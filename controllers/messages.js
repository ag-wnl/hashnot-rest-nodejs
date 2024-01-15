import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getMessages = (req, res) => {

    //user can only see messages they send, not all messages
    const q = `SELECT c.*, u.id AS userId, name, pfp FROM postdm AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createdAt DESC`;

    db.query(q, [req.query.postId], (err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });

};

//Currently only allowing 1 message per user for a post
export const addMessages = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged In.")
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid.");

        const checkQuery = "SELECT * FROM postdm WHERE userId = ? AND postId = ?";
        const checkValues = [userInfo.id, req.body.postId];

        db.query(checkQuery, checkValues, (checkErr, checkData) => {
            if(checkErr) {
                return res.status(500).json(checkErr);
            }

            if(checkData.length > 0) {
                //user already has sent 1 message for this post
                return res.status(400).json("You can only send one message per post.");
            } else {
                const q = "INSERT INTO postdm (`desc`,`createdAt`, `userId`, `postId`) VALUES (?)";
                const values = [
                    req.body.desc,
                    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    userInfo.id,
                    req.body.postId
                ]
        
                db.query(q, [values], (err, data) => {
                    if(err) return res.status(500).json(err);
                    return res.status(200).json("Message has been sent!");
                });      
            }
        })
    });
};