const express = require('express');
const router = express.Router();
const fictionController = require('../controllers/fictionController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', fictionController.listFictions);
router.post('/', authenticate, upload.single('cover'), fictionController.createFiction);
router.get('/:id', fictionController.getFiction);
router.put('/:id', authenticate, fictionController.updateFiction);
router.delete('/:id', authenticate, fictionController.deleteFiction);

module.exports = router;
