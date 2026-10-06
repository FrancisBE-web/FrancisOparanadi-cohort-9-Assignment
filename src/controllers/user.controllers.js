const User = require('../models/user.models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../helpers/email');
require("dotenv").config();


const registerUser = async (req,res) =>{ 
    const { firstName, lastName, email, Techfield, password} = req.body;
    try {
    if (!firstName , !lastName , !email ,!Techfield, !password) {
    return res.status(400).json({message : 'All fields are required'});
   }
    const hashPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
   const user = await User.findOne({email});
  if (user) {
    return res.status(400).json({message : 'User already exists'});
  }
 
  const newUser = await User.create({
    firstName, 
    lastName, 
    email, 
    Techfield, 
    password : hashPassword,
    isVerified : {
        default : false
    },
    verificationToken: token,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 Hours
});
    await newUser.save();
    await sendEmail(email, "Verify your Email Address" ,"Please verify your email" ,token, firstName);
  return res.status(201).json({message : 'Registered successfully Please check your email to verify your account.', user: newUser});
    } catch (e){
        console.log(e);
        return res.status(400).json({message : e.message});
    }
  
}
   // verifying user

   const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    user.isverified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// login user

  const logInUser = async (req, res) =>{
    const { email, password} = req.body;
    try{
        if (!email , !password) {
            return res.status(400).json({ message : 'All fields are required'});
        }
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({ message : 'User not found'});
        }
        if (!user.isverified){
            return res.status(400).json({ message : 'Please verify your email address before logging in.'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : 'Invalid password'});
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, { expiresIn : "1h", })
        return res.status(200).json({message : 'Login successful', user: user, token: token });
    } catch (e){
        console.log(e);
        return res.status(500).json({ message : 'error.message'});
    };
}; 

// protected route UserProfile

    const UserProfile = async (req, res) => {
    try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, logInUser, verifyEmail, UserProfile};