// imports
const Sauce = require("../models/sauce");
const fs = require("fs"); // package  file système

//création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // suppression du faux id envoyé par le frontend
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersliked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  //enregistrement en BDD
  sauce
    .save()
    .then(() => res.status(201).json({ message: "objet enregistré!" }))
    .catch((error) => res.status(400).json({ error }));
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
  // si req.file présent 
  if (req.file){
    // récupération de la sauce dans la bdd
    Sauce.findOne ({_id: req.params.id})
    .then (sauce => {
      // récupération du fichier image à supprimer 
      const filename = sauce.imageUrl.split ("/images/")[1];
      //suppression du fichier image dans le dossier du serveur 
      fs.unlink(`images/${filename}`, (err) => {if (err) throw err;
    });
  })
   .catch((error) => res.status(400).json({ error }));

}
  const sauceObject = req.file // si req.file existe on traite la nouvelle image, sinon on traite l'objet entrant
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "objet modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // trouver objet ds bdd
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "requête non autorisée!" });
      }
      //Verification que la sauce appartient à l'user
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
          error: "Requête non autorisée",
        });
      }
      const filename = sauce.imageUrl.split("/images/")[1]; // on extraie nom du fichier à supprimer
      // supression du fichier fs.unlink
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // ensuite supression de l'objet de la base
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
// affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //trouver l'objet unique ayant le même id que le paramètre de la recherche
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
// affichage toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Like ou dislike une sauce
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si le user n'a pas encore fait de choix
      if (
        sauce.usersDisliked.indexOf(req.body.userId) == -1 &&
        sauce.usersLiked.indexOf(req.body.userId) == -1
      ) {
        //Le user aime la sauce
        if (req.body.like == 1) {
          sauce.usersLiked.push(req.body.userId);
          sauce.likes += req.body.like;

          //Le user n'aime pas la sauce
        } else if (req.body.like == -1) {
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes -= req.body.like;
        }
      }
      // Retirer un like
      if (
        sauce.usersLiked.indexOf(req.body.userId) != -1 &&
        req.body.like == 0
      ) {
        const likesUserIndex = sauce.usersLiked.findIndex(
          (user) => user === req.body.userId
        );
        sauce.usersLiked.splice(likesUserIndex, 1);
        sauce.likes -= 1;
      }
      // Retirer un dislike
      if (
        sauce.usersDisliked.indexOf(req.body.userId) != -1 &&
        req.body.like == 0
      ) {
        const likesUserIndex = sauce.usersDisliked.findIndex(
          (user) => user === req.body.userId
        );
        sauce.usersDisliked.splice(likesUserIndex, 1);
        sauce.dislikes -= 1;
      }
      sauce.save();
      res.status(201).json({ message: "Mise à jour like / dislike" });
    })
    .catch((error) => res.status(500).json({ error }));
};
