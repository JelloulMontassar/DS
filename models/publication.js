const mongoose = require("mongoose")
const publicationSchema = mongoose.Schema({
        titre: { type: String, required: true },
        date: {
            type: Date,
            default: Date.now()
        },
        contenu: { type: String, required: true },
    }, {
        virtuals: {
            résumé: {
                get() {
                    return this.contenu.slice(10)
                }
            }
        }
    }

)

module.exports = mongoose.model("Publication", publicationSchema)