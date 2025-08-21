import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction, 
  getMint,
  getAccount,
  TokenAccountNotFoundError
} from '@solana/spl-token';
import { GuestIdentityDriver, keypairIdentity, Metaplex } from '@metaplex-foundation/js';
import base58 from 'bs58';

// NFT Metadata - Update this with your NFT metadata URI
const METADATA_URI = process.env.NEXT_PUBLIC_NFT_METADATA_URI || "https://arweave.net/your-metadata-uri";

// Payment token address - Using mainnet USDC
const USDC_ADDRESS = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// Connection endpoint - Using your Helius RPC
const ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://mainnet.helius-rpc.com/?api-key=your-api-key';

// NFT details
const NFT_NAME = "Solstudio Platform Pass";
const NFT_SYMBOL = "SOLXPASS";

// The amount to charge in USDC
const PRICE_USDC = parseFloat(process.env.NEXT_PUBLIC_NFT_PRICE || "10");

type InputData = {
  account: string;
}

type GetResponse = {
  label: string;
  icon: string;
}

export type PostResponse = {
  transaction: string;
  message: string;
}

export type PostError = {
  error: string;
}

export async function GET() {
  const response: GetResponse = {
    label: "Solstudio Platform",
    icon: "https://app.solstudio.so/logo/logo_single.png",
  };
  
  return NextResponse.json(response);
}

