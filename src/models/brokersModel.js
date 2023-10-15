const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brokersSchema = new Schema({
    id: { type: String, required: true, index: true },
    brokerName: { type: String, required: true }, // The name of the broker.
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNo: {
        type: String,
        required: true, // Ex format: 123-456-7890 , (123) 456-7890 , 123 456 7890 , 123.456.7890 ,+91 (123) 456-7890
    },
    properties: { type: [String] } // An array of references to Property documents associated with this landlord.
});

const BrokersInfo = mongoose.model('BrokersInfo', brokersSchema, 'BrokersInfo');

module.exports = BrokersInfo;
