const sendToken = async (user,res) => {
    const token = await user.getToken();
    user.password = undefined;
    res.status(200).json({
        success: true,
        token,
        user
    });
}



module.exports = sendToken;