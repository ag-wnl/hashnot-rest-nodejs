import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {initializeApp} from "firebase/app";
import admin from "firebase-admin";
import credentials from "../serviceAccountKey.json" assert { type: "json" };
  

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export const register = async (req, res) => {
  try {
    
    //Creating User on Firebase Authentication:
    const userResponse = await admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
      // emailVerified: false,
      // disabled: false,
    });
    const uid = userResponse.uid;

    //Storing user information in Database:
    const q = "INSERT INTO users (`accountUserId`,`username`,`email`,`name`) VALUE (?)";

    const values = [
        uid,
        req.body.username,
        req.body.email,
        req.body.name,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
    });

    res.status(200).json("User has been created in Authentication Server!");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = async (req , res) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(req.body.email);

    const token = jwt.sign({ uid: userRecord.uid }, "secretkey");
    res.cookie("accessToken", token, {
      httpOnly: true,
    }).status(200).json({ uid: userRecord.uid, email: userRecord.email });  
  
  } catch(error) {
    res.status(500).json(error);  
  }
};

export const logout = (req, res) => {
    res.clearCookie("accessToken", {
      secure: true,
      sameSite: "none"
    }).status(400).json("user logged out.")
}