// src/controllers/notesController.js
const db = require('../db/mysql');

// 1. CREATE a note
const createNote = async (req, res) => {
  try {
    // Secure: Get user_id from the token (req.user), not the body
    const userId = req.user.userId;
    const { title, content, priority } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const [result] = await db.query(
      'INSERT INTO notes (user_id, title, content, priority) VALUES (?, ?, ?, ?)',
      [userId, title, content, priority || 'LOW']
    );

    res.status(201).json({
      message: 'Note created successfully',
      noteId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. READ all notes (Only for the logged-in user)
const getNotes = async (req, res) => {
  try {
    // Secure: Only fetch notes belonging to the logged-in user
    const userId = req.user.userId;
    const { search, tag } = req.query;

    let query = 'SELECT DISTINCT n.* FROM notes n';
    let params = [];
    let conditions = ['n.user_id = ?'];
    params.push(userId);

    if (search) {
      conditions.push('(n.title LIKE ? OR n.content LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (tag) {
      query += ' INNER JOIN note_tags nt ON n.id = nt.note_id INNER JOIN tags t ON nt.tag_id = t.id';
      conditions.push('t.name = ?');
      params.push(tag);
    }

    query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY n.created_at DESC';

    const [rows] = await db.query(query, params);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. READ a single note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Secure: Check if note exists AND belongs to the user
    const [rows] = await db.query(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. UPDATE a note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, is_archived, priority, completed } = req.body;
    const userId = req.user.userId;

    // Secure: Verify ownership before updating
    const [existing] = await db.query(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    await db.query(
      'UPDATE notes SET title = ?, content = ?, is_archived = ?, priority = ?, completed = ? WHERE id = ?',
      [title, content, is_archived, priority, completed, id]
    );

    res.status(200).json({ message: 'Note updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 5. DELETE a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Secure: Verify ownership before deleting
    const [result] = await db.query(
      'DELETE FROM notes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Note not found or access denied' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};