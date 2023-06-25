const jwt =require('jsonwebtoken')
const {UserModel} = require("../models/user.model") 
require("dotenv").config()
const authMiddleWare = async(req,res,next)=>{
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token,process.env.secret)
        const {userId} = decodedToken;
        //Checking if user exists
        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(401).json({message:"User not found",ok:false})
        }
        req.body.user = user._id;
        next()
    } catch (error) {
        return res.status(401).json({message:error.message})
    }
}

module.exports = {authMiddleWare}
