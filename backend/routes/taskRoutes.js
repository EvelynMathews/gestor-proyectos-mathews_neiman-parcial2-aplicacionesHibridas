import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/project/:projectId', getTasks);
router.post('/project/:projectId', createTask);
router.put('/project/:projectId/task/:taskId', updateTask);
router.delete('/project/:projectId/task/:taskId', deleteTask);

export default router;
