const Joi = require('joi');

const registerSchema = Joi.object({
    firstName : Joi.string().required(),
    lastName : Joi.string().required(),
    email : Joi.string().email().required(),
    Techfield : Joi.string().required(),
    password : Joi.string().min(8).required().pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/).messages({
        'string.pattern.base': 'Password must contain both letters and numbers'
    }),

});

const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required(),

});

const validateRegister = (req,res, next) =>{
    const {error} = registerSchema.validate(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }
    next();
}

const validateLogin = (req,res, next) =>{
    const {error} = loginSchema.validate(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }
    next();
}

module.exports = { validateRegister, validateLogin };