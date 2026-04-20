import express, { json } from 'express';
import cors from 'cors';
import db from './config/db.js';
import router from './routes/routes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para habilitar CORS y parsear JSON
app.use(cors({
    allowedHeaders: ['Content-Type', 'user_id']
}));
app.use(json());

// Rutas de la API
app.use('/api', router);

// Middleware para manejo de errores
app.use(errorHandler);

// Sera el Health Check para verificar que la conexión a la base de datos es exitosa
app.get('/', async (req, res) => {
    const result = await db.query('SELECT 1'); 
        res.send('Hello World!');
    });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});