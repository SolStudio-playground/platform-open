// @mui
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// _mock
import { _faqs } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { Button, Stack, Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function FaqsList() {
  const theme = useTheme();

  return (
    <Box>
      {_faqs.map((accordion) => (
        <Accordion 
          key={accordion.id}
          sx={{
            mb: 2,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
              borderColor: alpha(theme.palette.primary.main, 0.3),
              boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
          }}
        >
          <AccordionSummary 
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{
              '& .MuiAccordionSummary-content': {
                my: 2,
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {accordion.heading}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {accordion.detail}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
      
      <Stack
        spacing={3}
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          mt: 8,
          py: 6,
          px: { xs: 4 },
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
          Still have questions?
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 600 }}>
          Our team is here to help! Chat with us on Telegram or follow us on Twitter for the latest updates, 
          tutorials, and community discussions.
        </Typography>
        
        <Stack sx={{ mt: 2 }} direction="row" spacing={3} flexWrap="wrap" justifyContent="center">
          <Button
            href="#"
            target="_blank"
            startIcon={<Iconify icon="simple-icons:x" width={24} height={24} />}
            sx={{ 
              px: 4, 
              py: 2,
              bgcolor: '#000000',
              color: 'white',
              borderRadius: 3,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#1a1a1a',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
            variant="contained"
            size="large"
          >
            Follow on Twitter
          </Button>
          
          <Button
            href="https://t.me/solstudio_so"
            target="_blank"
            startIcon={<Iconify icon="simple-icons:telegram" width={24} height={24} />}
            sx={{ 
              px: 4, 
              py: 2,
              bgcolor: '#229ED9',
              color: 'white',
              borderRadius: 3,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#1e8bc3',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(34, 158, 217, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
            variant="contained"
            size="large"
          >
            Join Telegram
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
