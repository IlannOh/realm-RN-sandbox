import { TaskRealm } from './models/index'
import TaskSchema, { dummyTask } from './models/Task';

export const doInsert = (isLocal, id) => {
  const task = { id: id || Date.now().toString(), ...dummyTask, isLocal };
  try {
    TaskRealm.beginTransaction();
    TaskRealm.create(TaskSchema.name, task, 'modified');
    TaskRealm.commitTransaction();
  } catch (error) {
    console.log(`TCL ~ file: funcs.js:10 ~ doInsert ~ error`, error);
    TaskRealm.cancelTransaction();
  } finally {
    return task;
  }
};

const threadSleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const doMultiInsert = async () => {
  const task = doInsert(true); // insert as local object
  await threadSleep(200); // simulate upload to server
  doInsert(false, task.id); // .then after update
  await threadSleep(200); // simulate wait time for listner to server
  doInsert(undefined, task.id); // on server listener
};
