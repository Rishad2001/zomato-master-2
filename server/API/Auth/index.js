import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Router = express.Router();

//Models
import { UserModel } from "../../database/user";

/*
Route         /signup
Descrip       Signup with email and password
Params        None
Access        Public
Method        POST
*/

Router.post("/signup", async(req,res) => {
  try {
    const { email, password, fullname, phoneNumber} = req.body.credentials;

    //Check whether email or phone number exists
    const checkUserByEmail = await UserModel.findOne({ email });
   const checkUserByPhone = await UserModel.findOne({ phoneNumber });

   if(checkUserByEmail || checkUserByPhone) {
     return res.json({ error: "User already Exists"});
   }

   //hashing and salting
   const bcryptSalt = await bcrypt.genSalt(8);

   const hashedPassword = await bcrypt.hash(password, bcryptSalt);

//DB
   await UserModel.create({
    ...req.body.credentials,
    password: hashedPassword     
   });

   //JWT Auth Token
   const token = jwt.sign({user: {fullname, email}}, "ZomatoApp");

   return res.status(200).json({token});

  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

export default Router;

//Aradhana
//encrypted - 45t1ywh895%%bjhg%%y8719880 -> yhajkgggggggggggguy782178319 ->
