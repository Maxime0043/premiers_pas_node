// Validation
const joi = require("joi");
const bcrypt = require("bcrypt");
const ObjectID = require("mongoose").Types.ObjectId;

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
const {
  getAll,
  getOne,
  createUser,
  updateUser,
  deleteUser,
  Account,
} = require("./Table");

// On va avoir besoin de parser le json entrant dans req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// debug
app.get("/accounts", async (req, res) => {
  res.status(200).json(await Account.find({}));
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
  const found = await Account.findOne({ email: account.email });
  if (found) return res.status(400).send("Please signin instead of signup");

  // Hachage du mot de passe
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(account.password, salt);
  account.password = passwordHashed;

  const newAccount = new Account(account);
  newAccount.save().then((account) => {
    res.status(201).json({
      name: account.name,
      email: account.email,
    });
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
  const account = await Account.findOne({ email: connexion.email });
  if (!account) return res.status(400).json({ error: "Email Invalide" });

  // On doit comparer les hash
  const passwordHashed = await bcrypt.compare(
    connexion.password,
    account.password
  );
  if (!passwordHashed)
    return res.status(400).json({ error: "Mot de passe invalide" });

  // On retourne un JWT
  const token = jwt.sign({ id: account._id }, process.env.JWT_PRIVATE_KEY);
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
app.get("/api/names", async (req, res) => {
  const users = await getAll();
  res.status(200).json(users);
});

// AJOUTER UN NOM
app.post("/api/names", [authGuard], async (req, res) => {
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
app.get("/api/names/:id", [authGuard, verifyId], async (req, res) => {
  const user = await getOne(req.params.id);
  res.status(200).json(user);
});

// MODIFIER UN NOM
app.put("/api/names/:id", [authGuard, verifyId], async (req, res) => {
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
app.delete("/api/names/:id", [authGuard, verifyId], async (req, res) => {
  const id = req.params.id;
  const user = await deleteUser(id);

  res.status(200).json(user);
});

module.exports = app;
