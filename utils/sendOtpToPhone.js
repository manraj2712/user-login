const CustomError = require('./CustomError');

module.exports = sendOtpToPhone = async (user,res)=>{
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    const client = require('twilio')(accountSid, authToken);
    const otp = await user.generateOtp();
    await user.save();
    const phoneNumber = user.phoneNumber;
    try{
        await client.messages.create({
            body: `Your verification code is ${otp}`,
            from: fromNumber,
            to: `+91${phoneNumber}`
        });
        res.status(200).json({
            success:true,
            message: "OTP sent successfully"
        });
    }catch(error){
        console.log(error);
        res.status(200).json({
            success:false,
            message: "Some error occured please try again"
        });
    }
}