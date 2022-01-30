const User = require("../models/user");
const CustomError = require("../utils/CustomError");
const BigPromise = require("./BigPromise");
const jwt = require("jsonwebtoken");

exports.isRegistered = BigPromise(async (req,res,next)=>{
    const {email,phone} = req.body;
    let registeredUser;
    
    if(email){
        registeredUser = await User.findOne({email:email});
    }

    if(phone){
        registeredUser = await User.findOne({phoneNumber:phone});
    }
    if(!registeredUser){
        return next(new CustomError("User not registered",400));
    }
    req.user = registeredUser;

    next();
});

exports.isLoggedIn = BigPromise(async (req,res,next)=>{
    const {token} = req.body;

    if(!token){
        return next(new CustomError("Please login to access this route",400));
    }

    const isValidToken = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(isValidToken.id);

    if(!user){
        return next(new CustomError("Token not valid"),400);
    }

    req.user = user;
    next();
});