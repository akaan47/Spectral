// App.js
import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SettingsForm from './components/SettingsForm';
import { 
  User, 
  MessageSquare, 
  Users, 
  Handshake, 
  LogOut,
  Settings,
  Menu,
  X
} from 'lucide-react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  console.log(user);
  const [activeSection, setActiveSection] = useState('messages');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));


    }
  }, []);

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleSettings = () => {
    setActiveSection('settings');
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'messages':
        return (
          <div className="content-section">
            <h2 className="text-2xl font-bold mb-6">Messagerie</h2>
            <p className="text-gray-600">[CONTENU]</p>
            {}
          </div>
        );
      case 'friends':
        return (
          <div className="content-section">
            <h2 className="text-2xl font-bold mb-6">Amis</h2>
            <p className="text-gray-600">[CONTENU]</p>
            {}
          </div>
        );
      case 'partners':
        return (
          <div className="content-section">
            <h2 className="text-2xl font-bold mb-6">Partenaires</h2>
            <p className="text-gray-600">[CONTENU]</p>
            {}
          </div>
        );
      case 'settings':
        return (
          <div className="content-section">
            <SettingsForm user={user} onUpdateSuccess={handleUserUpdate} />
          </div>
        );
      default:
        return (
          <div className="content-section">
            <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
            <p className="text-gray-600">Bienvenue sur votre espace personnel.</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="dashboard-container flex flex-col md:flex-row min-h-screen bg-gray-50">
      

      {/* Sidebar */}
      <aside 
        className={`sidebar bg-blue-700 text-white w-64 flex-shrink-0 flex flex-col transition-all duration-300
                   ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:translate-x-0 fixed md:static h-full z-40`}
      >
        {/* Profil utilisateur */}
        <div className="user-profile p-6 border-b border-blue-600">
          <div className="avatar bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 overflow-hidden">
            {user.profilePicture ? (
              <img
              src={`data:${user.profilePicture}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            ) : (
              <User size={32} />
            )}
          </div>
          <h2 className="text-xl font-bold text-center mb-1">{user.displayName || user.username}</h2>
          <p className="text-blue-200 text-sm text-center">ID: {user.id}</p>
        </div>

        
        <nav className="sidebar-nav flex-grow p-4">
          <ul className="space-y-1">
            <li>
              <button 
                className={`nav-item w-full text-left py-3 px-4 rounded-md flex items-center transition
                          ${activeSection === 'messages' ? 'bg-blue-800 font-medium' : 'hover:bg-blue-600'}`}
                onClick={() => setActiveSection('messages')}
              >
                <MessageSquare size={20} className="mr-3" />
                <span>Messagerie</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-item w-full text-left py-3 px-4 rounded-md flex items-center transition
                          ${activeSection === 'friends' ? 'bg-blue-800 font-medium' : 'hover:bg-blue-600'}`}
                onClick={() => setActiveSection('friends')}
              >
                <Users size={20} className="mr-3" />
                <span>Amis</span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-item w-full text-left py-3 px-4 rounded-md flex items-center transition
                          ${activeSection === 'partners' ? 'bg-blue-800 font-medium' : 'hover:bg-blue-600'}`}
                onClick={() => setActiveSection('partners')}
              >
                <Handshake size={20} className="mr-3" />
                <span>Partenaires</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Bouton de param et de déconnexion */}
        <div className="buttons-container p-4 mt-auto border-t border-blue-600">
          <div className="flex gap-3 justify-between">
            <button 
              onClick={handleSettings} 
              className={`settings-btn flex-1 py-2 px-3 ${activeSection === 'settings' ? 'bg-gray-800' : 'bg-gray-700 hover:bg-gray-600'} text-white rounded-md transition flex items-center justify-center`}
            >
              <Settings size={16} className="mr-1" />
              <span>Paramètres</span>
            </button>
            <button 
              onClick={handleLogout} 
              className="logout-btn flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition flex items-center justify-center"
            >
              <LogOut size={16} className="mr-1" />
              <span>Déconnexion </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="main-content flex-grow p-4 md:p-8">
        <header className="main-header mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Spectral Portal, Welcome {user.displayName || user.username}</h1>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default App;