const express=require('express')
const path=require('path')
const userRouter=require('./routes/userRoutes')
const messageRouter=require('./routes/messageRoutes')
const app=express();
const globalErrorHandler = require('./controllers/errorControllers');
const AppError = require('./utils/appError');

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json({ limit: '10kb' })); 

app.use('/v1/user',(req,res,next)=>{
   console.log('router')
   console.log(req);
},userRouter);
app.use('/v1/message',messageRouter)

app.all('*',(req,res,next)=>{
   // console.log(req)
   next(new AppError('Cant find the url',404));
})

app.use(globalErrorHandler)

module.exports=app;