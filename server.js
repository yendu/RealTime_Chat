const mongoose=require('mongoose')
const dotenv=require('dotenv')
const httpServer=require('http')

dotenv.config({path:'./config.env'});



mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>console.log('Connected successfully'));

const server=httpServer.createServer((req,res)=>{
   console.log("working");
});

server.listen(process.env.PORT,()=>{
    console.log("Server started ");
});
