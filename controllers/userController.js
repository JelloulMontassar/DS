const { response } = require("../app");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user")
const publicationModel = require("../models/publication");

exports.addAdmin = (req,res,next)=>{
    
          const user = new userModel({
              login : req.body.login,
              motdepasse:req.body.login,
              role:"admin",
              telephone:req.body.telephone,
              nom:req.body.nom,
              prenom:req.body.prenom,
              statut:"V"
          })
          user.save().then((response)=>{
              const newUser = response.toObject()
              res.status(201).json({
                  user:newUser,
                  message:"Utilisateur Créé ! ",
              })
          })
          .catch((error)=>res.status(400).json({error}))
      
}
exports.register = (req,res,next)=>{
    
    const user = new userModel({
        login : req.body.login,
        motdepasse:req.body.login,
        telephone:req.body.telephone,
        nom:req.body.nom,
        prenom:req.body.prenom,
    })
    user.save().then((response)=>{
        const newUser = response.toObject()
        res.status(201).json({
            user:newUser,
            message:"Utilisateur Créé !!!! ",
        })
    })
    .catch((error)=>res.status(400).json({error}))

}
  
exports.logIn = (req, res, next) => {
    userModel.findOne({ login: req.body.login })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Login ou mot de passe incorrecte" });
        }
  
        bcrypt.compare(req.body.motdepasse, user.motdepasse)
          .then((valid) => {
            if (!valid) {
                console.log(user);  

              return res.status(401).json({ message: "Login ou mot de passe incorrecte" });
            }
  
            res.status(200).json({
              token: jwt.sign({ userId: user._id ,role:user.role}, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  };
module.exports.validerAuteur = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findOne({ _id: req.params.id });
        console.log(user);
        if (!user) {
          return res.status(404).send("Utilisateur non trouvé");
        }
    
       
        const telephone = String(user.telephone);
        console.log(telephone)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(telephone, saltRounds);
    
        var updatevalue = { statut: "V",motdepasse:hashedPassword } ;
        var options = { new: true }
    
        const aa = await userModel.findByIdAndUpdate({ _id: id }, { $set: updatevalue });
        if (!aa) {
            console.log("Update failed.");
            return res.status(500).send("Update failed");
        }

        res.status(200).json(updatevalue);
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
    };
exports.getPublicationAuthenticatedUser = async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
            const authorId = decodedToken.userId;
    
            const user = await userModel.findById(authorId).populate('refereces');
    
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }
    
            const publications = user.refereces;
            
            res.status(200).json({ publications });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error." });
        }
    };
    