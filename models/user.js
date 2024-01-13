const mongoose = require("mongoose")

const utilisateurSchema = mongoose.Schema({

    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    motdepasse: { type: String },
    role: {
        type: String,
        enum: ["admin", "author"],
        default: "author"
    },
    statut: {
        type: String,
        enum: ["EA", "V"],
        default: "EA"
    },
    refereces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publication'
    }],
})


module.exports = mongoose.model("Utilisateur", utilisateurSchema)