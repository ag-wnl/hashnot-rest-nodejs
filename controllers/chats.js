import {db} from "../connect.js";
import moment from "moment";

export const getChatList = (req, res) => {
    const userId = req.query.userId;

    const q = `
        SELECT DISTINCT
            CASE
                WHEN \`from\` = ? THEN \`to\`
                ELSE \`from\`
            END AS \`userId\`,
            u.username,
            u.name,
            u.pfp
        FROM
            chats
        JOIN
            users u ON (
                CASE
                    WHEN \`from\` = ? THEN \`to\`
                    ELSE \`from\`
                END
            ) = u.id
        WHERE
            \`from\` = ? OR \`to\` = ?;
    `;
    const values = [userId, userId, userId, userId];

    db.query(q, values, (err, data) => {
        if(err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
}

export const getChats = (req, res) => {
    const userOne = req.query.firstUser;
    const userTwo = req.query.secondUser;

    const q = `
        SELECT chats.*, users.name, users.username, users.pfp
        FROM chats  
        INNER JOIN users ON chats.from = users.id
        WHERE (chats.to = ? AND chats.from = ?) OR (chats.to = ? AND chats.from = ?);
    `;

    const values = [
        userOne,
        userTwo,
        userTwo,
        userOne,
    ];

    db.query(q, values, (err, data) => {
        if(err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
}

export const postChats = (req, res) => {

    const recipient = req.body.sendToUser;
    const sender = req.body.userId;
    const messageContent = req.body.message;

    const q = 'INSERT INTO chats (`from`,`to`, `message`, `createdAt`) VALUES (?, ?, ?, ?)';

    const values = [
        sender,
        recipient,
        messageContent,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    ];

    db.query(q, values, (err, data) => {
        if(err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });
};

