const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();

app.use(express.json({ extended: false }));

app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/clientes', require('./routes/cliente'));
app.use('/api/trabajadores', require('./routes/trabajador'));

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
