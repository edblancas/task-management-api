import * as taskLogic from '../logic/tasks.js';
import * as taskDb from '../db/tasks.js';
import * as userDb from '../db/users.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getAllTasks = async () => {
  const tasks = await taskDb.findAllTasks();
  return taskLogic.formatTasksResponse(tasks);
};

export const getTaskById = async (id) => {
  const task = await taskDb.findTaskById(id);

  if (!task) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }

  return taskLogic.formatTaskResponse(task);
};

export const createTask = async (taskData) => {
  const validation = taskLogic.validateTaskData(taskData);

  if (!validation.isValid) {
    throw new ValidationError('Invalid task data', validation.errors);
  }

  // Check if assignee and reporter exist
  if (taskData.assigneeId) {
    const assignee = await userDb.findUserById(taskData.assigneeId);
    if (!assignee) {
      throw new NotFoundError(`Assignee with id ${taskData.assigneeId} not found`);
    }
  }

  if (taskData.reporterId) {
    const reporter = await userDb.findUserById(taskData.reporterId);
    if (!reporter) {
      throw new NotFoundError(`Reporter with id ${taskData.reporterId} not found`);
    }
  }

  // Process data for TypeORM relationships
  const processedData = {
    ...taskData,
    assignee: taskData.assigneeId ? { id: taskData.assigneeId } : null,
    reporter: taskData.reporterId ? { id: taskData.reporterId } : null,
  };

  // Remove the IDs as we're using the relation objects
  delete processedData.assigneeId;
  delete processedData.reporterId;

  const newTask = await taskDb.createTask(processedData);
  return taskLogic.formatTaskResponse(newTask);
};

export const updateTask = async (id, taskData) => {
  // Check if task exists
  const existingTask = await taskDb.findTaskById(id);

  if (!existingTask) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }

  // Validate update data
  const validation = taskLogic.validateTaskData({
    ...existingTask,
    ...taskData
  });

  if (!validation.isValid) {
    throw new ValidationError('Invalid task data', validation.errors);
  }

  // Check if assignee and reporter exist
  if (taskData.assigneeId) {
    const assignee = await userDb.findUserById(taskData.assigneeId);
    if (!assignee) {
      throw new NotFoundError(`Assignee with id ${taskData.assigneeId} not found`);
    }
  }

  if (taskData.reporterId) {
    const reporter = await userDb.findUserById(taskData.reporterId);
    if (!reporter) {
      throw new NotFoundError(`Reporter with id ${taskData.reporterId} not found`);
    }
  }

  // Process data for TypeORM relationships
  const processedData = { ...taskData };

  if (taskData.assigneeId) {
    processedData.assignee = { id: taskData.assigneeId };
    delete processedData.assigneeId;
  }

  if (taskData.reporterId) {
    processedData.reporter = { id: taskData.reporterId };
    delete processedData.reporterId;
  }

  const updatedTask = await taskDb.updateTask(id, processedData);
  return taskLogic.formatTaskResponse(updatedTask);
};

export const deleteTask = async (id) => {
  const existingTask = await taskDb.findTaskById(id);

  if (!existingTask) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }

  const deleted = await taskDb.deleteTask(id);

  if (!deleted) {
    throw new Error(`Failed to delete task with id ${id}`);
  }

  return { message: `Task with id ${id} deleted successfully` };
};
