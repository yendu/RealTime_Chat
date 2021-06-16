const User=require('../models/user');
const catchAsync=require('../utils/catchAsync')
exports.getAllUsers=catchAsync(async(req,res,next)=>{

   const users=await User.find({});
   res.status(200).json({
       status:'success',
       data:{
           users
       }
   })

});

exports.findAllUsers=async()=>{
    return await User.find({});
}