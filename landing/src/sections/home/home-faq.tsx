import { Container, Typography, Box } from '@mui/material';
import { MotionContainer } from 'src/components/animate';
import FaqsList from 'src/sections/home/faqs-list';

export default function FaqView() {
  return (
    <Container component={MotionContainer} sx={{ height: 1, my: 10 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            color: 'primary.main', 
            fontWeight: 600, 
            letterSpacing: 2,
            mb: 2,
            display: 'block',
          }}
        >
          ❓ Need Help?
        </Typography>
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Frequently Asked Questions
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            maxWidth: 600, 
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Find answers to common questions about solstudio.so and how to get started with your Solana project.
        </Typography>
      </Box>
      
      <FaqsList />
    </Container>
  );
}
