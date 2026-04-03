import { motion } from 'framer-motion';
import { Edit3, Share2, Trash2, Calendar } from 'lucide-react';

export default function NoteCard({ note, index, onEdit, onShare, onDelete }) {
  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Truncate content for preview
  const preview = note.content.length > 140
    ? note.content.slice(0, 140) + '…'
    : note.content;

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
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
            bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Shared
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100
        mb-2 pr-16 line-clamp-1">
        {note.title}
      </h3>

      {/* Content preview */}
      <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-4 line-clamp-3">
        {preview}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t
        border-surface-100 dark:border-surface-700/50">
        <div className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
          <Calendar size={12} />
          {formattedDate}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}>
          <button
            id={`edit-note-${note._id}`}
            onClick={() => onEdit(note)}
            className="p-2 rounded-lg text-surface-400 hover:text-primary-500
              hover:bg-primary-50 dark:hover:bg-primary-500/10
              transition-colors duration-150 cursor-pointer"
            title="Edit"
          >
            <Edit3 size={15} />
          </button>
          <button
            id={`share-note-${note._id}`}
            onClick={() => onShare(note)}
            className="p-2 rounded-lg text-surface-400 hover:text-blue-500
              hover:bg-blue-50 dark:hover:bg-blue-500/10
              transition-colors duration-150 cursor-pointer"
            title="Share"
          >
            <Share2 size={15} />
          </button>
          <button
            id={`delete-note-${note._id}`}
            onClick={() => onDelete(note)}
            className="p-2 rounded-lg text-surface-400 hover:text-red-500
              hover:bg-red-50 dark:hover:bg-red-500/10
              transition-colors duration-150 cursor-pointer"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
