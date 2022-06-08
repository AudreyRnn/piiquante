
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

// signup: enregistrement nouveaux users 

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur crée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//login: connexion d'users existants 
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // rechercher un user par rapport à son email unique
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "utilisateur non trouvé" });
      }
      bcrypt
        .compare(req.body.password, user.password) // comparer le mot de passe envoyé par user qui essaie de se co avec le hash enregistré avec le user déjà reçu
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id, // si user trouvé on demande à renvoyer l'identifiant de l'utilisateur ds la base
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
