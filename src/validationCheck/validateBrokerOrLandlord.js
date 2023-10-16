const { isEmpty, isString, isArray } = require("lodash");
const validator = require('validator');
const uuid = require('uuid');

class ValidateBrokerOrLandlord {

    /**
     * To Validate the request body
     * @param {*} requestBody 
     * @returns 
     */
    validateRequestBody(requestBody) {

        let errors = [];

        if (isEmpty(requestBody.email.trim())) {
            this.pushErrorDetails('email is required and cannot be empty', 'email', errors)
        }
        if (!isString(requestBody.email)) {
            this.pushErrorDetails('email should be of type string', 'email', errors)
        }
        if (!validator.isEmail(requestBody.email)) {
            this.pushErrorDetails('Invalid email address', 'email', errors)
        }
        if (!isString(requestBody.phoneNo)) {
            this.pushErrorDetails('phoneNo should be of type string', 'phoneNo', errors)
        }
        if (typeof requestBody.phoneNo === 'string') {
            if (!requestBody.phoneNo.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/)) {
                this.pushErrorDetails('Invalid phoneNo --> Ex Format : 123-456-7890 , (123) 456-7890 , 123 456 7890 , 123.456.7890 ,+91 (123) 456-7890', 'phoneNo', errors)
            }
        }

        if (requestBody.properties) {
            if (!isArray(requestBody.properties)) {
                this.pushErrorDetails('properties should of type array', 'properties', errors)
            } else {
                requestBody.properties.forEach((ob) => {
                    if (!isString(ob) || !(uuid.validate(ob))) {
                        this.pushErrorDetails('properties should be of type array<string> and contains valid uuid', 'properties', errors)
                    }
                })
            }
        }

        if (requestBody.brokerName) {
            if (isEmpty(requestBody.brokerName.trim()) || !isString(requestBody.brokerName)) {
                this.pushErrorDetails('brokerName is required and should be of type string', 'brokerName', errors)
            }
        }

        if (requestBody.landlordName) {
            if (isEmpty(requestBody.landlordName.trim()) || !isString(requestBody.landlordName)) {
                this.pushErrorDetails('landlordName is required and should be of type string', 'landlordName', errors)
            }
        }
        return { errors };
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

module.exports = new ValidateBrokerOrLandlord();
