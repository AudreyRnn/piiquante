const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique pour qu'un email ne soit ok qu'une fois / installer mongoose-unique-validator
  password: { type: String, required: true },
});

// passer le plugin sur le schema avant de l'exporter en modèle:
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
