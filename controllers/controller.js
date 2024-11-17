const pool = require('../model/db'); 

const getData = async (req, res) => {
  try {
    const result = await pool.query('SELECT "Ayah" FROM "Nama"');
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server', details: err.message });
  }
};

const addData = async (req, res) => {
  const { ayah } = req.body;

  // Validate data
  if (!ayah || typeof ayah !== 'string' || ayah.trim() === "") {
    return res.status(400).json({ error: "Nama Ayah harus diisi dan berupa string!" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO "Nama" ("Ayah") VALUES ($1) RETURNING *',
      [ayah]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saat menambah data:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server', details: err.message });
  }
};

module.exports = { getData, addData };
