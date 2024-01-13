const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const publicationController = require("../controllers/publicationController")
const loggedInMiddleware = require("../middleware/auth");
const { route } = require("../app");

//router.use(express.json());

router.post ("/add-admin",userController.addAdmin);
router.post ("/register",userController.register);
router.post ("/login",userController.logIn)
router.post("/author/addPublication",publicationController.addPublication,loggedInMiddleware.loggedMiddleware,loggedInMiddleware.isAuthor)
router.patch("/author/:id",userController.validerAuteur)
router.get("/publication/:id",publicationController.getPublicationID,loggedInMiddleware.isAuthor)
router.get("/posts/author/details",userController.getPublicationAuthenticatedUser,loggedInMiddleware.isAuthor)
module.exports = router;

