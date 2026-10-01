const express = require('express');
const { registerUser,logInUser } = require('../controllers/user.controllers');
const router = express.Router();
const { validateRegister, validateLogin } = require('../controllers/user.validation');


router.post('/register',validateRegister, registerUser);
router.post('/login',validateLogin ,logInUser);



module.exports = router;