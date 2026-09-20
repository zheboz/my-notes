import os
from datetime import datetime, timezone
from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient, ReturnDocument
from pymongo.errors import PyMongoError

load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_uri = os.environ.get("MONGO_URI")
if not mongo_uri:
    raise RuntimeError("MONGO_URI is required")

mongo_client = MongoClient(mongo_uri)
database_name = os.environ.get("MONGO_DB", "notes_db")
notes_collection = mongo_client[database_name]["notes"]


def serialize_note(note):
    return {
        "_id": str(note["_id"]),
        "title": note["title"],
        "content": note["content"],
        "createdAt": note.get("createdAt"),
        "updatedAt": note.get("updatedAt"),
    }


def note_payload():
    payload = request.get_json(silent=True) or {}
    return {
        "title": payload.get("title"),
        "content": payload.get("content"),
    }


def valid_note_payload(payload):
    return bool(
        isinstance(payload["title"], str)
        and payload["title"].strip()
        and isinstance(payload["content"], str)
        and payload["content"].strip()
    )


@app.get("/health")
def health_check():
    mongo_client.admin.command("ping")
    return jsonify({"status": "ok"})


@app.get("/api/notes")
def get_notes():
    try:
        notes = notes_collection.find().sort("createdAt", -1)
        return jsonify([serialize_note(note) for note in notes])
    except PyMongoError:
        return jsonify({"message": "Internal server error"}), 500


@app.get("/api/notes/<note_id>")
def get_note(note_id):
    try:
        note = notes_collection.find_one({"_id": ObjectId(note_id)})
    except Exception:
        return jsonify({"message": "Note not found"}), 404

    if not note:
        return jsonify({"message": "Note not found"}), 404
    return jsonify(serialize_note(note))


@app.post("/api/notes")
def create_note():
    payload = note_payload()
    if not valid_note_payload(payload):
        return jsonify({"message": "title and content are required"}), 400

    now = datetime.now(timezone.utc)
    document = {**payload, "createdAt": now, "updatedAt": now}
    try:
        result = notes_collection.insert_one(document)
        document["_id"] = result.inserted_id
        return jsonify(serialize_note(document)), 201
    except PyMongoError:
        return jsonify({"message": "Internal server error"}), 500


@app.put("/api/notes/<note_id>")
def update_note(note_id):
    payload = note_payload()
    if not valid_note_payload(payload):
        return jsonify({"message": "title and content are required"}), 400

    try:
        object_id = ObjectId(note_id)
        updated = notes_collection.find_one_and_update(
            {"_id": object_id},
            {"$set": {**payload, "updatedAt": datetime.now(timezone.utc)}},
            return_document=ReturnDocument.AFTER,
        )
    except Exception:
        return jsonify({"message": "Note not found"}), 404

    if not updated:
        return jsonify({"message": "Note not found"}), 404
    return jsonify(serialize_note(updated))


@app.delete("/api/notes/<note_id>")
def delete_note(note_id):
    try:
        result = notes_collection.delete_one({"_id": ObjectId(note_id)})
    except Exception:
        return jsonify({"message": "Note not found"}), 404

    if result.deleted_count == 0:
        return jsonify({"message": "Note not found"}), 404
    return jsonify({"message": "Note deleted successfully"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5001")))
