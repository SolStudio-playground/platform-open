import { forwardRef } from 'react';
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
import { RouterLink } from 'src/routes/components';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  type?: 'single' | 'default';
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, type = 'default', sx, ...other }, ref) => {
    let src = '/favicon/android-chrome-512x512.png'; // varsayılan logo yolu
    if (type === 'single') {
      src = '/favicon/android-chrome-512x512.png'; // tekli logo yolu
    }

    const logo = (
      <Box
        ref={ref}
        component="img"
        src={src}
        sx={{ width: 60, height: 70, cursor: 'pointer', ...sx }}
        {...other}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
