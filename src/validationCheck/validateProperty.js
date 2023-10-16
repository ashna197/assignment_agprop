const { isEmpty, isString, isArray, isInteger } = require("lodash");
const CONSTANTS = require('../constants');
const validator = require('validator');
const uuid = require('uuid');

class ValidateProperty {

    /**
     * To validate the request body 
     * @param {*} reqBody 
     * @returns 
     */
    validateRequestBody(reqBody) {
        let errors = [];

        if (reqBody.propertyName) {
            if (!isString(reqBody.propertyName) || isEmpty(reqBody.propertyName.trim())) {
                this.pushErrorDetails('propertyName should be of string and cannot be empty string', 'propertyName', errors)
            }
        }
        if (reqBody.description) {
            if (!isString(reqBody.description) || isEmpty(reqBody.description.trim())) {
                this.pushErrorDetails('description should be of string and cannot be empty string', 'description', errors)
            }
        }
        if (!reqBody.price || !isInteger(reqBody.price) || reqBody.price < 0) {
            this.pushErrorDetails('price of the property is required and should be of type positive integer', 'price', errors)
        }
        if (reqBody.bedrooms) {
            if (!isInteger(reqBody.bedrooms) || reqBody.bedrooms < 0) {
                this.pushErrorDetails('bedrooms should be of type positive integer', 'bedrooms', errors)
            }
        }
        if (reqBody.bathrooms) {
            if (!isInteger(reqBody.bathrooms) || reqBody.bathrooms < 0) {
                this.pushErrorDetails('bathrooms should be of type positive integer', 'bathrooms', errors)
            }
        }

        if (!reqBody.size || !isInteger(reqBody.size) || reqBody.size < 0) {
            this.pushErrorDetails('size of the property is required and should be of type positive integer', 'size', errors)
        }

        if (reqBody.images) {
            if (!isArray(reqBody.images)) {
                this.pushErrorDetails('images should of type array', 'images', errors)
            } else {
                reqBody.images.forEach((ob) => {
                    if (!isString(ob) || validator.isURL(ob, { require_protocol: true, protocols: ['https'] })) {
                        this.pushErrorDetails('images should be of type array<string> and should be valid https urls', 'images', errors)
                    }
                })
            }
        }
        if (reqBody.landlords) {
            if (!isArray(reqBody.landlords)) {
                this.pushErrorDetails('landlords should of type array', 'landlords', errors)
            } else {
                reqBody.landlords.forEach((ob) => {
                    if (!isString(ob) || !(uuid.validate(ob))) {
                        this.pushErrorDetails('landlords should be of type array<string> and contains valid uuid', 'landlords', errors)
                    }
                })
            }
        }

        if (reqBody.brokers) {
            if (!isArray(reqBody.brokers)) {
                this.pushErrorDetails('brokers should of type array', 'brokers', errors)
            } else {
                reqBody.brokers.forEach((ob) => {
                    if (!isString(ob) || !(uuid.validate(ob))) {
                        this.pushErrorDetails('brokers should be of type array<string> and contains valid uuid', 'brokers', errors)
                    }
                })
            }
        }

        if (!reqBody.address) {
            this.pushErrorDetails('address is required', 'address', errors);
        }
        if (!reqBody.propertyType) {
            this.pushErrorDetails('propertyType is required', 'propertyType', errors)
        }

        const isPresent = (arr, target) => target.every(key => arr.includes(key));

        if (reqBody.address) {
            const requiredRequestProperty = CONSTANTS.PROPERTIES.ADDRESS
            const passedRequestProperty = Object.keys(reqBody.address);
            if (!isPresent(passedRequestProperty, requiredRequestProperty)) {
                this.pushErrorDetails(`address must contains fields : ${requiredRequestProperty}`, 'propertyType', errors)
            }
        }

        if (reqBody.propertyType) {
            const propertyTypeAttributes = CONSTANTS.PROPERTIES.PROPERTY_TYPES;
            const propertyType = reqBody.propertyType;
            const type = Object.keys(propertyType)[0];

            if (!propertyTypeAttributes.includes(type)) {
                this.pushErrorDetails('propertyType can be of type : flat |apartment | house | office | land', 'propertyType', errors)
            }
            else {
                const requiredRequestProperty = CONSTANTS.PROPERTIES[type.toUpperCase()];

                const passedRequestProperty = Object.keys(reqBody.propertyType[type]);

                if (!isPresent(passedRequestProperty, requiredRequestProperty)) {
                    this.pushErrorDetails(`${type} must contains fields : ${requiredRequestProperty}`, 'propertyType', errors)
                }
            }


        }
        return { errors }
    }

    /**
     * Collects all errors
     * @param {*} error 
     * @param {*} attribute 
     * @param {*} collector 
     */
    pushErrorDetails(error, attribute, collector) {
        collector.push({ Attribute: attribute || '', detail: error });
    }
}

module.exports = new ValidateProperty();
