const express = require("express");
const server = express();
const db = require("./db");

server.use(express.json());
server.use(express.urlencoded());

server.get("/api/names", (req, res) => {
  res.json(Object.fromEntries(db.memoryDb));
});

server.post("/api/names", (req, res) => {
  let data = req.body;

  // Données non vide
  if (data) {
    // Vérification des données envoyées
    if ("name" in data) {
      db.memoryDb.set(db.id++, { nom: data.name });
      res.status(201).json(data);
    }

    // Création impossible
    else {
      res.status(424).json({ error: "Nope" });
    }
  }

  // Données vide
  else {
    res.status(424).json({ error: "Nope" });
  }
});

module.exports = server;
