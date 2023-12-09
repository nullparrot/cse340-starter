const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/**
 * Build the Detail view For Inventory Listing
 */

Util.buildDetailView = async function (data) {
  let print;
  const moneyFormetter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
  const milesFormatter = new Intl.NumberFormat("en-US");

  if (data.length > 0) {
    car = data[0];
    print = '<div id="inv-detail">';
    print +=
      '<img src="' +
      car.inv_image +
      '" alt="Image of ' +
      car.inv_make +
      " " +
      car.inv_model +
      ' on CSE Motors" />';
    print += '<div id="inv-detail-breakdown">';
    print += "<p><strong>Make: </strong>" + car.inv_make + "</p>";
    print += "<p><strong>Model: </strong>" + car.inv_model + "</p>";
    print += "<p><strong>Year: </strong>" + car.inv_year + "</p>";
    print +=
      "<p><strong>Miles: </strong>" +
      milesFormatter.format(car.inv_miles) +
      "</p>";
    print += "<p><strong>Color: </strong>" + car.inv_color + "</p>";
    print +=
      "<p><strong>Price: </strong>" +
      moneyFormetter.format(car.inv_price) +
      "</p>";
    print += "<p>" + car.inv_description + "</p>";
    print += "</div>";
    print += "</div>";
  }
  return print;
};

/* **************************************
 * Build the classification selector
 * ************************************ */
Util.buildClassificationSelector = async function (classification_id) {
  let classifications = await invModel.getClassifications();
  let selector = "";
  if (classification_id != "undefined") {
    selector = `<label for="classification_id">Classification</label><select name="classification_id" id="classification_id" required><option value="" disabled>Select an option</option>`;
  } else {
    selector =
      '<label for="classification_id">Classification</label><select name="classification_id" id="classification_id" required><option value="" disabled selected>Select an option</option>';
  }
  classifications.rows.forEach((row) => {
    selector += '<option value= "' + row.classification_id + '"';
    if (classification_id == row.classification_id) {
      selector += " selected";
    }
    selector += ">";
    selector += row.classification_name;
    selector += "</option>";
  });
  selector += "</select>";
  return selector;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
