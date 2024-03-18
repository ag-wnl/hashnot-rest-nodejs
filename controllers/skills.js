import { db } from "../connect.js";

export const getSkills = (req, res) => {

const q = "SELECT * FROM skills";

  db.query(q, [], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
};


export const addSkills = (req, res) => {
  const { userId, skills } = req.body;
  const insertQuery = "INSERT INTO userskillmapper (userId, skillId) VALUES ?";

  const q = "INSERT INTO userskillmapper (userId, skillId) VALUES ?";
  const values = skills.map(skillId => [userId, skillId]);

  db.query(insertQuery, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Skills added successfully", data : data });
  });
}

