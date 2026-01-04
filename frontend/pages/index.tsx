import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, Container, Typography, Box } from '@mui/material';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  
  return (
    <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6">Redirecting to dashboard...</Typography>
      </Box>
    </Container>
  );
}
