const mingodb = require("@karuga/mingodb");

const db = mingodb("data.json");

console.log("\ndeleting any existing countries");
db.countries.deleteMany({});

console.log("\ncreating countries");
db.countries.insertOne({ name: "Argentina", continent: "South America" });
db.countries.insertOne({ name: "Brazil", continent: "South America" });

db.countries.insertMany([
  { name: "Finland", continent: "Europe" },
  { name: "Greece", continent: "Europe" }
]);

console.log("\nreading countries");
const allCountries = db.countries.find({});
const europeanCountries = db.countries.find({ continent: "Europe" });
const greece = db.countries.findOne({ name: "Greece" });

console.log(allCountries);
console.log(europeanCountries);
console.log(greece);

console.log("\nupdating countries");

console.log("\nchanging an entry");
db.countries.updateOne({ name: "Argentina" }, { $set: { population: 44 } });
console.log(db.countries.findOne({ name: "Argentina" }));

console.log("\nreplacing an entry");
db.countries.replaceOne(
  { name: "Brazil" },
  { name: "Brazil", population: 210 }
);
console.log(db.countries.findOne({ name: "Brazil" }));

console.log("\ndeleting an entry");
db.countries.deleteOne({ name: "Finland" });

console.log("\ndeleting all entries");
db.countries.deleteMany({});
