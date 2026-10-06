const express = require('express');
const { registerUser,logInUser, verifyEmail , UserProfile} = require('../controllers/user.controllers');
const router = express.Router();
const { validateRegister, validateLogin } = require('../controllers/user.validation');
const authenticateUser = require('../middlewares/auth');

// endpoints or routes for Users

router.post('/register',validateRegister, registerUser); // register user route
router.get('/verify-email', verifyEmail); // verify email route
router.post('/login',validateLogin ,logInUser); // login user route
router.get('/user/profile', authenticateUser, UserProfile); //protected route



module.exports = router;