import express, { json } from 'express';
import cors from 'cors';
const app = express();
import db from '././config/db';
import router from '././routes/routes';
import errorHandler from './middlewares/errorHandler';

const PORT = process.env.PORT || 3000;

// Middleware para manejo de errores
app.use(errorHandler);

// Middleware para habilitar CORS y parsear JSON
app.use(cors());
app.use(json());

// Rutas de la API
app.use('/api', router);

// Sera el Health Check para verificar que la conexión a la base de datos es exitosa
app.get('/', async (req, res) => {
    const result = await db.query('SELECT 1'); 
        res.send('Hello World!');
    });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});