const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      errors: null,
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/**
 * Account Managment View
 */

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null
  });
}


/**
 * Account Update View
 */

async function buildAccountUpdate(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id);

  let nav = await utilities.getNav();
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account_id,
    account_firstname: accountData["account_firstname"],
    account_lastname: accountData["account_lastname"],
    account_email: accountData["account_email"]
  });
}

/* ****************************************
 *  Process Update
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body;

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  );

  if (updateResult) {
    req.flash(
      "notice",
      `Account details succesfully updated.`
    );
    res.status(201).redirect("/account");
  } else {
    req.flash("notice", "Sorry, the changes failed. Please try again.");
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    });
  }
}

/* ****************************************
 *  Process New Passowrd
 * *************************************** */
async function newPassword(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    const currAccountInfo = await accountModel.getAccountById(account_id)
    req.flash(
      "notice",
      "Sorry, there was an error changing your password."
    );
    res.status(500).render(`account/update-account`, {
      errors,
      title: "Update Account",
      nav,
      account_firstname: currAccountInfo["account_firstname"],
      account_lastname: currAccountInfo["account_lastname"],
      account_email: currAccountInfo["account_email"],
      account_id
    });
  }

  const newPassResult = await accountModel.newPassword(
    account_id,
    hashedPassword
  );

  if (newPassResult) {
    req.flash(
      "notice",
      `Your password has been updated.`
    );
    res.status(201).redirect("/account");
  } else {
    const currAccountInfo = await accountModel.getAccountById(account_id)
    req.flash(
      "notice",
      "Sorry, there was an error changing your password."
    );
    res.status(501).render(`account/update-account`, {
      errors,
      title: "Update Account",
      nav,
      account_firstname: currAccountInfo["account_firstname"],
      account_lastname: currAccountInfo["account_lastname"],
      account_email: currAccountInfo["account_email"],
      account_id
    });
  }
}

async function logout(req, res){
  res.cookie("jwt","",{ maxAge: 0 })
  req.flash(
    "notice",
    "Succesfully logged out."
  );
  res.redirect("/")
}

module.exports = {
  buildLogin,
  accountLogin,
  buildRegister,
  registerAccount,
  buildManagement,
  buildAccountUpdate,
  updateAccount,
  newPassword,
  logout
};
