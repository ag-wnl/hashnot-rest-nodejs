import {db} from "../connect.js";

//This is fetching post details from DB and returning data to get request
export const searchPosts = (req, res) => {

    const searchText = req.query.q;
    const q = "SELECT * FROM posts WHERE MATCH(title, `desc`) AGAINST (?) ORDER BY respect DESC";

    const values = [searchText];    
    db.query(q, values, (err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });

};