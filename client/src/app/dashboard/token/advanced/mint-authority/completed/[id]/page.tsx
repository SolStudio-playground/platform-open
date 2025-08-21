import MintAuthorCompleted from "src/sections/revoke/completed/mint-author-completed";


// revoke mint authority success page
export const metadata = {
  title: 'SolStudio | Revoke Mint Authority',
  description: `Ensure your token's supply remains fixed for enhanced trust and stability. Secure your Solana token's future with SolStudio.`,
};


interface Params {
    id: string;
}

export default function Page({ params }: { params: Params }) {
    const { id } = params;

    return (
        <MintAuthorCompleted id={id} />
    )
}