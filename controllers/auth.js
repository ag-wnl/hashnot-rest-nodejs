import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";


export const register = async (req, res) => {
  const userEmail = req.body.email;
  const userAccountId = req.body.userAccountId;
  const userAccountName = req.body.name;
  const userName = req.body.username;
  try {
    
  //   //Creating User on Firebase Authentication:
  //   const userResponse = await admin.auth().createUser({
  //     email: userEmail,
  //     password: userPassword,
  //     emailVerified: false,
  //     disabled: false,
  //   });
  //   const uid = userResponse.uid;

    //Storing user information in Database:
    const q = "INSERT INTO users (`accountUserId`,`username`,`email`,`name`) VALUE (?)";

    const values = [
      userAccountId,
      userName,
      userEmail,
      userAccountName,
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