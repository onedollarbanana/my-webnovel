const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/', authenticate, followController.listFollows);
router.post('/:fictionId', authenticate, followController.followFiction);
router.delete('/:fictionId', authenticate, followController.unfollowFiction);

module.exports = router;
