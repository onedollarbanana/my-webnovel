const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/:fictionId', authenticate, ratingController.submitRating);
router.get('/:fictionId', ratingController.getAverage);

module.exports = router;
