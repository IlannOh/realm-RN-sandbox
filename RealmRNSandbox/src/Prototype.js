Object.defineProperty(Object.prototype, 'realmToObject', {
  value: function () {
    if (!(this instanceof Realm.Object)) return this;

    let result = {};
    try {
      for (const key in this) {
        result[key] = this[key];
      }
    } catch (err) {
      if (Sentry)
        Sentry.captureException(err || new Error('realmToObject error'));
    }

    return result;
  },
  writable: true,
  configurable: true,
  enumerable: false,
});
