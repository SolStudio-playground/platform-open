// scroll bar

import 'simplebar-react/dist/simplebar.min.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// theme
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
// components
import ProgressBar from 'src/components/progress-bar';
import MotionLazy from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

// auth

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Solstudio | Create, manage, and distribute Solana tokens – all in one place.',
  description:
    'Create, manage, and distribute Solana tokens – all in one place. Solstudio is a decentralized platform that allows you to create and manage your own token on Solan.',
  keywords:
    'solana, token, solstudio.so, openbook, SPL, solstudio.so token, solstudio.so solana, create token, create token solana, create solana, solana create token, create spl token, create spl, meme, memetoken, create meme token, memecoins, memecoin, create meme coin, create meme coins, create meme tokens, create meme token, solana token creator, generate solana coin',
  icons: [
    {
      rel: 'icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon/android-chrome-192x192',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '384x384',
      url: '/favicon/android-chrome-512x512',
    },

    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon',
    },
  ],
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4F46E5',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.style.fontFamily}>
      <GoogleTagManager gtmId="AW-16534754531" />
      <GoogleAnalytics gaId="AW-16534754531" />
      <body>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'dark', // 'light' | 'dark'
            themeDirection: 'ltr', //  'rtl' | 'ltr'
            themeContrast: 'default', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <SettingsDrawer />
              <ProgressBar />
              {children}
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
