const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./model/db');  // Import the pool from db.js
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/routes'));

// Serve index.html on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API route to fetch data from the database (GET method)
app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Nama"');  // Make sure the query is correct
        res.status(200).json(result.rows);  // Send data as response
    } catch (err) {
        console.error("Error saat mengambil data:", err.message);
        res.status(500).json({ error: 'Terjadi kesalahan pada server', details: err.message });
    }
});

// API route to insert data into the database (POST method)
app.post('/api/data', async (req, res) => {
    const { ayah } = req.body;  // Get the 'ayah' data from the request body

    // Log the data received to verify
    console.log("Data received:", req.body);

    // Validate the data
    if (!ayah || typeof ayah !== 'string' || ayah.trim() === "") {
        return res.status(400).json({ error: "Nama Ayah harus diisi dan berupa string!" });
    }

    try {
        // Insert data into the database
        const result = await pool.query(
            'INSERT INTO "Nama" ("Ayah") VALUES ($1) RETURNING *',
            [ayah]
        );
        console.log('Data berhasil ditambahkan:', result.rows[0]);
        res.status(201).json(result.rows[0]);  // Send the newly inserted data as response
    } catch (err) {
        console.error("Error saat menambah data:", err.message);
        res.status(500).json({ error: 'Terjadi kesalahan pada server', details: err.message });
    }
});

// 404 handler for any other routes
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
