const express=require('express')
const userRouter=require('./routes/userRoutes')
const app=express();
const globalErrorHandler = require('./controllers/errorControllers');
const AppError = require('./utils/appError');

app.use(express.json({ limit: '10kb' })); 
app.use('/v1/user',userRouter);

app.all('*',(req,res,next)=>{
   next(new AppError('Cant find the url',404));
})

app.use(globalErrorHandler)

module.exports=app;