// ----------------------------------------------------------------------

import { paramCase } from "src/utils/change-case";

const ROOTS = {
  DASHBOARD: 'https://app.solstudio.so/dashboard',
}

// ----------------------------------------------------------------------

export const paths = {
  home: '/',
  docs: '/docs',
  creatorTools: {
    root: `${ROOTS.DASHBOARD}/token/create-token`,
    openbook: `${ROOTS.DASHBOARD}/token/advanced/openbook`,
    mint: `${ROOTS.DASHBOARD}/token/advanced/mint-authority`,
    burn: `${ROOTS.DASHBOARD}/token/advanced/burn-token/`,
    minttokens: `${ROOTS.DASHBOARD}/token/advanced/mint-token/`,
    revokefreeze: `${ROOTS.DASHBOARD}/token/advanced/revoke-freeze-authority`,
    immutable: `${ROOTS.DASHBOARD}/token/advanced/make-immutable/`,
    freezeToken: `${ROOTS.DASHBOARD}/token/advanced/freeze-account/`,
    thawToken: `${ROOTS.DASHBOARD}/token/advanced/thaw-account/`,
  },
  post: {
    root: `/blog`,
    details: (title: string) => `/blog/${paramCase(title)}`,
  },
};
