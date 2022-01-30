const BigPromise = require("../middleware/BigPromise");
const CustomError = require("../utils/CustomError");
const sendToken = require("../utils/sendToken");
const sendOtpToPhone = require("../utils/sendOtpToPhone");
const User = require("../models/user");
const crypto = require("crypto");


exports.isRegisteredUser = BigPromise(async (req,res,next)=>{
    const {email,phone} = req.body;

    
    if(!email && !phone){
        return next(new CustomError("Please provide an email or a phone number"),400);
    }

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

    res.status(200).json({
        found: true,
    });
});

exports.signupWithEmail = BigPromise(async (req,res,next)=>{
    const {email,password,name} = req.body;
    let userData = {};

    if(!name || !email || !password){
        return next(new CustomError("Please provide a name, an email and a password"),400);
    }

        const user = await User.create({
            name,
            email,
            password
        });
        sendToken(user,res);
});

exports.signupWithPhone = BigPromise(async (req,res,next)=>{

    const {phone,name} = req.body;

    if(!phone || !name){
        return next(new CustomError("Please provide a name and phone number",400));
    }

        const user = await User.create({
            phoneNumber: phone,
            name
        });

        await sendOtpToPhone(user,res);
});

exports.loginWithEmail = BigPromise(async (req,res,next)=>{
    const user = req.user;
    const {password,email} = req.body;

    if(email){
        if(!password){
            return next(new CustomError("Please enter password"));
        }

        const isValidPassword = await user.isValidPassword(password);
    
        if(!isValidPassword){
            return next(new CustomError("Incorrect password",400));
        }
        sendToken(user,res);
    }
});

exports.verifyOtp = BigPromise(async (req,res,next)=>{
    const {phone,otp} = req.body;

    if(!phone && !otp){
        return next(new CustomError("Please provide mobile number and otp"),400);
    }
    let correctOtp,hasExpired;
    const user = await User.findOne({phoneNumber:phone});

    if(user.phoneLoginOtp && user.phoneLoginOtpExpiry){
        correctOtp =  await crypto.createHash("sha256").update(otp).digest("hex") == user.phoneLoginOtp ? true : false;
        hasExpired = user.phoneLoginOtpExpiry < Date.now();
    }
    else{
        return next(new CustomError("Something went wrong please try requesting otp again",500));
    }
     user.phoneLoginOtp = user.phoneLoginOtpExpiry = undefined;
     await user.save();

    if(!correctOtp){
        return next(new CustomError("Incorrect Otp"),400);
    }


    if(hasExpired){
        return next(new CustomError("OTP has expired",400));
    }

    sendToken(user,res);
});

exports.sendOtp = BigPromise(async(req,res,next)=>{
    const phone = req.body.phone;

    if(!phone){
        return next(new CustomError("Please provide a phone number",400));
    }

    const user = await User.findOne({phoneNumber:phone});

    sendOtpToPhone(user,res);
});

exports.getUserDetails = BigPromise(async (req,res,next)=>{

    const user = req.user;
    user.password = undefined;
    res.status(200).json({
        user,
    });
});