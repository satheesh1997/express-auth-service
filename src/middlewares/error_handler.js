const MongooseErrors = require('mongoose').Error;


const validationErrorFormat = (err) => {
    let error = {};
    error.message = err._message;
    error.fields = Object.keys(err.errors).map((field)=> ({[field] : err.errors[field].message}));
    return error;
}

const errorHandler = (err, req, res, next) => {

    // Skip for already handled error
    if (res.headersSent) {
        return next(err)
    }

    if(err instanceof MongooseErrors.ValidationError){
        res.status(400).json(validationErrorFormat(err));
    } else {
        res.status(500).json();
    }
}

module.exports = () => errorHandler;