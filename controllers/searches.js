import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

//This is fetching post details from DB and returning data to get request
export const searchPosts = (req, res) => {

    const searchText = req.query.q;
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged In.")
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid.");

        const x = `SELECT DISTINCT p.*, u.id AS userId, name, username, pfp FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relations AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
        ORDER BY p.createdAt DESC`;

        const q = "SELECT * FROM posts WHERE MATCH(title, `desc`) AGAINST (?) ORDER BY respect DESC";

        const values = [searchText];    
        db.query(q, values, (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};