import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelations = (req, res) => {
  const q = "SELECT followerUserId FROM relations WHERE followedUserId = ?";
  const currentProfileUserId = req.query.followedUserId;

  db.query(q, [currentProfileUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(
        data.map((relation) => relation.followerUserId)
      );
  });
};

export const addRelations = (req, res) => {
  
  const followerUserId = req.query.curUserId;
  const followedUserId = req.query.userId;
  const q = "INSERT INTO relations (`followerUserId`,`followedUserId`) VALUES (?)";
  const values = [followerUserId , followedUserId];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Follower has been added");
  });

};

export const deleteRelations = (req, res) => {
  const followerUserId = req.query.curUserId;
  const followedUserId = req.query.userId;

  const q = "DELETE FROM relations WHERE `FollowerUserId` = ? AND `followedUserId` = ?";

  db.query(q, [followerUserId, followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Unfollowed User.");
  });
  
};
