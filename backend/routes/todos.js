const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET = "your_jwt_secret";

// Middleware to verify token
const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token.split(" ")[1], SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// Create a Todo
router.post("/", authenticate, async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    try {
        const newTodo = await pool.query(
            "INSERT INTO todos (user_id, title, completed) VALUES ($1, $2, false) RETURNING *",
            [req.user.id, title]
        );
        res.status(201).json(newTodo.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Todos with Usernames
router.get("/", async (req, res) => {
    try {
        const todos = await pool.query(`
            SELECT todos.id, todos.title, todos.completed, users.username
            FROM todos
            JOIN users ON todos.user_id = users.id
        `);
        res.json(todos.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Logged-in User's Todos
router.get("/my", authenticate, async (req, res) => {
    try {
        const todos = await pool.query(
            "SELECT id, title, completed FROM todos WHERE user_id = $1",
            [req.user.id]
        );
        res.json(todos.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle Todo Completed (Only Owner Can Update)
router.put("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await pool.query(
            "UPDATE todos SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, req.user.id]
        );

        if (todo.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized or Todo not found" });
        }

        res.json(todo.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a Todo (Only Owner Can Delete)
router.delete("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *", [id, req.user.id]);

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized or Todo not found" });
        }

        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
