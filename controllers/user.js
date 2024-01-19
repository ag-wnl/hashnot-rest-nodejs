import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.uid;
  const q = "SELECT * FROM users WHERE accountUserId=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    // const { password, ...info } = data[0];
    return res.json(data[0]);
  });
};

export const getUserByUserName = (req, res) => {
  const username = req.params.username;
  const q = "SELECT * FROM users WHERE username=?";

  db.query(q, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data[0]);
  });
}

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?, `github`=?,`about`=?,`pfp`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.github,
        req.body.about,
        req.body.pfp,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your profile activities!");
      }
    );
  });
};