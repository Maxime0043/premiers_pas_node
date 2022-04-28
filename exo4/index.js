const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(
  path.join(__dirname, "assets", "index.html"),
  "utf-8"
);

console.log(content);
