// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';
import Typography from '@mui/material/Typography';

// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgBlur } from 'src/theme/css';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify/iconify';
import Label from 'src/components/label/label';

//
import { HEADER } from '../config-layout';
import { navConfig } from './config-navigation';
import NavDesktop from './nav/desktop';
//
import { HeaderShadow } from '../_common';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Stack direction="row" alignItems="center" spacing={-1.2}>

              <Logo />
            
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 600,
                color: 'inherit',
                display: { xs: 'none', sm: 'block' },
                ml: -1,
              }}
            >
              Solstudio
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} data={navConfig} />}

          <Stack sx={{ ml: 3 }} alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }} spacing={2}>
            <Button
              color="inherit"
              variant="outlined"
              href="/nft-pass"
              startIcon={<Iconify icon="mingcute:certificate-line" width={20} height={20} />}
            >
              NFT Pass
            </Button>
            <Button
              startIcon={<Iconify icon="ph:lightning-fill" width={20} height={20} />}
              color="inherit"
              variant="contained"
              href="https://app.solstudio.so/"
            >
              {mdUp ? 'Go to Dashboard' : 'Dashboard'}
            </Button>
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
