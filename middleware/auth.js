const jwt = require("jsonwebtoken");
const User = require("../models/user")

module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    User.findOne({ _id: userId })
      .then((user) => {
        if (user) {
          req.auth = {
            userId: userId,
            role: user.role
          };
          next();
        } else {
          res.status(401).json({ error: "User doesn't exist" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
module.exports.isAdmin  = (req, res, next) => {
    try {
        if (req.auth.role==="admin"){
            next()
        }else{
            res.status(403).json({error : "no access to this route"})
        }
    }catch{
        res.status(401).json({error : error.message})    
    }
}
module.exports.isAuthor  = (req, res, next) => {
      try {
          if (req.auth.role==="author"){
                console.log(req.auth.userId)
              next()
          }else{
              res.status(403).json({error : "no access to this route"})
          }
      }catch{
          res.status(401).json({error : error.message})    
      }

}
