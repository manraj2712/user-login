const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        validate: [validator.isEmail,"Please enter a valid email"],
        lowercase: [true,"Email should be in lowercase"],
        unique:true,
    },
    password:{
        type: String,
        validate: [validator.isStrongPassword,"Password must be min 8 char, should be alphanumeric with symbols"],
    },
    phoneNumber: {
        type: String,
        maxlength: [10,"Mobile number should not exeed 10 digits"],
        minlength: [10, "Mobile number should contain atleast 10 digits"],
        unique:true
    },
    phoneLoginOtp: {
        type: String,
    },
    phoneLoginOtpExpiry: {
        type: Date,
    },

});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
});


userSchema.methods.getToken = async function(){
    const token = await jwt.sign({id: this._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_TOKEN_EXPIRY})
    return token;
}

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateOtp = async function(){
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    this.phoneLoginOtp = await crypto.createHash('sha256').update(otp).digest("hex");

    this.phoneLoginOtpExpiry = Date.now() + 5 * 60 * 1000;
    
    return otp;
}
module.exports = mongoose.model("User",userSchema);