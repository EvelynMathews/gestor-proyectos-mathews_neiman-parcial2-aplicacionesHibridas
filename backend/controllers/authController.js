import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    await authService.registerUser(username, email, password);
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    if (error.message === 'Usuario o email ya existe') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const result = await authService.authenticateUser(email, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Credenciales invalidas') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
