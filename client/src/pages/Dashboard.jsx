import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import ShareModal from '../components/ShareModal';
import DeleteConfirm from '../components/DeleteConfirm';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingNote, setSharingNote] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);

  // Action loading
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  // Create / Edit Note
  const handleSaveNote = async (data) => {
    setSaving(true);
    try {
      if (editingNote) {
        const res = await api.put(`/notes/${editingNote._id}`, data);
        setNotes((prev) =>
          prev.map((n) => (n._id === editingNote._id ? res.data : n))
        );
        toast.success('Note updated');
      } else {
        const res = await api.post('/notes', data);
        setNotes((prev) => [res.data, ...prev]);
        toast.success('Note created');
      }
      setNoteModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async () => {
    if (!deletingNote) return;
    setDeleting(true);
    try {
      await api.delete(`/notes/${deletingNote._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== deletingNote._id));
      toast.success('Note deleted');
      setDeleteModalOpen(false);
      setDeletingNote(null);
    } catch (err) {
      toast.error('Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  // Open modals
  const openCreate = () => {
    setEditingNote(null);
    setNoteModalOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setNoteModalOpen(true);
  };

  const openShare = (note) => {
    setSharingNote(note);
    setShareModalOpen(true);
  };

  const openDelete = (note) => {
    setDeletingNote(note);
    setDeleteModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            My Notes
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
            {searchQuery && ` · ${filteredNotes.length} matching`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <button
            id="create-note"
            onClick={openCreate}
            className="flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white
              bg-gradient-to-r from-primary-500 to-primary-600
              hover:from-primary-600 hover:to-primary-700
              shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40
              transform hover:-translate-y-0.5
              transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <Plus size={16} />
            New Note
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : notes.length === 0 ? (
        <EmptyState onCreateNote={openCreate} />
      ) : filteredNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-surface-500 dark:text-surface-400 text-lg font-medium mb-1">
            No notes found
          </p>
          <p className="text-surface-400 dark:text-surface-500 text-sm">
            Try searching with different keywords
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note, i) => (
              <NoteCard
                key={note._id}
                note={note}
                index={i}
                onEdit={openEdit}
                onShare={openShare}
                onDelete={openDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => { setNoteModalOpen(false); setEditingNote(null); }}
        onSave={handleSaveNote}
        note={editingNote}
        loading={saving}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => { setShareModalOpen(false); setSharingNote(null); }}
        note={sharingNote}
      />

      <DeleteConfirm
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeletingNote(null); }}
        onConfirm={handleDeleteNote}
        note={deletingNote}
        loading={deleting}
      />
    </div>
  );
}
