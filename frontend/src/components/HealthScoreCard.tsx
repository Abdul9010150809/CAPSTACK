import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Box, 
  Chip, 
  Stack, 
  Alert 
} from '@mui/material';
import { 
  Shield as ShieldIcon, 
  TrendingUp as TrendingUpIcon, 
  Warning as WarningIcon 
} from '@mui/icons-material';

interface HealthScoreCardProps {
  score: number; // 0 to 100
  category: string; // e.g., "Savings", "Investments", "Debt Ratio"
}

export default function HealthScoreCard({ score, category }: HealthScoreCardProps) {
  
  // 1. Logic to determine status color and state based on score
  const getStatus = (score: number) => {
    if (score >= 80) return { color: 'success', label: 'Secure', icon: <ShieldIcon fontSize="small" /> };
    if (score >= 50) return { color: 'warning', label: 'At Risk', icon: <TrendingUpIcon fontSize="small" /> };
    return { color: 'error', label: 'Critical', icon: <WarningIcon fontSize="small" /> };
  };

  // 2. Logic to generate specific advice based on the problem statement (Emergency funds/SIPs)
  const getRecommendation = (score: number) => {
    if (score >= 80) return "Great job! Your emergency fund allocation is optimal.";
    if (score >= 50) return "Consider increasing your SIP allocation to build a stronger safety net.";
    return "Action Needed: Your expense data indicates high vulnerability. Pause discretionary spending.";
  };

  const status = getStatus(score);
  const statusColor = status.color as 'success' | 'warning' | 'error';

  return (
    <Card 
      elevation={3} 
      sx={{ 
        maxWidth: 400, 
        borderRadius: 4, // More modern, mobile-friendly look
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardContent>
        {/* Header: Category and Status Badge */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
            {category}
          </Typography>
          <Chip 
            icon={status.icon} 
            label={status.label} 
            color={statusColor} 
            size="small" 
            variant="outlined" 
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>

        {/* Score Display */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h2" fontWeight="800" color={`${statusColor}.main`}>
            {score}
            <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 0.5 }}>
              /100
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Financial Health Score
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={score} 
            color={statusColor}
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: (theme) => theme.palette.grey[200] 
            }} 
          />
        </Box>

        {/* Actionable Insight (Crucial for the Target Audience) */}
        <Alert severity={statusColor} icon={false} sx={{ borderRadius: 2 }}>
          <Typography variant="caption" fontWeight="bold" display="block">
            AI RECOMMENDATION:
          </Typography>
          {getRecommendation(score)}
        </Alert>

      </CardContent>
    </Card>
  );
}