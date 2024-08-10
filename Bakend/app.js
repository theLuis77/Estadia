const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// Configurar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json({ extended: false }));

// Rutas
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/clientes', require('./routes/cliente'));
app.use('/api/trabajadores', require('./routes/trabajador'));
app.use('/api/mediciones', require('./routes/medicion'));

// Middleware para manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
