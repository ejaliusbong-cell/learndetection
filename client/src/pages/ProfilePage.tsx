import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Shield,
  Sliders,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Save,
  Lock,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [smoothingFactor, setSmoothingFactor] = useState(0.35);
  const [mirrorMode, setMirrorMode] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);

    // Fetch user preferences
    api.getPreferences().then((res: any) => {
      if (res?.data) {
        const cam = res.data.camera_preference || {};
        const ana = res.data.analysis_preferences || {};
        if (cam.mirrorMode !== undefined) setMirrorMode(cam.mirrorMode);
        if (cam.showLandmarks !== undefined) setShowLandmarks(cam.showLandmarks);
        if (ana.smoothingFactor !== undefined) setSmoothingFactor(ana.smoothingFactor);
      }
    });
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      await api.updateProfile({ fullName });
      await api.updatePreferences({
        cameraPreference: { mirrorMode, showLandmarks },
        analysisPreferences: { smoothingFactor },
      });
      await refreshProfile();
      setStatusMsg({ type: 'success', text: 'Profile and preferences updated successfully!' });
    } catch (e: any) {
      setStatusMsg({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePurgeAllData = async () => {
    const confirmation = prompt(
      'Type "DELETE MY DATA" to permanently purge all your facial analysis sessions, history, and profile records from the database.'
    );

    if (confirmation === 'DELETE MY DATA') {
      try {
        await api.purgeUserData();
        alert('All your biometric sessions and profile records have been permanently deleted.');
        await logout();
      } catch (e: any) {
        alert(`Deletion error: ${e.message}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-teal-400" />
          Account & Privacy Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your Google authentication profile, AI inference preferences, and privacy rights.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/60 border border-red-500/30 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-teal-400" />
            Google Profile Information
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-xl font-bold border border-teal-500/30">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}

            <div className="space-y-1">
              <span className="text-sm font-bold text-white block">{user?.fullName}</span>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {user?.email}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block mt-1">
                Authenticated via Google OAuth
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Registered Email (Read-only)
              </label>
              <input
                type="text"
                value={user?.email || ''}
                readOnly
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 outline-none cursor-not-allowed font-mono"
              />
            </div>
          </div>
        </div>

        {/* AI & Camera Preferences Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-teal-400" />
            AI Inference & Camera Parameters
          </h2>

          <div className="space-y-5">
            {/* Smoothing factor */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-300">
                  Temporal Smoothing Factor (Alpha): <strong className="text-teal-400">{smoothingFactor}</strong>
                </label>
                <span className="text-slate-500 text-[11px]">Lower = Smoother, Higher = Faster</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.9"
                step="0.05"
                value={smoothingFactor}
                onChange={e => setSmoothingFactor(parseFloat(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mirrorMode}
                  onChange={e => setMirrorMode(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-slate-300">Horizontal Mirror Preview</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLandmarks}
                  onChange={e => setShowLandmarks(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-500"
                />
                <span className="text-xs font-medium text-slate-300">Show Mesh Overlay by Default</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>

      {/* GDPR Data Purge Card */}
      <div className="bg-red-950/20 border border-red-500/20 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 mt-0.5">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Permanently Delete All User Data (GDPR)</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              In accordance with your privacy rights, you can permanently wipe all historical analysis sessions, expression distributions, preferences, and your profile records from our Google Cloud SQL database.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handlePurgeAllData}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete All My Data
          </button>
        </div>
      </div>
    </div>
  );
};
