const DB = require("./FileDB");

const makeProxy = db => {
  return new Proxy(db, {
    get: (wrappedDb, prop) => {
      const props = Object.getOwnPropertyNames(wrappedDb);
      const methods = Object.getOwnPropertyNames(wrappedDb.__proto__);
      if (props.includes(prop) || methods.includes(prop)) {
        return wrappedDb[prop];
      }
      return new Collection(wrappedDb, prop);
    }
  });
};

class Collection {
  constructor(database, name) {
    this._data = [];
    this._db = database;
    this._name = name;
  }

  insertOne(document) {
    this._db.insertOne(this._name, document);
  }

  insertMany(documents) {
    this._db.insertMany(this._name, documents);
  }

  find(query) {
    return this._db.find(this._name, query);
  }

  findOne(query) {
    return this._db.findOne(this._name, query);
  }

  updateOne(query, update) {
    this._db.updateOne(this._name, query, update);
  }

  deleteOne(query) {
    this._db.deleteOne(this._name, query);
  }

  deleteMany(query) {
    this._db.deleteMany(this._name, query);
  }
}

const openDb = fileName => {
  // access database under _fileName_
  const db = new DB(fileName);
  const dbProxy = makeProxy(db);
  return dbProxy;
};

module.exports = openDb;
