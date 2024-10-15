import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Protocols
app.get('/api/protocols', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM protocols');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/protocols', async (req, res) => {
  const { date, name, number, secretary, rows } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO protocols (date, name, number, secretary, rows) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [date, name, number, secretary, JSON.stringify(rows)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/protocols/:id', async (req, res) => {
  const { id } = req.params;
  const { date, name, number, secretary, rows } = req.body;
  try {
    const result = await pool.query(
      'UPDATE protocols SET date = $1, name = $2, number = $3, secretary = $4, rows = $5 WHERE id = $6 RETURNING *',
      [date, name, number, secretary, JSON.stringify(rows), id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/protocols/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM protocols WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Regions
app.get('/api/regions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM regions');
    res.json(result.rows.map(row => row.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/regions', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO regions (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/regions/:name', async (req, res) => {
  const { name } = req.params;
  try {
    await pool.query('DELETE FROM regions WHERE name = $1', [name]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Executors
app.get('/api/executors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM executors');
    res.json(result.rows.map(row => row.name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/executors', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO executors (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/executors/:name', async (req, res) => {
  const { name } = req.params;
  try {
    await pool.query('DELETE FROM executors WHERE name = $1', [name]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});