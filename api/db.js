//mysql資料庫連接
import mysql from "mysql2"

export const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "room_system",
    password: "room_system",
    database: "meeting"
});