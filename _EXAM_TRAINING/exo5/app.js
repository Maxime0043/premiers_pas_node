// Validation
const joi = require("joi");
const bcrypt = require("bcrypt");

// Express + async errors
const express = require("express");
require("express-async-errors"); // bcrypt est asynchrone
const app = express();

// JWT + dotenv + vérification de la présence d'une variable d'environnement
const jwt = require("jsonwebtoken");
require("dotenv").config();
if (!process.env.JWT_PRIVATE_KEY) {
  console.log(
    "Vous devez créer un fichier .env qui contient la variable JWT_PRIVATE_KEY"
  );
  process.exit(1);
}

// Base de données
const Collection = require("./Collection");
const Names = new Collection("Names");
const Accounts = new Collection("Accounts");

// On va avoir besoin de parser le json entrant dans req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// debug
app.get("/accounts", (req, res) => {
  res.status(200).json(Accounts.getAll());
});

// INSCRIPTION
app.post("/signup", async (req, res) => {
  const payload = req.body;
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().max(255).required().email(),
    password: joi.string().min(3).max(50).required(),
  });

  const { value: account, error } = schema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Avant d'inscrire on vérifie que le compte est unique
  const { id, found } = Accounts.findByProperty("email", account.email);
  if (found) return res.status(400).send("Please signin instead of signup");

  // Hachage du mot de passe
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(account.password, salt);
  account.password = passwordHashed;

  Accounts.insertOne(account);
  res.status(201).json({
    name: account.name,
    email: account.email,
  });
});

// CONNEXION
app.post("/signin", async (req, res) => {
  const payload = req.body;
  const schema = joi.object({
    email: joi.string().max(255).required().email(),
    password: joi.string().min(3).max(50).required(),
  });

  const { value: connexion, error } = schema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // On cherche dans la DB
  const { id, found: account } = Accounts.findByProperty(
    "email",
    connexion.email
  );
  if (!account) return res.status(400).json({ error: "Email Invalide" });

  // On doit comparer les hash
  const passwordHashed = await bcrypt.compare(
    connexion.password,
    account.password
  );
  if (!passwordHashed)
    return res.status(400).json({ error: "Mot de passe invalide" });

  // On retourne un JWT
  const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY);
  res.header("x-auth-token", token).status(200).json({ name: account.name });
});

const authGuard = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ error: "Vous devez vous connecter" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;

    // Le middleware a fait son boulot et peut laisser la place au suivant.
    next();
  } catch (err) {
    return res.status(400).json({ error: "Token invalide" });
  }
};

// RÉCUPERER TOUS LES NOMS
app.get("/api/names", (req, res) => {
  res.status(200).json(Names.getAll());
});

// AJOUTER UN NOM
app.post("/api/names", [authGuard], (req, res) => {
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
    Names.insertOne(value);

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
    if (Names.exists(id)) {
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
app.get("/api/names/:id", [authGuard, verifyId], (req, res) => {
  const id = parseInt(req.params.id);
  res.status(200).json(Names.getOne(id));
});

// MODIFIER UN NOM
app.put("/api/names/:id", [authGuard, verifyId], (req, res) => {
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
    Names.updateOne(id, value);
    res.status(200).json(value);
  }
});

// SUPPRIMER UN NOM
app.delete("/api/names/:id", [authGuard, verifyId], (req, res) => {
  const id = parseInt(req.params.id);
  Names.deleteOne(id);
  res.sendStatus(200);
});

module.exports = app;
