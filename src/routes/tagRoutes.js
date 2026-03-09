// src/routes/tagRoutes.js
const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (or protect if you want only logged-in users to see tags)
router.post('/', authMiddleware, tagsController.createTag);
router.get('/', authMiddleware, tagsController.getTags);

// Protected route to link a tag to a note
router.post('/:id/tags', authMiddleware, tagsController.addTagToNote);

module.exports = router;