import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Share2, Trash2, Calendar, Paperclip, FileText, MoreVertical } from 'lucide-react';

// Check if a URL looks like an image
function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

export default function NoteCard({ note, index, onEdit, onShare, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  // Truncate content for preview
  const preview = note.content.length > 140
    ? note.content.slice(0, 140) + '…'
    : note.content;

  const files = note.files || [];
  const maxThumbs = 3;
  const visibleFiles = files.slice(0, maxThumbs);
  const extraCount = files.length - maxThumbs;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative rounded-2xl p-5 border cursor-pointer
        bg-white dark:bg-surface-800/40
        border-surface-200 dark:border-surface-700/50
        hover:border-primary-300 dark:hover:border-primary-500/30
        hover:shadow-lg hover:shadow-primary-500/5 dark:hover:shadow-primary-500/10
        transform hover:-translate-y-1
        transition-all duration-300"
      onClick={() => onEdit(note)}
    >
      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        bg-gradient-to-br from-primary-500/[0.02] to-transparent
        dark:from-primary-500/[0.05] dark:to-transparent
        transition-opacity duration-300 pointer-events-none" />

      {/* Public badge */}
      {note.isPublic && (
        <div className="absolute top-3 right-12">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
            bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Shared
          </span>
        </div>
      )}

      {/* 3-dot menu button */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef}
        onClick={(e) => e.stopPropagation()}>
        <button
          id={`menu-note-${note._id}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-9 h-9 flex items-center justify-center rounded-xl
            text-surface-400 hover:text-surface-700 dark:hover:text-surface-200
            hover:bg-surface-100 dark:hover:bg-surface-700/50
            transition-colors duration-150 cursor-pointer"
          title="Options"
        >
          <MoreVertical size={20} />
        </button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-44 py-1.5 rounded-xl
                bg-white dark:bg-surface-800
                border border-surface-200 dark:border-surface-700
                shadow-xl shadow-black/10 dark:shadow-black/30
                z-50"
            >
              <button
                id={`edit-note-${note._id}`}
                onClick={() => { onEdit(note); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                  text-surface-700 dark:text-surface-200
                  hover:bg-primary-50 hover:text-primary-600
                  dark:hover:bg-primary-500/15 dark:hover:text-primary-400
                  transition-colors duration-150 cursor-pointer"
              >
                <Edit3 size={18} />
                Edit
              </button>
              <button
                id={`share-note-${note._id}`}
                onClick={() => { onShare(note); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                  text-surface-700 dark:text-surface-200
                  hover:bg-blue-50 hover:text-blue-600
                  dark:hover:bg-blue-500/15 dark:hover:text-blue-400
                  transition-colors duration-150 cursor-pointer"
              >
                <Share2 size={18} />
                Share
              </button>
              <div className="my-1 mx-3 border-t border-surface-100 dark:border-surface-700" />
              <button
                id={`delete-note-${note._id}`}
                onClick={() => { onDelete(note); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                  text-red-500 dark:text-red-400
                  hover:bg-red-50 dark:hover:bg-red-500/15
                  transition-colors duration-150 cursor-pointer"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100
        mb-2 pr-16 line-clamp-1">
        {note.title}
      </h3>

      {/* Content preview */}
      <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-3 line-clamp-3">
        {preview}
      </p>

      {/* File thumbnails */}
      {files.length > 0 && (
        <div className="mb-3 file-thumb-grid">
          {visibleFiles.map((file, i) =>
            isImageUrl(file.url) ? (
              <img
                key={file.public_id || i}
                src={file.url}
                alt="attachment"
                className="file-thumb"
              />
            ) : (
              <div
                key={file.public_id || i}
                className="file-thumb flex items-center justify-center bg-red-50 dark:bg-red-500/10"
              >
                <FileText size={16} className="text-red-500" />
              </div>
            )
          )}
          {extraCount > 0 && (
            <div className="file-thumb-more">
              +{extraCount}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t
        border-surface-100 dark:border-surface-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
            <Calendar size={12} />
            {formattedDate}
          </div>
          {files.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-surface-400 dark:text-surface-500">
              <Paperclip size={11} />
              {files.length}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
