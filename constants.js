const CONSTANTS = {
    SECRET_KEY: "CRYPTO_SECRET_KEY",
    MONGO: {
        ERROR_CODES: {
            DUPLICATE: 11000
        }
    },
    PROPERTIES: {
        PROPERTY_TYPES: ['flat', 'apartment', 'house', 'office', 'land'],
        FLAT: ['flat_no', 'floor_no', 'tower_no', 'society_name'],
        APARTMENT: ['apartment_no', 'floor_no'],
        HOUSE: ['house_no'],
        OFFICE: ['tower_no', 'floor_no', 'unit_no'],
        LAND: ['plot_no'],
        ADDRESS: ["pincode", "state", "areaName", "city"]
    },
}
module.exports = CONSTANTS;
