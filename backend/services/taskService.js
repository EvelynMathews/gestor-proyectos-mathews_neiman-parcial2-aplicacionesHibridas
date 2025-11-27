import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const verifyProjectOwnership = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Proyecto no encontrado');
  }
  return project;
};

export const getAllTasksByProject = async (projectId, userId) => {
  await verifyProjectOwnership(projectId, userId);
  return await Task.find({ projectId }).sort({ createdAt: -1 });
};

export const createNewTask = async (taskData, projectId, userId) => {
  await verifyProjectOwnership(projectId, userId);

  const task = new Task({
    ...taskData,
    projectId
  });

  await task.save();
  return task;
};

export const updateTaskById = async (taskId, taskData, projectId, userId) => {
  await verifyProjectOwnership(projectId, userId);

  const task = await Task.findOneAndUpdate(
    { _id: taskId, projectId },
    taskData,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new Error('Tarea no encontrada');
  }

  return task;
};

export const deleteTaskById = async (taskId, projectId, userId) => {
  await verifyProjectOwnership(projectId, userId);

  const task = await Task.findOneAndDelete({ _id: taskId, projectId });
  if (!task) {
    throw new Error('Tarea no encontrada');
  }

  return task;
};
