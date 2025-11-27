import * as commentService from '../services/commentService.js';

export const getComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const comments = await commentService.getAllCommentsByProject(projectId, req.user.userId);
    res.json(comments);
  } catch (error) {
    if (error.message === 'Proyecto no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al obtener comentarios', error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Contenido es requerido' });
    }

    const comment = await commentService.createNewComment(content, projectId, req.user.userId);
    res.status(201).json(comment);
  } catch (error) {
    if (error.message === 'Proyecto no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al crear comentario', error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { projectId, commentId } = req.params;
    await commentService.deleteCommentById(commentId, projectId, req.user.userId);
    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    if (error.message === 'Proyecto no encontrado' || error.message === 'Comentario no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al eliminar comentario', error: error.message });
  }
};
