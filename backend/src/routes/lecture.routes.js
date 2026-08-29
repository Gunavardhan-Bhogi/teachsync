import express from 'express';
import { uploadAudio } from '../middlewares/upload.js';
import {
  generateDraft,
  dispatchLecture,
  getLectures,
  getLectureById,
} from '../controllers/lecture.controller.js';

const router = express.Router();

router.post('/generate-draft', uploadAudio.single('audio'), generateDraft);
router.post('/dispatch', dispatchLecture);
router.get('/', getLectures);
router.get('/:id', getLectureById);

export default router;
