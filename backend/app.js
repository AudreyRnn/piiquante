require("dotenv").config("../.env");

const express = require("express");
const cors = require ("cors");
const mongoose = require("mongoose");
const helmet = require ("helmet");

const path = require("path");

const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());

app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

// se connecter à la bdd
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@piiquante.mpxxvg4.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


  app.use(cors ());


app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
