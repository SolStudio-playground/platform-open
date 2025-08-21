// @mui
import Masonry from '@mui/lab/Masonry';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import { m } from 'framer-motion';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
// _mock
import { _testimonials } from 'src/_mock';
// theme
import { bgBlur, bgGradient, hideScroll } from 'src/theme/css';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function AboutTestimonials() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderDescription = (
    <Box
      sx={{
        maxWidth: { md: 420 },
        textAlign: { xs: 'center', md: 'unset' },
      }}
    >
      <m.div variants={varFade().inUp}>
        <Typography variant="overline" sx={{ color: 'common.white', opacity: 0.8, fontWeight: 600, letterSpacing: 2 }}>
          💡 Platform Vision
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ my: 2, color: 'common.white', fontWeight: 800 }}>
          Why{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Solstudio
          </span>
          {' '}is Different
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant='body1' sx={{ color: 'common.white', opacity: 0.9, fontSize: '1.1rem', lineHeight: 1.6 }}>
          We&apos;re building the platform we always wanted as Solana developers. 
          Join us in creating the future of token management.
        </Typography>
      </m.div>
    </Box>
  );

  const renderContent = (
    <Box
      sx={{
        py: { md: 10 },
        height: { md: 1 },
        ...(mdUp && {
          ...hideScroll.y,
        }),
      }}
    >
      <Masonry spacing={3} columns={{ xs: 1, md: 2 }} sx={{ ml: 0 }}>
        {_testimonials.map((testimonial, index) => (
          <m.div key={index} variants={varFade().inUp}>
            <TestimonialCard testimonial={testimonial} />
          </m.div>
        ))}
      </Masonry>
    </Box>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: theme.palette.primary.main,
          endColor: theme.palette.secondary.main,
        }),
        overflow: 'hidden',
        height: { md: 840 },
        py: { xs: 10, md: 0 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/assets/images/home/hero-landing.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container component={MotionViewport} sx={{ position: 'relative', height: 1, zIndex: 1 }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ height: 1 }}
        >
          <Grid xs={10} md={4}>
            {renderDescription}
          </Grid>

          <Grid
            xs={12}
            md={7}
            lg={6}
            alignItems="center"
            sx={{
              height: 1,
            }}
          >
            {renderContent}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TestimonialCardProps = StackProps & {
  testimonial: {
    content: string;
    title: string;
    postedDate: Date;
    ratingNumber: number;
  };
};

function TestimonialCard({ testimonial, sx, ...other }: TestimonialCardProps) {
  const theme = useTheme();

  const { ratingNumber, postedDate, content, title } = testimonial;

  return (
    <Stack
      spacing={3}
      sx={{
        ...bgBlur({
          color: theme.palette.common.white,
          opacity: 0.15,
        }),
        p: 3,
        borderRadius: 3,
        color: 'common.white',
        border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: alpha(theme.palette.common.white, 0.4),
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`,
        },
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ color: 'common.white', opacity: 0.8 }} variant="caption">
          {fDate(postedDate)}
        </Typography>
        <Rating 
          value={ratingNumber} 
          readOnly 
          size="small" 
          sx={{ 
            '& .MuiRating-iconFilled': { color: '#FCD34D' },
            '& .MuiRating-iconEmpty': { color: alpha(theme.palette.common.white, 0.3) },
          }}
        />
      </Stack>
      
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'common.white' }}>
        {title}
      </Typography>
      
      <Typography variant="body2" sx={{ color: 'common.white', opacity: 0.9, lineHeight: 1.6 }}>
        {content}
      </Typography>
    </Stack>
  );
}
