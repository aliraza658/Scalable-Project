const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadPhoto, getPhotos, getPhotoById } = require('../controllers/photoController');
const { createComment, deleteComment, getCommentsForPhoto } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Multer setup
const uploadFolder = path.join(__dirname, '../public');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.memoryStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Routes
router.post('/photos', upload.single('image'), uploadPhoto);
router.get('/photos',  getPhotos);
router.get('/photos/:id', getPhotoById);

// Routes for Comments
router.post('/photos/:id/comments', express.json(), createComment);  // Create comment route
router.delete('/photos/:id/comments/:commentId', deleteComment);  // Delete comment route
router.get('/photos/:id/comments', getCommentsForPhoto);

module.exports = router;
