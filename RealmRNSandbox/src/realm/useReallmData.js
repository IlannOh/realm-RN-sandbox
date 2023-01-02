import _ from 'lodash';
import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { TaskRealm } from './models/index';

/**
 * @template T
 * @param {T} value
 * @param {any[]} depsArr
 * @returns
 */
const useRefed = (value, depsArr) => {
  const ref = useRef(value);
  ref.current = useMemo(() => value, depsArr);
  return ref;
};

/**
 * @typedef {{
 *  returnRawData?: boolean,
 *  shouldListen?: boolean,
 *  shouldQuery?: boolean,
 * }} UseRealmOptimizations
 * @param {string} query
 * @param {{ transformObject?: (object: any) => any }} [options]
 * @param {UseRealmOptimizations} [optimizations]
 * @returns
 */
const useRealmData = (query = null, options = null, optimizations = null) => {
  const { transformObject } = options || {};
  const {
    returnRawData,
    shouldListen = true,
    shouldQuery = true,
  } = optimizations || {};
  const [data, setData] = useState(null);

  const onData = useCallback(
    /** @type {import('realm').CollectionChangeCallback<any>} */
    (objects, changes = null) => {
      if (returnRawData) {
        setData(objects);
        return;
      }

      /**
       *
       * @param {number} index
       * @returns
       */
      const getObject = index => {
        let object = objects[index].realmToObject();
        if (transformObject) {
          object = transformObject(object);
        }

        return object;
      };

      let objectsMap = {};
      if (changes) {
        objectsMap = Object.assign({}, data);
        Array.from(
          new Set([
            ...changes.newModifications,
            ...changes.oldModifications,
            ...changes.modifications,
            ...changes.insertions,
          ]),
        ).forEach(index => {
          const object = getObject(index);
          objectsMap[object.id] = object;
        });

        changes.deletions.forEach(index => {
          const object = objects[index];
          delete objectsMap[object.id];
        });
      } else {
        objects.forEach((obj, index) => {
          const object = getObject(index);
          objectsMap[object.id] = object;
        });
      }

      setData(_.size(objectsMap) ? objectsMap : null);
    },
    [data, transformObject, returnRawData],
  );

  const onDataRef = useRefed(onData, [onData]);

  useEffect(() => {
    if (!shouldQuery) {
      setData(null);
      return;
    }

    /** @type {Realm} */
    const realm = TaskRealm;
    const realmObjects = realm.objects('Task');
    if (realmObjects) {
      const objects = query ? realmObjects.filtered(query) : realmObjects;
      if (objects) {
        onData(objects);
        if (shouldListen) {
          /** @type {import('realm').CollectionChangeCallback<any>} */
          const objectsListener = (objects, changes) => {
            const didChange = Boolean(
              changes.insertions.length ||
              changes.deletions.length ||
              changes.modifications.length ||
              changes.newModifications.length ||
              changes.oldModifications.length,
            );

            if (didChange) {
              onDataRef.current(objects, changes);
            }
          };

          objects.addListener(objectsListener);

          return () => {
            objects.removeListener(objectsListener);
          };
        }
      }
    }
  }, [query, shouldQuery, shouldListen]);

  return data;
};

export default useRealmData;
