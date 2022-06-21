// varibale d'envoronnement 
require("dotenv").config();

// import
const jwt = require("jsonwebtoken");

//Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); // décoder le token (token à vérifier, clé d'encodage)
    const userId = decodedToken.userId; // récupérer le userID
    req.auth = { userId };
    //vérification: si userID de la requête est aussi celui du token 
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ message: "requête non autorisée" });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | "Requête invalide!" });
  }
};
