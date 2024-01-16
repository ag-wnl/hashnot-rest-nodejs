import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getRequests = (req, res) => {

    const userId = req.query.userId;

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged In.")
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid.");
        
        const q = `SELECT postdm.desc, postdm.userId, postdm.postId
        FROM postdm
        JOIN posts ON postdm.postId = posts.id
        WHERE posts.userId = ?`;

        const values = [userId];

        db.query(q, values, (err, data) => {
            if(err) return res.status(500).json(err);

            return res.status(200).json(data);
        });
    });
};