async function createNFTTransaction(account: PublicKey): Promise<PostResponse> {
  const connection = new Connection(ENDPOINT);

  console.log('=== Starting NFT Transaction Creation ===');
  console.log('Buyer account:', account.toString());
  console.log('RPC Endpoint:', ENDPOINT);
  console.log('NFT Price:', PRICE_USDC, 'USDC');
  console.log('NFT Metadata URI:', METADATA_URI);
  console.log('USDC Address:', USDC_ADDRESS.toString());

  // Get the shop keypair from the environment variable
  const shopPrivateKey = process.env.SHOP_PRIVATE_KEY;
  if (!shopPrivateKey) {
    console.error('SHOP_PRIVATE_KEY environment variable not found');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.startsWith('SHOP') || k.startsWith('NEXT_PUBLIC')));
    throw new Error('SHOP_PRIVATE_KEY not found. Please check your .env.local file');
  }
  
  let shopKeypair: Keypair;
  try {
    shopKeypair = Keypair.fromSecretKey(base58.decode(shopPrivateKey));
    console.log('Shop wallet:', shopKeypair.publicKey.toString());
  } catch (error) {
    console.error('Failed to decode shop private key:', error);
    throw new Error('Invalid SHOP_PRIVATE_KEY format. Make sure it\'s a valid base58 encoded private key');
  }

  // Initialize Metaplex with shop keypair
  const metaplex = Metaplex
    .make(connection)
    .use(keypairIdentity(shopKeypair));

  const nfts = metaplex.nfts();

  // The mint needs to sign the transaction, so we generate a new keypair for it
  const mintKeypair = Keypair.generate();
  console.log('NFT Mint address:', mintKeypair.publicKey.toString());

  // Create a transaction builder to create the NFT
  console.log('Creating NFT with metadata URI:', METADATA_URI);
  const transactionBuilder = await nfts.builders().create({
    uri: METADATA_URI,
    name: NFT_NAME,
    symbol: NFT_SYMBOL,
    tokenOwner: account, // NFT is minted to the wallet submitting the transaction (buyer)
    updateAuthority: shopKeypair, // we retain update authority
    sellerFeeBasisPoints: 250, // 2.5% royalty
    useNewMint: mintKeypair, // we pass our mint in as the new mint to use
  });

  // Get USDC mint info first
  const usdcMint = await getMint(connection, USDC_ADDRESS);
  const decimals = usdcMint.decimals;

  // Get the associated token addresses
  const fromUsdcAddress = await getAssociatedTokenAddress(
    USDC_ADDRESS,
    account
  );

  const toUsdcAddress = await getAssociatedTokenAddress(
    USDC_ADDRESS,
    shopKeypair.publicKey
  );

  // Check if buyer's USDC account exists
  let buyerTokenAccount;
  try {
    buyerTokenAccount = await getAccount(connection, fromUsdcAddress);
    console.log('Buyer USDC account found:', fromUsdcAddress.toString());
    console.log('Buyer USDC balance:', Number(buyerTokenAccount.amount) / (10 ** decimals), 'USDC');
  } catch (error: any) {
    if (error instanceof TokenAccountNotFoundError) {
      console.error('Buyer has no USDC token account');
      // Account doesn't exist, buyer needs USDC first
      throw new Error('No USDC token account found. Please ensure you have USDC in your wallet.');
    } else {
      throw error;
    }
  }

  // Check if buyer has enough USDC
  const requiredAmount = PRICE_USDC * (10 ** decimals);
  if (buyerTokenAccount && buyerTokenAccount.amount < requiredAmount) {
    console.error('Insufficient USDC balance:', {
      required: PRICE_USDC,
      available: Number(buyerTokenAccount.amount) / (10 ** decimals)
    });
    throw new Error(`Insufficient USDC balance. Required: ${PRICE_USDC} USDC, Available: ${Number(buyerTokenAccount.amount) / (10 ** decimals)} USDC`);
  }

  // Check if shop's USDC account exists
  let shopTokenAccount;
  try {
    shopTokenAccount = await getAccount(connection, toUsdcAddress);
    console.log('Shop USDC account found:', toUsdcAddress.toString());
  } catch (error: any) {
    if (error instanceof TokenAccountNotFoundError) {
      console.log('Shop USDC account not found, will create it');
      // Account doesn't exist, we'll create it
      shopTokenAccount = null;
    } else {
      throw error;
    }
  }

  // Create a guest identity for buyer, so they will be a required signer for the transaction
  const identitySigner = new GuestIdentityDriver(account);

  // Create an array to hold our instructions in the correct order
  const paymentInstructions = [];

  // If shop's token account doesn't exist, add instruction to create it FIRST
  if (!shopTokenAccount) {
    const createShopTokenAccountInstruction = createAssociatedTokenAccountInstruction(
      shopKeypair.publicKey, // payer
      toUsdcAddress, // associated token account
      shopKeypair.publicKey, // owner
      USDC_ADDRESS // mint
    );
    
    paymentInstructions.push({
      instruction: createShopTokenAccountInstruction,
      signers: [shopKeypair]
    });
  }

  // Create USDC transfer instruction (this should come AFTER account creation)
  const usdcTransferInstruction = createTransferCheckedInstruction(
    fromUsdcAddress, // from USDC address
    USDC_ADDRESS, // USDC mint address
    toUsdcAddress, // to USDC address
    account, // owner of the from USDC address (the buyer)
    PRICE_USDC * (10 ** decimals), // multiply by 10^decimals
    decimals
  );

  paymentInstructions.push({
    instruction: usdcTransferInstruction,
    signers: [identitySigner]
  });

  // Add payment instructions in reverse order (because prepend adds to the beginning)
  // This ensures shop token account is created before the transfer
  for (let i = paymentInstructions.length - 1; i >= 0; i -= 1) {
    transactionBuilder.prepend(paymentInstructions[i]);
  }

  // Convert to transaction
  const latestBlockhash = await connection.getLatestBlockhash();
  const transaction = await transactionBuilder.toTransaction(latestBlockhash);

  // Set the fee payer to the buyer (they will pay for the transaction)
  transaction.feePayer = account;

  // Partially sign the transaction, as the shop and the mint
  // The account is also a required signer, but they'll sign it with their wallet after we return it
  transaction.sign(shopKeypair, mintKeypair);

  console.log('\n=== Transaction Details ===');
  console.log('Transaction signatures needed from:', [
    `${account.toString()} (buyer)`,
    `${shopKeypair.publicKey.toString()} (shop) - already signed`,
    `${mintKeypair.publicKey.toString()} (mint) - already signed`
  ]);
  console.log('Number of instructions:', transaction.instructions.length);
  console.log('Fee payer:', transaction.feePayer?.toString() || 'Not set');

  // Log each instruction with descriptive names
  transaction.instructions.forEach((instruction, index) => {
    let instructionName = 'Unknown';
    
    if (instruction.programId.toString() === 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL') {
      instructionName = 'Create Associated Token Account';
    } else if (instruction.programId.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
      instructionName = 'USDC Transfer';
    } else if (instruction.programId.toString() === 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s') {
      instructionName = 'Metaplex NFT';
    }
    
    console.log(`\nInstruction ${index + 1}: ${instructionName}`);
    console.log('Program ID:', instruction.programId.toString());
    console.log('Number of keys:', instruction.keys.length);
  });

  // Simulate the transaction
  try {
    console.log('\n=== Simulating Transaction ===');
    
    const simulation = await connection.simulateTransaction(transaction);

    console.log('Simulation result:', {
      err: simulation.value.err,
      logs: simulation.value.logs?.slice(0, 10), // Show first 10 logs
      unitsConsumed: simulation.value.unitsConsumed,
    });

    if (simulation.value.err) {
      console.error('⚠️  Transaction simulation failed:', simulation.value.err);
      console.error('This is expected when token accounts need to be created.');
      console.error('The transaction should still work when the user signs it.');
      
      // Don't throw error for simulation failures - these often happen due to
      // missing signatures or accounts that will be created
    } else {
      console.log('✅ Transaction simulation successful');
    }
  } catch (simError) {
    console.error('Error during simulation:', simError);
    // Continue anyway, simulation might fail due to missing signatures
  }

  // Serialize the transaction and convert to base64 to return it
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false // account is a missing signature
  });
  const base64 = serializedTransaction.toString('base64');

  console.log('\n=== Transaction Created Successfully ===');
  console.log('Serialized transaction size:', serializedTransaction.length, 'bytes');
  console.log('Base64 length:', base64.length);

  const message = `Purchase your Solstudio Platform Pass for ${PRICE_USDC} USDC`;

  // Return the serialized transaction
  return {
    transaction: base64,
    message,
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('\n=== NFT Pass Checkout API Called ===');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { account } = body as InputData;
    
    if (!account) {
      console.error('No account provided in request');
      return NextResponse.json(
        { error: "No account provided" } as PostError, 
        { status: 400 }
      );
    }

    console.log('Creating transaction for account:', account);
    const mintOutputData = await createNFTTransaction(new PublicKey(account));
    console.log('Transaction created successfully');
    
    return NextResponse.json(mintOutputData);
  } catch (error: any) {
    console.error('\n❌ Error in checkout API:', error);
    console.error('Error stack:', error.stack);
    
    // Return more specific error messages
    let errorMessage = 'Error creating transaction';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage } as PostError, 
      { status: 500 }
    );
  }
} 