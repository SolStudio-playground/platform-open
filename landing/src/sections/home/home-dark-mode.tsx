import { m } from 'framer-motion';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
// components
import { MotionViewport, varFade } from 'src/components/animate';
// theme
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 20,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

const StatIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  fontSize: '1.5rem',
  boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
}));

export default function HomeDarkMode() {
  const theme = useTheme();

  const stats = [
    {
      icon: '🚀',
      number: 'Launch',
      label: 'Ready Platform',
      description: 'Fully developed & tested',
    },
    {
      icon: '⚡',
      number: '2 Min',
      label: 'Token Creation',
      description: 'Lightning fast deployment',
    },
    {
      icon: '🔒',
      number: 'Enterprise',
      label: 'Security Level',
      description: 'Bank-grade protection',
    },
    {
      icon: '💎',
      number: '100%',
      label: 'Solana Native',
      description: 'Built for the ecosystem',
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #334155 50%, #475569 75%, #64748B 100%)`,
        py: { xs: 10, md: 15 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.15) 0%, transparent 50%)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)',
          zIndex: 0,
        },
      }}
    >
      <Container component={MotionViewport} sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <m.div variants={varFade().inUp}>
            <Typography 
              variant="overline" 
              sx={{ 
                color: 'common.white', 
                opacity: 0.8,
                fontWeight: 600, 
                letterSpacing: 2,
                mb: 2,
                display: 'block',
              }}
            >
              ⭐ Platform Highlights
            </Typography>
          </m.div>
          
          <m.div variants={varFade().inUp}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'common.white',
                fontWeight: 800,
                mb: 3,
              }}
            >
              Built for{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Tomorrow&apos;s
              </span>
              {' '}Solana Projects
            </Typography>
          </m.div>
          
          <m.div variants={varFade().inUp}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'common.white', 
                opacity: 0.9,
                maxWidth: 800, 
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              solstudio.so is a next-generation platform designed to revolutionize how creators build on Solana. 
              Experience the future of token creation and management.
            </Typography>
          </m.div>
        </Box>

        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <m.div variants={varFade().inUp}>
                <StatCard>
                  <StatIcon>
                    {stat.icon}
                  </StatIcon>
                  
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      mb: 1,
                      background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.number}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'common.white' }}>
                    {stat.label}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: 'common.white', opacity: 0.8 }}>
                    {stat.description}
                  </Typography>
                </StatCard>
              </m.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <m.div variants={varFade().inUp}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'common.white',
                fontWeight: 700,
                mb: 3,
              }}
            >
              Be Among the First
            </Typography>
          </m.div>
          
          <m.div variants={varFade().inUp}>
            <Typography variant="body1" sx={{ color: 'common.white', opacity: 0.9, fontSize: '1.1rem' }}>
              Join the early adopters and help shape the future of Solana token creation. 
              Your feedback drives our innovation.
            </Typography>
          </m.div>
        </Box>
      </Container>
    </Box>
  );
}
