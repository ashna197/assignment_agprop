const express = require('express');
const router = express.Router();
const landlordsHandler = require('../controllers/landlordsController');
const authController = require('../controllers/authController')

// Create a new landlord
router.post('/', authController.authenticate, (req, res) => {
    landlordsHandler.createLanlordDetails(req, res)
});

// Retrieve all landlord details
router.get('/', authController.authenticate, (req, res) => {
    landlordsHandler.getAllLandlords(req, res)
});

// Retrieve a specific landlord details by ID
router.get('/:landlordId', authController.authenticate, (req, res) => {
    landlordsHandler.getLandlordById(req, res)
});

// Update a landlord details by ID
router.put('/:landlordId', authController.authenticate, (req, res) => {
    landlordsHandler.updateLandlordDetails(req, res)
});

// Delete a landlord details by ID
router.delete('/:landlordId', authController.authenticate, (req, res) => {
    landlordsHandler.deleteLandlordDetails(req, res)
});

module.exports = router;
