// @mui
import { Link, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
// components
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

const socialLinks = [
  // TODO: Replace these social links with your own.
  {
    href: '#',
    title: 'Twitter',
    icon: 'akar-icons:x-fill',
  },
  {
    href: '#',
    title: 'GitHub',
    icon: 'akar-icons:github-fill',
  },
  // {
  //   href: 'https://discord.gg/Wghptx9Mcv',
  //   icon: 'akar-icons:discord-fill',
  // },
  {
    href: 'https://t.me/solstudio_so',
    icon: 'akar-icons:telegram-fill',
  },
  // {
  //     href: '#',
  //     icon: 'mingcute:medium-fill',
  //   },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo type="single" sx={{ mb: 1, mx: 'auto', height: 65, width: 65 }} />

        <Typography sx={{ fontWeight: 'bold' }} variant="caption" component="div">
          © 2025 solstudio.so | Version 1.0
        </Typography>
        <Typography color="text.secondary" variant="caption" component="div">
          Easily create and manage your Solana tokens in one seamless platform - Solstudio.
        </Typography>
        <Stack
          sx={{ my: 1 }}
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
        >
          {socialLinks.map((link) => (
            <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              <Iconify color="text.secondary" icon={link.icon} sx={{ width: 20, height: 20 }} />
            </Link>
          ))}
        </Stack>
      </Container>
    </Box>
  );

  return simpleFooter;
}
