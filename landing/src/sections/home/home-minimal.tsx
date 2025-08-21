import { m } from 'framer-motion';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { MotionViewport, varFade } from 'src/components/animate';


// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function HomeMinimal() {
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 5 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 5 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
            A SIMPLE WAY TO CREATE TOKENS
          </Typography>
        </m.div>
        <m.div variants={varFade().inDown}>
          <Typography variant="h3">  Solstudio is your ultimate token toolkit - <Typography component="span" sx={{textDecoration: 'underline', color: '#3e83ff' }} variant='h3'>no coding needed. </Typography> 
          </Typography>
        </m.div>
      </Stack>
    </Container>
  );
}
