import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../config/db.js';

export const consentRouter = Router();

const ConsentSchema = z.object({
  consentType: z.enum(['CAMERA_PROCESSING', 'SESSION_STATS_STORAGE', 'PRIVACY_POLICY']),
  consentStatus: z.boolean(),
});

consentRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = ConsentSchema.parse(req.body);
    const ip = req.ip || req.socket.remoteAddress;

    const result = await db.query(
      `INSERT INTO public.consent_records (user_id, consent_type, consent_status, ip_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, consent_type, consent_status, consented_at`,
      [req.user!.id, body.consentType, body.consentStatus, ip ? 'hash_' + ip.slice(0, 10) : null]
    );

    res.status(201).json({
      success: true,
      message: 'Consent recorded successfully',
      data: result.rows[0],
    });
  } catch (e) {
    next(e);
  }
});

consentRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT ON (consent_type) id, consent_type, consent_status, consented_at
       FROM public.consent_records
       WHERE user_id = $1
       ORDER BY consent_type, consented_at DESC`,
      [req.user!.id]
    );

    res.json({ success: true, data: result.rows });
  } catch (e) {
    next(e);
  }
});
