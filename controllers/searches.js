import {db} from "../connect.js";
import {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} from 'obscenity';

//TODO: make this search algorithm more efficient:
export const searchPosts = (req, res) => {

    const searchText = req.query.q;

    // const obscenityMatcher = new RegExpMatcher({
    //     ...englishDataset.build(),
    //     ...englishRecommendedTransformers,
    // });

    // if (obscenityMatcher.hasMatch(searchText)) {
    //     return res.status(400).json({ 
    //         error: 'Search query is unacceptable according to platform guidelines. Cannot perform the search.' 
    //     });
    // }

    const q = "SELECT * FROM posts WHERE title LIKE ? OR `desc` LIKE ? ORDER BY respect DESC";

    const q2 = `SELECT DISTINCT p.*, u.id AS userId, name, username, pfp, 
        (SELECT COUNT(*) FROM upvotes AS upv WHERE upv.postId = p.id) AS upvoteCount
        FROM posts AS p 
        JOIN users AS u ON u.id = p.userId
        LEFT JOIN upvotes AS upv ON p.id = upv.postId
        WHERE p.title LIKE ? OR p.desc LIKE ?
        ORDER BY respect DESC`;

    const values = [`%${searchText}%`, `%${searchText}%`];   

    db.query(q2, values, (err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });

};