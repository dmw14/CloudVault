import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, Calendar, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api/axios';

export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/share/${shareId}`);
        setNote(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Note not found');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
        bg-surface-50 dark:bg-surface-950">
        <div className="flex items-center gap-3">
          <Loader2 size={24} className="animate-spin text-primary-500" />
          <span className="text-surface-500 dark:text-surface-400 font-medium">Loading note...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center
        bg-surface-50 dark:bg-surface-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-500/20
            flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
            Note not found
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-sm">
            This note may have been removed, or the link might be incorrect.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              text-primary-600 dark:text-primary-400
              bg-primary-50 dark:bg-primary-500/10
              hover:bg-primary-100 dark:hover:bg-primary-500/20
              transition-colors duration-150"
          >
            <ArrowLeft size={16} />
            Go to CloudNotes
          </Link>
        </motion.div>
      </div>
    );
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl
        bg-white/80 dark:bg-surface-950/80
        border-b border-surface-200/60 dark:border-surface-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/login" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700
                flex items-center justify-center shadow-sm">
                <Cloud size={15} className="text-white" />
              </div>
              <span className="text-sm font-bold text-surface-900 dark:text-surface-100">
                Cloud<span className="text-primary-500">Notes</span>
              </span>
            </Link>

            <span className="text-xs text-surface-400 dark:text-surface-500 font-medium">
              Shared Note
            </span>
          </div>
        </div>
      </header>

      {/* Article */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-surface-100
          leading-tight mb-4">
          {note.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-2 text-sm text-surface-400 dark:text-surface-500 mb-10">
          <Calendar size={14} />
          <time dateTime={note.createdAt}>{formattedDate}</time>
        </div>

        {/* Divider */}
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 mb-10" />

        {/* Content */}
        <div className="markdown-body prose-lg text-surface-700 dark:text-surface-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </div>
      </motion.article>

      {/* Footer */}
      <footer className="border-t border-surface-200/60 dark:border-surface-800/60 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-surface-400 dark:text-surface-500">
            Shared via{' '}
            <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-600 transition-colors">
              CloudNotes
            </Link>
            {' '}— Your ideas, anywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
