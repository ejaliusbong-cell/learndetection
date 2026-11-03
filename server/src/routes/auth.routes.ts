import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
