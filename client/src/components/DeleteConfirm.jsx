import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export default function DeleteConfirm({ isOpen, onClose, onConfirm, note, loading }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-2xl p-6
              bg-white dark:bg-surface-900
              border border-surface-200 dark:border-surface-700/50
              shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-surface-400
                hover:text-surface-600 hover:bg-surface-100
                dark:hover:bg-surface-800 dark:hover:text-surface-300
                transition-colors duration-150 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/20
              flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-1">
              Delete Note
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-medium text-surface-700 dark:text-surface-300">
                "{note?.title}"
              </span>
              ? This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 min-h-11 rounded-xl px-4 py-2.5 text-sm font-medium
                  text-surface-600 dark:text-surface-400
                  bg-surface-100 dark:bg-surface-800
                  hover:bg-surface-200 dark:hover:bg-surface-700
                  transition-colors duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-delete"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-white
                  bg-red-500 hover:bg-red-600
                  shadow-md shadow-red-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 cursor-pointer
                  flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
