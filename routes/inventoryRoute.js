// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

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
  "/add-classification",
  utilities.handleErrors(invController.buildNewClassification)
);

//Route to process New Classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassification,
  utilities.handleErrors(invController.addClassification)
);

//Route to New Classification View
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildNewInventory)
);

//Route to process New Inventory
router.post(
  "/add-inventory",
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
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

//Route to handle inventory update form
router.post(
  "/update/",
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
  )



//Route to build managment view
router.get("", utilities.handleErrors(invController.buildManagment));

module.exports = router;
