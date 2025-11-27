import Project from '../models/Project.js';

export const getAllProjectsByUser = async (userId) => {
  return await Project.find({ userId }).sort({ createdAt: -1 });
};

export const getProjectByIdAndUser = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Proyecto no encontrado');
  }
  return project;
};

export const createNewProject = async (projectData, userId) => {
  const project = new Project({
    ...projectData,
    userId
  });
  await project.save();
  return project;
};

export const updateProjectById = async (projectId, projectData, userId) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, userId },
    projectData,
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new Error('Proyecto no encontrado');
  }

  return project;
};

export const deleteProjectById = async (projectId, userId) => {
  const project = await Project.findOneAndDelete({ _id: projectId, userId });
  if (!project) {
    throw new Error('Proyecto no encontrado');
  }
  return project;
};
