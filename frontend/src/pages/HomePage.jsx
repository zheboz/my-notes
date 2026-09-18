import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import NotesNotFound from "../components/NotesNotFound";
import { data } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // const res = await fetch("http://localhost:5001/api/notes");
        // const data = await res.json();
        // console.log(data);
        // const res = await axios.post("http://localhost:5001/api/notes");
        const res = await api.get("/notes");
        // const res = await axios.get("http://localhost:5001/api/notes");
        setNotes(res.data);
        setIsRateLimited(false);
        console.log(res.data);
      } catch (error) {
        console.log("Error fecthing");
        console.log(error);
        if (error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Fail to load");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl ma-auto p-4 mt-6">
        {loading && <div className="text-center text-primary px-10">Loading...</div>}
        {notes.length === 0 && !isRateLimited &&<NotesNotFound/>}
        {notes.length > 0 && !isRateLimited && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) =>(
                    <NoteCard key={note._id} note={note} setNotes={setNotes}/>
                ))}
            </div>)}
      </div>
    </div>
  );
};

export default HomePage;
