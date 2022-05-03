const memoryDb = new Map();

// CREATION
memoryDb.set("Alice", { name: "Alice", age: 37 });
memoryDb.set(0, { name: "Carole", age: 29 });

console.log(memoryDb);

console.log(memoryDb.get(0));
console.log(memoryDb.get("Alice"));

// MODIFICATION
memoryDb.set("Alice", { blabla: "hey" });
console.log(memoryDb);

// SUPPRESSION
memoryDb.delete(0);
console.log(memoryDb);
