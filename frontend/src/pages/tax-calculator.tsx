import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, TextField, Select, MenuItem, FormControl, InputLabel, Button, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../components/Layout';

const TaxCalculator = () => {
    const [income, setIncome] = useState(1200000);
    const [regime, setRegime] = useState<'old' | 'new'>('new');
    const [deductions, setDeductions] = useState({
        section80C: 150000,
        section80D: 25000,
        homeLoan: 200000,
        nps: 50000,
    });

    const calculateTax = () => {
        let taxableIncome = income;

        if (regime === 'old') {
            taxableIncome -= deductions.section80C;
            taxableIncome -= deductions.section80D;
            taxableIncome -= deductions.homeLoan;
            taxableIncome -= deductions.nps;
        }

        let tax = 0;
        if (regime === 'new') {
            // New regime slabs (FY 2024-25)
            if (taxableIncome <= 300000) tax = 0;
            else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
            else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.10;
            else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
            else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.20;
            else tax = 150000 + (taxableIncome - 1500000) * 0.30;
        } else {
            // Old regime slabs
            if (taxableIncome <= 250000) tax = 0;
            else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
            else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.20;
            else tax = 112500 + (taxableIncome - 1000000) * 0.30;
        }

        // Add 4% cess
        tax = tax * 1.04;

        return {
            taxableIncome,
            tax: Math.round(tax),
            effectiveRate: ((tax / income) * 100).toFixed(2),
            takeHome: income - Math.round(tax),
        };
    };

    const taxData = calculateTax();

    const breakdownData = [
        { name: 'Take Home', value: taxData.takeHome, color: '#10b981' },
        { name: 'Tax', value: taxData.tax, color: '#ef4444' },
    ];

    const monthlyBreakdown = [
        { month: 'Gross Income', amount: Math.round(income / 12) },
        { month: 'Tax Deducted', amount: Math.round(taxData.tax / 12) },
        { month: 'Take Home', amount: Math.round(taxData.takeHome / 12) },
    ];

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                    🧾 Tax Calculator
                </Typography>

                <Grid container spacing={3}>
                    {/* Input Section */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Income Details
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Annual Income"
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(Number(e.target.value))}
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                    }}
                                />

                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <InputLabel>Tax Regime</InputLabel>
                                    <Select
                                        value={regime}
                                        label="Tax Regime"
                                        onChange={(e) => setRegime(e.target.value as 'old' | 'new')}
                                    >
                                        <MenuItem value="new">New Regime (Lower rates, no deductions)</MenuItem>
                                        <MenuItem value="old">Old Regime (Higher rates, with deductions)</MenuItem>
                                    </Select>
                                </FormControl>

                                {regime === 'old' && (
                                    <Box>
                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                            Deductions
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            label="Section 80C (PPF, ELSS, etc.)"
                                            type="number"
                                            value={deductions.section80C}
                                            onChange={(e) => setDeductions({ ...deductions, section80C: Number(e.target.value) })}
                                            sx={{ mb: 2 }}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                            }}
                                            helperText="Max: ₹1,50,000"
                                        />

                                        <TextField
                                            fullWidth
                                            label="Section 80D (Health Insurance)"
                                            type="number"
                                            value={deductions.section80D}
                                            onChange={(e) => setDeductions({ ...deductions, section80D: Number(e.target.value) })}
                                            sx={{ mb: 2 }}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                            }}
                                            helperText="Max: ₹25,000"
                                        />

                                        <TextField
                                            fullWidth
                                            label="Home Loan Interest"
                                            type="number"
                                            value={deductions.homeLoan}
                                            onChange={(e) => setDeductions({ ...deductions, homeLoan: Number(e.target.value) })}
                                            sx={{ mb: 2 }}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                            }}
                                            helperText="Max: ₹2,00,000"
                                        />

                                        <TextField
                                            fullWidth
                                            label="NPS (Additional 80CCD(1B))"
                                            type="number"
                                            value={deductions.nps}
                                            onChange={(e) => setDeductions({ ...deductions, nps: Number(e.target.value) })}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                            }}
                                            helperText="Max: ₹50,000"
                                        />
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Results Section */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            {/* Summary Cards */}
                            <Grid item xs={12} md={6}>
                                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Taxable Income</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            ₹{taxData.taxableIncome.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Total Tax</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            ₹{taxData.tax.toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption">
                                            Effective Rate: {taxData.effectiveRate}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Annual Take Home</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            ₹{taxData.takeHome.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Monthly Take Home</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            ₹{Math.round(taxData.takeHome / 12).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Income Distribution */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            Income Distribution
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={breakdownData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {breakdownData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Monthly Breakdown */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            Monthly Breakdown
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={monthlyBreakdown}>
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                                <Bar dataKey="amount" fill="#667eea" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Tax Saving Tips */}
                            <Grid item xs={12}>
                                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            💡 Tax Saving Recommendations
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            {regime === 'new' ? (
                                                <>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        • You&apos;re using the New Tax Regime. Consider switching to Old Regime if you can claim deductions worth more than ₹{Math.round((taxData.tax * 0.15))}.
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        • The New Regime offers lower tax rates but no deductions. It&apos;s beneficial if you don&apos;t have many investments.
                                                    </Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        • Maximize your Section 80C deduction by investing in ELSS, PPF, or NPS to save up to ₹46,800 in taxes.
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        • Claim health insurance premium under Section 80D to save up to ₹7,800 in taxes.
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        • Consider additional NPS contribution under 80CCD(1B) for extra ₹15,600 tax savings.
                                                    </Typography>
                                                </>
                                            )}
                                            <Typography variant="body2">
                                                • Your effective tax rate is {taxData.effectiveRate}%. The average for your income bracket is {(Number(taxData.effectiveRate) + 2).toFixed(2)}%.
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default TaxCalculator;
