import { EntitySchema } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export const CommentEntity = new EntitySchema({
  name: 'Comment',
  tableName: 'comments',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      default: () => uuidv4()
    },
    text: {
      type: 'text'
    },
    date: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
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
    task: {
      type: 'many-to-one',
      target: 'Task',
      joinColumn: {
        name: 'taskId'
      },
      inverseSide: 'comments'
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'userId'
      },
      inverseSide: 'comments'
    }
  }
});

export default CommentEntity;
