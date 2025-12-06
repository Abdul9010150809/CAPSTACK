import { Request, Response } from 'express';
import { calculateHealthScore } from '../services/healthScoreService';
import { calculateSurvivalMonths } from '../services/survivalService';
import { calculateIncomeSuitabilityScore } from '../services/incomeVarianceService';

export const calculateFinance = async (req: Request, res: Response) => {
  // TODO: General finance calculations
  const { income, expenses } = req.body;
  const ratio = expenses / income;
  res.json({ expenseRatio: ratio });
};

export const getHealthScore = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const isGuest = (req as any).isGuest;

  // For guest users or when no user data is available, use mock data
  const result = await calculateHealthScore(userId || 0);
  res.json({
    score: result.totalScore,
    grade: result.grade,
    categoryScores: result.categoryScores,
    insights: result.insights,
    recommendations: result.recommendations,
    isGuest: isGuest || false
  });
};

export const getSurvival = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const isGuest = (req as any).isGuest;

  const result = await calculateSurvivalMonths(userId || 0);
  res.json({
    months: result.months,
    riskLevel: result.riskLevel,
    breakdown: result.breakdown,
    scenarios: result.scenarios,
    recommendations: result.recommendations,
    isGuest: isGuest || false
  });
};

export const getIncomeScore = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const isGuest = (req as any).isGuest;

  const result = await calculateIncomeSuitabilityScore(userId || 0);
  res.json({
    score: result.totalScore,
    grade: result.grade,
    riskLevel: result.riskLevel,
    categoryScores: result.categoryScores,
    insights: result.insights,
    recommendations: result.recommendations,
    projections: result.projections,
    isGuest: isGuest || false
  });
};