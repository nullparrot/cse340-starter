const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build Vehicle Detail View
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getDetailByInventoryId(inventory_id);
  const print = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const className =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/detail", {
    title: className,
    nav,
    print,
  });
};

/* ****************************************
 *  Deliver Management view
 * *************************************** */
invCont.buildManagment = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Deliver New Classification view
 * *************************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "New Classification",
    nav,
    errors: null,
  });
};

// Process New Classification
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;

  const addClassResult = await invModel.addClassification(classification_name);
  let nav = await utilities.getNav();
  if (addClassResult) {
    console.log(addClassResult);
    req.flash("notice", `New Classification "${classification_name}" added.`);
    res.status(201).render("./inventory/management", {
      title: "Inventory Managment",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, adding the classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "New Classification",
      nav,
      classification_name,
    });
  }
};

/**
 * Deliver New Inventory View
 */
invCont.buildNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationSelector = await utilities.buildClassificationSelector();
  res.render("./inventory/add-inventory", {
    title: "New Inventory",
    nav,
    errors: null,
    classificationSelector,
  });
};

/**
 * Process New Inventory
 */
invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  const addInventoryResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );
  let nav = await utilities.getNav();
  if (addInventoryResult) {
    console.log(addInventoryResult);
    req.flash("notice", `${inv_make} ${inv_model} added to inventory.`);
    res.status(201).render("./inventory/management", {
      title: "Inventory Managment",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, adding the vehicle to inventory failed.");
    let classificationSelector = await utilities.buildClassificationSelector(classification_id);
    res
      .status(501)
      .res.render("inventory/add-inventory", {
        errors,
        title: "New Inventory",
        nav,
        classificationSelector,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      });
  }
};

module.exports = invCont;
