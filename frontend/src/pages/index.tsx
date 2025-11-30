'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Typography, 
  Button, 
  Container, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip,
  useTheme,
  Avatar
} from '@mui/material';
import { 
  Security, 
  TrendingDown, 
  AccountBalanceWallet, 
  Psychology,
  ArrowForward 
} from '@mui/icons-material';

// --- Components for cleaner code structure ---

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card sx={{ height: '100%', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
    <CardContent sx={{ p: 4 }}>
      <Box sx={{ color: 'primary.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const StatBox = ({ number, label }: { number: string, label: string }) => (
  <Box>
    <Typography variant="h4" fontWeight="800" color="primary">
      {number}
    </Typography>
    <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">
      {label}
    </Typography>
  </Box>
);

// --- Main Page Component ---

export default function Home() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>CapStack | The Smart Financial Safety Net</title>
        <meta name="description" content="AI-powered financial safety net for unstable markets." />
      </Head>

      {/* 1. HERO SECTION */}
      <Box sx={{ 
        bgcolor: 'background.paper', 
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 8, md: 10 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            
            {/* Hero Text */}
            <Grid item xs={12} md={7}>
              <Chip 
                label="AI-Powered Financial Defense" 
                color="secondary" 
                size="small" 
                sx={{ mb: 3, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }} 
              />
              <Typography variant="h2" component="h1" fontWeight="900" sx={{ mb: 2, lineHeight: 1.1 }}>
                Build Your Safety Net <br />
                <Box component="span" sx={{ color: 'primary.main' }}>Before the Market Shifts.</Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, fontWeight: 'normal' }}>
                In an era of layoffs and inflation, CapStack acts as your personal 
                <strong> Financial Data Scientist</strong>. We automate your emergency funds, 
                block risky spending, and stabilize your future.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={Link} 
                  href="/onboarding"
                  endIcon={<ArrowForward />}
                  sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem' }}
                >
                  Start My Audit
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  href="#how-it-works"
                  sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem' }}
                >
                  How it Works
                </Button>
              </Stack>

              {/* Trust Indicators / Social Proof based on Problem Statement */}
              <Stack direction="row" spacing={4} sx={{ mt: 6 }}>
                <StatBox number="4k+" label="Jobs at Risk Tracked" />
                <StatBox number="24/7" label="AI Monitoring" />
                <StatBox number="100%" label="Traceability" />
              </Stack>
            </Grid>

            {/* Hero Visual (Abstract Representation of Shield/Data) */}
            <Grid item xs={12} md={5}>
              <Box sx={{ 
                position: 'relative', 
                height: 400, 
                width: '100%',
                bgcolor: 'primary.light',
                opacity: 0.1,
                borderRadius: '50% 50% 50% 0%',
                display: { xs: 'none', md: 'block' }
              }}>
                {/* You can replace this Box with an actual <img> or <Image /> tag later */}
              </Box>
               {/* Floating Cards for effect */}
               <Card sx={{ position: 'absolute', top: '20%', right: '10%', maxWidth: 220, boxShadow: 4, display: { xs: 'none', md: 'block' } }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <Security color="success" />
                      <Typography variant="subtitle2" fontWeight="bold">Emergency Fund</Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight="bold">₹ 1,50,000</Typography>
                    <Typography variant="caption" color="success.main">+12% this month</Typography>
                  </CardContent>
               </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. PROBLEM & SOLUTION SECTION */}
      <Box sx={{ py: 10, bgcolor: 'grey.50' }} id="how-it-works">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1.5}>
              The CapStack Advantage
            </Typography>
            <Typography variant="h3" fontWeight="800" sx={{ mt: 1 }}>
              Survive the &ldquo;Unstable Market Reality&rdquo;
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 700, mx: 'auto' }}>
              Traditional banking is scattered. We bring your data together to enforce 
              discipline and build a fortress around your income.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<TrendingDown fontSize="large" />}
                title="Automated Spending Blocks"
                description="Our algorithms detect weak control over money flow and automatically block discretionary spending when your safety score drops."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<Psychology fontSize="large" />}
                title="AI Financial Scientist"
                description="We analyze global layoff trends and inflation data to adjust your 'Survival Ratio'—balancing SIPs, stocks, and cash daily."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                icon={<AccountBalanceWallet fontSize="large" />}
                title="Traceability & Transparency"
                description="End-to-end tracking of every rupee. No scattered platforms. Just one integrated dashboard for your total financial health."
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. CTA SECTION */}
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: { xs: 4, md: 8 }, 
          borderRadius: 4,
          boxShadow: 10
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to secure your future?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of young professionals building their safety net today.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link}
            href="/onboarding"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main', 
              fontWeight: 'bold',
              '&:hover': { bgcolor: 'grey.100' } 
            }}
          >
            Create Free Account
          </Button>
        </Box>
      </Container>
    </>
  );
}