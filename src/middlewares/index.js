const customErrorHandler = require('./error_handler')
const { authenticateJWT, authenticateMachineToken } = require('./auth');

module.exports.userAuthentication = authenticateJWT;
module.exports.machineAuthentication = authenticateMachineToken;
module.exports.errorHandler = customErrorHandler;