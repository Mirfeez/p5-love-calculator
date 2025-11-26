// index.js (Node.js backend for Love Calculator)

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Path to database file (db.json in the same folder)
const dbPath = path.join(__dirname, "db.json");

// Function: Read database file
function readDB() {
    if (!fs.existsSync(dbPath)) {
        // Initialize if not present
        fs.writeFileSync(dbPath, JSON.stringify({ results: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

// Function: Write database file
function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ---- API ROUTES ----

// 1. Get all results
app.get("/api/data", (req, res) => {
    const db = readDB();
    res.json(db.results);
});

// 2. Add/save a result
app.post("/api/save", (req, res) => {
    const db = readDB();
    const newEntry = {
        hisName: req.body.hisName,
        herName: req.body.herName,
        score: req.body.score,
        datetime: req.body.datetime
    };
    db.results.push(newEntry);
    writeDB(db);
    res.json({ success: true, entry: newEntry });



    db.results.push(newEntry);
    writeDB(db);
    res.json({ success: true, entry: newEntry });
});

// 3. Delete one result by id
app.delete("/api/results/:id", (req, res) => {
    const db = readDB();
    const id = Number(req.params.id);
    const originalLength = db.results.length;
    db.results = db.results.filter(r => r.id !== id);
    writeDB(db);
    res.json({ success: true, deleted: originalLength !== db.results.length });
});

// 4. Clear all results
app.post("/api/clear", (req, res) => {
    writeDB({ results: [] });
    res.json({ success: true });
});

// ---- Run Server ----
const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
