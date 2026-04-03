import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function EmptyState({ onCreateNote }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-6"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-500/20 to-primary-600/10
          dark:from-primary-500/10 dark:to-primary-600/5
          flex items-center justify-center">
          <FileText size={48} className="text-primary-500/60" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl
          bg-gradient-to-br from-primary-400 to-primary-600 opacity-30 blur-sm" />
        <div className="absolute -bottom-1 -left-3 w-6 h-6 rounded-lg
          bg-gradient-to-br from-violet-400 to-violet-600 opacity-20 blur-sm" />
      </div>

      <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
        No notes yet
      </h2>
      <p className="text-surface-500 dark:text-surface-400 text-center max-w-sm mb-8 leading-relaxed">
        Start capturing your ideas, thoughts, and discoveries. Your first note is just a click away.
      </p>

      <button
        id="empty-state-create"
        onClick={onCreateNote}
        className="min-h-11 rounded-xl px-6 py-3 text-sm font-semibold text-white
          bg-gradient-to-r from-primary-500 to-primary-600
          hover:from-primary-600 hover:to-primary-700
          shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40
          transform hover:-translate-y-0.5
          transition-all duration-200 cursor-pointer"
      >
        Create your first note
      </button>
    </motion.div>
  );
}
