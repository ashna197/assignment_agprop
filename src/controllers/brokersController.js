const brokersModel = require('../models/brokersModel');
const utils = require('../utils');
const validateBroker = require('../validationCheck/validateBrokerOrLandlord');
const { isEmpty } = require("lodash");
const propertiesModel = require('../models/propertiesModel');
const CONSTANTS = require('../constants')

/**
 * To Create a new broker
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function createBrokerDetails(req, res) {
    try {
        //For checking the validations on req.body
        const errors = await onPreActionValidations(req, res);
        if (!isEmpty(errors)) {
            return res.status(400).json(errors)
        }
        req.body['id'] = utils.uuid();
        const broker = await brokersModel.create(req.body);
        delete broker._doc._id;
        delete broker._doc.__v;
        return res.status(201).json(broker);
    } catch (error) {
        if (error.code === CONSTANTS.MONGO.ERROR_CODES.DUPLICATE) {
            return res.status(409).json({ error: `emailid already exist` });
        }
        return res.status(500).json({ error: `Error creating the broker : ${error}` });
    }
};


/**
 * Retrieve all brokers
 * @param {*} req 
 * @param {*} res 
 */
async function getAllBrokers(req, res) {
    try {
        const brokers = await brokersModel.find();
        return res.status(200).json(brokers);
    } catch (error) {
        return res.status(500).json({ error: `Error retrieving brokers : ${error}` });
    }
};

/**
 * Retrieve a specific broker by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getBrokerById(req, res) {
    try {
        //To validate the brokerId passed in params is valid uuid or not
        if (!utils.validateUUID(req.params.brokerId)) {
            return res.status(400).json({ detail: `id : ${req.params.brokerId} is not a valid uuid` })
        }
        const broker = await brokersModel.findOne({ id: req.params.brokerId }, { _id: 0, __v: 0 });
        if (!broker) {
            return res.status(404).json({ error: 'Broker details not found' });
        }
        return res.status(200).json(broker);
    } catch (error) {
        return res.status(500).json({ error: `Error retrieving broker : ${error}` });
    }
};

/**
 * Update a broker by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateBrokerDetails(req, res) {
    try {

        //To check the brokerId is a valid uuid or not
        if (!utils.validateUUID(req.params.brokerId)) {
            return res.status(400).json({ detail: `id : ${req.params.brokerId} is not a valid uuid` })
        }
        //To check the validations on body passed in the request
        const errors = await onPreActionValidations(req, res);
        if (!isEmpty(errors)) {
            return res.status(400).json(errors)
        }
        let options = Object.assign({}, {
            returnOriginal: false,
            projection: { __v: 0, _id: 0 }
        });
        req.body["id"] = req.params.brokerId;
        const updatedBroker = await brokersModel.findOneAndReplace({ id: req.params.brokerId }, req.body, options);
        if (!updatedBroker) {
            return res.status(404).json({ error: 'Broker not found' });
        }
        return res.status(200).json(updatedBroker);
    } catch (error) {
        if (error.code === CONSTANTS.MONGO.ERROR_CODES.DUPLICATE) {
            return res.status(409).json({ error: `emailid already exist` });
        }
        return res.status(500).json({ error: `Error updating broker : ${error}` });
    }
};

/**
 * Delete a broker by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function deleteBrokerDetails(req, res) {
    try {
        //To check the brokerId is a valid uuid or not
        if (!utils.validateUUID(req.params.brokerId)) {
            return res.status(400).json({ detail: `id : ${req.params.brokerId} is not a valid uuid` })
        }
        const deletedBroker = await brokersModel.findOneAndDelete({ id: req.params.brokerId });
        if (!deletedBroker) {
            return res.status(404).json({ error: 'Broker not found' });
        }
        //To delete the broker from the associated properties
        await utils.removeDeletedValues(propertiesModel, req.params.brokerId, 'brokers')
        return res.status(204).send(); // No content
    } catch (error) {
        return res.status(500).json({ error: `Error deleting broker : ${error}` });
    }
};

/**
 * To check the validations on req.body and validate brokers contains valid existing properties
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function onPreActionValidations(req, res) {
    const checkError = validateBroker.validateRequestBody(req.body)
    if (!isEmpty(checkError.errors)) {
        return checkError.errors;
    } else if (req.body.properties) {
        const checkValidity = await utils.validateAttribute(propertiesModel, req.body.properties, 'properties');
        if (!isEmpty(checkValidity)) {
            return checkValidity;
        }
    }
    return;
}

module.exports = {
    createBrokerDetails,
    getAllBrokers,
    getBrokerById,
    updateBrokerDetails,
    deleteBrokerDetails,
};
