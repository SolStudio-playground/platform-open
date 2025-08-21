// @mui
import { m } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// theme
import { bgGradient } from 'src/theme/css';
// routes
// components
import { MotionViewport, varFade } from 'src/components/animate';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function HomeAdvertisement() {
  const theme = useTheme();

  const renderDescription = (
    <Box
      sx={{
        textAlign: {
          xs: 'center',
          md: 'left',
        },
      }}
    >
      <Box
        component={m.div}
        variants={varFade().inDown}
        sx={{ 
          color: 'common.white', 
          mb: 5, 
          typography: 'h2',
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        Ready to build the future of{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Web3?
        </span>
        <br />
        Start with Solstudio today!
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        spacing={2}
      >
        <m.div variants={varFade().inRight}>
          <Button
            color="inherit"
            size="large"
            fullWidth
            variant="contained"
            target="_blank"
            rel="noopener"
            href="https://app.solstudio.so/"
            startIcon={<Iconify icon="ic:round-generating-tokens" width={24} />}
            sx={{
              color: 'grey.800',
              bgcolor: 'common.white',
              px: 4,
              py: 2,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            🚀 Be an Early Adopter
          </Button>
        </m.div>
        <m.div variants={varFade().inRight}>
          <Button
            color="inherit"
            fullWidth
            size="large"
            variant="outlined"
            rel="noopener"
            href="https://app.solstudio.so/"
            endIcon={<Iconify icon="ph:lightning-fill" width={16} sx={{ mr: 0.5 }} />}
            sx={{ 
              color: 'common.white', 
              borderColor: 'common.white',
              borderWidth: 2,
              px: 4,
              py: 2,
              borderRadius: 3,
              fontWeight: 600,
              fontSize: '1.1rem',
              '&:hover': { 
                borderColor: 'common.white',
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            ⚡ Explore Platform
          </Button>
        </m.div>
      </Stack>
    </Box>
  );

  const renderImg = (
    <Stack component={m.div} variants={varFade().inUp} alignItems="center">
      <Box
        component={m.img}
        animate={{
          y: [-20, 0, -20],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        alt="rocket"
        src="/assets/images/home/rocket.webp"
        sx={{ 
          maxWidth: 460,
          filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
        }}
      />
    </Stack>
  );

  return (
    <Container component={MotionViewport}>
      <Stack
        alignItems="center"
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.secondary.main,
          }),
          borderRadius: 4,
          pb: { xs: 5, md: 0 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            zIndex: 0,
          },
        }}
      >
        {renderImg}

        <Box sx={{ position: 'relative', zIndex: 1, flex: 1, p: { xs: 3, md: 5 } }}>
          {renderDescription}
        </Box>
      </Stack>
    </Container>
  );
}
