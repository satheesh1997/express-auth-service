const MongooseErrors = require('mongoose').Error;


const errorHandler = (err, req, res, next) => {

    // Skip for already handled error
    if (res.headersSent) {
        return next(err)
    }

    if(err instanceof MongooseErrors.ValidationError){
        res.status(400).json(err);
    }
}

module.exports = () => errorHandler;