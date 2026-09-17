// export const getAllNotes = (req, res) =>{

import Note from "../models/Note.js";

// };

export async function getAllNotes(req, res) {
  // res.status(200).send("you got 10 notes");
  try {
    const notes = await Note.find().sort({createdAt:-1}); // newest first
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// export async function getAllNotes (req, res) {
// }

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    console.error("Error in getAllNote controller", error);
    res.status(500).json({ message: "error" });
  }
}

// export function createNote (req, res) {
//     res.status(201).json({message:"Note created successfully"});
// }
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    console.log(title, content);
    const newNote = new Note({ title, content });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
    // res.status(201).json({message:"Note created successfully"})
  } catch (error) {
    console.error("Error in getAllNote controller", error);
    res.status(500).json({ message: "error" });
  }
}

// export function updateNote (req, res) {
//     res.status(200).json({message:"Note update successfully"});
// }
export async function updateNote(req, res) {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
      },
      //   { new: true },
      { returnDocument: "after" },
    );
    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    // res.status(200).json({ message: "Note delete successfully" });
    const deletedNode = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNode)
      return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNode controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


