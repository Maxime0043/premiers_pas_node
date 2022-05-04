const db = require("./db");
const http = require("http");
const server = http.createServer((req, res) => {
  let result = "";

  try {
    // ROUTE API
    if (req.url.match("/api/name")) {
      // LISTER / AJOUTER DES DONNEES
      if (req.url === "/api/names") {
        // METHODE GET
        if (req.method === "GET") {
          res.writeHead(200, { "content-type": "application/json" });
          result = Object.fromEntries(db.memoryDb);
          result = JSON.stringify(result);
          res.write(result);
          res.end();
        }

        // METHODE POST
        else if (req.method === "POST") {
          let data = "";

          req.on("data", (chunk) => {
            data += chunk;
          });

          req.on("end", () => {
            // Données non vide
            if (data !== "") {
              data = JSON.parse(data);

              // Vérification des données envoyées
              if ("name" in data) {
                res.writeHead(201, { "content-type": "application/json" });
                db.memoryDb.set(db.id++, { nom: data.name });
                result = JSON.stringify(data);
                res.write(result);
              }

              // Création impossible
              else {
                res.writeHead(424, { "content-type": "application/json" });
                res.write(JSON.stringify({ error: "Nope" }));
              }
            }

            // Données vides
            else {
              // Création impossible
              res.writeHead(424, { "content-type": "application/json" });
              res.write(JSON.stringify({ error: "Nope" }));
            }

            res.end();
          });
        }

        // AUTRES METHODES
        else {
          res.writeHead(405, { "content-type": "application/json" });
          res.write(JSON.stringify({ error: "Nope" }));
          res.end();
        }
      }

      // DETAILLER / SUPPRIMER DES DONNEES
      else if (req.url.match(/\/api\/name\/\d+/g)) {
        let id = parseInt(req.url.split("/")[3]);

        // L'identifiant existe
        if (db.memoryDb.has(id)) {
          // METHODE GET
          if (req.method === "GET") {
            res.writeHead(200, { "content-type": "application/json" });
            result = Object.fromEntries(db.memoryDb);
            result = JSON.stringify(result[id]);
            res.write(result);
            res.end();
          }

          // METHODE DELETE
          else if (req.method === "DELETE") {
            res.writeHead(200, { "content-type": "application/json" });
            result = Object.fromEntries(db.memoryDb);
            result = JSON.stringify(result[id]);

            db.memoryDb.delete(id);

            res.write(result);
            res.end();
          }

          // METHODE PUT
          else if (req.method === "PUT") {
            let data = "";

            req.on("data", (chunk) => {
              data += chunk;
            });

            req.on("end", () => {
              // Données non vide
              if (data !== "") {
                data = JSON.parse(data);

                // Vérification des données envoyées
                if ("name" in data) {
                  res.writeHead(201, { "content-type": "application/json" });
                  db.memoryDb.set(id, { nom: data.name });
                  result = JSON.stringify(data);
                  res.write(result);
                }

                // Modification impossible
                else {
                  res.writeHead(424, { "content-type": "application/json" });
                  res.write(JSON.stringify({ error: "Nope" }));
                }
              }

              // Données vides
              else {
                // Création impossible
                res.writeHead(424, { "content-type": "application/json" });
                res.write(JSON.stringify({ error: "Nope" }));
              }

              res.end();
            });
          }

          // AUTRES METHODES
          else {
            res.writeHead(405, { "content-type": "application/json" });
            res.write(JSON.stringify({ error: "Nope" }));
            res.end();
          }
        }

        // L'identifiant n'existe pas
        else {
          res.writeHead(404, { "content-type": "application/json" });
          res.write(JSON.stringify({ error: "Nope" }));
          res.end();
        }
      }

      // AUTRES REQUÊTES
      else {
        res.writeHead(404, { "content-type": "application/json" });
        res.write(JSON.stringify({ error: "Nope" }));
        res.end();
      }
    }

    // ROUTE INEXISTANTE
    else {
      res.writeHead(404, { "content-type": "application/json" });
      res.write(JSON.stringify({ error: "Nope" }));
      res.end();
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.write(JSON.stringify({ error: "Nope" }));
    res.end();
  }
});

module.exports = server;
