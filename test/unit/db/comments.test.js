import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { AppDataSource } from '../../../src/db/config.js';
import * as commentsDb from '../../../src/db/comments.js';

// Mock TypeORM repository
jest.unstable_mockModule('../../../src/db/config.js', () => {
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  return {
    AppDataSource: {
      getRepository: jest.fn().mockReturnValue(mockRepository)
    }
  };
});

describe('Comments Database Functions', () => {
  const mockRepository = AppDataSource.getRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllComments', () => {
    test.only('should fetch all comments with relations', async () => {
      const mockComments = [
        { id: 'comment-1', text: 'Comment 1' },
        { id: 'comment-2', text: 'Comment 2' }
      ];

      mockRepository.find.mockResolvedValue(mockComments);

      const comments = await commentsDb.findAllComments();

      expect(comments).toEqual(mockComments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['task', 'user']
      });
    });

    test('should throw error when find fails', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(commentsDb.findAllComments()).rejects.toThrow('Database error');
    });
  });

  describe('findCommentById', () => {
    test('should fetch a comment by ID with relations', async () => {
      const mockComment = { id: 'comment-1', text: 'Comment 1' };

      mockRepository.findOne.mockResolvedValue(mockComment);

      const comment = await commentsDb.findCommentById('comment-1');

      expect(comment).toEqual(mockComment);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
        relations: ['task', 'user']
      });
    });
  });

  describe('findCommentsByTaskId', () => {
    test('should fetch comments by task ID with relations', async () => {
      const mockComments = [
        { id: 'comment-1', text: 'Comment 1' },
        { id: 'comment-2', text: 'Comment 2' }
      ];

      mockRepository.find.mockResolvedValue(mockComments);

      const comments = await commentsDb.findCommentsByTaskId('task-1');

      expect(comments).toEqual(mockComments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { task: { id: 'task-1' } },
        relations: ['user'],
        order: { date: 'DESC' }
      });
    });
  });

  describe('createComment', () => {
    test('should create a new comment', async () => {
      const commentData = {
        text: 'New comment',
        task: { id: 'task-1' },
        user: { id: 'user-1' }
      };

      const createdComment = {
        id: 'comment-new',
        ...commentData
      };

      mockRepository.create.mockReturnValue(createdComment);
      mockRepository.save.mockResolvedValue(createdComment);

      const comment = await commentsDb.createComment(commentData);

      expect(comment).toEqual(createdComment);
      expect(mockRepository.create).toHaveBeenCalledWith(commentData);
      expect(mockRepository.save).toHaveBeenCalledWith(createdComment);
    });
  });

  describe('updateComment', () => {
    test('should update a comment', async () => {
      const commentId = 'comment-1';
      const commentData = { text: 'Updated comment' };
      const updatedComment = {
        id: commentId,
        text: 'Updated comment',
        task: { id: 'task-1' },
        user: { id: 'user-1' }
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedComment);

      const comment = await commentsDb.updateComment(commentId, commentData);

      expect(comment).toEqual(updatedComment);
      expect(mockRepository.update).toHaveBeenCalledWith(commentId, commentData);
    });
  });

  describe('deleteComment', () => {
    test('should delete a comment', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await commentsDb.deleteComment('comment-1');

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith('comment-1');
    });

    test('should return false when no comment was deleted', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await commentsDb.deleteComment('non-existent');

      expect(result).toBe(false);
    });
  });
});
