const mongoose=require('mongoose')
const dotenv=require('dotenv')
const httpServer=require('http')
const {Server}=require('socket.io')
const userController=require('./controllers/userController')
const messageController=require('./controllers/messageController')


dotenv.config({path:'./config.env'});
const app=require('./app');
const { Socket } = require('dgram');



mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>console.log('Connected successfully'));

// const server=httpServer.createServer((req,res)=>{
//    console.log("working");
// });

// app.listen(process.env.PORT,()=>{
    
//     console.log("Server started ");
// });
const server=httpServer.createServer(app)
const io=new Server(server)

io.on('connection',(socket)=>{
    console.log("socket started")
    socket.on('message',(msg)=>{
        console.log(msg);
        socket.in(msg).emit('data',msg);
        //filter the message
        //create message
    })
    socket.on('room',async(roomid)=>{
        console.log(roomid)
        socket.join(roomid);
        const users= await userController.findAllUsers();
        socket.emit(roomid+"users",users);
        
        
    })
})
server.listen(process.env.PORT,()=>{
    console.log("Server Started");
})