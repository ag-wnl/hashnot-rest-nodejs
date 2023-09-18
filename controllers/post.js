import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {

    const userId = req.query.userId;
    const postSort = req.query.sort || "highest";
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged In.")
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid.");

        let q;

        if (userId !== "undefined") {
            q = `SELECT p.*, u.id AS userId, name, username, pfp, 
                
                 FROM posts AS p 
                 JOIN users AS u ON (u.id = p.userId) 
                 LEFT JOIN upvotes AS upv ON (p.id = upv.postId)
                 WHERE p.userId = ?`;
    
            if (postSort === "recent") {
                q += " ORDER BY p.createdAt DESC";
            } else if (postSort === "highest") {
                q += " GROUP BY p.id ORDER BY upvoteCount DESC";
            }
        } else {
            q = `SELECT DISTINCT p.*, u.id AS userId, name, username, pfp, 
                (SELECT COUNT(*) FROM upvotes AS upv WHERE upv.postId = p.id) AS upvoteCount
                 FROM posts AS p 
                 JOIN users AS u ON (u.id = p.userId)
                 LEFT JOIN relations AS r ON (p.userId = r.followedUserId) 
                 LEFT JOIN upvotes AS upv ON (p.id = upv.postId)
                 WHERE r.followerUserId = ? OR p.userId = ?`;
    
            if (postSort === "recent") {
                q += " ORDER BY p.createdAt DESC";
            } else if (postSort === "highest") {
                q += " GROUP BY p.id ORDER BY upvoteCount DESC";
            }
        }

        const values = (userId !== "undefined") ? [userId] : [userInfo.id, userInfo.id];    
        db.query(q, values, (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

export const addPost = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not Logged In.")
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid.");

        const q = "INSERT INTO posts (`title`, `desc`, `img`, `createdAt`, `userID`) VALUES (?)";
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("Post has been Uploaded.");
        });
    });
};

export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
    
        const q =
            "DELETE FROM posts WHERE `id`=? AND `userId` = ?";
    
        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
            return res.status(403).json("You can only delete your post")
        });
    });
};