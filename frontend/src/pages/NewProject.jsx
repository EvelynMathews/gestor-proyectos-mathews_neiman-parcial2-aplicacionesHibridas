import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

const NewProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    image: '',
    links: []
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [newLink, setNewLink] = useState({ name: '', url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();
  const api = useApi();

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título es requerido';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Título debe tener al menos 3 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descripción es requerida';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAddLink = () => {
    if (newLink.name.trim() && newLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, { ...newLink }]
      }));
      setNewLink({ name: '', url: '' });
    }
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await api.post('/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({ ...prev, image: response.data.imageUrl }));
      setUploadingImage(false);
    } catch (error) {
      setServerError('Error al subir imagen');
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let finalData = { ...formData };
      if (newLink.name.trim() && newLink.url.trim()) {
        finalData = {
          ...formData,
          links: [...formData.links, { ...newLink }]
        };
      }

      await api.post('/projects', finalData);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Error al crear proyecto');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="pixel-title">Nuevo Proyecto</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Nombre del proyecto"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              placeholder="Describe tu proyecto"
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Prioridad</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="todo">Por hacer</option>
              <option value="in-progress">En progreso</option>
              <option value="completed">Completado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen del proyecto</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploadingImage}
            />
            {uploadingImage && <p className="upload-status">Subiendo imagen...</p>}
            {formData.image && (
              <div className="image-preview">
                <img src={`http://localhost:3000${formData.image}`} alt="Preview" />
                <button type="button" onClick={handleRemoveImage} className="btn-link danger">
                  Eliminar imagen
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Links de referencia</label>
            <div className="links-input">
              <input
                type="text"
                placeholder="Nombre (ej: GitHub)"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
              <button type="button" onClick={handleAddLink} className="btn-secondary">
                + Agregar
              </button>
            </div>
            {formData.links.length > 0 && (
              <div className="links-list">
                {formData.links.map((link, index) => (
                  <div key={index} className="link-item">
                    <span>{link.name}: {link.url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="btn-link danger"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {serverError && <div className="server-error">{serverError}</div>}

          <button type="submit" className="btn-primary">
            Crear Proyecto
          </button>
        </form>

        <p className="auth-link">
          <Link to="/dashboard">Volver al dashboard</Link>
        </p>
      </div>
    </div>
  );
};

export default NewProject;
