import { Card, CardContent, Typography } from '@mui/material';

interface SurvivalCalculatorCardProps {
  months: number;
  category: string;
}

export default function SurvivalCalculatorCard({ months, category }: SurvivalCalculatorCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Emergency Survival
        </Typography>
        <Typography variant="h4" color="secondary">
          {months} months
        </Typography>
        <Typography variant="body2">
          Coverage: {category}
        </Typography>
      </CardContent>
    </Card>
  );
}