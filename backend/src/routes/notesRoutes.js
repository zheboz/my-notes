import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  getNoteById,
} from "../controllers/notesController.js";

const router = express.Router();

// router.get("/", (req, res) => {
//     res.status(200).send("you just fetched the notes");
// });

// router.post("/", (req, res) => {
//     // create a note
//     res.status(201).json({message:"Note created successfully"});
// });

// router.put("/:id", (req, res) => {
//     // create a note
//     res.status(200).json({message:"Note updated successfully"});
// });

// router.delete("/:id", (req, res) => {
//     // create a note
//     res.status(200).json({message:"Note deleted successfully"});
// });

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

// app.get("/api/notes", (req, res) => {
//     // send a note
//     res.status(200).send("you got 10 notes");
// });

// app.post("/api/notes", (req, res) => {
//     // create a note
//     res.status(201).json({message:"Note created successfully"});
// });

// app.put("/api/notes/:id", (req, res) => {
//     // create a note
//     res.status(200).json({message:"Note updated successfully"});
// });

// app.delete("/api/notes/:id", (req, res) => {
//     // create a note
//     res.status(200).json({message:"Note deleted successfully"});
// });
