import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, TextField, LinearProgress, Chip, IconButton } from '@mui/material';
import { Add, Edit, Delete, CheckCircle } from '@mui/icons-material';
import Layout from '../components/Layout';

interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: 'house' | 'car' | 'vacation' | 'retirement' | 'education' | 'other';
    priority: 'high' | 'medium' | 'low';
    color: string;
}

const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([
        {
            id: '1',
            name: 'Dream Home Down Payment',
            targetAmount: 2000000,
            currentAmount: 850000,
            deadline: '2026-12-31',
            category: 'house',
            priority: 'high',
            color: '#3b82f6',
        },
        {
            id: '2',
            name: 'New Car',
            targetAmount: 800000,
            currentAmount: 320000,
            deadline: '2025-06-30',
            category: 'car',
            priority: 'medium',
            color: '#10b981',
        },
        {
            id: '3',
            name: 'Europe Vacation',
            targetAmount: 300000,
            currentAmount: 180000,
            deadline: '2025-09-01',
            category: 'vacation',
            priority: 'low',
            color: '#f59e0b',
        },
        {
            id: '4',
            name: 'Retirement Fund',
            targetAmount: 10000000,
            currentAmount: 1500000,
            deadline: '2050-12-31',
            category: 'retirement',
            priority: 'high',
            color: '#8b5cf6',
        },
    ]);

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            house: '🏠',
            car: '🚗',
            vacation: '✈️',
            retirement: '🏖️',
            education: '🎓',
            other: '🎯',
        };
        return icons[category] || '🎯';
    };

    const getPriorityColor = (priority: string) => {
        const colors: Record<string, string> = {
            high: '#ef4444',
            medium: '#f59e0b',
            low: '#10b981',
        };
        return colors[priority] || '#6b7280';
    };

    const calculateMonthsRemaining = (deadline: string) => {
        const today = new Date();
        const target = new Date(deadline);
        const months = Math.max(0, Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        return months;
    };

    const calculateMonthlySavingsNeeded = (goal: Goal) => {
        const remaining = goal.targetAmount - goal.currentAmount;
        const months = calculateMonthsRemaining(goal.deadline);
        return months > 0 ? Math.ceil(remaining / months) : 0;
    };

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        🎯 Financial Goals
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' },
                        }}
                    >
                        Add New Goal
                    </Button>
                </Box>

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Total Goals</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700 }}>{goals.length}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Target Amount</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    ₹{(goals.reduce((sum, g) => sum + g.targetAmount, 0) / 10000000).toFixed(1)}Cr
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Saved So Far</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    ₹{(goals.reduce((sum, g) => sum + g.currentAmount, 0) / 100000).toFixed(1)}L
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Overall Progress</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                    {((goals.reduce((sum, g) => sum + g.currentAmount, 0) / goals.reduce((sum, g) => sum + g.targetAmount, 0)) * 100).toFixed(0)}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Goals List */}
                <Grid container spacing={3}>
                    {goals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const monthsRemaining = calculateMonthsRemaining(goal.deadline);
                        const monthlySavings = calculateMonthlySavingsNeeded(goal);

                        return (
                            <Grid item xs={12} md={6} key={goal.id}>
                                <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -10,
                                            right: 20,
                                            background: goal.color,
                                            color: 'white',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            fontSize: '2rem',
                                        }}
                                    >
                                        {getCategoryIcon(goal.category)}
                                    </Box>
                                    <CardContent sx={{ pt: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {goal.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Chip
                                                        label={goal.priority.toUpperCase()}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: getPriorityColor(goal.priority),
                                                            color: 'white',
                                                            fontWeight: 600,
                                                        }}
                                                    />
                                                    <Chip
                                                        label={`${monthsRemaining} months left`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>
                                            <Box>
                                                <IconButton size="small">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Progress
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {progress.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(progress, 100)}
                                                sx={{
                                                    height: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: '#e5e7eb',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: goal.color,
                                                        borderRadius: 5,
                                                    },
                                                }}
                                            />
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="textSecondary">
                                                    Current Amount
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: goal.color }}>
                                                    ₹{(goal.currentAmount / 100000).toFixed(1)}L
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="textSecondary">
                                                    Target Amount
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    ₹{(goal.targetAmount / 100000).toFixed(1)}L
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        background: `linear-gradient(135deg, ${goal.color}15 0%, ${goal.color}05 100%)`,
                                                        borderRadius: 2,
                                                        border: `1px solid ${goal.color}30`,
                                                    }}
                                                >
                                                    <Typography variant="caption" color="textSecondary">
                                                        Monthly Savings Needed
                                                    </Typography>
                                                    <Typography variant="h5" sx={{ fontWeight: 700, color: goal.color }}>
                                                        ₹{monthlySavings.toLocaleString()}/month
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        to reach your goal by {new Date(goal.deadline).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* AI Recommendations */}
                <Card sx={{ mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            🤖 Goal Achievement Recommendations
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                • Prioritize your &quot;Dream Home Down Payment&quot; - you&apos;re 42.5% there! Increase monthly savings by ₹5,000 to reach it 3 months earlier.
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                • Your &quot;Europe Vacation&quot; goal is 60% complete and on track. You&apos;ll reach it 2 months before the deadline at your current pace.
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                • Consider setting up automatic transfers of ₹15,000/month to your retirement fund to stay on track.
                            </Typography>
                            <Typography variant="body2">
                                • You&apos;re saving ₹45,000/month across all goals. This is excellent progress - keep it up!
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Layout>
    );
};

export default Goals;
