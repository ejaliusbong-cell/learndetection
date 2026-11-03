import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { AnalysisService } from '../services/analysis.service.js';

export const analysisRouter = Router();

const CreateSessionSchema = z.object({
  sessionStartedAt: z.string().datetime(),
  sessionEndedAt: z.string().datetime(),
  dominantExpression: z.string().min(1),
  averageConfidence: z.number().min(0).max(100),
  totalFramesAnalyzed: z.number().int().min(1),
  expressionDistribution: z.record(z.string(), z.number()),
  notes: z.string().optional(),
  expressionSamples: z
    .array(
      z.object({
        expressionLabel: z.string(),
        confidenceScore: z.number(),
        recordedAt: z.string().optional(),
      })
    )
    .optional(),
});

// Create new session summary
analysisRouter.post('/sessions', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = CreateSessionSchema.parse(req.body);

    const session = await AnalysisService.createSession({
      userId: req.user!.id,
      sessionStartedAt: validated.sessionStartedAt,
      sessionEndedAt: validated.sessionEndedAt,
      dominantExpression: validated.dominantExpression,
      averageConfidence: validated.averageConfidence,
      totalFramesAnalyzed: validated.totalFramesAnalyzed,
      expressionDistribution: validated.expressionDistribution,
      notes: validated.notes,
      expressionSamples: validated.expressionSamples,
    });

    res.status(201).json({
      success: true,
      message: 'Analysis session successfully recorded',
      data: session,
    });
  } catch (e) {
    next(e);
  }
});

// List user sessions (paginated)
analysisRouter.get('/sessions', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const offset = parseInt(req.query.offset as string) || 0;

    const sessions = await AnalysisService.getSessionsByUser(req.user!.id, limit, offset);
    res.json({
      success: true,
      total: sessions.length,
      data: sessions,
    });
  } catch (e) {
    next(e);
  }
});

// Get user aggregated stats
analysisRouter.get('/stats', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const stats = await AnalysisService.getUserStatistics(req.user!.id);
    res.json({
      success: true,
      data: stats,
    });
  } catch (e) {
    next(e);
  }
});

// Get single session details
analysisRouter.get('/sessions/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const session = await AnalysisService.getSessionById(req.params.id, req.user!.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found or access denied.' });
    }
    res.json({ success: true, data: session });
  } catch (e) {
    next(e);
  }
});

// Delete session
analysisRouter.delete('/sessions/:id', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const deleted = await AnalysisService.deleteSession(req.params.id, req.user!.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Session not found or unauthorized' });
    }
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (e) {
    next(e);
  }
});
