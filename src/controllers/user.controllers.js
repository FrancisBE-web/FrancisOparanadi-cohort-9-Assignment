const User = require('../models/user.models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();


const registerUser = async (req,res) =>{ 
    const { firstName, lastName, email, Techfield, password} = req.body;
    try {
    if (!firstName , !lastName , !email ,!Techfield, !password) {
    return res.status(400).json({message : 'All fields are required'});
   }
    const hashPassword = await bcrypt.hash(password, 10);
   const user = await User.findOne({email});
  if (user) {
    return res.status(400).json({message : 'User already exists'});
  }
 
  const newUser = await User.create({
    firstName, 
    lastName, 
    email, 
    Techfield, 
    password : hashPassword });
  return res.status(201).json({message : 'Registered successfully', user: newUser});
    } catch (e){
        console.log(e);
        return res.status(400).json({message : e.message});
    }
  
}


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
            return res.status(400).json({ message : 'User not verfied'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : 'Invalid password'});
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, { expiresIn : "1h", })
        return res.status(200).json({message : 'Login successful', user: user, token: token });
    } catch (e){
        console.log(e);
        return res.status(500).json({ message : 'Internal server error'});
    };
}; 

module.exports = { registerUser, logInUser};