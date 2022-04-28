const fs = require("fs");
const content = fs.readFileSync(__dirname + "/assets/index.html", "utf-8");

console.log(content);
