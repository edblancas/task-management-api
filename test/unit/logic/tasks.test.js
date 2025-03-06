import { describe, test, expect } from '@jest/globals';
import * as taskLogic from '../../../src/logic/tasks.js';
import { TaskStatus, TaskPriority } from '../../../src/db/enums.js';

describe('Task Logic', () => {
  describe('validateTaskData', () => {
    test('should validate a valid task', () => {
      const taskData = {
        title: 'Test Task',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM
      };

      const validation = taskLogic.validateTaskData(taskData);
      expect(validation.isValid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    test('should return error for missing title', () => {
      const taskData = {
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM
      };

      const validation = taskLogic.validateTaskData(taskData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('Title is required');
    });

    test('should return error for invalid status', () => {
      const taskData = {
        title: 'Test Task',
        status: 'invalid_status',
        priority: TaskPriority.MEDIUM
      };

      const validation = taskLogic.validateTaskData(taskData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('Status must be one of');
    });

    test('should return error for invalid priority', () => {
      const taskData = {
        title: 'Test Task',
        status: TaskStatus.TODO,
        priority: 'invalid_priority'
      };

      const validation = taskLogic.validateTaskData(taskData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('Priority must be one of');
    });
  });

  describe('formatTaskResponse', () => {
    test('should format task response correctly', () => {
      const task = {
        id: '123-456',
        title: 'Test Task',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assignee: {
          id: '789-012',
          firstName: 'John',
          lastName: 'Doe'
        },
        reporter: {
          id: '345-678',
          firstName: 'Jane',
          lastName: 'Smith'
        },
        comments: [
          { id: 'comment-1' },
          { id: 'comment-2' }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const formatted = taskLogic.formatTaskResponse(task);

      expect(formatted.id).toBe(task.id);
      expect(formatted.title).toBe(task.title);
      expect(formatted.status).toBe(task.status);
      expect(formatted.priority).toBe(task.priority);
      expect(formatted.assignee.id).toBe(task.assignee.id);
      expect(formatted.assignee.fullName).toBe('John Doe');
      expect(formatted.reporter.id).toBe(task.reporter.id);
      expect(formatted.reporter.fullName).toBe('Jane Smith');
      expect(formatted.commentsCount).toBe(2);
      expect(formatted.createdAt).toBe(task.createdAt);
      expect(formatted.updatedAt).toBe(task.updatedAt);
    });

    test('should handle null assignee and reporter', () => {
      const task = {
        id: '123-456',
        title: 'Test Task',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assignee: null,
        reporter: null,
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const formatted = taskLogic.formatTaskResponse(task);

      expect(formatted.assignee).toBe(null);
      expect(formatted.reporter).toBe(null);
      expect(formatted.commentsCount).toBe(0);
    });

    test('should return null for null input', () => {
      const formatted = taskLogic.formatTaskResponse(null);
      expect(formatted).toBe(null);
    });
  });
});
