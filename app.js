const express = require('express');
const cors = require('cors');
const noteRoutes = require('./src/routes/noteRoutes');
const authRoutes = require('./src/routes/authRoutes');
const tagRoutes = require('./src/routes/tagRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/notes', noteRoutes);
app.use('/auth', authRoutes);
app.use('/tags', tagRoutes);
    
app.get('/', (req, res) => res.send('API Running'));

module.exports = app;
