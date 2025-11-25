// Importar librerías
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const rutasDatos = require('./rutas/datos');
const rutasAutenticacion = require('./rutas/autenticacion');
const rutasCarrito = require('./rutas/carrito');
const verificarToken = require('./autenticacion/verificarToken');

// Crear la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' });
});

// Rutas públicas (no requieren autenticación)
app.use('/auth', rutasAutenticacion);
app.use('/emercado-api', rutasDatos); // ← SIN verificarToken

// Rutas protegidas (requieren autenticación)
app.use('/api', verificarToken, rutasCarrito);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});