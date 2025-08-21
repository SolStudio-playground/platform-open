// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

import 'src/app/styles.css';

// editor
import 'react-quill/dist/quill.snow.css';

// ----------------------------------------------------------------------

// theme
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
// components
import ProgressBar from 'src/components/progress-bar';
import MotionLazy from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
// auth
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { ContextProvider } from 'src/contexts/ContextProvider';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'SolStudio.so',
  description:
    'Create, manage, and distribute Solana tokens – all in one place. SolStudio is a decentralized platform that allows you to create and manage your own token on Solana.',
  keywords:
    'solana, token, solstudio.so, openbook, SPL, solstudio token, parachut.ag solana',
  authors: [
    {
      name: 'SolStudio',
      url: 'https://solstudio.so',
    },
  ],
  creator: 'SolStudio',
  publisher: 'SolStudio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://solstudio.so'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: 'SolStudio.so',
    description:
      'Create, manage, and distribute Solana tokens – all in one place. SolStudio is a decentralized platform that allows you to create and manage your own token on Solana.',
    url: 'https://solstudio.so',
    siteName: 'SolStudio.so',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolStudio.so',
    description:
      'Create, manage, and distribute Solana tokens – all in one place. SolStudio is a decentralized platform that allows you to create and manage your own token on Solana.',
    images: ['/og-image.jpg'],
    creator: '@solstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      me: ['my-email@my-domain.com', 'my-link'],
    },
  },
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      {/* <GoogleAnalytics gaId='G-9Q8R661K3L' /> */}
      {/* <GoogleTagManager gtmId='GTM-KP75NXMD' /> */}

      <body>
        <ContextProvider>
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
        </ContextProvider>
      </body>

    </html>
  );
}
