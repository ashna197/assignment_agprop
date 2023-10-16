const CONSTANTS = require('../constants')
const jwt = require('jsonwebtoken')

/**
 * To generate token
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function generateToken(req, res) {
    const body = req.body;
    var token = jwt.sign({ prop: "auth" }, CONSTANTS.SECRET_KEY); // we can extend this logic , for just sending the token
    res.header('token', token);
    return res.status(200).json(token);
}

/**
 * To authenticate the token for validation
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(400).json({ message: 'You dont have permissions' });
        }
        const token = authorization.replace('Bearer ', "");
        const decode = jwt.verify(token, CONSTANTS.SECRET_KEY);
        req.user = decode;
        next();

    } catch (e) { console.log(e); }
}

module.exports = {
    generateToken, authenticate
}
