import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  ShieldCheck,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-[#114232]" />
          Account & Privacy Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Manage your Google authentication profile, AI inference preferences, and GDPR data rights.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-medium ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#114232]" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Info Card */}
        <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-clean space-y-6">
          <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-[#114232]" />
            Google Profile Information
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#114232] text-white flex items-center justify-center text-xl font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}

            <div className="space-y-1">
              <span className="text-base font-extrabold text-[#111827] block">{user?.fullName}</span>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </p>
              <span className="text-[10px] text-[#114232] font-bold bg-[#eaf4f0] px-2.5 py-0.5 rounded-full border border-[#114232]/10 inline-block mt-1">
                Authenticated via Google OAuth
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-[#f4f5f7] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 outline-none font-medium focus:border-[#114232]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registered Email (Read-only)
              </label>
              <input
                type="text"
                value={user?.email || ''}
                readOnly
                disabled
                className="w-full bg-[#f4f5f7] border border-slate-200 text-slate-500 rounded-full px-4 py-2.5 text-xs outline-none cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Inference Preferences Card */}
        <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 shadow-clean space-y-6">
          <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-[#114232]" />
            AI Inference & Camera Preferences
          </h2>

          <div className="space-y-4">
            {/* Smoothing factor slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Exponential Moving Average (EMA) Smoothing</span>
                <span className="font-mono text-[#114232]">{smoothingFactor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={smoothingFactor}
                onChange={e => setSmoothingFactor(parseFloat(e.target.value))}
                className="w-full accent-[#114232] cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Nilai lebih rendah menghasilkan stabilitas halus; nilai lebih tinggi lebih responsif terhadap kedipan cepat.
              </p>
            </div>

            {/* Toggle checkboxes */}
            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mirrorMode}
                  onChange={e => setMirrorMode(e.target.checked)}
                  className="w-4 h-4 rounded text-[#114232] focus:ring-[#114232] accent-[#114232]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Mirror Camera Stream</span>
                  <span className="text-[11px] text-slate-500">
                    Membalik tampilan video horizontal seperti cermin alami.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLandmarks}
                  onChange={e => setShowLandmarks(e.target.checked)}
                  className="w-4 h-4 rounded text-[#114232] focus:ring-[#114232] accent-[#114232]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Tampilkan 478 Mesh Landmark</span>
                  <span className="text-[11px] text-slate-500">
                    Merender titik geometri MediaPipe di atas video secara default.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#114232] hover:bg-[#0d3528] text-white text-xs font-bold shadow-pine transition"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </div>
      </form>

      {/* Danger Zone: GDPR Right to be Forgotten */}
      <div className="bg-white border border-rose-200 rounded-[28px] p-6 sm:p-8 shadow-clean space-y-4">
        <h2 className="text-sm font-bold text-rose-700 flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Hapus Seluruh Data Pribadi (GDPR Right to Erasure)
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Tindakan ini akan menghapus secara permanen seluruh riwayat sesi analisis, metrik ekspresi, preferensi, dan akun Anda dari database Google Cloud SQL. Data yang dihapus tidak dapat dipulihkan.
        </p>

        <button
          type="button"
          onClick={handlePurgeAllData}
          className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm"
        >
          Purge All My Data & Logout
        </button>
      </div>
    </div>
  );
};
