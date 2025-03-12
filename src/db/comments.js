import { AppDataSource } from './config.js';
import CommentEntity from './orm/comment.js';

const commentRepository = AppDataSource.getRepository(CommentEntity);

export const findAllComments = async () => {
  try {
    return await commentRepository.find({
      relations: ['task', 'user']
    });
  } catch (error) {
    console.error("Error finding all comments:", error);
    throw error;
  }
};

export const findCommentById = async (id) => {
  try {
    return await commentRepository.findOne({
      where: { id },
      relations: ['task', 'user']
    });
  } catch (error) {
    console.error(`Error finding comment by id ${id}:`, error);
    throw error;
  }
};

export const findCommentsByTaskId = async (taskId) => {
  try {
    return await commentRepository.find({
      where: { task: { id: taskId } },
      relations: ['user'],
      order: { date: 'DESC' }
    });
  } catch (error) {
    console.error(`Error finding comments for task ${taskId}:`, error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const newComment = commentRepository.create(commentData);
    return await commentRepository.save(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const updateComment = async (id, commentData) => {
  try {
    await commentRepository.update(id, commentData);
    return await findCommentById(id);
  } catch (error) {
    console.error(`Error updating comment ${id}:`, error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    const result = await commentRepository.delete(id);
    return result.affected > 0;
  } catch (error) {
    console.error(`Error deleting comment ${id}:`, error);
    throw error;
  }
};
