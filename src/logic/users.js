export const validateUserData = (userData) => {
  const errors = [];

  if (!userData.firstName || typeof userData.firstName !== 'string') {
    errors.push('First name is required and must be a string');
  }

  if (!userData.lastName || typeof userData.lastName !== 'string') {
    errors.push('Last name is required and must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatUserResponse = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const formatUsersResponse = (users = []) => {
  return users.map(formatUserResponse);
};
