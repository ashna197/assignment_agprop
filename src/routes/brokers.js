const express = require('express');
const router = express.Router();
const brokersHandler = require('../controllers/brokersController');
const authController = require('../controllers/authController')

// Create a new broker deatils
router.post('/', authController.authenticate, (req, res) => {
    brokersHandler.createBrokerDetails(req, res)
});

// Retrieve all brokers
router.get('/', authController.authenticate, (req, res) => {
    brokersHandler.getAllBrokers(req, res)
});

// Retrieve a specific broker details by ID
router.get('/:brokerId', authController.authenticate, (req, res) => {
    brokersHandler.getBrokerById(req, res)
});

// Update a broker details by ID
router.put('/:brokerId', authController.authenticate, (req, res) => {
    brokersHandler.updateBrokerDetails(req, res)
});

// Delete a broker deatils by ID
router.delete('/:brokerId', authController.authenticate, (req, res) => {
    brokersHandler.deleteBrokerDetails(req, res)
});

module.exports = router;
