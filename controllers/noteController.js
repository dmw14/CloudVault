import Note from "../models/Note.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinary.js";

// Create Note
export const createNote = async (req, res) => {
  const { title, content } = req.body;

  const files = req.files?.map((file) => ({
    url: file.path,
    public_id: file.filename,
  }));

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    files,
  });

  res.status(201).json(note);
};

// Get Notes (search + pagination)
export const getNotes = async (req, res) => {
  const keyword = req.query.search
    ? {
        title: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const page = Number(req.query.page) || 1;
  const limit = 5;

  const count = await Note.countDocuments({
    user: req.user._id,
    ...keyword,
  });

  const notes = await Note.find({
    user: req.user._id,
    ...keyword,
  })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    notes,
    page,
    pages: Math.ceil(count / limit),
  });
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

  // 🔥 Delete files from Cloudinary
  if (note.files && note.files.length > 0) {
    for (const file of note.files) {
      await cloudinary.uploader.destroy(file.public_id);
    }
  }

  await note.deleteOne();

  res.json({ message: "Note and files deleted" });
};

// Share Note
export const shareNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!note.shareId) {
    note.shareId = uuidv4();
  }

  note.isPublic = true;
  note.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await note.save();

  res.json({
    shareLink: `http://localhost:5000/api/notes/share/${note.shareId}`,
    expiresAt: note.expiresAt,
  });
};

// Get Shared Note
export const getSharedNote = async (req, res) => {
  const note = await Note.findOne({ shareId: req.params.shareId });

  if (!note || !note.isPublic) {
    return res.status(404).json({ message: "Note not found" });
  }

  if (note.expiresAt && note.expiresAt < new Date()) {
    return res.status(410).json({ message: "Link expired" });
  }

  res.json(note);
};