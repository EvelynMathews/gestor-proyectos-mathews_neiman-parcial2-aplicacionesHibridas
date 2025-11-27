import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const api = useApi();
  const { user, logout } = useContext(AuthContext);
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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar proyectos');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    showModal({
      title: 'Eliminar Proyecto',
      message: '¿Seguro que querés eliminar este proyecto? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await api.delete(`/projects/${id}`);
          fetchProjects();
        } catch (error) {
          setError('Error al eliminar proyecto');
        }
      }
    });
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="pixel-title">Pixel Planner</h1>
        <div className="user-info">
          <span>Hola, {user?.username}!</span>
          <button onClick={handleLogout} className="btn-secondary">
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <Link to="/projects/new" className="btn-primary">
            + Nuevo Proyecto
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {projects.length === 0 ? (
          <p className="no-projects">
            No tenés proyectos aún. Creá tu primer proyecto!
          </p>
        ) : (
          <>
            {/* Proyectos en progreso */}
            {projects.filter(p => p.status === 'in-progress').length > 0 && (
              <div className="projects-section">
                <h2 className="section-title in-progress">En Progreso</h2>
                <div className="projects-grid">
                  {projects.filter(p => p.status === 'in-progress').map((project) => (
                    <div key={project._id} className={`project-card ${project.status}`}>
                      <div className="project-header">
                        <h3>{project.title}</h3>
                        <span className={`priority ${project.priority}`}>
                          {translatePriority(project.priority)}
                        </span>
                      </div>
                      <p>{project.description}</p>
                      {project.image && (
                        <div className="project-card-image">
                          <img src={`http://localhost:3000${project.image}`} alt={project.title} />
                        </div>
                      )}
                      {project.links && project.links.length > 0 && (
                        <div className="project-card-links">
                          {project.links.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="link-badge-small">
                              {link.name}
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="project-footer">
                        <span className={`status ${project.status}`}>
                          {translateStatus(project.status)}
                        </span>
                        <div className="project-actions">
                          <Link to={`/projects/${project._id}`} className="btn-link">
                            Tareas
                          </Link>
                          <Link to={`/projects/${project._id}/edit`} className="btn-link">
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="btn-link danger"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proyectos pendientes */}
            {projects.filter(p => p.status === 'todo').length > 0 && (
              <div className="projects-section">
                <h2 className="section-title todo">Pendientes</h2>
                <div className="projects-grid">
                  {projects.filter(p => p.status === 'todo').map((project) => (
                    <div key={project._id} className={`project-card ${project.status}`}>
                      <div className="project-header">
                        <h3>{project.title}</h3>
                        <span className={`priority ${project.priority}`}>
                          {translatePriority(project.priority)}
                        </span>
                      </div>
                      <p>{project.description}</p>
                      {project.image && (
                        <div className="project-card-image">
                          <img src={`http://localhost:3000${project.image}`} alt={project.title} />
                        </div>
                      )}
                      {project.links && project.links.length > 0 && (
                        <div className="project-card-links">
                          {project.links.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="link-badge-small">
                              {link.name}
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="project-footer">
                        <span className={`status ${project.status}`}>
                          {translateStatus(project.status)}
                        </span>
                        <div className="project-actions">
                          <Link to={`/projects/${project._id}`} className="btn-link">
                            Tareas
                          </Link>
                          <Link to={`/projects/${project._id}/edit`} className="btn-link">
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="btn-link danger"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proyectos completados */}
            {projects.filter(p => p.status === 'completed').length > 0 && (
              <div className="projects-section">
                <h2 className="section-title completed">Completados</h2>
                <div className="projects-grid">
                  {projects.filter(p => p.status === 'completed').map((project) => (
                    <div key={project._id} className={`project-card ${project.status}`}>
                      <div className="project-header">
                        <h3>{project.title}</h3>
                        <span className={`priority ${project.priority}`}>
                          {translatePriority(project.priority)}
                        </span>
                      </div>
                      <p>{project.description}</p>
                      {project.image && (
                        <div className="project-card-image">
                          <img src={`http://localhost:3000${project.image}`} alt={project.title} />
                        </div>
                      )}
                      {project.links && project.links.length > 0 && (
                        <div className="project-card-links">
                          {project.links.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="link-badge-small">
                              {link.name}
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="project-footer">
                        <span className={`status ${project.status}`}>
                          {translateStatus(project.status)}
                        </span>
                        <div className="project-actions">
                          <Link to={`/projects/${project._id}`} className="btn-link">
                            Tareas
                          </Link>
                          <Link to={`/projects/${project._id}/edit`} className="btn-link">
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="btn-link danger"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
