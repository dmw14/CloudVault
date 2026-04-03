import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Cloud, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl
        bg-white/80 dark:bg-surface-900/80
        border-b border-surface-200 dark:border-surface-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700
                flex items-center justify-center shadow-md shadow-primary-500/20
                group-hover:shadow-primary-500/40 transition-shadow duration-200">
                <Cloud size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-surface-900 dark:text-surface-100">
                Cloud<span className="text-primary-500">Notes</span>
              </span>
            </button>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* User menu */}
              <div className="relative" ref={menuRef}>
                <button
                  id="user-menu"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex min-h-11 items-center gap-3 rounded-2xl border border-transparent px-3.5 py-2
                    hover:border-surface-200 hover:bg-surface-100 dark:hover:border-surface-700 dark:hover:bg-surface-800
                    transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600
                    flex items-center justify-center text-white text-xs font-bold
                    shadow-sm shadow-primary-500/20">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 leading-tight max-w-[140px] truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-surface-400 dark:text-surface-500 leading-tight max-w-[140px] truncate">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown size={16} className={`text-surface-400 transition-transform duration-200 ml-1
                    ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 rounded-3xl
                        bg-white/95 dark:bg-surface-800/95 backdrop-blur
                        border border-surface-200 dark:border-surface-700
                        shadow-2xl shadow-black/10 dark:shadow-black/40
                        overflow-hidden"
                    >
                      {/* User info header */}
                      <div className="border-b border-surface-100 px-5 py-4 dark:border-surface-700">
                        <div className="flex items-center gap-3.5">
                          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600
                            flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm shadow-primary-500/25">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-surface-900 dark:text-surface-100 break-words leading-snug">
                              {user?.name}
                            </p>
                            <p className="text-xs text-surface-500 dark:text-surface-400 break-all leading-snug">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-1.5 p-3">
                        <button
                          id="profile-menu-item"
                          className="w-full flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                            text-surface-700 dark:text-surface-300
                            hover:bg-surface-50 dark:hover:bg-surface-700/60
                            transition-colors duration-150 cursor-pointer"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-100 text-surface-500 dark:bg-surface-700/70 dark:text-surface-300">
                            <User size={16} />
                          </span>
                          My Profile
                        </button>
                        <button
                          id="settings-menu-item"
                          className="w-full flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                            text-surface-700 dark:text-surface-300
                            hover:bg-surface-50 dark:hover:bg-surface-700/60
                            transition-colors duration-150 cursor-pointer"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-100 text-surface-500 dark:bg-surface-700/70 dark:text-surface-300">
                            <Settings size={16} />
                          </span>
                          Settings
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="mt-0 border-t border-surface-100 p-3 pt-2 dark:border-surface-700">
                        <button
                          id="logout-button"
                          onClick={handleLogout}
                          className="w-full flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                            text-red-500 dark:text-red-400
                            hover:bg-red-50 dark:hover:bg-red-500/10
                            transition-colors duration-150 cursor-pointer"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-400">
                            <LogOut size={16} />
                          </span>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content — full width */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8">
        <Outlet />
      </main>
    </div>
  );
}
