const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Usuarios
const usuarios = [
  {
    id: 1,
    email: 'sebastiansilvayferrer@JAP',
    password: 'jap314'
  },
  {
    id: 2,
    email: 'agustinfourcade@JAP',
    password: 'jap314' 
  },
  {
    id: 3,
    email: 'alexissalsamendi@JAP',
    password: 'jap314' 
  },
  {
    id: 4,
    email: 'invitado@JAP',
    password: 'jap314' 
  }
];

// Endpoint POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que vengan los datos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario por email
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    
    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar respuesta exitosa
    res.json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id: usuario.id,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error en el servidor' 
    });
  }
});

module.exports = router;