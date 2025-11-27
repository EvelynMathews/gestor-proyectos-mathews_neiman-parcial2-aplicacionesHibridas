import express from 'express';
import upload from '../config/multer.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'Imagen subida exitosamente',
      imageUrl: imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir imagen', error: error.message });
  }
});

export default router;
