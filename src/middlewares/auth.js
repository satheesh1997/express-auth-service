const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const tokenJWT = authHeader.split(' ')[1];

        jwt.verify(tokenJWT, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            if (user.isActive == false) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        return res.sendStatus(401);
    }
}

const authenticateSessionToken = (req, res, next) => {
    const authToken = req.cookies._token;

    // check if the _token is present in cookies
    if (authToken) {
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

            // if the _token verification failed
            if (err) {

                // if uri is / or /users/login proceed to next
                if (req.originalUrl === "/" || req.originalUrl === '/users/login/') next();

                // if the uri is doesnt belongs to login pages throw 403
                else return res.sendStatus(403);
            }
            else {
                if (user.isActive == false) return res.sendStatus(403);
                // if the uri is / redirect to /services 
                if (req.originalUrl == "/") return res.redirect('/services/');
                
                // if the uri is not / proceed further
                req.user = user;
                next();
            }
        });
    } else {
        // if the uri belongs to login page proceed further otherwise send 401 status
        if (req.originalUrl !== '/users/login/' && req.originalUrl !== '/') return res.sendStatus(401);
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
module.exports.authenticateSessionToken = authenticateSessionToken;