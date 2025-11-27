import * as taskService from '../services/taskService.js';

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await taskService.getAllTasksByProject(projectId, req.user.userId);
    res.json(tasks);
  } catch (error) {
    if (error.message === 'Proyecto no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, priority, image } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Titulo es requerido' });
    }

    const taskData = { title, description, dueDate, priority, image };
    const task = await taskService.createNewTask(taskData, projectId, req.user.userId);
    res.status(201).json(task);
  } catch (error) {
    if (error.message === 'Proyecto no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, completed, dueDate, priority, image } = req.body;

    const taskData = { title, description, completed, dueDate, priority, image };
    const task = await taskService.updateTaskById(taskId, taskData, projectId, req.user.userId);
    res.json(task);
  } catch (error) {
    if (error.message === 'Proyecto no encontrado' || error.message === 'Tarea no encontrada') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    await taskService.deleteTaskById(taskId, projectId, req.user.userId);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    if (error.message === 'Proyecto no encontrado' || error.message === 'Tarea no encontrada') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
};
