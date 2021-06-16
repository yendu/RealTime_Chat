const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    senderId:{
        type:String,
        required:[true]
    },
    receiverId:{
        type:String,
        required:[true]
    },
    messageContent:{
        type:String,
        required:[true]
    }
})

const message=mongoose.model('Message',messageSchema);
module.exports=message;