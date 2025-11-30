import { Router } from 'express';
import {
  lock,
  unlock,
  getStatus,
  createPlan,
  getInsights,
  checkTransaction,
  processTransaction,
  triggerAutoSave
} from '../controllers/savingsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

// Savings management
router.post('/lock', lock);
router.post('/unlock/:planId', unlock);
router.get('/status', getStatus);

// Discipline protocol
router.post('/plan', createPlan);
router.get('/insights', getInsights);
router.post('/check-transaction', checkTransaction);
router.post('/process-transaction', processTransaction);
router.post('/auto-save', triggerAutoSave);

export default router;