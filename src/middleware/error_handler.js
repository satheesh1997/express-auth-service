const MongooseErrors = require('mongoose').Error;


const errorHandler = (err, req, res, next) => {

    // Skip for already handled error
    if (res.headersSent) {
        return next(err)
    }

    if(err instanceof MongooseErrors.ValidationError){
        console.log(err);
        res.status(500).json({"error": "Server Down"});
    }
}

module.exports = () => errorHandler;