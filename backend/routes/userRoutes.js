const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, userController.updateMe);

module.exports = router;
