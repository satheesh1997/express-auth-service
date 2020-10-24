const jwt = require('jsonwebtoken');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const tokenJWT = authHeader.split(' ')[1];

        jwt.verify(tokenJWT, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        if (req.originalUrl !== '/users/login/') return res.sendStatus(401);
        next();
    }
}

const authenticateMachineToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const machineToken = authHeader.split(' ')[1];

        if (machineToken !== process.env.ACCESS_TOKEN_SECRET) return res.sendStatus(403);
        next();
    } else {
        return res.sendStatus(401)
    }
}

module.exports.authenticateJWT = authenticateJWT;
module.exports.authenticateMachineToken = authenticateMachineToken;