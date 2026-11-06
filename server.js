import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(projectDirectory, 'public');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(publicDirectory));

app.listen(PORT, () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});
