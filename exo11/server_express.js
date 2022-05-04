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

const verifyId = (req, res, next) => {
  const params = req.params;
  let id = params.id;

  // Si l'id est un nombre
  if (id.match(/\d+/)) {
    id = parseInt(id);

    // Si l'identifiant existe
    if (db.memoryDb.has(id)) {
      next();
    }

    // Sinon
    else {
      res.status(404).json({ error: "Nope" });
    }
  }

  // Sinon
  else {
    res.status(400).json({ error: "Nope" });
  }
};

server.get("/api/name/:id", verifyId, (req, res) => {
  const id = parseInt(req.params.id);
  res.status(200).json(Object.fromEntries(db.memoryDb)[id]);
});

server.delete("/api/name/:id", verifyId, (req, res) => {
  const id = parseInt(req.params.id);
  const data = Object.fromEntries(db.memoryDb)[id];

  db.memoryDb.delete(id);

  res.status(200).json(data);
});

server.put("/api/name/:id", verifyId, (req, res) => {
  const id = parseInt(req.params.id);
  let data = req.body;

  // Données non vide
  if (data) {
    // Vérification des données envoyées
    if ("name" in data) {
      db.memoryDb.set(id, { nom: data.name });
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
