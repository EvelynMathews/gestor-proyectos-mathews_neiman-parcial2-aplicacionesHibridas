import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getComments, createComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/project/:projectId', getComments);
router.post('/project/:projectId', createComment);
router.delete('/project/:projectId/comment/:commentId', deleteComment);

export default router;
