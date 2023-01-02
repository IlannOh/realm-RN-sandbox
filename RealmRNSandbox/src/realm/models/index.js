import Realm from 'realm';
import TaskSchema from './Task';

export const TaskRealm = new Realm({
  schema: [TaskSchema],
  schemaVersion: TaskSchema.version,
  path: 'tasks.realm',
});
