import ImmutableCompleted from "src/sections/revoke/completed/immutable-completed";

export const metadata = {
  title: 'SolStudio - Make Immutable',
  description: `Ensure your token's supply remains fixed for enhanced trust and stability. Secure your Solana token's future with SolStudio.`,
};

interface Params {
    id: string;
}


export default function Page({ params }: { params: Params}) {
    const { id } = params;

    return (
       <ImmutableCompleted id={id} />
    )
}