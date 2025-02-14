const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();
const SECRET = "your_jwt_secret"; // Change in production

// Register User
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) return res.status(401).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user.rows[0].id }, SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
