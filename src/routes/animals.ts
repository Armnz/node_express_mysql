import express, { Request, Response } from 'express';
import db from './src/db'; // Import the database connection

const router = express.Router();

// Get all animals
router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM animals');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new animal
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, species, imageLink } = req.body;
    const result = await db.query('INSERT INTO animals (name, species, imageLink) VALUES (?, ?, ?)', [name, species, imageLink]);
    res.status(201).json({ id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an animal
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, species, imageLink } = req.body;
    await db.query('UPDATE animals SET name = ?, species = ?, imageLink = ? WHERE id = ?', [name, species, imageLink, req.params.id]);
    res.status(200).json({ message: 'Animal updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an animal
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await db.query('DELETE FROM animals WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: 'Animal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
