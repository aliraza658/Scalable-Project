const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', express.json(), signup);
router.post('/login', express.json(), login);

module.exports = router;
