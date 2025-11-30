import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface SavingsLockCardProps {
  lockedAmount: number;
  availableAmount: number;
  onLock: (amount: number) => void;
  onUnlock: (amount: number) => void;
}

export default function SavingsLockCard({
  lockedAmount,
  availableAmount,
  onLock,
  onUnlock
}: SavingsLockCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Savings Lock
        </Typography>
        <Typography variant="body1">
          Locked: ${lockedAmount}
        </Typography>
        <Typography variant="body1">
          Available: ${availableAmount}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" onClick={() => onLock(100)}>
            Lock $100
          </Button>
          <Button variant="outlined" size="small" onClick={() => onUnlock(100)}>
            Unlock $100
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}