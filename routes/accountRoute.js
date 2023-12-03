// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountsController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

//Route to build login page
router.get("/login", utilities.handleErrors(accountsController.buildLogin));

//Route to build registration page
router.get(
  "/register",
  utilities.handleErrors(accountsController.buildRegister)
);

//Route to process registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountsController.registerAccount)
);

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkAccountLogin,
    utilities.handleErrors(accountsController.loginAccount)
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
  )

module.exports = router;
