// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountsController = require("../controllers/accountsController")

//Route to build login page
router.get("/login", utilities.handleErrors(accountsController.buildLogin))

//Route to build registration page
router.get("/register", utilities.handleErrors(accountsController.buildRegister))

//Route to process registration
router.post('/register', utilities.handleErrors(accountsController.registerAccount))

module.exports = router