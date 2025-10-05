const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_03ykBpzhxsIo@ep-summer-mountain-ad7nf8ih-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
async function initDB() {
  try {
    // Create healthcare records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS healthcare_records (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        type VARCHAR(100) NOT NULL,
        value VARCHAR(255) NOT NULL,
        unit VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create food diet records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_diet_records (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        meal_type VARCHAR(50) NOT NULL,
        food_name VARCHAR(255) NOT NULL,
        calories INTEGER,
        protein DECIMAL(5,2),
        carbs DECIMAL(5,2),
        fat DECIMAL(5,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Healthcare Records Routes
app.get('/api/healthcare', async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id 
      ? 'SELECT * FROM healthcare_records WHERE user_id = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM healthcare_records ORDER BY created_at DESC';
    
    const params = user_id ? [user_id] : [];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching healthcare records:', error);
    res.status(500).json({ error: 'Failed to fetch healthcare records' });
  }
});

app.post('/api/healthcare', async (req, res) => {
  try {
    const { user_id, type, value, unit, notes } = req.body;
    
    const result = await pool.query(
      'INSERT INTO healthcare_records (user_id, type, value, unit, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, type, value, unit, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating healthcare record:', error);
    res.status(500).json({ error: 'Failed to create healthcare record' });
  }
});

// Food Diet Records Routes
app.get('/api/food-diet', async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id 
      ? 'SELECT * FROM food_diet_records WHERE user_id = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM food_diet_records ORDER BY created_at DESC';
    
    const params = user_id ? [user_id] : [];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching food diet records:', error);
    res.status(500).json({ error: 'Failed to fetch food diet records' });
  }
});

app.post('/api/food-diet', async (req, res) => {
  try {
    const { user_id, meal_type, food_name, calories, protein, carbs, fat, notes } = req.body;
    
    const result = await pool.query(
      'INSERT INTO food_diet_records (user_id, meal_type, food_name, calories, protein, carbs, fat, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user_id, meal_type, food_name, calories, protein, carbs, fat, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating food diet record:', error);
    res.status(500).json({ error: 'Failed to create food diet record' });
  }
});

// Delete routes
app.delete('/api/healthcare/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM healthcare_records WHERE id = $1', [id]);
    res.json({ message: 'Healthcare record deleted successfully' });
  } catch (error) {
    console.error('Error deleting healthcare record:', error);
    res.status(500).json({ error: 'Failed to delete healthcare record' });
  }
});

app.delete('/api/food-diet/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM food_diet_records WHERE id = $1', [id]);
    res.json({ message: 'Food diet record deleted successfully' });
  } catch (error) {
    console.error('Error deleting food diet record:', error);
    res.status(500).json({ error: 'Failed to delete food diet record' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});

module.exports = app;