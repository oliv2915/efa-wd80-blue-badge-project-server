const jwt = require("jsonwebtoken");
const {UserModel} = require("../models");

const validateJWT = async (req, res, next) => {
    try {
        if (req.method == "OPTIONS") return next(); // ignore preflight checks
    
        if (!req.headers.authorization) return res.status(403).json({message: "Forbidden"}); // if no auth header found, access is Forbidden
    
        const { authorization } = req.headers; // get authorization header
        
        const payload = authorization ? jwt.verify(authorization.includes("Bearer") ? authorization.split(" ")[1] : authorization, process.env.JWT_SECRET) : undefined; // verify authorization token is valid, if not, set payload to undefined

        if (!payload) return res.status(401).json({message: "Not Authorized"});  // if payload is invalid, deny access
            
        let foundUser = await UserModel.findOne({ // attempt to find a user based on the payload data
            where: {username: payload.username}
        });
        
        if (!foundUser) return res.status(401).json({message: "Not Authorized"}); // if no user found, deny access
                     
        req.user = foundUser; // add user to req obj
        return next(); // return next()
 
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "Session Token Expired. Login to get a new Session Token"});
        } else {
            return res.status(500).json({message: "Error"});
        }
    }

};

module.exports = validateJWT;