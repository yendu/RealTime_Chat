const Message=require('../models/message');
const catchAsync=require('../utils/catchAsync')

exports.getMessages=catchAsync(async(req,res,next)=>{

    const {senderId, receiverId}=req.body;
    if (!senderId || !receiverId) {
        return next(new AppError('Provide senderId and receiverId', 400));
    }
   const messages=await Message.find({senderId:senderId,receiverId:receiverId});
   res.status(200).json({
       status:'success',
       data:{
           messages
       }
   })

});

exports.createMessage=catchAsync(async(body)=>{
    const newMessage=await Message.create(body);
    
})
