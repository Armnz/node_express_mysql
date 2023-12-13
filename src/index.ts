import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { pool } from './db';
import { RowDataPacket } from 'mysql2';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

app.get('/animals', async (req, res) => {
  try {
    // Use the promise-based query function for this query
    const [rows] = await pool.execute('SELECT * FROM animals');
    res.json(rows);
  } catch (err) {
    handleError(res, err as Error);
  }
});

app.post('/animals', async (req, res) => {
  try {
    const { name, species, imageLink } = req.body;

    if (!name || !species || !imageLink) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    // Insert the new animal
    const [insertResult] = await pool.execute('INSERT INTO animals (name, species, imageLink) VALUES (?, ?, ?)', [name, species, imageLink]);
    const lastInsertId = (insertResult as any)?.insertId;

    if (lastInsertId === undefined) {
      return res.status(500).json({ message: 'Failed to retrieve the last inserted ID' });
    }

    // Retrieve the newly added animal, including the createdAt field
    const [queryResult] = await pool.execute('SELECT * FROM animals WHERE id = ?', [lastInsertId]);
    const rows = queryResult as RowDataPacket[];
    const newAnimal = rows[0];

    if (newAnimal) {
      res.status(201).json(newAnimal);
    } else {
      res.status(500).json({ message: 'Failed to retrieve the newly added animal' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/animals/:id', async (req, res) => {
  try {
    const { name, species, imageLink } = req.body;
    await pool.execute('UPDATE animals SET name = ?, species = ?, imageLink = ? WHERE id = ?', [name, species, imageLink, req.params.id]);
    res.status(200).json({ message: 'Animal updated successfully' });
  } catch (err) {
    handleError(res, err as Error);
  }
});

app.delete('/animals/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM animals WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: 'Animal deleted successfully' });
  } catch (err) {
    handleError(res, err as Error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function handleError(res: express.Response, error: Error) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Unknown error occurred' });
  }
}
