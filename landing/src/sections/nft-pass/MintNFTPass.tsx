'use client';

import { createQR, encodeURL, TransactionRequestURLFields } from '@solana/pay';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Transaction } from '@solana/web3.js';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Alert, CircularProgress, Grid, Chip, Divider, Paper } from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// Types from the API
import type { PostResponse, PostError, AddSignaturesResponse } from 'src/app/api/nft-pass/checkout/route';

// ----------------------------------------------------------------------

const StyledHeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(6, 4),
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.5,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`
    : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.5)'
      : '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledQRContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 300,
  padding: theme.spacing(3),
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(145deg, ${alpha(theme.palette.background.default, 0.3)} 0%, ${alpha(theme.palette.background.default, 0.1)} 100%)`
    : `linear-gradient(145deg, ${alpha(theme.palette.grey[50], 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.6)} 100%)`,
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: theme.shape.borderRadius * 1.5,
    zIndex: -1,
    opacity: 0.1,
  },
}));

const StyledBenefitCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    background: theme.palette.mode === 'dark'
      ? alpha(theme.palette.background.paper, 0.8)
      : alpha(theme.palette.background.paper, 1),
  },
}));

const StyledPriceCard = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    background: alpha(theme.palette.common.white, 0.1),
    borderRadius: '50%',
  },
}));

// ----------------------------------------------------------------------

