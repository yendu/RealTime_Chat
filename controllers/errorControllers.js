
const AppError = require('../utils/appError');
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
// Function for handling duplicate keys
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // Match string between quotes. Get the first element of returned array
    const message = `Duplicate field value: ${value}. Use another value`;
    return new AppError(message, 400);
};
// Function for handling validation errors
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
// Function for handling JWT errors
const handleJWTError = () => new AppError('Invalid JWT. Log in again', 401);
const handleJWTExpiredError = () => new AppError('JWT has expired. Log in again', 401);

// Function for Development Errors
const sendErrorDev = (err, req, res) => {
    // ---- API Errors ----
    if (req.originalUrl.startsWith('/api')) {
        // Sending Status and JSON
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    
    // ---- Front-End Errors ----
    return res.status(err.statusCode).render('error', {
        title: 'Error Occured',
        msg: err.message
    });  
};

// Function for Production Errors
const sendErrorProd = (err, req, res) => {
    // ---- API Errors ----
    if (req.originalUrl.startsWith('/v1')) {
      
        console.error('Error', err);
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
         
        // // else if it's not operational (3rd party error) - don't leak details to the client
        
        // // Sending Generic Status and JSON
        // return res.status(500).json({
        //     status: 'error',
        //     message: 'Something went wrong'
        // });
    }

   
    return res.status(err.statusCode).render('error', {
        title: 'Error Occured',
        msg: 'Try again later'
    });
};


module.exports = (err, req, res, next) => {
    // Default Status Code & Status
    // console.log(req)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err}; 
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};