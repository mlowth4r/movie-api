const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));
app.use(express.json());

// Supabase config
const SUPABASE_URL = 'https://evxfjyjzqtlzayuihtos.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eGZqeWp6cXRsemF5dWlob3RvcyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzkwMDI3OTg5LCJleHAiOjIxMDU2MDM5ODl9.P05hrYZAzGFm1c2UyiqNNVGI7gnis0UuP94IZFiHG34';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Movie API running' });
});

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('title', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add a movie
app.post('/movies', async (req, res) => {
  try {
    const { title, year, rating, warnings } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('movies')
      .insert([{
        title,
        year,
        rating,
        warnings
      }])
      .select();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error adding movie:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Movie API server running on port ${PORT}`);
});
