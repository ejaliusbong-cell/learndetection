import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ScanFace,
  LayoutDashboard,
  Camera,
  Clock,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Bell,
  Search,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - Donezo-inspired aesthetic */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#114232] flex items-center justify-center text-white shadow-sm shadow-[#114232]/20 group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-none stroke-current stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 6a6 6 0 1 0 6 6" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#111827]">
                FaceScan
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eaf4f0] text-[#114232] border border-[#114232]/10">
                AI Vision
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#114232]" />
              On-Device Private Inference
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  isActive('/dashboard')
                    ? 'bg-[#114232] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              <Link
                to="/analyze"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  isActive('/analyze')
                    ? 'bg-[#114232] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-emerald-500" />
                Live Camera
              </Link>

              <Link
                to="/history"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  isActive('/history')
                    ? 'bg-[#114232] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                History
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/analyze"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  isActive('/analyze')
                    ? 'bg-[#114232] text-white'
                    : 'text-[#114232] bg-[#eaf4f0] hover:bg-[#d8ece4]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#114232]" />
                Live Camera Studio
              </Link>
              <a
                href="/#features"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              >
                How It Works
              </a>
              <a
                href="/#technology"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              >
                Technology
              </a>
              <a
                href="/#privacy"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
              >
                Privacy & Ethics
              </a>
            </>
          )}
        </nav>

        {/* Right CTA / User Profile - Donezo style */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification icon pill */}
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition border border-slate-200/70"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* User profile pill */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#114232] text-white flex items-center justify-center text-xs font-bold">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight max-w-[110px] truncate">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-none max-w-[110px] truncate">
                    {user.email}
                  </p>
                </div>
              </Link>

              <button
                onClick={logout}
                title="Sign out"
                className="w-9 h-9 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 flex items-center justify-center transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                Sign In
              </Link>
              <Link
                to="/analyze"
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#114232] hover:bg-[#0d3528] shadow-sm shadow-[#114232]/25 flex items-center gap-1.5 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                Mulai Analisis
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white p-4 space-y-2 shadow-lg">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4 text-[#114232]" />
                Dashboard
              </Link>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#114232] bg-[#eaf4f0] rounded-xl"
              >
                <Camera className="w-4 h-4" />
                Live Camera Studio
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
              >
                <User className="w-4 h-4 text-slate-500" />
                Profile & Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-[#114232] bg-[#eaf4f0] rounded-xl"
              >
                <Sparkles className="w-4 h-4 text-[#114232]" />
                Buka Kamera (Bebas Akses)
              </Link>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700"
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700"
              >
                How It Works
              </a>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-[#114232]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
