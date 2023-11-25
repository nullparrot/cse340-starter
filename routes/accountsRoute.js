// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountsController = require("../controllers/accountsController")

//Route to build login page
router.get("/login", accountsController.buildLogin)

module.exports = router