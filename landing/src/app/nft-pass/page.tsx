'use client';

import Box from '@mui/material/Box';
// sections
import MintNFTPass from 'src/sections/nft-pass/MintNFTPass';
// wallet provider
import { WalletContextProvider } from 'src/contexts/WalletProvider';
import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

export default function NFTPassPage() {
    return (
        <MainLayout>

            <WalletContextProvider>
                <Box
                    sx={{
                        minHeight: '100vh',
                        py: { xs: 8, md: 12 },
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)'
                            : 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.02) 100%)',
                    }}
                >
                    <MintNFTPass />
                </Box>
            </WalletContextProvider>
        </MainLayout>
    );
} 