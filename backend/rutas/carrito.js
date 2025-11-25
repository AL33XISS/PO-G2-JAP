const express = require('express');
const router = express.Router();
const pool = require('../configuracion/database');

// POST /cart - Guardar carrito en la base de datos
router.post('/cart', async (req, res) => {
  try {
    const { usuario_id, items } = req.body;

    // Validar datos
    if (!usuario_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Datos inválidos. Se requiere usuario_id y un array de items.' 
      });
    }

    // Limpiar carrito anterior del usuario
    await pool.query('DELETE FROM carrito WHERE usuario_id = ?', [usuario_id]);

    // Insertar nuevos items
    for (const item of items) {
      const { producto_id, cantidad } = item;
      
      if (!producto_id || !cantidad) {
        continue; // Saltar items inválidos
      }

      await pool.query(
        'INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [usuario_id, producto_id, cantidad]
      );
    }

    res.json({ 
      mensaje: 'Carrito guardado exitosamente',
      items_guardados: items.length
    });

  } catch (error) {
    console.error('Error al guardar carrito:', error);
    res.status(500).json({ 
      error: 'Error al guardar el carrito en la base de datos' 
    });
  }
});

module.exports = router;