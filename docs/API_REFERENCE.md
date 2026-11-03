# 🔌 Express REST API Reference

**Base URL**: `http://localhost:5000/api`

All protected endpoints require an authorization header containing a valid Supabase JWT access token:
```http
Authorization: Bearer <SUPABASE_JWT_ACCESS_TOKEN>
```

---

## 1. Authentication & Identity

### `GET /api/auth/me`
Verifies current Supabase access token and returns synchronized user profile.
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "11111111-1111-1111-1111-111111111111",
    "supabaseUserId": "google-oauth2|1029384756",
    "email": "user@example.com",
    "fullName": "Alex Morgan",
    "avatarUrl": "https://lh3.googleusercontent.com/..."
  }
}
```

---

## 2. User Profile & Data Rights

### `GET /api/profile`
Returns full profile details for the authenticated user.
- **Access**: Protected

### `PATCH /api/profile`
Updates profile metadata.
- **Request Body**:
```json
{
  "fullName": "Alex Morgan, Ph.D.",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### `POST /api/profile/delete-data`
Permanently purges all user sessions, preferences, and profile entries from PostgreSQL (GDPR Right to be Forgotten).
- **Access**: Protected

---

## 3. Analysis Sessions

### `POST /api/analysis/sessions`
Records a completed real-time facial expression observation session.
- **Request Body**:
```json
{
  "sessionStartedAt": "2026-11-04T00:10:00.000Z",
  "sessionEndedAt": "2026-11-04T00:12:30.000Z",
  "dominantExpression": "Happy",
  "averageConfidence": 89.2,
  "totalFramesAnalyzed": 145,
  "expressionDistribution": {
    "Happy": 72.5,
    "Neutral": 18.0,
    "Surprised": 7.5,
    "Sad": 2.0,
    "Angry": 0.0,
    "Fearful": 0.0,
    "Disgusted": 0.0
  },
  "notes": "User testing prototype A"
}
```

### `GET /api/analysis/sessions`
Returns paginated session history for the authenticated user.
- **Query Params**: `limit` (default: 20), `offset` (default: 0)

### `GET /api/analysis/sessions/:id`
Retrieves detailed breakdown of a single session.

### `DELETE /api/analysis/sessions/:id`
Deletes a specific session belonging to the authenticated user.

### `GET /api/analysis/stats`
Aggregates user-level metrics across all sessions (total sessions, total frames, average confidence, expression distribution).

---

## 4. Preferences & Consent

### `GET /api/preferences` & `PATCH /api/preferences`
Inspect and update camera mirror mode, default landmark mesh visibility, and temporal smoothing alpha factor.

### `POST /api/consent`
Audits user consent grant (`CAMERA_PROCESSING`, `SESSION_STATS_STORAGE`, `PRIVACY_POLICY`).
