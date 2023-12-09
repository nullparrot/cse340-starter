const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const inventoryModel = require("../models/inventory-model");

/*  **********************************
 *  Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // valid classification name is 3+ characters and only letters
    body("classification_name")
    .trim()
    .matches(/^[A-z]{3,}$/)
    .withMessage("Classification Name should be at least three chracters long and include only letters.")
    .custom(async (classification_name) => {
      const classificationExists = await inventoryModel.checkExistingClassification(
        classification_name
      );
      if (classificationExists) {
        throw new Error("Classification already exists.");
      }
    }),
    ];
  };

validate.checkClassification = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", { errors, title: "New Classification", nav, classification_name});
    return;
  }
  next();
};

/*  **********************************
 *  Inventory Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // valid classification name is 3+ characters and only letters
  body("classification_id")
  .trim()
  .matches(/[0-9]+/)
  .withMessage("Please select a vehicle classification")
  .custom(async (classification_id) => {
    const classificationExists = await inventoryModel.checkExistingClassificationId(
      classification_id
    );
    if (!classificationExists) {
      throw new Error("Classification doesn't exist.");
    }
  }),
  body("inv_make")
  .trim()
  .matches(/[A-z0-9 ]+/)
  .withMessage("Please include a vehicle make. (Letter, numbers, and spaces accepted)"),
  body("inv_model")
  .trim()
  .matches(/[A-z0-9 ]+/)
  .withMessage("Please include a vehicle model. (Letter, numbers, and spaces accepted)"),
  body("inv_year")
  .trim()
  .matches(/[A-z0-9 ]+/)
  .withMessage("Please include a vehicle year (ex. 2023)."),
  body("inv_description")
  .trim()
  .matches(/[A-z0-9 ]+/)
  .withMessage("Please include a vehicle description. (Letter, numbers, and spaces accepted)"),
  body("inv_image")
  .trim()
  .isLength({min: 3})
  .withMessage("Please include a path to the vehicle image."),
  body("inv_thumbnail")
  .trim()
  .isLength({min: 3})
  .withMessage("Please include a path to the vehicle thumbnail."),
  body("inv_price")
  .trim()
  .matches(/[0-9]+/)
  .withMessage("Please include a vehicle price (ex. 23190)."),
  body("inv_miles")
  .trim()
  .matches(/[0-9]+/)
  .withMessage("Please include a the vehicle miles (ex. 135982)."),
  body("inv_color")
  .trim()
  .matches(/[A-z ]{3,}/)
  .withMessage("Please include a vehicle color (Min. 3 Characters)."),
  ];
};

validate.checkInventory = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelector = await utilities.buildClassificationSelector(classification_id)
    res.render("inventory/add-inventory", { errors, title: "New Inventory", nav, classificationSelector, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color});
    return;
  }
  next();
};

/*  **********************************
 *  Inventory Validation Rules
 * ********************************* */
validate.newInventoryRules = () => {
  return [
    // valid classification name is 3+ characters and only letters
  body("classification_id")
  .trim()
  .matches(/[0-9]+/)
  .withMessage("Please select a vehicle classification")
  .custom(async (classification_id) => {
    const classificationExists = await inventoryModel.checkExistingClassificationId(
      classification_id
    );
    if (!classificationExists) {
      throw new Error("Classification doesn't exist.");
    }
  }),
  body("inv_make")
  .trim()
  .matches(/[A-z0-9 ]+/)
  .withMessage("Please include a vehicle make. (Letter, numbers, and spaces accepted)"),
  body("inv_model")
  .trim()
  .matches(/[A-z0-9 ]+/)
  .withMessage("Please include a vehicle model. (Letter, numbers, and spaces accepted)"),
  body("inv_year")
  .trim()
  .matches(/[A-z0-9 ]+/)
  .withMessage("Please include a vehicle year (ex. 2023)."),
  body("inv_description")
  .trim()
  .matches(/[A-z0-9 ]+/)
  .withMessage("Please include a vehicle description. (Letter, numbers, and spaces accepted)"),
  body("inv_image")
  .trim()
  .isLength({min: 3})
  .withMessage("Please include a path to the vehicle image."),
  body("inv_thumbnail")
  .trim()
  .isLength({min: 3})
  .withMessage("Please include a path to the vehicle thumbnail."),
  body("inv_price")
  .trim()
  .matches(/[0-9]+/)
  .withMessage("Please include a vehicle price (ex. 23190)."),
  body("inv_miles")
  .trim()
  .matches(/[0-9]+/)
  .withMessage("Please include a the vehicle miles (ex. 135982)."),
  body("inv_color")
  .trim()
  .matches(/[A-z ]{3,}/)
  .withMessage("Please include a vehicle color (Min. 3 Characters)."),
  ];
};

validate.checkUpdateData = async (req, res, next) => {
  const { classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
  let errors = [];
  errors = validationResult(req);
  const itemName = `${inv_make} ${inv_model}`
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelector = await utilities.buildClassificationSelector(classification_id)
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelector,
      errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return;
  }
  next();
};

/*  **********************************
 *  Search Validation Rules
 * ********************************* */
validate.searchRules = () => {
  return [
    // valid classification name is 3+ characters and only letters
  body("search_term")
  .trim()
  .isLength({min:1})
  .withMessage("Unable to complete search. A search must contain at least one letter or number.")
  .matches(/^[A-z0-9 ]+$/)
  .withMessage("Unable to complete search. A search can only contain letters, numbers, or space."),
  ];
};

validate.checkSearch = async (req, res, next) => {
const { search_term } = req.body;
let errors = [];
errors = validationResult(req);
if (!errors.isEmpty()) {
  let nav = await utilities.getNav();
  res.render("inventory/search", { errors, title: `Search results for '${search_term}'`, nav, grid:null});
  return;
}
next();
};

module.exports = validate;
