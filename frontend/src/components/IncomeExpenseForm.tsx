import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

interface IncomeExpenseFormProps {
  onSubmit: (data: { income: number; expenses: number }) => void;
}

export default function IncomeExpenseForm({ onSubmit }: IncomeExpenseFormProps) {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      income: parseFloat(income),
      expenses: parseFloat(expenses)
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Enter Financial Data
      </Typography>
      <TextField
        fullWidth
        label="Monthly Income"
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Monthly Expenses"
        type="number"
        value={expenses}
        onChange={(e) => setExpenses(e.target.value)}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Calculate
      </Button>
    </Box>
  );
}