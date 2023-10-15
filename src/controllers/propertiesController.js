const propertiesModel = require('../models/propertiesModel');
const utils = require('../utils');
const landlordsModel = require('../models/landlordsModel');
const brokersModel = require('../models/brokersModel');
const validateProperty = require('../validationCheck/validateProperty');
const { isEmpty } = require('lodash');

/**
 * Create a new property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function createProperty(req, res) {
    try {
        //For checking the validations on req.body
        const errors = await onPreActionValidationOnProperties(req, res);
        if (!isEmpty(errors)) {
            return res.status(400).json(errors)
        }
        req.body['id'] = utils.uuid();
        const property = await propertiesModel.create(req.body);
        delete property._doc._id;
        delete property._doc.__v;
        return res.status(201).json(property);
    } catch (error) {
        return res.status(500).json({ error: `'Error creating the property' : ${error}` });
    }
}

/**
 * Retrieve all properties
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getAllProperties(req, res) {
    try {
        const properties = await propertiesModel.find();
        return res.status(200).json(properties);
    } catch (error) {
        return res.status(500).json({ error: `Error retrieving properties : ${error}` });
    }
};

/**
 * Retrieve a specific property by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function getPropertyById(req, res) {
    try {
        if (!utils.validateUUID(req.params.propertyId)) {
            return res.status(400).json({ detail: `id : ${req.params.propertyId} is not a valid uuid` })
        }
        const property = await propertiesModel.findOne({ id: req.params.propertyId }, { _id: 0, __v: 0 });
        if (!property) {
            return res.status(404).json({ error: 'Property details not found' });
        }
        return res.status(200).json(property);
    } catch (error) {
        return res.status(500).json({ error: `Error retrieving property : ${error}` });
    }
};

/**
 * Update a property by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateProperty(req, res) {
    try {
        //To check the propertyId is a valid uuid or not
        if (!utils.validateUUID(req.params.propertyId)) {
            return res.status(400).json({ detail: `id : ${req.params.propertyId} is not a valid uuid` })
        }
        //To check validations on body passed in the request
        const errors = await onPreActionValidationOnProperties(req, res);
        if (!isEmpty(errors)) {
            return res.status(400).json(errors)
        }
        let options = Object.assign({}, {
            returnOriginal: false,
            projection: { __v: 0, _id: 0 }
        });
        req.body["id"] = req.params.propertyId;
        const updatedProperty = await propertiesModel.findOneAndReplace({ id: req.params.propertyId }, req.body, options);
        if (!updatedProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }
        return res.status(200).json(updatedProperty);
    } catch (error) {
        return res.status(500).json({ error: `Error updating property : ${error}` });
    }
};

/**
 * Delete a property by ID
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function deleteProperty(req, res) {
    try {
        //To check the propertyId is a valid uuid or not
        if (!utils.validateUUID(req.params.propertyId)) {
            return res.status(400).json({ detail: `id : ${req.params.propertyId} is not a valid uuid` })
        }
        const deletedProperty = await propertiesModel.findOneAndDelete({ id: req.params.propertyId });
        if (!deletedProperty) {
            return res.status(404).json({ error: 'Property not found' });
        }
        //To delete the properties from the associated landlords
        await utils.removeDeletedValues(landlordsModel, req.params.propertyId, 'properties')
        //To delete the properties from the brokers
        await utils.removeDeletedValues(brokersModel, req.params.propertyId, 'properties')
        return res.status(204).send(); // No content
    } catch (error) {
        return res.status(500).json({ error: `Error deleting property : ${error}` });
    }
};

/**
 * To check the validations on req.body and validate properties contains valid existing landlords/brokers
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function onPreActionValidationOnProperties(req, res) {
    //To check the validations on req.body
    const checkErrors = validateProperty.validateRequestBody(req.body)
    if (!isEmpty(checkErrors.errors)) {
        return checkErrors.errors;
    }
    if (req.body.landlords) {
        //To validate properties contains valid existing landlords
        const checkValidity = await utils.validateAttribute(landlordsModel, req.body.landlords, 'landlords');
        if (!isEmpty(checkValidity)) {
            return checkValidity;
        }
    }
    if (req.body.brokers) {
        // to validate properties contains valid existing brokers
        const checkValidity = await utils.validateAttribute(brokersModel, req.body.brokers, 'brokers');
        if (!isEmpty(checkValidity)) {
            return checkValidity;
        }
    }

}

module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
};
