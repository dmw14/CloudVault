import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Link2, ExternalLink, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function ShareModal({ isOpen, onClose, note }) {
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateLink = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/notes/share/${note._id}`);
      // Backend returns { shareLink: "http://localhost:5000/api/notes/share/:shareId" }
      // Extract shareId and construct frontend URL
      const backendLink = res.data.shareLink;
      const shareId = backendLink.split('/share/').pop();
      const frontendLink = `${window.location.origin}/share/${shareId}`;
      setShareLink(frontendLink);
    } catch (err) {
      setError('Failed to generate share link');
      toast.error('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  // Generate link when modal opens
  const handleOpen = () => {
    if (isOpen && note && !shareLink && !loading) {
      // If note already has shareId, construct the link directly
      if (note.isPublic && note.shareId) {
        setShareLink(`${window.location.origin}/share/${note.shareId}`);
      } else {
        generateLink();
      }
    }
  };

  // Trigger on open
  useState(() => {
    handleOpen();
  });

  // Re-run when note or isOpen changes
  if (isOpen && note && !shareLink && !loading && !error) {
    handleOpen();
  }

  const handleClose = () => {
    setShareLink('');
    setCopied(false);
    setError('');
    onClose();
  };

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl
              bg-white dark:bg-surface-900
              border border-surface-200 dark:border-surface-700/50
              shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4
              border-b border-surface-100 dark:border-surface-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                  <Link2 size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Share Note
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600
                  hover:bg-surface-100 dark:hover:bg-surface-800 dark:hover:text-surface-300
                  transition-colors duration-150 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                Anyone with the link can view this note without signing in.
              </p>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-primary-500" />
                  <span className="ml-2 text-sm text-surface-500">Generating link...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-500 mb-3">{error}</p>
                  <button
                    onClick={generateLink}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-primary-600
                      hover:bg-primary-50 dark:hover:bg-primary-500/10
                      transition-colors duration-150 cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              ) : shareLink ? (
                <div>
                  {/* Link display */}
                  <div className="flex items-center gap-2 p-3 rounded-xl
                    bg-surface-50 dark:bg-surface-800/50
                    border border-surface-200 dark:border-surface-700/50">
                    <input
                      id="share-link-input"
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-surface-700 dark:text-surface-300
                        outline-none font-mono truncate"
                    />
                    <button
                      id="copy-share-link"
                      onClick={copyToClipboard}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        transition-all duration-200 cursor-pointer
                        ${copied
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-500/30'
                        }`}
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* Open in new tab */}
                  <a
                    href={shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary-500
                      hover:text-primary-600 hover:underline transition-colors duration-150"
                  >
                    <ExternalLink size={12} />
                    Open in new tab
                  </a>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
