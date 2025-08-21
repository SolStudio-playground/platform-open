// components

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Creator Tools',
    path: '/pages',
    children: [
      {
        subheader: 'Token Management',
        items: [
          { title: 'Create Your Token', path: paths.creatorTools.root },
          { title: 'Create OpenBook Market', path: paths.creatorTools.openbook },
          { title: 'Revoke Freeze Authority', path: paths.creatorTools.revokefreeze },
          { title: 'Revoke Mint Authority', path: paths.creatorTools.mint },
          { title: 'Make Token Immutable', path: paths.creatorTools.immutable },
          { title: 'Burn Tokens', path: paths.creatorTools.burn },
          { title: 'Mint Tokens', path: paths.creatorTools.minttokens },
          { title: 'Freeze Tokens', path: paths.creatorTools.freezeToken },
          { title: 'Unfreeze/Thaw Tokens', path: paths.creatorTools.thawToken },
        ],
      },
      {
        subheader: 'Dashboard',
        items: [{ title: 'Dashboard', path: 'https://app.solstudio.so/' }],
      },
    ],
  },
  {
    title: 'Blog',
    path: paths.post.root,
  },
  {
    title: 'Join Telegram',
    path: 'https://t.me/solstudio_so',
  },

  // {
  //   title: 'Docs',
  //   path: paths.docs,
  // },
];
