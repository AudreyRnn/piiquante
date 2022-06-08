const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//création d'une sauce 
router.post("/", auth, multer, sauceCtrl.createSauce);

// mettre à jour une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// supression d'une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// récupérer une seule sauce d'après son id 
router.get("/:id", auth, sauceCtrl.getOneSauce);

//récupérer toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauces);

module.exports = router;
