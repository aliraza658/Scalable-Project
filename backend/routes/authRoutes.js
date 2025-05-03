const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');

router.post('/register', express.json(), signup);
router.post('/login', express.json(), login);
router.get('/memessage',express.json(), getMe);

module.exports = router;
