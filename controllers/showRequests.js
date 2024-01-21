import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getRequests = (req, res) => {

    const userId = req.query.userId;
    const q = `SELECT posts.title, postdm.desc, postdm.userId, postdm.postId, postdm.createdAt  
    FROM postdm
    JOIN posts ON postdm.postId = posts.id
    WHERE posts.userId = ?`;

    const values = [userId];

    db.query(q, values, (err, data) => {
        if(err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data);
    });
};
