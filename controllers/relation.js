import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelations = (req, res) => {
  const q = "SELECT followerUserId FROM relations WHERE followedUserId = ?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((relation) => relation.followerUserId));
  });
};

export const addRelations = (req, res) => {
  
  const sessionUserId = req.user.uid;
  const q = "INSERT INTO relations (`followerUserId`,`followedUserId`) VALUES (?)";
  const values = [sessionUserId, req.body.userId];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("follow has been added");
  });

};

export const deleteRelations = (req, res) => {
  const sessionUserId = req.user.uid;
  const q = "DELETE FROM relations WHERE `FollowerUserId` = ? AND `followedUserId` = ?";

  db.query(q, [sessionUserId, req.query.userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Unfollowed User.");
  });
  
};
