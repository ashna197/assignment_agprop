const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const addressSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  areaName: {
    type: String,
    required: true,
  }
});

const propertiesSchema = new Schema({
  id: { type: String, required: true, index: true },
  propertyName: { type: String }, //The name or title of the property.
  description: { type: String }, // A description of the property.
  address: addressSchema, // property's address
  price: { type: Number, required: true }, // price or rent for the property
  propertyType: { type: Object, required: true }, // The type of property (e.g., flat ,apartment, house, office , land)
  bedrooms: { type: Number }, // number of bedrooms in the property.
  bathrooms: { type: Number }, // number of bathrooms in the property
  size: { type: Number, required: true }, // size of the property (in square feet or square meters).
  images: { type: [String] }, // An array of image URLs for the property
  landlords: { type: [String] }, // An array of references to Landlord documents associated with this property.
  brokers: { type: [String] } // // An array of references to Broker documents associated with this property.
});

const PropertiesInfo = mongoose.model('PropertiesInfo', propertiesSchema, 'PropertiesInfo');

module.exports = PropertiesInfo;
