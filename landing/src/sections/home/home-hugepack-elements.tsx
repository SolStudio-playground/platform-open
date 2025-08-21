import { useState, useCallback } from 'react';
import { m } from 'framer-motion';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { styled, Box } from '@mui/material';

import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import Alert from '@mui/material/Alert';

import Button from '@mui/material/Button';


import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';

import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';

import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// components
import Iconify from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  marginBottom: theme.spacing(2),
  fontSize: '1.5rem',
}));

export default function HomeHugePackElements() {
  const mdUp = useResponsive('up', 'md');
  const theme = useTheme();

  const [select, setSelect] = useState('Option 1');
  const [currentTab, setCurrentTab] = useState('Angular');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangeSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelect(event.target.value);
  }, []);

  const viewAllBtn = (
    <m.div variants={varFade().inUp}>
      <Button
        size="large"
        color="primary"
        variant="contained"
        rel="noopener"
        href="https://app.solstudio.so/"
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        sx={{
          px: 4,
          py: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 15px 40px rgba(79, 70, 229, 0.4)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Launch Dashboard
      </Button>
    </m.div>
  );

  const renderDescription = (
    <Stack
      sx={{
        textAlign: { xs: 'center', md: 'unset' },
        pl: { md: 5 },
        pt: { md: 15 },
      }}
    >
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}>
          🚀 Revolutionary Features
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ my: 3, fontWeight: 800 }}>
          Everything You Need to{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Build & Scale
          </span>
        </Typography>
      </m.div>
      <m.div variants={varFade().inUp}>
        <Typography
          sx={{
            mb: 5,
            color: 'text.secondary',
            fontSize: '1.1rem',
            lineHeight: 1.7,
          }}
        >
          solstudio.so is designed to be the most comprehensive and user-friendly platform for Solana token creation. 
          We&apos;ve built the tools we wished existed when we started building on Solana.
        </Typography>
      </m.div>

      {mdUp && viewAllBtn}
    </Stack>
  );

  const features = [
    {
      icon: '🚀',
      title: 'Token Creation',
      description: 'Create SPL tokens with custom metadata in minutes',
      color: 'primary',
    },
    {
      icon: '⚡',
      title: 'Multisender',
      description: 'Bulk distribute tokens to thousands of wallets',
      color: 'secondary',
    },
    {
      icon: '📸',
      title: 'Snapshot Tool',
      description: 'Take snapshots of token holders for airdrops',
      color: 'info',
    },
    {
      icon: '🏪',
      title: 'OpenBook Markets',
      description: 'Create and manage DEX markets seamlessly',
      color: 'success',
    },
    {
      icon: '🔒',
      title: 'Token Management',
      description: 'Mint, burn, freeze, and manage authorities',
      color: 'warning',
    },
    {
      icon: '💎',
      title: 'Raydium Integration',
      description: 'Advanced DeFi features and liquidity pools',
      color: 'error',
    },
  ];

  const renderFeatures = (
    <Grid container spacing={3}>
      {features.map((feature, index) => (
        <Grid xs={12} sm={6} md={4} key={index}>
          <m.div variants={varFade().inUp}>
            <FeatureCard>
              <FeatureIcon>
                {feature.icon}
              </FeatureIcon>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {feature.description}
              </Typography>
            </FeatureCard>
          </m.div>
        </Grid>
      ))}
    </Grid>
  );

  const renderContent = (
    <Stack
      component={Paper}
      variant="outlined"
      alignItems="center"
      spacing={{ xs: 3, md: 5 }}
      sx={{
        borderRadius: 3,
        bgcolor: 'unset',
        borderStyle: 'dashed',
        borderColor: alpha(theme.palette.primary.main, 0.3),
        p: { xs: 3, md: 5 },
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.5)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
        🎯 Live Demo - Token Creation
      </Typography>

      {/* Row 1 */}
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 3, md: 4 }}
        sx={{ width: 1 }}
      >
        <m.div variants={varFade().in}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="ic:round-generating-tokens" />}
            sx={{ borderRadius: 2 }}
          >
            Create SPL Token
          </Button>
        </m.div>
        <m.div variants={varFade().in}>
          <CircularProgress color="success" />
        </m.div>
        <m.div variants={varFade().in}>
          <Button variant="soft" color="primary" startIcon={<Iconify icon="mdi:camera" />} sx={{ borderRadius: 2 }}>
            Take Snapshot
          </Button>
        </m.div>
      </Stack>

      {/* Row 2 */}
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 3, md: 4 }}
        sx={{ width: 1 }}
      >
        <m.div variants={varFade().in}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              boxShadow: (themeParam) => `inset 0 -2px 0 0 ${alpha(themeParam.palette.grey[500], 0.08)}`,
            }}
          >
            {['Revoke Mint Authority', 'Burn Token', 'Mint Token', 'Freeze Token Account'].map(
              (tab) => (
                <Tab
                  key={tab}
                  value={tab}
                  label={tab}
                  sx={{
                    '&:not(:last-of-type)': { mr: 3 },
                  }}
                />
              )
            )}
          </Tabs>
        </m.div>

        <m.div variants={varFade().in}>
          <Chip color="secondary" variant="soft" onDelete={() => {}} label="Meme Token" sx={{ borderRadius: 2 }} />
        </m.div>
        <m.div variants={varFade().in}>
          <Chip color="primary" variant="soft" onDelete={() => {}} label="SPL Token" sx={{ borderRadius: 2 }} />
        </m.div>
      </Stack>

      {/* Row 3 */}
      <Stack
        spacing={{ xs: 3, md: 4 }}
        sx={{
          width: 1,
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' },
        }}
      >
        <m.div variants={varFade().in}>
          <Alert severity="success" onClose={() => {}} sx={{ borderRadius: 2 }}>
            <AlertTitle>Success</AlertTitle>
            You have successfully created a new token — <strong>see on browser!</strong>
          </Alert>
        </m.div>
      </Stack>

      {mdUp && (
        <>
          {/* Row 5 */}
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            spacing={{ xs: 3, md: 4 }}
            sx={{ width: 1 }}
          >
            <m.div variants={varFade().in}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Make Token Immutable"
                sx={{ m: 0 }}
              />
            </m.div>

            <m.div variants={varFade().in}>
              <FormControlLabel
                control={<Checkbox color="info" defaultChecked />}
                label="Include Custom Creator Information"
                sx={{ m: 0 }}
              />
            </m.div>
          </Stack>

          {/* Row 6 */}
          <Stack spacing={3} direction="row" justifyContent="center" sx={{ width: 1 }}>
            <Stack spacing={3} sx={{ width: 1 }}>
              <m.div variants={varFade().in}>
                <TextField fullWidth label="Token Name" value="Solstudio Token" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </m.div>

              <m.div variants={varFade().in}>
                <TextField
                  select
                  fullWidth
                  label="Token Program"
                  value={select}
                  onChange={handleChangeSelect}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {['Token Program', 'Tax Payer (Token 2022)'].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </m.div>

              <m.div variants={varFade().in}>
                <TextField fullWidth multiline rows={3} label="Token Description" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </m.div>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Grid container direction={{ xs: 'column', md: 'row-reverse' }} spacing={5}>
        <Grid xs={12} md={5}>
          {renderDescription}
        </Grid>

        <Grid xs={12} md={7}>
          {renderContent}
        </Grid>

        {!mdUp && (
          <Grid xs={12} sx={{ textAlign: 'center' }}>
            {viewAllBtn}
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 10 }}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Complete Feature Set
            </span>
          </Typography>
        </m.div>
        
        {renderFeatures}
      </Box>
    </Container>
  );
}
