const http = require("http");
const fs = require("fs");
const path = require("path");

const contentType = {
  js: { "content-type": "text/javascript" },
  css: { "content-type": "text/css" },
  gif: { "content-type": "image/gif" },
};

const server = http.createServer((req, res) => {
  try {
    if (req.url === "/") {
      if (req.method === "GET") {
        res.writeHead(200, { "content-type": "text/html" });
        res.write(
          fs.readFileSync(path.join(__dirname, "public", "pages", "index.html"))
        );
        res.end();
      } else {
        res.writeHead(405, { "content-type": "text/html" });
        res.write(
          fs.readFileSync(
            path.join(__dirname, "public", "pages", "method_not_allowed.html")
          )
        );
        res.end();
      }
    } else if (req.url.match(/\/public\/*.*/)) {
      const split = req.url.split("/");
      const file = split[split.length - 1].split(".");
      if (req.method === "GET") {
        res.writeHead(200, contentType[file[1]]);
        res.write(
          fs.readFileSync(
            path.join(__dirname, "public", file[1], `${file[0]}.${file[1]}`)
          )
        );
        res.end();
      } else {
        res.writeHead(405, { "content-type": "text/html" });
        res.write(
          fs.readFileSync(
            path.join(__dirname, "public", "pages", "method_not_allowed.html")
          )
        );
        res.end();
      }
    } else {
      res.writeHead(404, { "content-type": "text/html" });
      res.write(
        fs.readFileSync(
          path.join(__dirname, "public", "pages", "not_found.html")
        )
      );
      res.end();
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "text/html" });
    res.write(
      fs.readFileSync(
        path.join(__dirname, "public", "pages", "internal_server_error.html")
      )
    );
    res.end();
  }
});

module.exports = server;
