import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { connectDB } from "./config/db.js";

// const express = require("express");commonjs

dotenv.config();
// console.log(process.env.MONGO_URI);
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//middleware

//explain middleware's function
// app.use((req, res, next) => {
//   console.log(`Req is ${req.method} & URL is ${req.url}`);
//   next();
// });
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    }),
  );
}

// app.use(cors());

app.use(express.json());
app.use(rateLimiter);
app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
// app.use("/api/product", productRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/payments", paymentsRoutes);
// app.use("/api/emails", emailsRoutes);

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

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
