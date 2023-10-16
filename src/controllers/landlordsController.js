const landlordsModel = require('../models/landlordsModel');
const utils = require('../utils');
const validateLandlord = require('../validationCheck/validateBrokerOrLandlord');
const { isEmpty } = require("lodash");
const propertiesModel = require('../models/propertiesModel');
const CONSTANTS = require('../constants')

/**
 * Create a new landlord
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function createLanlordDetails(req, res) {
    try {
        //For checking the validations on req.body
        const error = await onPreActionValidations(req, res);
        if (!isEmpty(error)) {
            return res.status(400).json(error)
        }
        req.body['id'] = utils.uuid();
        const landlord = await landlordsModel.create(req.body);
        if (req.body.properties) {
            await utils.updateAssocitedFields(propertiesModel, req.body['id'], req.body.properties, "landlords")
        }
        delete landlord._doc._id;
        delete landlord._doc.__v;
        return res.status(201).json(landlord);
    } catch (error) {
        if (error.code === CONSTANTS.MONGO.ERROR_CODES.DUPLICATE) {
            return res.status(409).json({ error: `emailid already exist` });
        }
        return res.status(500).json({ error: `Error creating the landlord : ${error}` });
    }
};

/**
 * Retrieve all landlords
 * @param {*} req 
 * @param {*} res 
 */
async function getAllLandlords(req, res) {
    try {
        const landlords = await landlordsModel.find();
        return res.status(200).json(landlords);
    } catch (error) {
        return res.status(500).json({ error: `Error retrieving landlords : ${error}` });
    }
};

/**
 * Retrieve a specific landlord by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getLandlordById(req, res) {
    try {
        //To validate the landlordId passed in params is valid uuid or not
        if (!utils.validateUUID(req.params.landlordId)) {
            return res.status(400).json({ detail: `id : ${req.params.landlordId} is not a valid uuid` })
        }
        const landlord = await landlordsModel.findOne({ id: req.params.landlordId }, { _id: 0, __v: 0 });
        if (!landlord) {
            return res.status(404).json({ error: 'Landlord details not found' });
        }
        res.status(200).json(landlord);
    } catch (error) {
        return res.status(500).json({ error: `Error retrieving landlord : ${error}` });
    }
};

/**
 * Update a landlord by Id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateLandlordDetails(req, res) {
    try {
        //To check the landlordId is a valid uuid or not
        if (!utils.validateUUID(req.params.landlordId)) {
            return res.status(400).json({ detail: `id : ${req.params.landlordId} is not a valid uuid` })
        }
        //To check the validations on body passed in the request
        const errors = await onPreActionValidations(req, res);
        if (!isEmpty(errors)) {
            return res.status(400).json(errors);
        }
        let options = Object.assign({}, {
            returnOriginal: false,
            projection: { __v: 0, _id: 0 }
        });
        req.body["id"] = req.params.landlordId;
        const updatedLandlord = await landlordsModel.findOneAndReplace({ id: req.params.landlordId }, req.body, options);
        if (!updatedLandlord) {
            return res.status(404).json({ error: 'Landlord Details not found' });
        }
        if (req.body.properties) {
            await utils.updateAssocitedFields(propertiesModel, req.body['id'], req.body.properties, "landlords")
        }
        return res.status(200).json(updatedLandlord);
    } catch (error) {
        if (error.code === CONSTANTS.MONGO.ERROR_CODES.DUPLICATE) {
            return res.status(409).json({ error: `emailid already exist` });
        }
        return res.status(500).json({ error: `Error updating landlord : ${error}` });
    }
};

/**
 * Delete a landlord by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function deleteLandlordDetails(req, res) {
    try {
        if (!utils.validateUUID(req.params.landlordId)) {
            return res.status(400).json({ detail: `id : ${req.params.landlordId} is not a valid uuid` })
        }
        const deletedLandlord = await landlordsModel.findOneAndDelete({ id: req.params.landlordId });
        if (!deletedLandlord) {
            return res.status(404).json({ error: 'Landlord not found' });
        }
        //To delete the landlords from the associated properties
        await utils.removeDeletedValues(propertiesModel, req.params.landlordId, 'landlords')
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ error: `Error deleting landlord : ${error}` });
    }
};

/**
 * To check the validations on req.body and validate landlords contains valid existing properties
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function onPreActionValidations(req, res) {
    const checkError = validateLandlord.validateRequestBody(req.body)
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
    createLanlordDetails,
    getAllLandlords,
    getLandlordById,
    updateLandlordDetails,
    deleteLandlordDetails,
};
