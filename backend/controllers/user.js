// variables d'environnement
require("dotenv").config();

//imports 
const bcrypt = require("bcrypt");// import du package pour hasher les mots de passe 
const jwt = require("jsonwebtoken");// import du package pour générrer un token 

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

// utilisation d'une regEx pour vérifier que l'input complété comprend un email valide 

if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
  return res.status(400).json ({message: "merci de renseigner un email valide"});
}

//Enregistrer les données de l'utilisateur dans la BDD
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur crée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//login: connexion d'users existants
exports.login = (req, res, next) => {
   
  // regEx pour vérifier l'input complété par l'utilisateur

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)) {
    return res
      .status(400)
      .json({ message: "merci de renseigner un email valide" });
  }

  User.findOne({ email: req.body.email }) // rechercher un user par rapport à son email unique
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "utilisateur non trouvé" });
      }
      //comparaison du MDP envoyé par le user qui tente de se connecter et du hash enregistré dans la BDD
      bcrypt
        .compare(req.body.password, user.password) // (MDP envoyé dans la requête , hash enregistré en bdd user )
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id, // si user trouvé on demande à renvoyer l'identifiant de l'utilisateur ds la base
            token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
