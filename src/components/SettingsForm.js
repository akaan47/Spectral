import React, { useState, useRef } from 'react';
import { Save, Upload, User } from 'lucide-react';
import '../components/styles/SettingsForm.css';

const SettingsForm = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    displayName: user.displayName || '',
    email: user.email || '',
    profilePicture: user.profilePicture || null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;


    // Vérifier le type de fichier on va pas filtrer pour l'instant
    if (!file.type.match('image.*')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille du fichier (max 2MB mais la base64 peut supproter jusqu'à environ 10MB) à prévoir un compresseur automatique comme ça on pourra augmenter cette limite
    if (file.size > 8 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        profilePicture: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé, veuillez vous reconnecter');
      }

      console.log('Envoi des données:', {
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        profilePictureSize: formData.profilePicture ? formData.profilePicture.length : 0
      });

      const response = await fetch('http://localhost:3001/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          displayName: formData.displayName,
          email: formData.email,
          profilePicture: formData.profilePicture
        })
      });

      const data = await response.json();
      console.log('Réponse du serveur:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de la mise à jour');
      }

      const updatedUser = {
        ...user,
        ...data.user
      };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Vos informations ont été mises à jour avec succès');
      
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedUser);
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-form">
        <h2>Paramètres du compte</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Photo de profil */}
          <div className="form-group">
            <label className="text-center" style={{ textAlign: 'center', display: 'block' }}>Photo de profil</label>
            <div className="avatar-container">
              <div className="avatar">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" />
                ) : (
                  <User size={50} color="white" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="upload-button"
              >
                <Upload size={16} className="upload-icon" />
                Changer la photo
              </button>
            </div>
          </div>
          
          {/* Nom d'affichage */}
          <div className="form-group">
            <label htmlFor="displayName">
              Nom d'affichage
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Nom d'utilisateur */}
          <div className="form-group">
            <label htmlFor="username">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Bouton de soumission */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Chargement...</span>
            ) : (
              <>
                <Save size={18} className="save-icon" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;