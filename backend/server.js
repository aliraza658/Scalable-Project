const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); 

// ===== SETUP UPLOAD TO public/ FOLDER =====
const uploadFolder = path.join(__dirname, 'public');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ======= DATA FILE SETUP =======
const DATA_FILE = path.join(__dirname, 'data.json');
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// ======= UPLOAD ENDPOINT =======
app.post('/api/photos', upload.single('image'), (req, res) => {
    console.log(req);
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
  
    // req.body should now have title, caption, location, people
    const { title, caption, location, people } = req.body;
  
    const data = readData();
  
    const newPhoto = {
      id: Date.now().toString(),
      title: title || '',
      caption: caption || '',
      location: location || '',
      people: people || '',
      url: '/' + req.file.filename,
      comments: []
    };
  
    data.photos.push(newPhoto);
    writeData(data);
  
    res.status(201).json(newPhoto);
  });

// ======= GET PHOTOS =======
app.get('/api/photos', (req, res) => {
  const data = readData();
  res.json(data.photos);
});

// ======= GET SINGLE PHOTO =======
app.get('/api/photos/:id', (req, res) => {
  const data = readData();
  const photo = data.photos.find(p => p.id === req.params.id);
  photo ? res.json(photo) : res.status(404).json({ message: 'Photo not found' });
});

// ======= POST COMMENT =======
app.post('/api/photos/:id/comments', express.json(), (req, res) => {
  const { comment, rating } = req.body;
  const data = readData();
  const photo = data.photos.find(p => p.id === req.params.id);

  if (!photo) return res.status(404).json({ message: 'Photo not found' });

  photo.comments = photo.comments || [];
  photo.comments.push({ comment, rating, date: new Date().toISOString() });
  writeData(data);

  res.status(201).json({ message: 'Comment added' });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
