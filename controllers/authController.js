const crypto=require('crypto')
const jwt=require('jsonwebtoken')
const { promisify } = require('util'); 
const catchAsync = require('../utils/catchAsync')
const AppError=require('../utils/appError')
const User=require('../models/user')

const signToken=id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);    
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.login=catchAsync(async(req,res,next)=>{

    const {email, password}=req.body;
    if (!email || !password) {
        return next(new AppError('Provide email and password', 400));
    }
    
    const user = await User.findOne({ email }).select('+password'); 

    // Check if user exist and if password is correct
    if (!user || !(await user.correctPassword(password, user.password))) { // Compare passwords
        return next(new AppError('Incorrect email or password', 401)); // 401 - Unauthorised
    }

    createSendToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
    
    const newUser = await User.create(req.body);


    createSendToken(newUser, 201, res);
});
exports.authenticate = catchAsync(async (req, res, next) => {
    
    let token;
    if(req.headers.authorization&& req.headers.authorization.split(' ')[1]){
        token=req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You must be logged in'), 401);
    }

    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); 

   
    const currentUser = await User.findById(decoded.id); 
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    req.user = currentUser;
    next();
});