// import de multer pour la gestion des images 
const multer = require("multer");

// Definition des types de fichiers acceptés 
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//Configuration
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // indiquer à multer ou les images doivent être stockées ( null= pas d'erreur, dossier de destination)
  },
  // définition du nom de fichier 
  filename: (req, file, callback) => {
    const name = file.originalname.split(".")[0].split (" ").join("_"); // création nom de fichier 
    const extension = MIME_TYPES[file.mimetype];// ajouter extension de fichier en utilisant le MIME TYPE defini
    callback(null, name + Date.now() + "." + extension); 
  },
});

module.exports = multer({ storage }).single("image");
