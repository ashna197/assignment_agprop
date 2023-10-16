const express = require('express');
const router = express.Router();
const propertiesHandler = require('../controllers/propertiesController');
const authController = require('../controllers/authController')

// Create a new property
router.post('/', authController.authenticate, (req, res) => {
  propertiesHandler.createProperty(req, res);
});

// Retrieve all properties
router.get('/', authController.authenticate, (req, res) => {
  propertiesHandler.getAllProperties(req, res);
});

// Retrieve a specific property by ID
router.get('/:propertyId', authController.authenticate, (req, res) => {
  propertiesHandler.getPropertyById(req, res);
});

// Update a property by ID
router.put('/:propertyId', authController.authenticate, (req, res) => {
  propertiesHandler.updateProperty(req, res);
});

// Delete a property by ID
router.delete('/:propertyId', authController.authenticate, (req, res) => {
  propertiesHandler.deleteProperty(req, res);
});

module.exports = router;
