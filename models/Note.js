import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);