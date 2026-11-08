import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(projectDirectory, 'public');
const PORT = process.env.PORT || 3000;
const actFiles = new Map([
  ['1', 'acto_1_sombras_de_zhyun .json'],
  ['2', 'acto_2_caceria-jhin.json']
]);

app.use(express.json());
app.get('/api/actos/:id', async (req, res) => {
  const fileName = actFiles.get(req.params.id);
  if (!fileName) {
    res.status(404).json({ error: 'El acto solicitado no existe.' });
    return;
  }

  try {
    const filePath = path.join(publicDirectory, fileName);
    const act = JSON.parse(await readFile(filePath, 'utf8'));
    res.json(act);
  } catch (error) {
    console.error(`No se pudo cargar el acto ${req.params.id}:`, error);
    res.status(500).json({ error: 'No se pudo cargar el acto.' });
  }
});
app.use(express.static(publicDirectory));

app.listen(PORT, () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});
