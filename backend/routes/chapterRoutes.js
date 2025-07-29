const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/:fictionId', chapterController.listChapters);
router.post('/:fictionId', authenticate, chapterController.createChapter);
router.get('/:fictionId/:id', chapterController.getChapter);
router.put('/:fictionId/:id', authenticate, chapterController.updateChapter);
router.delete('/:fictionId/:id', authenticate, chapterController.deleteChapter);

module.exports = router;
