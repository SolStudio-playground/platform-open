
// ----------------------------------------------------------------------

import MultiSendForm from "src/sections/multisender/view/mulyisender-view";



export const metadata = {
  title: 'SolStudio | Multisender',
};

interface Params {
    id: string;
  }


export default function TokenListPage({params} : {params: Params}) {
    const { id } = params;

    return <MultiSendForm id={id} />;
}
