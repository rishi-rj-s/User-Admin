const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: [validator.isEmail, 'Please enter a valid email address'] 
    },
    password: { 
        type: String, 
        required: true, 
    },
    profilePic : {
        type: String
    }
}, {
    timestamps: true
});
const User = mongoose.model('user', userSchema);

module.exports = User;