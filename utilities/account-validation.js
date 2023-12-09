const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");
const bodyParser = require("body-parser");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = (account_email, account_password) => {
    return [
      // valid email is required and cannot already exist in the database
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("Email address required to login."),

  // password is required and must be strong password
  body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Please enter a valid password."),
    ];
  };

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", { errors, title: "Login", nav, account_email,});
    return;
  }
  next();
};

/*  **********************************
 *  Account Update Data Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database, unless its the user's email
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        // const accountInfo = await accountModel.getAccountById(accountId)  ^ account_email == accountInfo["account_email"]
        if (emailExists) {
          throw new Error("Email exists. Please use different email");
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to update account
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  let errors = [];
  const currAccountInfo = await accountModel.getAccountById(account_id)
  errors = validationResult(req)
  if (account_email == currAccountInfo["account_email"]){
    errors["errors"] = errors["errors"].filter((err) => err.msg != "Email exists. Please use different email")
  }
    if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render(`account/update-account`, {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    });
    return;
  }
  next();
};

/*  **********************************
 *  New Passwor Data Validation Rules
 * ********************************* */
validate.newPasswordRules = (account_email, account_password) => {
  return [
// password is required and must be strong password
body("account_password")
  .trim()
  .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("Please enter a valid password."),
  ];
};

validate.checkPasswordData = async (req, res, next) => {
const { account_id } = req.body;
let errors = [];
errors = validationResult(req);
if (!errors.isEmpty()) {
  const currAccountInfo = await accountModel.getAccountById(account_id)
  let nav = await utilities.getNav();
    res.render(`account/update-account`, {
      errors,
      title: "Update Account",
      nav,
      account_firstname: currAccountInfo["account_firstname"],
      account_lastname: currAccountInfo["account_lastname"],
      account_email: currAccountInfo["account_email"],
      account_id
    });
    return;
}
next();
};

module.exports = validate;
