import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../config/db.js';

export const preferencesRouter = Router();

const UpdatePrefSchema = z.object({
  cameraPreference: z.record(z.any()).optional(),
  analysisPreferences: z.record(z.any()).optional(),
});

preferencesRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await db.query(
      'SELECT camera_preference, analysis_preferences, updated_at FROM public.user_preferences WHERE user_id = $1',
      [req.user!.id]
    );

    const data = result.rows[0] || {
      camera_preference: { preferredDeviceId: null, mirrorMode: true, showLandmarks: true },
      analysis_preferences: { smoothingFactor: 0.35, inferenceFps: 30, minConfidence: 0.4 },
    };

    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

preferencesRouter.patch('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = UpdatePrefSchema.parse(req.body);
    const existing = await db.query(
      'SELECT camera_preference, analysis_preferences FROM public.user_preferences WHERE user_id = $1',
      [req.user!.id]
    );

    const prevCamera = existing.rows[0]?.camera_preference || { preferredDeviceId: null, mirrorMode: true, showLandmarks: true };
    const prevAnalysis = existing.rows[0]?.analysis_preferences || { smoothingFactor: 0.35, inferenceFps: 30, minConfidence: 0.4 };

    const newCam = body.cameraPreference ? { ...prevCamera, ...body.cameraPreference } : prevCamera;
    const newAnalysis = body.analysisPreferences ? { ...prevAnalysis, ...body.analysisPreferences } : prevAnalysis;

    await db.query(
      `INSERT INTO public.user_preferences (user_id, camera_preference, analysis_preferences, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         camera_preference = EXCLUDED.camera_preference,
         analysis_preferences = EXCLUDED.analysis_preferences,
         updated_at = NOW()`,
      [req.user!.id, JSON.stringify(newCam), JSON.stringify(newAnalysis)]
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { camera_preference: newCam, analysis_preferences: newAnalysis },
    });
  } catch (e) {
    next(e);
  }
});
