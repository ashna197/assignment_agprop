const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const landlordsSchema = new Schema({
    id: { type: String, required: true, index: true },
    landlordName: { type: String, required: true }, // The name of the landlord.
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    properties: { type: [String] }, // An array of references to Property documents associated with this landlord.
});

const LandlordsInfo = mongoose.model('LandlordsInfo', landlordsSchema, 'LandlordsInfo');

module.exports = LandlordsInfo;
