import { EntitySchema } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export const UserEntity = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      default: () => uuidv4()
    },
    firstName: {
      type: 'varchar',
      length: 100
    },
    lastName: {
      type: 'varchar',
      length: 100
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    }
  },
  relations: {
    assignedTasks: {
      type: 'one-to-many',
      target: 'Task',
      inverseSide: 'assignee',
      cascade: true
    },
    reportedTasks: {
      type: 'one-to-many',
      target: 'Task',
      inverseSide: 'reporter',
      cascade: true
    },
    comments: {
      type: 'one-to-many',
      target: 'Comment',
      inverseSide: 'user',
      cascade: true
    }
  }
});

export default UserEntity;
