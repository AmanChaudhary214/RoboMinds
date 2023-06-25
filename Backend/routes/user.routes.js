const express = require("express");
const { UserModel } = require("../models/user.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tokenList = {};
require("dotenv").config()
const userRoute = express.Router();



userRoute.get("/", async (req, res) => {
  try {
    const data = await UserModel.find();
    res.send(data)

  } catch (error) {
    res.status(403).json({ error: error.message })
  }
})

userRoute.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  const check = await UserModel.find({ email });
  if (check.length > 0) {
    return res.status(200).json({ "ok": false, "msg": "User already exist" });
  }
  bcrypt.hash(pass, 5, async (err, hash) => {
    try {
      if(err){
        res.send(err.message)
      }else{
        const data = new UserModel({ name, email, pass: hash });
        await data.save();
        res.status(200).json({ "ok": true, "msg": "Registered Successfully" });
      }
    } catch (error) {
      res.status(400).json({ "ok": false, "msg": error.message });
    }

  });
})


userRoute.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    const user = await UserModel.findOne({ email:email });
    if (!user) {
      return res.status(401).json({ msg: "User with this email not found", ok: false })
    }
    const isPasswordSame = await bcrypt.compare(pass, user.pass)
    if (!isPasswordSame) {
      return res.status(401).json({ msg: "Invalid email or password", ok: false })
    }
    const token = jwt.sign({ userId: user._id }, process.env.secret, { expiresIn: '1hr' })
    const refreshToken = jwt.sign({ userId: user._id }, process.env.refresh_secret, { expiresIn: "3hr" })
    const response = {
      "ok": true,
      "token": token,
      "refreshToken": refreshToken,
      "msg": "Login Successfull",
      "id": user._id,
      "userName": user.name
    }
    tokenList[refreshToken] = response
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json({ "ok": false, "msg": error.message });
  }
})



module.exports = {
  userRoute
}
