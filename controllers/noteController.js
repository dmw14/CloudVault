import Note from "../models/Note.js";
import { v4 as uuidv4 } from "uuid";

// Create Note
export const createNote = async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
  });

  res.status(201).json(note);
};

// Get All Notes (for logged-in user)
export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
};

// Update Note
export const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;

  const updatedNote = await note.save();
  res.json(updatedNote);
};

// Delete Note
export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await note.deleteOne();
  res.json({ message: "Note deleted" });
};

// Generate shareable link
export const shareNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // ✅ Generate shareId only once
  if (!note.shareId) {
    note.shareId = uuidv4();
  }

  // ✅ Make note public
  note.isPublic = true;

  // ⏳ Add expiry (24 hours)
  note.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await note.save();

  res.json({
    shareLink: `http://localhost:5000/api/notes/share/${note.shareId}`,
    expiresAt: note.expiresAt,
  });
};

// Access shared note (no auth required)
export const getSharedNote = async (req, res) => {
  const note = await Note.findOne({ shareId: req.params.shareId });

  if (!note || !note.isPublic) {
    return res.status(404).json({ message: "Note not found" });
  }

  // ⏳ Expiry check
  if (note.expiresAt && note.expiresAt < new Date()) {
    return res.status(410).json({ message: "Link expired" });
  }

  res.json(note);
};