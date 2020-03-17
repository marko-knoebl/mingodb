const fs = require("fs");

const FileDB = require("./FileDB.js");

describe("database access", () => {
  afterEach(() => {
    fs.unlinkSync("fdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("accesses a databse given a file location", () => {
    const db = new FileDB("fdb.json");
  });
});

describe("create", () => {
  let db;

  beforeEach(() => {
    db = new FileDB("vdb.json");
  });

  afterEach(() => {
    fs.unlinkSync("vdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("creates a new document", () => {
    db.insertOne("countries", { name: "Greece" });
    const fileContent = JSON.parse(fs.readFileSync("vdb.json"));
    expect(fileContent.countries).toBeDefined();
    expect(fileContent.countries[0].name).toEqual("Greece");
  });

  it("creates multiple documents", () => {
    db.insertMany("countries", [{ name: "Finland" }, { name: "Greece" }]);
    const fileContent = JSON.parse(fs.readFileSync("vdb.json"));
    expect(fileContent.countries[1].name).toEqual("Greece");
  });
});

describe("read", () => {
  let db;

  beforeEach(() => {
    db = new FileDB("vdb.json");
    db.insertOne("countries", {
      name: "Argentina",
      continent: "South America"
    });
    db.insertOne("countries", { name: "Brazil", continent: "South America" });
    db.insertOne("countries", { name: "Zimbabwe", continent: "Africa" });
  });

  afterEach(() => {
    fs.unlinkSync("vdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("reads all documents", () => {
    const all = db.find("countries", {});
    expect(all.length).toEqual(3);
    expect(all[0].name).toEqual("Argentina");
  });

  it("reads specific documents", () => {
    const southAmericanCountries = db.find("countries", {
      continent: "South America"
    });
    expect(southAmericanCountries.length).toEqual(2);
  });
});

describe("update", () => {
  let db;

  beforeEach(() => {
    db = new FileDB("vdb.json");
    db.insertOne("countries", {
      name: "Argentina",
      continent: "South America"
    });
    db.insertOne("countries", { name: "Brazil", continent: "South America" });
    db.insertOne("countries", { name: "Zimbabwe", continent: "Africa" });
  });

  afterEach(() => {
    fs.unlinkSync("vdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("updates a single entry", () => {
    db.updateOne(
      "countries",
      { name: "Argentina" },
      { $set: { population: 44 } }
    );
    const argentina = db.findOne("countries", { name: "Argentina" });
    expect(argentina.name).toEqual("Argentina");
    expect(argentina.population).toEqual(44);
  });

  it("replaces a single entry", () => {
    db.replaceOne(
      "countries",
      { name: "Argentina" },
      { name: "Argentina", population: 44 }
    );
    const argentina = db.findOne("countries", { name: "Argentina" });
    expect(argentina.name).toEqual("Argentina");
    expect(argentina.population).toEqual(44);
    expect(argentina.continent).toEqual(undefined);
  });
});

describe("delete", () => {
  let db;

  beforeEach(() => {
    db = new FileDB("vdb.json");
    db.insertOne("countries", {
      name: "Argentina",
      continent: "South America"
    });
    db.insertOne("countries", { name: "Brazil", continent: "South America" });
    db.insertOne("countries", { name: "Zimbabwe", continent: "Africa" });
  });

  afterEach(() => {
    fs.unlinkSync("vdb.json", err => {
      if (err) {
        throw err;
      }
    });
  });

  it("deletes a single entry", () => {
    db.deleteOne("countries", { name: "Argentina" });
    const allCountries = db.find("countries", {});
    expect(allCountries.length).toEqual(2);
  });

  it("deletes all entries", () => {
    db.deleteMany("countries", {});
    const allCountries = db.find("countries", {});
    expect(allCountries.length).toEqual(0);
  });
});
