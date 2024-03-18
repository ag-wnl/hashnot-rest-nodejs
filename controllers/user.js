import { db } from "../connect.js";

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
  
  const skillsQuery = `
    SELECT s.skill
    FROM userskillmapper usm
    INNER JOIN skills s ON usm.skillId = s.id
    WHERE usm.userId=?
  `;

  db.query(q, [username], (err, userData) => {
    if (err) return res.status(500).json(err);

    if (userData.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userData[0].id;

    db.query(skillsQuery, [userId], (err, skillsData) => {
      if (err) return res.status(500).json(err);

      // Extract the skillIds from the skillsData array
      const skillIds = skillsData.map(skill => skill.skill);

      const userDataWithSkills = {
        ...userData[0], // Include the user's details
        skills: skillIds  // Include the user's skillIds
      };

      return res.json(userDataWithSkills);
    });
  });
}


const addSkills = (req, res) => {
  const { userId, skills } = req.body;
  const insertQuery = "INSERT INTO userskillmapper (userId, skillId) VALUES ?";
  const values = skills.map(skillId => [userId, skillId]);

  db.query(insertQuery, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Skills added successfully", data : data });
  });
}

export const updateUser = (req, res) => {
  // const token = req.cookies.accessToken;
  // if (!token) return res.status(401).json("Not authenticated!");

  let q = "UPDATE users SET";
  let params = []
  let paramIndex = 0;

  if (req.body.name !== "") {
      q += "`name`=?, ";
      params.push(req.body.name);
  }

  if (req.body.city !== "") {
      q += "`city`=?, ";
      params.push(req.body.city);
  }

  if (req.body.website !== "") {
      q += "`website`=?, ";
      params.push(req.body.website);
  }

  if (req.body.github !== "") {
      q += "`github`=?, ";
      params.push(req.body.github);
  }

  if (req.body.about !== "") {
      q += "`about`=?, ";
      params.push(req.body.about);
  }

  if (req.body.pfp !== null) {
      q += "`pfp`=?, ";
      params.push(req.body.pfp);
  }

  if (req.body.coverPic !== "") {
      q += "`coverPic`=?, ";
      params.push(req.body.coverPic);
  }

  q = q.slice(0, -2);
  q += " WHERE id=?";
  params.push(req.body.userId);

  db.query(q, params, (err, data) => {
      if (err) res.status(500).json(err);

      if (data.affectedRows > 0) {
        addSkills(req, res);
      } else {
        return res.status(403).json("You can update only your profile activities!");
      }
    }
  );
 
};