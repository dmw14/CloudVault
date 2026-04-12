import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, Calendar, ArrowLeft, AlertCircle, Loader2, Clock, FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api/axios';

// Check if a URL looks like an image
function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

// Extract a display name from a Cloudinary URL
function getFileName(url) {
  try {
    const parts = url.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return 'File';
  }
}

export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(''); // 'expired' | 'notFound'

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/share/${shareId}`);
        setNote(res.data);
      } catch (err) {
        if (err.response?.status === 410) {
          setErrorType('expired');
        } else {
          setErrorType('notFound');
        }
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

  // ── Expired Link ──
  if (errorType === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center
        bg-surface-50 dark:bg-surface-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/20
            flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
            Link Expired
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-sm">
            This share link has expired. Share links are valid for 24 hours.
            Ask the note owner to generate a new link.
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
            Go to CloudVault
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Not Found ──
  if (errorType === 'notFound') {
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
            Go to CloudVault
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

  const files = note.files || [];
  const imageFiles = files.filter((f) => isImageUrl(f.url));
  const otherFiles = files.filter((f) => !isImageUrl(f.url));

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

        {/* ── Attached Files ── */}
        {files.length > 0 && (
          <div className="mt-12 pt-8 border-t border-surface-200/60 dark:border-surface-800/60">
            <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-6">
              Attachments ({files.length})
            </h2>

            {/* Image attachments */}
            {imageFiles.length > 0 && (
              <div className="space-y-4 mb-6">
                {imageFiles.map((file, i) => (
                  <a key={file.public_id || i} href={file.url} target="_blank" rel="noopener noreferrer"
                    className="block group">
                    <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700/50
                      hover:border-primary-300 dark:hover:border-primary-500/30
                      transition-colors duration-200">
                      <img
                        src={file.url}
                        alt={`Attachment ${i + 1}`}
                        className="w-full max-h-[500px] object-contain bg-surface-100 dark:bg-surface-800/40
                          group-hover:opacity-90 transition-opacity duration-200"
                        loading="lazy"
                      />
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Other file attachments (PDFs, etc.) */}
            {otherFiles.length > 0 && (
              <div className="space-y-2">
                {otherFiles.map((file, i) => (
                  <a key={file.public_id || i} href={file.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl
                      bg-surface-50 dark:bg-surface-800/40
                      border border-surface-200 dark:border-surface-700/50
                      hover:border-primary-300 dark:hover:border-primary-500/30
                      hover:bg-surface-100 dark:hover:bg-surface-800/60
                      transition-all duration-200 group">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/15
                      flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate">
                        {getFileName(file.url)}
                      </p>
                      <p className="text-xs text-surface-400 dark:text-surface-500">
                        Click to open
                      </p>
                    </div>
                    <Download size={16} className="text-surface-400 group-hover:text-primary-500
                      transition-colors duration-150 flex-shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.article>

      {/* Footer */}
      <footer className="border-t border-surface-200/60 dark:border-surface-800/60 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-surface-400 dark:text-surface-500">
            Shared via{' '}
            <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-600 transition-colors">
              CloudVault
            </Link>
            {' '}— Your ideas, anywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
