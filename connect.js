import mysql from "mysql2"


export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Agnideep2017",
    database: "hashnot"
})