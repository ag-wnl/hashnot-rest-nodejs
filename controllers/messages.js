import { db } from "../connect.js";

export const getMessages = (req, res) => {

    const q = `SELECT dm.*, u.id AS userId, name, pfp FROM postdm AS dm JOIN users AS u ON (u.id = dm.userId) WHEREdm.postId = ? ORDER BY dm.createdAt DESC`;

    db.query(q, [req.query.postId], (err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    })

}