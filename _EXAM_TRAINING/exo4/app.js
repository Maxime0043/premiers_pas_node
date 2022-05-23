const express = require("express");
const app = express();
const {
  getAll,
  getOne,
  createUser,
  updateUser,
  deleteUser,
} = require("./Table");
const joi = require("joi");
const ObjectID = require("mongoose").Types.ObjectId;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RÉCUPERER TOUS LES NOMS
app.get("/api/names", async (req, res) => {
  const users = await getAll();
  res.status(200).json(users);
});

// AJOUTER UN NOM
app.post("/api/names", async (req, res) => {
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
    const user = await createUser(value);

    // Renvoie objet créé
    res.status(201).json(user);
  }
});

const verifyId = async (req, res, next) => {
  const params = req.params;
  let id = params.id;

  // Vérification
  if (ObjectID.isValid(id)) {
    const user = await getOne(id);

    if (user) next();
    else res.status(400).json({ error: "Id must exists !" });
  }

  // Sinon
  else {
    res.status(400).json({ error: "Id must exists !" });
  }
};

// RECUPERER UN NOM
app.get("/api/names/:id", [verifyId], async (req, res) => {
  const user = await getOne(req.params.id);
  res.status(200).json(user);
});

// MODIFIER UN NOM
app.put("/api/names/:id", [verifyId], async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  // validation
  const schema = joi.object({
    name: joi.string().min(2).max(255).required(),
  });
  const { value, error } = schema.validate(payload);

  if (error) res.status(400).json({ error: error.details[0].message });
  else {
    // Modification
    const user = await updateUser(id, value);
    res.status(200).json(user);
  }
});

// SUPPRIMER UN NOM
app.delete("/api/names/:id", [verifyId], async (req, res) => {
  const id = req.params.id;
  const user = await deleteUser(id);

  res.status(200).json(user);
});

module.exports = app;
