import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { ProfileService } from '../services/profile.service.js';

export const profileRouter = Router();

const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

profileRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const profile = await ProfileService.getProfileById(req.user!.id);
    res.json({ success: true, data: profile });
  } catch (e) {
    next(e);
  }
});

profileRouter.patch('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = UpdateProfileSchema.parse(req.body);
    const updated = await ProfileService.updateProfile(req.user!.id, {
      fullName: body.fullName,
      avatarUrl: body.avatarUrl || undefined,
    });
    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (e) {
    next(e);
  }
});

profileRouter.post('/delete-data', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    await ProfileService.deleteUserData(req.user!.id);
    res.json({ success: true, message: 'All user data has been permanently deleted.' });
  } catch (e) {
    next(e);
  }
});
