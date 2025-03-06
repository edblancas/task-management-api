export const validateCommentData = (commentData) => {
  const errors = [];

  if (!commentData.text || typeof commentData.text !== 'string') {
    errors.push('Comment text is required and must be a string');
  }

  if (!commentData.taskId) {
    errors.push('Task ID is required');
  }

  if (!commentData.userId) {
    errors.push('User ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatCommentResponse = (comment) => {
  if (!comment) return null;

  return {
    id: comment.id,
    text: comment.text,
    date: comment.date,
    taskId: comment.task?.id,
    user: comment.user ? {
      id: comment.user.id,
      fullName: `${comment.user.firstName} ${comment.user.lastName}`
    } : null,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt
  };
};

export const formatCommentsResponse = (comments = []) => {
  return comments.map(formatCommentResponse);
};
