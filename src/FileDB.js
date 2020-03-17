const fs = require("fs");

const BsonObjectId = require("bson-objectid");

class FileDB {
  constructor(dbPath) {
    this._dbPath = dbPath;
    this._data = {};
    if (fs.existsSync(this._dbPath)) {
      const fileContent = fs.readFileSync(this._dbPath, { encoding: "utf-8" });
      this._data = JSON.parse(fileContent);
    } else {
      // initialize file with empty JSON object
      this._data = {};
      this.save();
    }
  }

  save() {
    const content = JSON.stringify(this._data);
    fs.writeFileSync(this._dbPath, content);
  }

  /**
   * access internal collection data
   */
  _collectionData(name) {
    if (this._data[name] === undefined) {
      this._data[name] = [];
    }
    return this._data[name];
  }

  insertOne(collectionName, document) {
    const collection = this._collectionData(collectionName);
    const objectId = BsonObjectId().toHexString();
    collection.push({ ...document, _id: objectId });
    this.save();
  }

  insertMany(collectionName, documents) {
    const collection = this._collectionData(collectionName);
    for (let document of documents) {
      const objectId = BsonObjectId().toHexString();
      collection.push({ ...document, _id: objectId });
      this.save();
    }
  }

  find(collectionName, query) {
    return this._collectionData(collectionName).filter(doc =>
      match(doc, query)
    );
  }

  findOne(collectionName, query) {
    return this._collectionData(collectionName).find(doc => match(doc, query));
  }

  updateOne(collectionName, query, update) {
    const collection = this._collectionData(collectionName);
    if (update.$set === undefined) {
      // replace document
      const entryIndex = collection.findIndex(doc => match(doc, query));
      const entryId = collection[entryIndex]._id;
      collection[entryIndex] = { ...update, _id: entryId };
    } else {
      // update document
      const entry = collection.find(doc => match(doc, query));
      for (let key in update.$set) {
        entry[key] = update.$set[key];
      }
    }
    this.save();
  }

  deleteOne(collectionName, query = {}) {
    const collection = this._collectionData(collectionName);
    const entryIndex = collection.findIndex(doc => match(doc, query));
    collection.splice(entryIndex, 1);
    this.save();
  }

  deleteMany(collectionName, query = {}) {
    const collection = this._collectionData(collectionName);
    const filteredCollection = collection.filter(doc => !match(doc, query));
    this._data[collectionName] = filteredCollection;
    this.save();
  }
}

const match = (doc, query) => {
  for (let key in query) {
    if (query[key] !== doc[key]) {
      return false;
    }
  }
  return true;
};

module.exports = FileDB;
