const express = require("express");
const app = express();
const db = require("./Table");
const joi = require("joi");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RÉCUPERER TOUS LES NOMS
app.get("/api/names", (req, res) => {
  res.status(200).json(Object.fromEntries(db.memoryDb));
});

// AJOUTER UN NOM
app.post("/api/names", (req, res) => {
  const payload = req.body;

  // validation
  const schema = joi.object({
    name: joi.string().min(2).max(50).required(),
  });
  const { value, error } = schema.validate(payload);

  // Erreur => Renvoie erreur
  if (error) res.status(400).json({ erreur: error.details[0].message });
  else {
    // Ajout valeur dans base de données
    db.insertOne(value);

    // Renvoie objet créé
    res.status(201).json(value);
  }
});

const verifyId = (req, res, next) => {
  const params = req.params;
  let id = params.id;

  // Vérifie si l'id est un nombre
  if (id.match(/\d+/)) {
    id = parseInt(id);

    // Vérifie l'existance
    if (db.exists(id)) {
      next();
    }

    // Sinon
    else {
      res.status(400).json({ error: "Id must exists !" });
    }
  }

  // Sinon
  else {
    res.status(400).json({ error: "Id must be a number !" });
  }
};

// RECUPERER UN NOM
app.get("/api/names/:id", [verifyId], (req, res) => {
  const id = parseInt(req.params.id);
  res.status(200).json(db.getOne(id));
});

// MODIFIER UN NOM
app.put("/api/names/:id", [verifyId], (req, res) => {
  const id = parseInt(req.params.id);
  const payload = req.body;

  // validation
  const schema = joi.object({
    name: joi.string().min(2).max(255).required(),
  });
  const { value, error } = schema.validate(payload);

  if (error) res.status(400).json({ error: error.details[0].message });
  else {
    // Modification
    db.updateOne(id, value);
    res.status(200).json(value);
  }
});

// SUPPRIMER UN NOM
app.delete("/api/names/:id", [verifyId], (req, res) => {
  const id = parseInt(req.params.id);
  db.deleteOne(id);
  res.sendStatus(200);
});

module.exports = app;
