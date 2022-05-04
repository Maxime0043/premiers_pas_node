const db = {
  memoryDb: new Map(),
  id: 0,
};

db.memoryDb.set(db.id++, { nom: "Alice" }); // voici comment set une nouvelle entrée.
db.memoryDb.set(db.id++, { nom: "Bob" });
db.memoryDb.set(db.id++, { nom: "Charlie" });

module.exports = db;
