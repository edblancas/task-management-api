import * as commentLogic from '../logic/comments.js';
import * as commentDb from '../db/comments.js';
import * as taskDb from '../db/tasks.js';
import * as userDb from '../db/users.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getAllComments = async () => {
  const comments = await commentDb.findAllComments();
  return commentLogic.formatCommentsResponse(comments);
};

export const getCommentById = async (id) => {
  const comment = await commentDb.findCommentById(id);

  if (!comment) {
    throw new NotFoundError(`Comment with id ${id} not found`);
  }

  return commentLogic.formatCommentResponse(comment);
};

export const getCommentsByTaskId = async (taskId) => {
  // Check if task exists
  const task = await taskDb.findTaskById(taskId);

  if (!task) {
    throw new NotFoundError(`Task with id ${taskId} not found`);
  }

  const comments = await commentDb.findCommentsByTaskId(taskId);
  return commentLogic.formatCommentsResponse(comments);
};

export const createComment = async (commentData) => {
  const validation = commentLogic.validateCommentData(commentData);

  if (!validation.isValid) {
    throw new ValidationError('Invalid comment data', validation.errors);
  }

  // Check if task exists
  const task = await taskDb.findTaskById(commentData.taskId);

  if (!task) {
    throw new NotFoundError(`Task with id ${commentData.taskId} not found`);
  }

  // Check if user exists
  const user = await userDb.findUserById(commentData.userId);

  if (!user) {
    throw new NotFoundError(`User with id ${commentData.userId} not found`);
  }

  // Process data for TypeORM relationships
  const processedData = {
    text: commentData.text,
    task: { id: commentData.taskId },
    user: { id: commentData.userId }
  };

  const newComment = await commentDb.createComment(processedData);
  return commentLogic.formatCommentResponse(newComment);
};

export const updateComment = async (id, commentData) => {
  // Check if comment exists
  const existingComment = await commentDb.findCommentById(id);

  if (!existingComment) {
    throw new NotFoundError(`Comment with id ${id} not found`);
  }

  // Only allow updating the text field
  const processedData = {
    text: commentData.text
  };

  const updatedComment = await commentDb.updateComment(id, processedData);
  return commentLogic.formatCommentResponse(updatedComment);
};

export const deleteComment = async (id) => {
  const existingComment = await commentDb.findCommentById(id);

  if (!existingComment) {
    throw new NotFoundError(`Comment with id ${id} not found`);
  }

  const deleted = await commentDb.deleteComment(id);

  if (!deleted) {
    throw new Error(`Failed to delete comment with id ${id}`);
  }

  return { message: `Comment with id ${id} deleted successfully` };
};
