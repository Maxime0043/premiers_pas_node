const fs = require("fs");
const path = require("path");

const contentFileHTML = fs.readFileSync(
  path.join(__dirname, "..", "assets", "index.html"),
  "utf-8"
);
const contentFileLog = fs.readFileSync(
  path.join(__dirname, "log.txt"),
  "utf-8"
);

console.log(contentFileHTML);
console.log(contentFileLog);
