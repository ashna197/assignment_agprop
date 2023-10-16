const uuid = require('uuid');
const { differenceWith, isEqual } = require('lodash');

class Utils {
    /**
     * Generates and returns a valid uuid of type version 4
     * @returns {String}
     */
    uuid() {
        return uuid.v4();
    }

    /**
     * To check the properties/landlords/brokers passed in the associated collection exist or not
     * @param {*} model 
     * @param {*} list 
     * @param {*} attributeName 
     * @returns 
     */
    async validateAttribute(model, list, attributeName) {
        let error = {}
        const dbList = await model.find({ id: { $in: list } });
        const listLength = Array.from(new Set(list)).length;
        if (dbList.length !== listLength) {
            // un-matched existing ids are there, need to add them and throw error
            const listInDb = dbList.map(obj => obj['id']);
            //difference with properties/landlords/brokers in db and scimData
            const differenceOfPropertiesIds = differenceWith(list, listInDb, isEqual);
            error = {
                attribute: `${attributeName}`,
                detail: `These ${attributeName} with id : ${differenceOfPropertiesIds} does not exist in our system `
            };
            return error;
        }
    }

    /**
     * To check id is valid uuid or not
     * @param {*} id 
     * @returns 
     */
    validateUUID(id) {
        return uuid.validate(id);
    }

    /**
     * To remove the deleted values from associated collections
     * @param {*} model 
     * @param {*} id 
     * @param {*} attribute 
     */
    async removeDeletedValues(model, id, attribute) {
        await model.updateMany({ [`${attribute}`]: id }, { $pull: { [`${attribute}`]: id } })
    }

    /**
     *To update the asscoiated fields in collection . Ex : if we create a landlord with property x and in that x property update this landlord
     * @param {*} model 
     * @param {*} data 
     * @param {*} filter 
     * @param {*} attribute 
     */
    async updateAssocitedFields(model , data , filter , attribute) {
        await model.updateMany({ id : { $in : filter} }, { $addToSet: { [`${attribute}`]: data } })
    }
}
module.exports = new Utils();
