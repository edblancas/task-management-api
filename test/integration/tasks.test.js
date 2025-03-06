import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/index.js';
import { AppDataSource, initializeDatabase } from '../../src/db/config.js';
import { TaskStatus, TaskPriority } from '../../src/db/enums.js';

// Mock the database initialization
jest.mock('../../src/db/config.js', () => {
  const originalModule = jest.requireActual('../../src/db/config.js');
  return {
    ...originalModule,
    initializeDatabase: jest.fn().mockResolvedValue(true),
    AppDataSource: {
      initialize: jest.fn().mockResolvedValue(true),
      getRepository: jest.fn().mockImplementation((entity) => {
        return {
          find: jest.fn().mockResolvedValue([]),
          findOne: jest.fn().mockImplementation(({ where: { id } }) => {
            if (id === 'existing-task') {
              return {
                id: 'existing-task',
                title: 'Existing Task',
                status: TaskStatus.TODO,
                priority: TaskPriority.MEDIUM,
                assignee: null,
                reporter: null,
                comments: []
              };
            }
            return null;
          }),
          create: jest.fn().mockImplementation((data) => ({
            id: 'new-task-id',
            ...data
          })),
          save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
          update: jest.fn().mockResolvedValue({ affected: 1 }),
          delete: jest.fn().mockResolvedValue({ affected: 1 })
        };
      })
    }
  };
});

describe('Task API Endpoints', () => {
  describe('GET /api/tasks', () => {
    test('should return all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('x-correlation-id', 'test-correlation-id');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('should return a single task when it exists', async () => {
      const response = await request(app)
        .get('/api/tasks/existing-task')
        .set('x-correlation-id', 'test-correlation-id');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('existing-task');
    });

    test('should return 404 when task does not exist', async () => {
      const response = await request(app)
        .get('/api/tasks/non-existent-task')
        .set('x-correlation-id', 'test-correlation-id');

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('POST /api/tasks', () => {
    test('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH
      };

      const response = await request(app)
