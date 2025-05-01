const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Database setup
const db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) console.error(err.message);
    console.log("Connected to SQLite database.");
});

// Create table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT,
        category TEXT,
        price REAL,
        image_url TEXT
    )
`);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Add item
app.post('/add_item', (req, res) => {
    const { name, brand, category, price, image_url } = req.body;
    db.run(
        `INSERT INTO wishlist (name, brand, category, price, image_url) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, brand, category, price, image_url || 'https://via.placeholder.com/200'],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

// Get all items
app.get('/get_items', (req, res) => {
    db.all("SELECT * FROM wishlist", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Delete item
app.delete('/delete_item/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM wishlist WHERE id = ?", id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, changes: this.changes });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});