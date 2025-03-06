import express from 'express';
import * as httpIn from '../diplomat/httpIn.js';

const router = express.Router();

// Users routes
router.get('/users', httpIn.getAllUsers);
router.get('/users/:id', httpIn.getUserById);
router.post('/users', httpIn.createUser);
router.put('/users/:id', httpIn.updateUser);
router.delete('/users/:id', httpIn.deleteUser);

// Tasks routes
router.get('/tasks', httpIn.getAllTasks);
router.get('/tasks/:id', httpIn.getTaskById);
router.post('/tasks', httpIn.createTask);
router.put('/tasks/:id', httpIn.updateTask);
router.delete('/tasks/:id', httpIn.deleteTask);

// Comments routes
router.get('/comments', httpIn.getAllComments);
router.get('/comments/:id', httpIn.getCommentById);
router.get('/tasks/:taskId/comments', httpIn.getCommentsByTaskId);
router.post('/comments', httpIn.createComment);
router.put('/comments/:id', httpIn.updateComment);
router.delete('/comments/:id', httpIn.deleteComment);

export default router;
