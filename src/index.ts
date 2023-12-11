import express from 'express';
const cors = require('cors');
var bodyParser = require('body-parser');
import { connection } from "./db";
import animalRoutes from './routes/animals';
const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use('/animals', animalRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});