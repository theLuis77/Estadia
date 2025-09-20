const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler'); // Asegúrate de que este archivo existe y maneja errores correctamente

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a MongoDB Atlas exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error.message);
    process.exit(1); // Sale del proceso con un código de error
  }
};

connectDB();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuario')); // Asegúrate de que ./routes/usuario.js exporta las rutas
app.use('/api/trabajadores', require('./routes/trabajador')); // Asegúrate de que ./routes/trabajador.js exporta las rutas
app.use('/api/mediciones', require('./routes/medicion')); // Asegúrate de que ./routes/medicion.js exporta las rutas

// Verifica el secreto JWT (esto debería ser eliminado o manejado de forma segura en producción)
if (process.env.JWT_SECRET) {
  console.log('JWT_SECRET está configurado');
} else {
  console.warn('JWT_SECRET no está configurado');
}

// Middleware para manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Inicia el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
