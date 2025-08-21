'use client';

import { m, useScroll } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// routes
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient, bgBlur } from 'src/theme/css';
// layouts
import { HEADER } from 'src/layouts/config-layout';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, 0.95),
    imgUrl: '/assets/images/home/heroAd.png',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));

const StyledWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    marginTop: HEADER.H_DESKTOP_OFFSET,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  top: -80,
  width: 480,
  right: -80,
  height: 480,
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(120px)',
  WebkitFilter: 'blur(120px)',
  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(120px)',
  WebkitFilter: 'blur(120px)',
  background: `radial-gradient(circle, ${alpha(theme.palette.info.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
}));

type StyledPolygonProps = {
  opacity?: number;
  anchor?: 'left' | 'right';
};
const StyledPolygon = styled('div')<StyledPolygonProps>(
  ({ opacity = 1, anchor = 'left', theme }) => ({
    ...bgBlur({
      opacity,
      color: theme.palette.background.default,
    }),
    zIndex: 9,
    bottom: 0,
    height: 80,
    width: '50%',
    position: 'absolute',
    clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
    ...(anchor === 'left' && {
      left: 0,
    }),
    ...(anchor === 'right' && {
      right: 0,
      transform: 'scaleX(-1)',
    }),
  })
);

// ----------------------------------------------------------------------

export default function HomeHero() {
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();

  const heroRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const opacity = 1 - percent / 100;

  const hide = percent > 120;

  const solanaLogo = (
    <Box
      sx={{
        width: { xs: 140, md: 200 },
        height: { xs: 15, md: 30 },
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.3),
          imgUrl: '/assets/images/home/solanaLogo.png',
        }),
      }}
    />
  );

  const renderDescription = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={3}
      sx={{
        height: 1,
        mx: 'auto',
        maxWidth: 1200,
        opacity: opacity > 0 ? opacity : 0,
        mt: {
          md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
        },
      }}
    >
      <m.div variants={varFade().in}>
        <Typography 
          variant="overline" 
          sx={{ 
            textAlign: 'center', 
            color: 'primary.main',
            fontWeight: 600,
            letterSpacing: 2,
            mb: 2,
            px: 3,
            py: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          🚀 Next-Gen Solana Platform
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography 
          textAlign="center" 
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
            fontWeight: 800,
            lineHeight: 1.1,
            mb: 2,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 25%, #EC4899 50%, #F59E0B 75%, #10B981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 8s ease infinite',
            '@keyframes gradientShift': {
              '0%, 100%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
            },
          }}
        >
          The Future of
          <br />
          Solana Tokens
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography 
          variant="h5" 
          sx={{ 
            textAlign: 'center', 
            color: 'text.secondary',
            maxWidth: 800,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Experience the next generation of token creation and management on Solana. 
          <br />
          <strong>Built by developers, for developers.</strong>
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack 
          spacing={2} 
          direction={{ xs: 'column', sm: 'row' }} 
          sx={{ my: 5 }}
        >
          <Button
            component={RouterLink}
            href="https://app.solstudio.so/dashboard/token/create-token"
            size="large"
            variant="contained"
            startIcon={<Iconify icon="ic:round-generating-tokens" width={24} />}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              boxShadow: '0 20px 40px rgba(79, 70, 229, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 25px 50px rgba(79, 70, 229, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            🚀 Create Your Token
          </Button>

          <Button
            color="primary"
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="ph:lightning-fill" width={24} />}
            href="https://app.solstudio.so/"
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              borderWidth: 2,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            ⚡ Explore Dashboard
          </Button>
        </Stack>
      </m.div>

      <m.div variants={varFade().in}>
        <Stack direction="column" alignItems="center" spacing={2}>
          <Typography
            variant="overline"
            sx={{ 
              textAlign: 'center', 
              color: 'text.disabled',
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Powered by Solana
          </Typography>
          {solanaLogo}
        </Stack>
      </m.div>
    </Stack>
  );

  const renderPolygons = (
    <>
      <StyledPolygon />
      <StyledPolygon anchor="right" opacity={0.48} />
      <StyledPolygon anchor="right" opacity={0.48} sx={{ height: 48, zIndex: 10 }} />
      <StyledPolygon anchor="right" sx={{ zIndex: 11, height: 24 }} />
    </>
  );

  const renderEllipses = (
    <>
      {mdUp && <StyledEllipseTop />}
      <StyledEllipseBottom />
    </>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
        sx={{
          ...(hide && {
            opacity: 0,
          }),
        }}
      >
        <StyledWrapper>
          <Container component={MotionContainer} sx={{ height: 1 }}>
            <Grid sx={{ my: 10, height: 0.75 }} xs={12} md={12}>
              {renderDescription}
            </Grid>
          </Container>

          {renderEllipses}
        </StyledWrapper>
      </StyledRoot>

      {renderPolygons}

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
