const crypto=require('crypto')
const jwt=require('jsonwebtoken')
const user=require('../models/user')
const catchAsync = require('../utils/catchAsync')
const AppError=require('../utils/catchAsync')

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