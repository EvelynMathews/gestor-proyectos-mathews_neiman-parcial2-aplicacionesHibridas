import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useModal } from '../context/ModalContext';

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', image: '' });
  const [newComment, setNewComment] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [uploadingTaskImage, setUploadingTaskImage] = useState(false);

  const { id } = useParams();
  const api = useApi();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const translateStatus = (status) => {
    const translations = {
      'todo': 'Por hacer',
      'in-progress': 'En progreso',
      'completed': 'Completado'
    };
    return translations[status] || status;
  };

  const translatePriority = (priority) => {
    const translations = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta'
    };
    return translations[priority] || priority;
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes, commentsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
        api.get(`/comments/project/${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setComments(commentsRes.data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar proyecto');
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await api.post(`/tasks/project/${id}`, newTask);
      setNewTask({ title: '', description: '', priority: 'medium', image: '' });
      fetchProjectData();
    } catch (error) {
      setError('Error al agregar tarea');
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      await api.put(`/tasks/project/${id}/task/${taskId}`, { completed: !completed });
      fetchProjectData();
    } catch (error) {
      setError('Error al actualizar tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    showModal({
      title: 'Eliminar Tarea',
      message: '¿Seguro que querés eliminar esta tarea?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await api.delete(`/tasks/project/${id}/task/${taskId}`);
          fetchProjectData();
        } catch (error) {
          setError('Error al eliminar tarea');
        }
      }
    });
  };

  const handleUpdateTask = async (taskId) => {
    if (!editingTask.title.trim()) return;

    try {
      await api.put(`/tasks/project/${id}/task/${taskId}`, editingTask);
      setEditingTask(null);
      fetchProjectData();
    } catch (error) {
      setError('Error al actualizar tarea');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/comments/project/${id}`, { content: newComment });
      setNewComment('');
      fetchProjectData();
    } catch (error) {
      setError('Error al agregar comentario');
    }
  };

  const handleDeleteComment = async (commentId) => {
    showModal({
      title: 'Eliminar Comentario',
      message: '¿Seguro que querés eliminar este comentario?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await api.delete(`/comments/project/${id}/comment/${commentId}`);
          fetchProjectData();
        } catch (error) {
          setError('Error al eliminar comentario');
        }
      }
    });
  };

  const handleDeleteProject = async () => {
    showModal({
      title: 'Eliminar Proyecto',
      message: '¿Seguro que querés eliminar este proyecto? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await api.delete(`/projects/${id}`);
          navigate('/dashboard');
        } catch (error) {
          setError('Error al eliminar proyecto');
        }
      }
    });
  };

  const handleTaskImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingTaskImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await api.post('/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setNewTask(prevTask => ({
        ...prevTask,
        image: response.data.imageUrl
      }));
      setUploadingTaskImage(false);
    } catch (error) {
      setError('Error al subir imagen: ' + (error.response?.data?.message || error.message));
      setUploadingTaskImage(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (!project) return <div className="loading">Proyecto no encontrado</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="pixel-title">Pixel Planner</h1>
        <Link to="/dashboard" className="btn-secondary">
          Volver al Dashboard
        </Link>
      </header>

      <div className="dashboard-content">
        {error && <div className="server-error">{error}</div>}

        <div className="project-detail-card">
          <div className="project-detail-header">
            <div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="project-meta">
                <span className={`priority ${project.priority}`}>{translatePriority(project.priority)}</span>
                <span className={`status ${project.status}`}>{translateStatus(project.status)}</span>
              </div>
            </div>
            <div className="project-detail-actions">
              <Link to={`/projects/${id}/edit`} className="btn-secondary">
                Editar
              </Link>
              <button onClick={handleDeleteProject} className="btn-link danger">
                Eliminar Proyecto
              </button>
            </div>
          </div>

          {project.image && (
            <div className="project-image">
              <img src={`http://localhost:3000${project.image}`} alt={project.title} />
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div className="project-links">
              <h3>Links de referencia</h3>
              <div className="links-list">
                {project.links.map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="link-badge">
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="project-sections">
            <section className="tasks-section">
              <h3>Tareas</h3>

              <form onSubmit={handleAddTask} className="add-task-form-vertical">
                <div className="task-form-row">
                  <input
                    type="text"
                    placeholder="Título de la tarea..."
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="task-title-input"
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="task-priority-select"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div className="task-image-section">
                  <label className="task-image-label">
                    <span>Imagen (opcional)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTaskImageChange}
                      disabled={uploadingTaskImage}
                    />
                  </label>
                  {uploadingTaskImage && <p className="upload-status">Subiendo imagen...</p>}
                  {newTask.image && (
                    <div className="task-image-preview-inline">
                      <img src={`http://localhost:3000${newTask.image}`} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => setNewTask(prev => ({ ...prev, image: '' }))}
                        className="btn-link danger"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-primary" disabled={uploadingTaskImage || !newTask.title.trim()}>
                  {uploadingTaskImage ? 'Subiendo...' : 'Agregar Tarea'}
                </button>
              </form>

              <div className="tasks-list">
                {tasks.length === 0 ? (
                  <p className="no-items">No hay tareas aún</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task._id} className="task-item">
                      {editingTask?._id === task._id ? (
                        <div className="task-edit-form">
                          <input
                            type="text"
                            value={editingTask.title}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, title: e.target.value })
                            }
                          />
                          <button
                            onClick={() => handleUpdateTask(task._id)}
                            className="btn-link"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingTask(null)}
                            className="btn-link danger"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="task-content">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleTask(task._id, task.completed)}
                            />
                            <div className="task-info">
                              <div className="task-header-row">
                                <span className={task.completed ? 'completed' : ''}>
                                  {task.title}
                                </span>
                                <span className={`priority ${task.priority}`}>
                                  {translatePriority(task.priority)}
                                </span>
                              </div>
                              {task.image && (
                                <img src={`http://localhost:3000${task.image}`} alt={task.title} className="task-image" />
                              )}
                            </div>
                          </div>
                          <div className="task-actions">
                            <button
                              onClick={() => setEditingTask(task)}
                              className="btn-link"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="btn-link danger"
                            >
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="comments-section">
              <h3>Comentarios</h3>

              <form onSubmit={handleAddComment} className="add-comment-form">
                <textarea
                  placeholder="Agregar un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="3"
                />
                <button type="submit" className="btn-primary">Comentar</button>
              </form>

              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-items">No hay comentarios aún</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{comment.userId?.username}</span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn-link danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
