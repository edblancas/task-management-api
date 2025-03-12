import { EntitySchema } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TaskStatus, TaskPriority } from '../enums.js';

export const TaskEntity = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      default: () => uuidv4()
    },
    title: {
      type: 'varchar',
      length: 255
    },
    status: {
      type: 'enum',
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO
    },
    priority: {
      type: 'enum',
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM
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
    assignee: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'assigneeId'
      },
      inverseSide: 'assignedTasks'
    },
    reporter: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'reporterId'
      },
      inverseSide: 'reportedTasks'
    },
    comments: {
      type: 'one-to-many',
      target: 'Comment',
      inverseSide: 'task',
      cascade: true
    }
  }
});

export default TaskEntity;
