import Comment from '../models/Comment.js';
import Project from '../models/Project.js';

export const verifyProjectOwnership = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    throw new Error('Proyecto no encontrado');
  }
  return project;
};

export const getAllCommentsByProject = async (projectId, userId) => {
  await verifyProjectOwnership(projectId, userId);

  return await Comment.find({ projectId })
    .populate('userId', 'username')
    .sort({ createdAt: -1 });
};

export const createNewComment = async (content, projectId, userId) => {
  await verifyProjectOwnership(projectId, userId);

  const comment = new Comment({
    content,
    projectId,
    userId
  });

  await comment.save();
  return await Comment.findById(comment._id).populate('userId', 'username');
};

export const deleteCommentById = async (commentId, projectId, userId) => {
  await verifyProjectOwnership(projectId, userId);

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    projectId,
    userId
  });

  if (!comment) {
    throw new Error('Comentario no encontrado');
  }

  return comment;
};
