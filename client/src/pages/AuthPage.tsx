import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loginWithGoogle, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google OAuth.');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-[32px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] space-y-6 relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#114232] flex items-center justify-center text-white shadow-pine mb-3">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 fill-none stroke-current stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 6a6 6 0 1 0 6 6" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            Masuk ke FaceScan AI
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Sinkronkan analisis ekspresi wajah ke database cloud Anda
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Primary: Sign In with Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-full border border-slate-200/90 flex items-center justify-center gap-3 shadow-clean transition duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">
              atau coba langsung
            </span>
            <div className="flex-grow border-t border-slate-100" />
          </div>

          {/* Secondary: Instant Demo Session Mode */}
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 px-4 bg-[#114232] hover:bg-[#0d3528] text-white font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-pine transition duration-200"
          >
            <Sparkles className="w-4 h-4" />
            <span>Masuk Mode Demo Instan</span>
          </button>
        </div>

        <div className="p-3.5 bg-[#f4f5f7] border border-slate-200/60 rounded-2xl text-[11px] text-slate-500 text-center leading-relaxed font-medium">
          <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-[#114232]" />
          Video kamera Anda tidak pernah disimpan di server kami. Privasi dan keamanan data dijamin sepenuhnya.
        </div>
      </div>
    </div>
  );
};
