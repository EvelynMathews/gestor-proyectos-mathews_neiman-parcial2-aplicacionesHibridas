import * as projectService from '../services/projectService.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjectsByUser(req.user.userId);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectByIdAndUser(req.params.id, req.user.userId);
    res.json(project);
  } catch (error) {
    if (error.message === 'Proyecto no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al obtener proyecto', error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, status, priority, image, links } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Titulo y descripcion son requeridos' });
    }

    const projectData = { title, description, status, priority, image, links };
    const project = await projectService.createNewProject(projectData, req.user.userId);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear proyecto', error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { title, description, status, priority, image, links } = req.body;
    const projectData = { title, description, status, priority, image, links };

    const project = await projectService.updateProjectById(req.params.id, projectData, req.user.userId);
    res.json(project);
  } catch (error) {
    if (error.message === 'Proyecto no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar proyecto', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProjectById(req.params.id, req.user.userId);
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    if (error.message === 'Proyecto no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al eliminar proyecto', error: error.message });
  }
};
