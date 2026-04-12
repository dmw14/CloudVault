import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      login(res.data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-surface-100 via-white to-primary-100 dark:from-surface-950 dark:via-surface-900 dark:to-primary-900">

      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary-200/60 blur-3xl dark:bg-primary-500/20" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl dark:bg-primary-700/20" />
      <div className="pointer-events-none absolute top-1/2 right-8 h-28 w-28 -translate-y-1/2 rounded-3xl -rotate-12 border border-primary-200/60 bg-white/60 backdrop-blur-sm dark:border-primary-400/20 dark:bg-surface-900/40" />
      <div className="pointer-events-none absolute top-24 left-12 h-20 w-20 rotate-6 rounded-2xl border border-primary-200/60 bg-white/70 backdrop-blur-sm dark:border-primary-400/20 dark:bg-surface-900/40" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
        {/* Logo + Branding */}
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
            <Cloud size={30} className="text-white" />
          </div>
          <h1 className="mb-1 text-3xl font-extrabold text-surface-900 dark:text-surface-100">CloudVault</h1>
          <p className="text-sm text-surface-600 dark:text-surface-400">Start your journey today.</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-surface-200/80 bg-white/95 p-8 sm:p-10 shadow-2xl shadow-surface-900/10 backdrop-blur dark:border-surface-700/60 dark:bg-surface-900/90 dark:shadow-black/30">

          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-1 text-center">
            Create an account
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-7 text-center text-sm">
            Get started with your free account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full min-h-13 px-5 py-3.5 rounded-2xl text-[15px]
                  bg-surface-50 dark:bg-surface-800/60
                  border-2 border-surface-200 dark:border-surface-700/50
                  text-surface-900 dark:text-surface-100
                  placeholder:text-surface-400 dark:placeholder:text-surface-500
                  focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500
                  transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-13 px-5 py-3.5 rounded-2xl text-[15px]
                  bg-surface-50 dark:bg-surface-800/60
                  border-2 border-surface-200 dark:border-surface-700/50
                  text-surface-900 dark:text-surface-100
                  placeholder:text-surface-400 dark:placeholder:text-surface-500
                  focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500
                  transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full min-h-13 px-5 pr-14 py-3.5 rounded-2xl text-[15px]
                    bg-surface-50 dark:bg-surface-800/60
                    border-2 border-surface-200 dark:border-surface-700/50
                    text-surface-900 dark:text-surface-100
                    placeholder:text-surface-400 dark:placeholder:text-surface-500
                    focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-surface-400
                    hover:text-surface-600 dark:hover:text-surface-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full min-h-13 px-5 pr-14 py-3.5 rounded-2xl text-[15px]
                    bg-surface-50 dark:bg-surface-800/60
                    border-2 border-surface-200 dark:border-surface-700/50
                    text-surface-900 dark:text-surface-100
                    placeholder:text-surface-400 dark:placeholder:text-surface-500
                    focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-surface-400
                    hover:text-surface-600 dark:hover:text-surface-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="mt-2 w-full min-h-12 rounded-xl px-5 py-3.5 text-sm font-bold text-white tracking-wide
                bg-gradient-to-r from-primary-500 to-primary-600
                hover:from-primary-600 hover:to-primary-700
                shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-200 cursor-pointer
                flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Create Account
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:underline transition-colors dark:text-primary-400">
            Sign in
          </Link>
        </p>
        </motion.div>
      </div>
    </div>
  );
}
