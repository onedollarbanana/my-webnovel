const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/:chapterId', commentController.listComments);
router.post('/:chapterId', authenticate, commentController.createComment);

module.exports = router;
