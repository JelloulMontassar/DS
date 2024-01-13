const publicationModel = require("../models/publication");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

exports.addPublication = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const authorId = decodedToken.userId;

        console.log(authorId);

        const publication = new publicationModel({
            titre: req.body.titre,
            contenu: req.body.contenu,
        });

        const newPublication = await publication.save();

        const user = await userModel.findById(authorId);

        if (!user) {
            return res.status(404).json({ error: "Author not found." });
        }

        user.refereces.push(newPublication._id);

        await user.save();

        res.status(201).json({
            publication: newPublication,
            message: "Publication créée !",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
exports.getPublicationID = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const authorId = decodedToken.userId;
        //
        
        const publication = await publicationModel.findById(req.params.id).select('-titre');;


        res.status(201).json({
            "Publication":publication
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
