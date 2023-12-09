// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const validate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build Product Listing by Inventory Id
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

//Route to New Classification View
router.get(
  "/add-classification",utilities.checkLogin,
  utilities.handleErrors(invController.buildNewClassification)
);

//Route to process New Classification
router.post(
  "/add-classification",utilities.checkLogin,
  invValidate.classificationRules(),
  invValidate.checkClassification,
  utilities.handleErrors(invController.addClassification)
);

//Route to New Classification View
router.get(
  "/add-inventory",utilities.checkLogin,
  utilities.handleErrors(invController.buildNewInventory)
);

//Route to process New Inventory
router.post(
  "/add-inventory",utilities.checkLogin,
  invValidate.inventoryRules(),
  invValidate.checkInventory,
  utilities.handleErrors(invController.addInventory)
);

//Route to pass through inventory data
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//Route to edit inventory item
router.get(
  "/edit/:inv_id",utilities.checkLogin,
  utilities.handleErrors(invController.editInventoryView)
)

//Route to handle inventory update form
router.post(
  "/update/",utilities.checkLogin,
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
  )

//Route to show delete confirmation view
router.get(
  "/delete/:inv_id",utilities.checkLogin,
  utilities.handleErrors(invController.deleteConfirmView)
)

//Route to delete inventory item
router.post(
  "/delete/",utilities.checkLogin,
  utilities.handleErrors(invController.deleteInventory)
)

//Route
router.post(
  "/search/",
  validate.searchRules(),
  validate.checkSearch,
  utilities.handleErrors(invController.buildBySearchTerm)
)

//Route to build managment view
router.get("",utilities.checkLogin, utilities.handleErrors(invController.buildManagment));

module.exports = router;
