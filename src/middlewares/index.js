const customErrorHandler = require('./error_handler')
const { authenticateJWT, authenticateMachineToken, authenticateSessionToken } = require('./auth');

module.exports.tokenAuthentication = authenticateJWT;
module.exports.machineAuthentication = authenticateMachineToken;
module.exports.sessionAuthentication = authenticateSessionToken;
module.exports.errorHandler = customErrorHandler;