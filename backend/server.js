require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION =================

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

// Test database connection
db.query("SELECT 1", (err) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
    } else {
        console.log("MySQL connected successfully!");
    }
});

// ================= HOME =================

app.get("/", (req, res) => {
    res.send("Online Bookstore Backend is Running!");
});

// ================= GET BOOKS =================

app.get("/api/books", (req, res) => {

    db.query("SELECT * FROM books", (err, result) => {

        if (err) {
            console.log("Database query error:", err.message);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);
    });

});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});