const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createJournal } = require('../controllers/journalController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.mp4', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image/video/pdf allowed'));
  }
});

// Protected route
router.post('/create', authMiddleware, upload.single('file'), createJournal);

router.get('/feed', authMiddleware, require('../controllers/journalController').getFeed);

router.put('/:id', authMiddleware, require('../controllers/journalController').updateJournal);
router.delete('/:id', authMiddleware, require('../controllers/journalController').deleteJournal);
router.post('/:id/publish', authMiddleware, require('../controllers/journalController').publishJournal);

module.exports = router;
