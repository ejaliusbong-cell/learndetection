import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { profileRouter } from './profile.routes.js';
import { analysisRouter } from './analysis.routes.js';
import { preferencesRouter } from './preferences.routes.js';
import { consentRouter } from './consent.routes.js';
import { db } from '../config/db.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AI Facial Expression Analysis Backend API',
    uptime: process.uptime(),
    isLiveDatabase: db.isLiveDB,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/analysis', analysisRouter);
apiRouter.use('/preferences', preferencesRouter);
apiRouter.use('/consent', consentRouter);
