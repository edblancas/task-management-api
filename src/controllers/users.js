import * as userLogic from '../logic/users.js';
import * as userDb from '../db/users.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getAllUsers = async () => {
  const users = await userDb.findAllUsers();
  return userLogic.formatUsersResponse(users);
};

export const getUserById = async (id) => {
  const user = await userDb.findUserById(id);

  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }

  return userLogic.formatUserResponse(user);
};

export const createUser = async (userData) => {
  const validation = userLogic.validateUserData(userData);

  if (!validation.isValid) {
    throw new ValidationError('Invalid user data', validation.errors);
  }

  const newUser = await userDb.createUser(userData);
  return userLogic.formatUserResponse(newUser);
};

export const updateUser = async (id, userData) => {
  // Check if user exists
  const existingUser = await userDb.findUserById(id);

  if (!existingUser) {
    throw new NotFoundError(`User with id ${id} not found`);
  }

  // Validate update data
  const validation = userLogic.validateUserData({
    ...existingUser,
    ...userData
  });

  if (!validation.isValid) {
    throw new ValidationError('Invalid user data', validation.errors);
  }

  const updatedUser = await userDb.updateUser(id, userData);
  return userLogic.formatUserResponse(updatedUser);
};

export const deleteUser = async (id) => {
  const existingUser = await userDb.findUserById(id);

  if (!existingUser) {
    throw new NotFoundError(`User with id ${id} not found`);
  }

  const deleted = await userDb.deleteUser(id);

  if (!deleted) {
    throw new Error(`Failed to delete user with id ${id}`);
  }

  return { message: `User with id ${id} deleted successfully` };
};
