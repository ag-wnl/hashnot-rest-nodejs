import {db} from "../connect.js";
import {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} from 'obscenity';

//TODO: make this search algorithm more efficient:
export const searchPosts = (req, res) => {

    const obscenityMatcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });

    const searchText = req.query.q;

    if (obscenityMatcher.hasMatch(searchText)) {
        return res.status(400).json({ 
            error: 'Search query is unacceptable according to platform guidelines. Cannot perform the search.' 
        });
    }

    const q = "SELECT * FROM posts WHERE title LIKE ? OR `desc` LIKE ? ORDER BY respect DESC";
    const values = [`%${searchText}%`, `%${searchText}%`];   

    db.query(q, values, (err, data) => {
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });

};