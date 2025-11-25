const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Función auxiliar para leer archivos JSON
const leerJSON = (rutaArchivo) => {
  const rutaCompleta = path.join(__dirname, '..', 'datos', rutaArchivo);
  const datos = fs.readFileSync(rutaCompleta, 'utf8');
  return JSON.parse(datos);
};

// Obtener todas las categorías
router.get('/cats/cat.json', (req, res) => {
  try {
    const categorias = leerJSON('cats/cat.json');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar categorías' });
  }
});

// Obtener productos por categoría
router.get('/cats_products/:id.json', (req, res) => {
  try {
    const { id } = req.params;
    const productos = leerJSON(`cats_products/${id}.json`);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar productos' });
  }
});

// Obtener información de un producto específico
router.get('/products/:id.json', (req, res) => {
  try {
    const { id } = req.params;
    const producto = leerJSON(`products/${id}.json`);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar producto' });
  }
});

// Obtener comentarios de un producto
router.get('/products_comments/:id.json', (req, res) => {
  try {
    const { id } = req.params;
    const comentarios = leerJSON(`products_comments/${id}.json`);
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar comentarios' });
  }
});

// Obtener carrito de usuario
router.get('/user_cart/:id.json', (req, res) => {
  try {
    const { id } = req.params;
    const carrito = leerJSON(`user_cart/${id}.json`);
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar carrito' });
  }
});

module.exports = router;