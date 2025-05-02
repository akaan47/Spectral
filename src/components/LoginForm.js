import React, { useState } from 'react';
import '../components/styles/LoginForm.css';
import axios from 'axios'; 

const LoginForm = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Le nom d\'utilisateur est requis';
        } else if (value.length < 3) {
          newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        } else if (value.length > 32) {
          newErrors.username = 'Le nom d\'utilisateur doit contenir au plus 32 caractères';
        }
        else {
          delete newErrors.username;
        }
        break;
      
      case 'displayName':
        if (!isLogin && !value.trim()) {
          newErrors.displayName = 'Le nom d\'affichage est requis';
        } else if (value.length < 3) {
          newErrors.displayName = 'Le nom d\'affichage doit contenir au moins 3 caractères';
        } else if (value.length > 32) {
          newErrors.displayName = 'Le nom d\'affichage doit contenir au plus 3 caractères';
        }
        else {
          delete newErrors.displayName;
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'L\'email est requis';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Format d\'email invalide';
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'password':
        if (!value) {
          newErrors.password = 'Le mot de passe est requis';
        } else if (value.length < 8) {
          newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        } else if (value.length > 32) {
          newErrors.password = 'Le mot de passe doit contenir au plus 32 caractères';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
        } else if (/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
          newErrors.password = 'Le mot de passe contient des caractères non supportés';
        } else {
          delete newErrors.password;
        }
        
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      
      case 'confirmPassword':
        if (!isLogin && !value) {
          newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
        } else if (!isLogin && value !== formData.password) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    
    if (!isLogin && !formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
      isValid = false;
    }
    
    if (!isLogin && !formData.displayName.trim()) {
      newErrors.displayName = 'Le nom d\'affichage est requis';
      isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      isValid = false;
    } else if (!isLogin && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
      isValid = false;
    }
    
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        if (isLogin) {
          const response = await axios.post('http://localhost:3001/auth/login', {
            email: formData.email,
            password: formData.password
          });
          
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          if (onSuccess) {
            onSuccess(response.data);
          }
          
          console.log('Connexion réussie', response.data);
        } else {
          const response = await axios.post('http://localhost:3001/auth/signup', {
            username: formData.username,
            displayName: formData.displayName,
            email: formData.email,
            password: formData.password
          });
          
          console.log('Inscription réussie', response.data);
          setIsLogin(true);
          setFormData({
            username: '',
            displayName: '',
            email: formData.email, 
            password: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
        setApiError(
          (error.response && error.response.data && error.response.data.error) || 
          'Une erreur est survenue. Veuillez réessayer.' 
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setApiError('');
    setFormData({
      username: '',
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="logo-container">
          <h1>Spectral</h1>
        </div>
        
        <div className="form-toggle">
          <button 
            type="button"
            className={`toggle-btn ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Connexion
          </button>
          <button 
            type="button"
            className={`toggle-btn ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Créer un compte
          </button>
        </div>
        
        {apiError && (
          <div className="error-alert">
            {apiError}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
          )}
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="displayName">Nom d'affichage</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className={errors.displayName ? 'error' : ''}
              />
              {errors.displayName && <span className="error-message">{errors.displayName}</span>}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading 
              ? 'Chargement...' 
              : (isLogin ? 'Se connecter' : 'S\'inscrire')
            }
          </button>
        </form>
        
        <div className="form-footer">
          <p>
            {isLogin ? 'Pas encore de compte ?' : 'Déjà inscrit ?'} 
            <button type="button" className="toggle-link" onClick={toggleForm}>
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;