const CONSTANTS = require('../constants')
const jwt=require('jsonwebtoken')

async function generateToken(req,res)
{
    const body=req.body;
    var token =jwt.sign({prop:"auth"},CONSTANTS.SECRET_KEY);
    res.header('token', token);
    return res.status(200).json(token);
}

async function authenticate(req, res , next){
    try {
        //console.log(req);
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
    generateToken , authenticate
}
