# MingoDB

**MingoDB** is a tiny implementation of some parts of the MongoDB shell. It is intended for learning MongoDB concepts without having to install it.

## functionality

opening a database connection:

```js
const mingodb = require("@karuga/mingodb");

const db = mingodb("data.json");
```

### create

creating entries in a collection:

```js
db.countries.insertOne({ name: "Argentina", continent: "South America" });
db.countries.insertOne({ name: "Brazil", continent: "South America" });
```

creating multiple entries at once:

```js
db.countries.insertMany([
  { name: "Finland", continent: "Europe" },
  { name: "Greece", continent: "Europe" }
]);
```

### read

reading an array of all entries:

```js
const allCountries = db.countries.find({});
```

reading an array of some entries:

```js
const europeanCountries = db.countries.find({ continent: "Europe" });
```

reading a single entry:

```js
const greece = db.countries.findOne({ name: "Greece" });
```

### update

changing an entry:

```js
db.countries.updateOne({ name: "Argentina" }, { $set: { population: 44 } });
```

replacing an entry:

```js
db.countries.replaceOne(
  { name: "Brazil" },
  { name: "Brazil", population: 210 }
);
```

### delete

deleting an entry:

```js
db.countries.deleteOne({ name: "Finland" });
```

deleting all entries:

```js
db.countries.deleteMany({});
```
