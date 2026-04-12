import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Edit3, Loader2, Upload, FileText, Image, Trash2, Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Check if a URL/filename looks like an image
function isImageFile(file) {
  if (file instanceof File) {
    return file.type.startsWith('image/');
  }
  // For existing files from the server (url string)
  if (typeof file === 'object' && file.url) {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.url);
  }
  return false;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function NoteModal({ isOpen, onClose, onSave, note, loading, uploadProgress }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]); // New File objects to upload
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const isEdit = !!note;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
    setFiles([]);
    setShowPreview(false);
    setErrors({});
    setDragActive(false);
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
    onSave({ title: title.trim(), content: content.trim(), files });
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ── Drag & Drop Handlers ──
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const addFiles = (newFiles) => {
    // Filter valid types and limit to 5 total
    const allowed = newFiles.filter((f) =>
      /\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(f.name)
    );
    setFiles((prev) => {
      const combined = [...prev, ...allowed];
      return combined.slice(0, 5); // Max 5 files
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileInputChange = (e) => {
    const selected = Array.from(e.target.files);
    addFiles(selected);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  // Existing files from a note (edit mode)
  const existingFiles = note?.files || [];

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
                    rows={10}
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

              {/* ── Existing Files (edit mode) ── */}
              {isEdit && existingFiles.length > 0 && (
                <div className="mt-5 pt-4 border-t border-surface-100 dark:border-surface-800">
                  <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
                    Attached Files
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {existingFiles.map((file, i) => (
                      <div key={file.public_id || i}
                        className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700/50
                          bg-surface-50 dark:bg-surface-800/40">
                        {isImageFile(file) ? (
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <img src={file.url} alt="attachment"
                              className="w-full h-24 object-cover hover:opacity-80 transition-opacity" />
                          </a>
                        ) : (
                          <a href={file.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 hover:bg-surface-100 dark:hover:bg-surface-700/40 transition-colors">
                            <FileText size={18} className="text-red-500 flex-shrink-0" />
                            <span className="text-xs text-surface-600 dark:text-surface-400 truncate">
                              PDF Document
                            </span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── File Upload Zone (create mode only) ── */}
              {!isEdit && (
                <div className="mt-5 pt-4 border-t border-surface-100 dark:border-surface-800">
                  <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Paperclip size={12} />
                    Attachments <span className="font-normal normal-case">({files.length}/5)</span>
                  </p>

                  {/* Drop zone */}
                  <div
                    className={`drop-zone ${dragActive ? 'drop-zone--active' : ''}`}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      id="file-upload-input"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/gif,image/webp,.pdf"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2 py-2">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/15
                        flex items-center justify-center">
                        <Upload size={20} className="text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
                          {dragActive ? 'Drop files here' : 'Drop files here or click to browse'}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                          JPG, PNG, PDF · Max 5 files
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* File previews */}
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, i) => (
                        <div key={`${file.name}-${i}`}
                          className="flex items-center gap-3 p-2.5 rounded-xl
                            bg-surface-50 dark:bg-surface-800/40
                            border border-surface-200 dark:border-surface-700/50
                            group">
                          {/* Thumbnail / Icon */}
                          {isImageFile(file) ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/15
                              flex items-center justify-center flex-shrink-0">
                              <FileText size={18} className="text-red-500" />
                            </div>
                          )}

                          {/* File info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-surface-400 dark:text-surface-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-500
                              hover:bg-red-50 dark:hover:bg-red-500/10
                              opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload progress */}
                  {loading && uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                          Uploading...
                        </span>
                        <span className="text-xs font-semibold text-primary-500">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                        <div
                          className="upload-progress-bar"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
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
                {isEdit ? 'Save Changes' : files.length > 0 ? 'Create with Files' : 'Create Note'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
