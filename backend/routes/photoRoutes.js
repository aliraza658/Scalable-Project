const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadPhoto, getPhotos, getPhotoById, addComment } = require('../controllers/photoController');
const { protect } = require('../middleware/authMiddleware');

// Multer setup
const uploadFolder = path.join(__dirname, '../public');
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

// Routes
router.post('/photos', protect, upload.single('image'), uploadPhoto);
router.get('/photos', protect, getPhotos);
router.get('/photos/:id', protect, getPhotoById);
router.post('/photos/:id/comments', protect, express.json(), addComment);

module.exports = router;
