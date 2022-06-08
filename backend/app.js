const express = require("express");
const mongoose = require('mongoose');
const path = require('path')

const app = express();

app.use(express.json());

// se connecter à la bdd 
mongoose
  .connect(
    "mongodb+srv://piiquante_access:2022BDDtest@piiquante.mpxxvg4.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  console.log("Requête Reçue!");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue!" });
  next();
});

app.use((req, res, next) => {
  log("Réponse envoyée avec succès!");
});

module.exports = app;
