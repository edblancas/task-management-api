import { AppDataSource } from './config.js';
import TaskEntity from './entities/task.js';

const taskRepository = AppDataSource.getRepository(TaskEntity);

export const findAllTasks = async () => {
  try {
    return await taskRepository.find({
      relations: ['assignee', 'reporter', 'comments', 'comments.user']
    });
  } catch (error) {
    console.error("Error finding all tasks:", error);
    throw error;
  }
};

export const findTaskById = async (id) => {
  try {
    return await taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'reporter', 'comments', 'comments.user']
    });
  } catch (error) {
    console.error(`Error finding task by id ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const newTask = taskRepository.create(taskData);
    return await taskRepository.save(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  try {
    await taskRepository.update(id, taskData);
    return await findTaskById(id);
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const result = await taskRepository.delete(id);
    return result.affected > 0;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};
