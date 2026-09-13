const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Maha@2305",
    database: "online_bookstore"
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err.message);
    } else {
        console.log("MySQL connected successfully!");
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Online Bookstore Backend is Running!");
});

// Get all books
app.get("/api/books", (req, res) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(result);
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});