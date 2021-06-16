const express=require('express');
const authController=require('../controllers/authController')
const userController=require('../controllers/userController')
const router=express.Router();

router.post('/login',authController.login);
router.post('/signup',authController.signup);
router.get('/chat',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
   
})
router.use(authController.authenticate);
router.get("/users",userController.getAllUsers)

module.exports=router;
