import { TaskStatus, TaskPriority } from '../db/enums.js';

export const validateTaskData = (taskData) => {
  const errors = [];

  if (!taskData.title || typeof taskData.title !== 'string') {
    errors.push('Title is required and must be a string');
  }

  if (taskData.status && !Object.values(TaskStatus).includes(taskData.status)) {
    errors.push(`Status must be one of: ${Object.values(TaskStatus).join(', ')}`);
  }

  if (taskData.priority && !Object.values(TaskPriority).includes(taskData.priority)) {
    errors.push(`Priority must be one of: ${Object.values(TaskPriority).join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatTaskResponse = (task) => {
  if (!task) return null;

  return {
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee ? {
      id: task.assignee.id,
      fullName: `${task.assignee.firstName} ${task.assignee.lastName}`
    } : null,
    reporter: task.reporter ? {
      id: task.reporter.id,
      fullName: `${task.reporter.firstName} ${task.reporter.lastName}`
    } : null,
    commentsCount: task.comments ? task.comments.length : 0,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
};

export const formatTasksResponse = (tasks = []) => {
  return tasks.map(formatTaskResponse);
};
