const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must have minimum of 8 characters'],
        select: false // Won't show up in output
    },
   
});

userSchema.pre('save', async function(next) {
   
    if (!this.isModified('password')) return next();

   
    this.password = await bcrypt.hash(this.password, 12); 
    next();
});

// Instance Method - Check if entered password and hashed password are the 'same'
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};



// User Model
const User = mongoose.model('User', userSchema);

// Exporting User Model
module.exports = User;