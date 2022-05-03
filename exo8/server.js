const http = require("http");
const server = http.createServer((req, res) => {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    data = JSON.parse(data);
    console.log(data);

    let results = { name: "Hello", age: 21 };
    results = JSON.stringify(results);

    res.write(results);
    res.end();
  });
});

server.listen(3000);