export default function MintNFTPass() {
  const theme = useTheme();
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const mintQrRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Handler to clear error
  const handleClearError = () => setError(null);

  // Memoized start icon based on loading state
  const startIcon = useMemo(() => {
    if (loading) return <CircularProgress size={20} color="inherit" />;
    return <Iconify icon="mingcute:certificate-line" />;
  }, [loading]);

  // Memoized button text based on loading and success states
  const buttonText = useMemo(() => {
    if (loading) return 'Processing...';
    if (success) return 'NFT Pass Minted!';
    return 'Mint NFT Pass';
  }, [loading, success]);

  // Memoized transaction URL
  const transactionUrl = useMemo(() => 
    transactionHash ? `https://solscan.io/tx/${transactionHash}` : '',
    [transactionHash]
  );

  // Generate the Solana Pay QR code
  useEffect(() => {
    const { location } = window;
    const apiUrl = `${location.protocol}//${location.host}/api/nft-pass/checkout`;

    const mintUrlFields: TransactionRequestURLFields = {
      link: new URL(apiUrl),
    };
    const mintUrl = encodeURL(mintUrlFields);
    const mintQr = createQR(mintUrl, 300, 'transparent');

    // Set the generated QR code on the QR ref element
    if (mintQrRef.current) {
      mintQrRef.current.innerHTML = '';
      mintQr.append(mintQrRef.current);
    }
  }, []);

  const handleMint = useCallback(async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Step 1: Fetch the unsigned transaction from our checkout API
      console.log('Step 1: Fetching unsigned transaction...');
      const response = await fetch('/api/nft-pass/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: publicKey.toBase58() })
      });

      const responseBody = await response.json() as PostResponse | PostError;

      if ('error' in responseBody) {
        const { error: apiError } = responseBody;
        console.error(apiError);
        setError(`Error: ${apiError}`);
        setLoading(false);
        return;
      }

      // Step 2: Deserialize the unsigned transaction
      console.log('Step 2: Deserializing unsigned transaction...');
      const transaction = Transaction.from(Buffer.from(responseBody.transaction, 'base64'));
      
      // Step 3: User wallet signs FIRST (Phantom's recommended order)
      console.log('Step 3: User wallet signing transaction...');
      const userSignedTransaction = await signTransaction(transaction);
      
      // Step 4: Send the user-signed transaction back to add additional signatures
      console.log('Step 4: Adding additional signatures...');
      const userSignedBase64 = userSignedTransaction.serialize().toString('base64');
      
      const signatureResponse = await fetch('/api/nft-pass/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          account: publicKey.toBase58(),
          signedTransaction: userSignedBase64 
        })
      });

      const signatureBody = await signatureResponse.json() as AddSignaturesResponse | PostError;

      if ('error' in signatureBody) {
        const { error: signatureError } = signatureBody;
        console.error(signatureError);
        setError(`Signature error: ${signatureError}`);
        setLoading(false);
        return;
      }

      // Step 5: Deserialize the fully signed transaction
      console.log('Step 5: Deserializing fully signed transaction...');
      const fullySignedTransaction = Transaction.from(Buffer.from(signatureBody.fullySignedTransaction, 'base64'));
      
      // Step 6: Send the fully signed transaction
      console.log('Step 6: Sending fully signed transaction...');
      const signature = await connection.sendRawTransaction(fullySignedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      
      // Step 7: Wait for confirmation
      console.log('Step 7: Waiting for transaction confirmation...');
      const latestBlockhash = await connection.getLatestBlockhash();
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }
      
      setTransactionHash(signature);
      setSuccess(true);
      setLoading(false);
      
      console.log('NFT Pass minted successfully!');
      console.log('Transaction signature:', signature);
      
    } catch (txError: any) {
      console.error(txError);
      setError(`Transaction failed: ${txError?.message || 'Unknown error'}`);
      setLoading(false);
    }
  }, [publicKey, signTransaction, connection]);

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <StyledHeroSection>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          🎫 Solstudio Platform Pass
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          Unlock exclusive access to premium features, advanced tools, and priority support
        </Typography>
        <Chip 
          label="Limited Time Offer" 
          color="secondary" 
          size="medium"
          icon={<Iconify icon="eva:clock-fill" />}
        />
      </StyledHeroSection>

      <Grid container spacing={4}>
        {/* Left side - Info & Benefits */}
        <Grid item xs={12} lg={7}>
          <Stack spacing={4}>
            {/* Benefits Section */}
            <StyledCard>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                ✨ Platform Benefits
              </Typography>
              <Grid container spacing={2}>
                {[
                  { icon: 'eva:settings-2-fill', title: 'Advanced Tools', desc: 'Access to premium token creation tools' },
                  { icon: 'eva:flash-fill', title: 'Priority Processing', desc: 'Faster transaction confirmation' },
                  { icon: 'eva:star-fill', title: 'Exclusive Features', desc: 'Early access to new platform updates' },
                  { icon: 'eva:headphones-fill', title: 'Premium Support', desc: 'Priority customer support access' },
                  { icon: 'eva:gift-fill', title: 'Special Rewards', desc: 'Exclusive airdrops and rewards' },
                  { icon: 'eva:shield-fill', title: 'Enhanced Security', desc: 'Advanced security features and monitoring' },
                ].map((benefit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <StyledBenefitCard>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          <Iconify icon={benefit.icon} width={20} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {benefit.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {benefit.desc}
                          </Typography>
                        </Box>
                      </Stack>
                    </StyledBenefitCard>
                  </Grid>
                ))}
              </Grid>
            </StyledCard>

            {/* Price Section */}
            <StyledPriceCard>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                10 USDC
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                One-time payment
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Lifetime access to all premium features
              </Typography>
            </StyledPriceCard>
          </Stack>
        </Grid>

        {/* Right side - Minting Interface */}
        <Grid item xs={12} lg={5}>
          <StyledCard>
            <Stack spacing={4}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  🚀 Mint Your Pass
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose your preferred payment method
                </Typography>
              </Box>

              {/* Wallet Connect Option */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Option 1: Connect Wallet
                </Typography>
                <Stack spacing={2} alignItems="center">
                  <WalletMultiButton />
                  
                  {publicKey && (
                    <Button
                      size="large"
                      variant="contained"
                      fullWidth
                      onClick={handleMint}
                      disabled={loading || success}
                      startIcon={startIcon}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                        },
                      }}
                    >
                      {buttonText}
                    </Button>
                  )}
                </Stack>
              </Box>

              <Divider>
                <Chip label="OR" size="small" />
              </Divider>

              {/* QR Code Option */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Option 2: Solana Pay
                </Typography>
                <StyledQRContainer>
                  <div ref={mintQrRef} />
                </StyledQRContainer>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                  Scan with any Solana Pay compatible wallet
                </Typography>
              </Box>

              {/* Status Messages */}
              {error && (
                <Alert 
                  severity="error" 
                  onClose={handleClearError}
                  sx={{ borderRadius: 2 }}
                >
                  {error}
                </Alert>
              )}

              {success && transactionHash && (
                <Alert 
                  severity="success" 
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      href={transactionUrl}
                      target="_blank"
                      sx={{ fontWeight: 600 }}
                    >
                      View Transaction
                    </Button>
                  }
                  sx={{ borderRadius: 2 }}
                >
                  🎉 NFT Pass minted successfully! Your transaction has been confirmed on the Solana blockchain.
                </Alert>
              )}
            </Stack>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
}   