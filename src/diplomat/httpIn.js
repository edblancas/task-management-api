import * as userController from '../controllers/users.js';
import * as taskController from '../controllers/tasks.js';
import * as commentController from '../controllers/comments.js';

// Users endpoints
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userController.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userController.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await userController.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await userController.updateUser(id, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userController.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Tasks endpoints
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskController.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await taskController.getTaskById(id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const taskData = req.body;
    const newTask = await taskController.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const taskData = req.body;
    const updatedTask = await taskController.updateTask(id, taskData);
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await taskController.deleteTask(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Comments endpoints
export const getAllComments = async (req, res, next) => {
  try {
    const comments = await commentController.getAllComments();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await commentController.getCommentById(id);
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const getCommentsByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const comments = await commentController.getCommentsByTaskId(taskId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const commentData = req.body;
    const newComment = await commentController.createComment(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const commentData = req.body;
    const updatedComment = await commentController.updateComment(id, commentData);
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await commentController.deleteComment(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
