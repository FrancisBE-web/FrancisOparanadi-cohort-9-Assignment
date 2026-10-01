const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName : {
        type: String,
        required : true
    },
    lastName : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        minlength : 8,
        required : true,
        match : [/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must contain both letters and numbers']
    },
    Techfield : {
        type : String,
        required : true,
        enum : ["Frontend Development", "UI/UX", "Backend Development", "Cyber Security","Digital Markerting","Data Analysis"]
    },
    createdAt : {
        type: Date,
        default : Date.now
    },
    updatedAt : {
        type: Date,
        default : Date.now
    },
    isverified : {
        type : Boolean,
        default : false
    },

}, {timestamps: true, versionkey : false});

const User = mongoose.model('User', userSchema);

module.exports = User;
