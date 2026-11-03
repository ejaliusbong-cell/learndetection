import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ScanFace, Activity, History, User, LogOut, Menu, X, Sparkles, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <ScanFace className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">FaceScan</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                AI Vision
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Client-Side Private Inference
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive('/dashboard')
                    ? 'bg-slate-850 text-teal-400 border border-slate-700/80 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Activity className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/analyze"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive('/analyze')
                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
                Analyze Studio
              </Link>

              <Link
                to="/history"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive('/history')
                    ? 'bg-slate-850 text-teal-400 border border-slate-700/80'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/analyze"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive('/analyze')
                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                    : 'text-teal-400 hover:text-teal-300 hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                Live Camera
              </Link>
              <a href="/#features" className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition">
                Features
              </a>
              <a href="/#how-it-works" className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition">
                How It Works
              </a>
              <a href="/#technology" className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition">
                Technology
              </a>
              <a href="/#privacy" className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition">
                Privacy & Ethics
              </a>
            </>
          )}
        </nav>

        {/* Right CTA / User Profile */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                  {user.fullName}
                </span>
              </Link>

              <button
                onClick={logout}
                title="Sign out"
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/analyze"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-md shadow-teal-500/20 flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Buka Kamera
              </Link>
              <Link
                to="/auth"
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-200"
              >
                Dashboard
              </Link>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-teal-400"
              >
                Analyze Studio
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-200"
              >
                History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-200"
              >
                Profile & Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-teal-400 bg-teal-500/10 rounded-xl"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                Live Camera Studio (Bebas Akses)
              </Link>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-200"
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-200"
              >
                How It Works
              </a>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-teal-500 text-white rounded-xl text-sm font-bold"
              >
                Sign In with Google
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
