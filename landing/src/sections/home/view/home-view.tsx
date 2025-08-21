'use client';

import { useScroll } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
// layouts
import MainLayout from 'src/layouts/main';
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import FaqView from 'src/sections/home/home-faq';
import HomeHero from '../home-hero';
import HomeAdvertisement from '../home-advertisement';
import AboutTestimonials from '../about-testimonials';
import HomeHugePackElements from '../home-hugepack-elements';
import HomeDarkMode from '../home-dark-mode';
import HomeMinimal from '../home-minimal';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeDarkMode />
        <HomeMinimal />

        <HomeHugePackElements />

        <AboutTestimonials />

        <FaqView />
        <HomeAdvertisement />
      </Box>
    </MainLayout>
  );
}
