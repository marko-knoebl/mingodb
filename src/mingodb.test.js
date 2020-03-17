const fs = require("fs");

const vdb = require("./mingodb.js");

describe("collection access", () => {
  let db;

  beforeEach(() => {
    db = vdb("vdb.json");
  });

  afterEach(() => {
    fs.unlinkSync("vdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("accesses a new collection", () => {
    const countries = db.countries;
    expect(countries).toBeDefined();
  });

  it("accesses an existing collection", () => {
    const countries1 = db.countries;
    const countries2 = db.countries;
    expect(countries1).toEqual(countries2);
  });
});

describe("create", () => {
  let db;

  beforeEach(() => {
    db = vdb("vdb.json");
  });

  afterEach(() => {
    fs.unlinkSync("vdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("creates a new document", () => {
    const countries = db.countries;
    countries.insertOne({ name: "Greece" });
    const fileContent = JSON.parse(fs.readFileSync("vdb.json"));
    expect(fileContent.countries).toBeDefined();
    expect(fileContent.countries[0].name).toEqual("Greece");
  });

  it("creates multiple documents", () => {
    db.countries.insertMany([{ name: "Finland" }, { name: "Greece" }]);
    const fileContent = JSON.parse(fs.readFileSync("vdb.json"));
    expect(fileContent.countries[1].name).toEqual("Greece");
  });
});

describe("read", () => {
  let db;

  beforeEach(() => {
    db = vdb("vdb.json");
    db.countries.insertOne({ name: "Argentina", continent: "South America" });
    db.countries.insertOne({ name: "Brazil", continent: "South America" });
    db.countries.insertOne({ name: "Zimbabwe", continent: "Africa" });
  });

  afterEach(() => {
    fs.unlinkSync("vdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("reads all documents", () => {
    const all = db.countries.find({});
    expect(all.length).toEqual(3);
    expect(all[0].name).toEqual("Argentina");
  });

  it("reads specific documents", () => {
    const southAmericanCountries = db.countries.find({
      continent: "South America"
    });
    expect(southAmericanCountries.length).toEqual(2);
  });
});

describe("update", () => {
  let db;

  beforeEach(() => {
    db = vdb("vdb.json");
    db.countries.insertOne({ name: "Argentina", continent: "South America" });
    db.countries.insertOne({ name: "Brazil", continent: "South America" });
    db.countries.insertOne({ name: "Zimbabwe", continent: "Africa" });
  });

  afterEach(() => {
    fs.unlinkSync("vdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("updates a single entry", () => {
    db.countries.updateOne({ name: "Argentina" }, { $set: { population: 44 } });
    const argentina = db.countries.findOne({ name: "Argentina" });
    expect(argentina.name).toEqual("Argentina");
    expect(argentina.population).toEqual(44);
  });

  it("replaces a single entry", () => {
    db.countries.replaceOne(
      { name: "Argentina" },
      { name: "Argentina", population: 44 }
    );
    const argentina = db.countries.findOne({ name: "Argentina" });
    expect(argentina.name).toEqual("Argentina");
    expect(argentina.population).toEqual(44);
    expect(argentina.continent).toEqual(undefined);
  });
});
