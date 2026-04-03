import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  shareNote,
  getSharedNote,
} from "../controllers/noteController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ NEW

const router = express.Router();

// ✅ CREATE NOTE (with file upload)
router.post("/", protect, upload.array("files", 5), createNote);

// ✅ GET ALL NOTES
router.get("/", protect, getNotes);

// ✅ UPDATE NOTE (optional: you can later add upload here too)
router.put("/:id", protect, updateNote);

// ✅ DELETE NOTE
router.delete("/:id", protect, deleteNote);

// 🔗 SHARE FEATURE
router.get("/share/:shareId", getSharedNote);
router.post("/share/:id", protect, shareNote);

export default router;