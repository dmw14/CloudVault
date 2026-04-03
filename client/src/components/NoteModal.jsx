import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Edit3, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NoteModal({ isOpen, onClose, onSave, note, loading }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!note;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
    setShowPreview(false);
    setErrors({});
  }, [note, isOpen]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!content.trim()) errs.content = 'Content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ title: title.trim(), content: content.trim() });
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl
              bg-white dark:bg-surface-900
              border border-surface-200 dark:border-surface-700/50
              shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4
              border-b border-surface-100 dark:border-surface-800">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {isEdit ? 'Edit Note' : 'Create Note'}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    transition-colors duration-150 cursor-pointer
                    ${showPreview
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                      : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
                    }`}
                >
                  {showPreview ? <Edit3 size={13} /> : <Eye size={13} />}
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600
                    hover:bg-surface-100 dark:hover:bg-surface-800 dark:hover:text-surface-300
                    transition-colors duration-150 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[60vh]">
              {/* Title */}
              <div className="mb-4">
                <input
                  id="note-title"
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
                  placeholder="Untitled note"
                  className={`w-full text-xl font-bold bg-transparent border-none outline-none
                    text-surface-900 dark:text-surface-100
                    placeholder:text-surface-300 dark:placeholder:text-surface-600
                    ${errors.title ? 'ring-2 ring-red-500/40 rounded-lg px-2 py-1' : ''}`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              {showPreview ? (
                <div className="markdown-body min-h-[200px] text-surface-700 dark:text-surface-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || '*Nothing to preview*'}
                  </ReactMarkdown>
                </div>
              ) : (
                <div>
                  <textarea
                    id="note-content"
                    value={content}
                    onChange={(e) => { setContent(e.target.value); setErrors(prev => ({ ...prev, content: '' })); }}
                    placeholder="Start writing... (Markdown supported)"
                    rows={12}
                    className={`w-full bg-transparent border-none outline-none resize-none
                      text-surface-700 dark:text-surface-300 leading-relaxed
                      placeholder:text-surface-300 dark:placeholder:text-surface-600
                      font-[inherit] text-sm
                      ${errors.content ? 'ring-2 ring-red-500/40 rounded-lg p-2' : ''}`}
                  />
                  {errors.content && (
                    <p className="mt-1 text-xs text-red-500">{errors.content}</p>
                  )}
                </div>
              )}

              {/* Markdown hint */}
              {!showPreview && (
                <p className="mt-2 text-xs text-surface-400 dark:text-surface-500">
                  Supports **bold**, *italic*, `code`, lists, and more with Markdown
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4
              border-t border-surface-100 dark:border-surface-800">
              <button
                onClick={onClose}
                className="min-h-11 rounded-xl px-4 py-2 text-sm font-medium
                  text-surface-600 dark:text-surface-400
                  hover:bg-surface-100 dark:hover:bg-surface-800
                  transition-colors duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-note"
                onClick={handleSubmit}
                disabled={loading}
                className="min-h-11 rounded-xl px-5 py-2 text-sm font-semibold text-white
                  bg-gradient-to-r from-primary-500 to-primary-600
                  hover:from-primary-600 hover:to-primary-700
                  shadow-md shadow-primary-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 cursor-pointer
                  flex items-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {isEdit ? 'Save Changes' : 'Create Note'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
