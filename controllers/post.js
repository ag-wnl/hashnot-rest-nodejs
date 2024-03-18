import {db} from "../connect.js";
import moment from "moment";

  
export const getPosts = (req, res) => {
    const userId = req.query.userId;
    const postSort = req.query.sort === undefined ? "highest" : req.query.sort;
    const teamSize = req.query.teamSize;
    let q;

    // SELECT DISTINCT p.*, u.id AS userId, name, username, pfp, 
    // (SELECT COUNT(*) FROM upvotes AS upv WHERE upv.postId = p.id) AS upvoteCount,
    // GROUP_CONCAT(s.skill) AS skills
    // FROM posts AS p 
    // JOIN users AS u ON u.id = p.userId
    // LEFT JOIN relations AS r ON p.userId = r.followedUserId
    // LEFT JOIN upvotes AS upv ON p.id = upv.postId
    // LEFT JOIN post_skills AS ps ON ps.postId = p.id
    // LEFT JOIN skills AS s ON ps.skillId = s.id
    // WHERE r.followerUserId = ? OR p.userId = ?

    // SELECT DISTINCT p.*, u.id AS userId, name, username, pfp, 
    // (SELECT COUNT(*) FROM upvotes AS upv WHERE upv.postId = p.id) AS upvoteCount
    // FROM posts AS p 
    // JOIN users AS u ON (u.id = p.userId)
    // LEFT JOIN relations AS r ON (p.userId = r.followedUserId) 
    // LEFT JOIN upvotes AS upv ON (p.id = upv.postId)
    // WHERE (r.followerUserId = ? OR p.userId = ?)

    q = `SELECT DISTINCT p.*, u.id AS userId, name, username, pfp, 
    (SELECT COUNT(*) FROM upvotes AS upv WHERE upv.postId = p.id) AS upvoteCount,
    GROUP_CONCAT(s.skill) AS skills
    FROM posts AS p 
    JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relations AS r ON (p.userId = r.followedUserId)
    LEFT JOIN upvotes AS upv ON (p.id = upv.postId)
    LEFT JOIN post_skills AS ps ON (ps.postId = p.id)
    LEFT JOIN skills AS s ON (ps.skillId = s.id)
    WHERE (r.followerUserId = ? OR p.userId = ?)`;


    if (req.query.objective === "Hackathon") {
        q += " AND (p.objective = 'Hackathon')";
    } else if (req.query.objective === "Project") {
        q += " AND (p.objective = 'Project')";
    }

    if (teamSize !== undefined && teamSize !== "1" && !isNaN(teamSize)) {
        q += ` AND p.team_size = ${teamSize}`;
    }

    // if (req.query.domains && req.query.domains !== undefined) {
    //     const domainsArray = req.query.domains.split(',');
    //     const domainConditions = domainsArray.map((domain) => {
    //         return `FIND_IN_SET('${domain}', p.domain)`;
    //     }).join(' AND ');

    //     q += ` AND (${domainConditions})`;
    // }

    if (postSort === "recent") {
        q += " GROUP BY p.id ORDER BY p.createdAt DESC";
    } else if (postSort === "highest") {
        q += " GROUP BY p.id ORDER BY upvoteCount DESC";
    } else {
        q += " GROUP BY p.id";
    }

    const values = [userId, userId];
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data);
    });

};


export const getCurrentUserPosts = (req, res) => {
    const q = `SELECT DISTINCT p.*, u.id AS userId, name, username, pfp, 
            (SELECT COUNT(*) FROM upvotes AS upv WHERE upv.postId = p.id) AS upvoteCount,
            GROUP_CONCAT(s.skill) AS skills
        FROM posts AS p 
        JOIN users AS u ON u.id = p.userId
        LEFT JOIN upvotes AS upv ON p.id = upv.postId
        LEFT JOIN post_skills AS ps ON ps.postId = p.id
        LEFT JOIN skills AS s ON ps.skillId = s.id
        WHERE p.userId = ?
        GROUP BY p.id`

    const values = [req.query.userId];
    
    db.query(q, values, (err, data) => {
        if(err) return res.status(500).json(err);

        return res.status(200).json(data);
    });
}

const addSkills = (postId, userId, skills, res) => {
    const insertQuery = "INSERT INTO post_skills (skillId, postId) VALUES ?";
    const values = skills.map(skillId => [skillId, postId]);
  
    db.query(insertQuery, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json({ message: "Skills added successfully", data : data });
    });
  }
 
export const addPost = (req, res) => {
    const q = "INSERT INTO posts (`title`, `desc`, `img`, `createdAt`, `userID`, `objective`, `team_size`) VALUES (?)";

    const values = [
        req.body.title,
        req.body.desc,
        req.body.img,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        req.body.userId,
        req.body.objective,
        req.body.sliderValue
    ]

    db.query(q, [values], (err, data) => {
        if(err) return res.status(500).json(err);

        
        const postId = data.insertId;
        addSkills(postId, req.body.userId, req.body.skills, res);
    });
    
};

export const deletePost = (req, res) => {
    const q =
        "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
        return res.status(403).json("You can only delete your post")
    });
};