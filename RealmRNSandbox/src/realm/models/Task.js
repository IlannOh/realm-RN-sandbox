const TaskSchema = {
  name: 'Task',
  primaryKey: 'id',
  version: 1,
  properties: {
    id: { type: 'string', indexed: true },
    prop1: { type: 'string', indexed: true },
    prop2: { type: 'string', indexed: true },
    prop3: { type: 'string', indexed: true },
    prop4: { type: 'int', default: 300 },
    prop5: { type: 'int?', default: 0 },
    prop6: { type: 'int?', default: 0 },
    prop7: { type: 'int?' },
    prop8: { type: 'bool?' },
    prop9: { type: 'string?', indexed: true },
    prop10: { type: 'string?', indexed: true },
    isLocal: { type: 'bool?', indexed: true },
  },
};

export default TaskSchema;

export const dummyTask = {
  prop1: 'string',
  prop2: 'string',
  prop3: 'string',
  prop4: 4,
  prop5: 5,
  prop6: 6,
  prop7: 7,
  prop8: true,
  prop9: 'string?',
  prop10: 'string?',
}
