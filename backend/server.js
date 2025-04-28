require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const photoRoutes = require('./routes/photoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', photoRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
