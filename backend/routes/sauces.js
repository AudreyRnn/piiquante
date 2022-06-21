// imports 
const express = require("express");
const sauceCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//creation du router 
const router = express.Router();

//création d'une sauce (create)
router.post("/", auth, multer, sauceCtrl.createSauce);

// récupérer une seule sauce d'après son id (read)
router.get("/:id", auth, sauceCtrl.getOneSauce);

//récupérer toutes les sauces (read)
router.get("/", auth, sauceCtrl.getAllSauces);

// mettre à jour une sauce (update)
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// supression d'une sauce (delete)
router.delete("/:id", auth, sauceCtrl.deleteSauce);


// Gestion des likes et dislikes 
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
