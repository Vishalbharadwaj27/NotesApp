// src/controllers/tagsController.js
const db = require('../db/mysql');

// 1. CREATE a new tag
const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Tag name is required' });

    const [result] = await db.query('INSERT INTO tags (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Tag created', tagId: result.insertId });
  } catch (error) {
    // Handle duplicate tag name error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Tag already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. GET all tags
const getTags = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tags ORDER BY name ASC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. ADD a tag to a note (Protected)
const addTagToNote = async (req, res) => {
  try {
    const { id: noteId } = req.params; // Note ID from URL
    const { tag_id } = req.body;       // Tag ID from Body
    const userId = req.user.userId;    // User ID from Token

    // Security: Verify the note actually belongs to the user
    const [notes] = await db.query('SELECT id FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
    if (notes.length === 0) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    // Add the relationship
    await db.query('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)', [noteId, tag_id]);
    res.status(200).json({ message: 'Tag added to note' });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Tag already assigned to this note' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createTag, getTags, addTagToNote };