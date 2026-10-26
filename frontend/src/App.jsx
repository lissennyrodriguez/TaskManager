
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');

  function handleLogin(loggedUser) {
    setUser(loggedUser);
  }

  function handleLogout() {
    sessionStorage.removeItem('token');
    setUser(null);
    setPage('login');
  }

  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (page === 'register') {
    return (
      <Register
        onGoToLogin={() => setPage('login')}
      />
    );
  }

  return (
    <div>
      <Login onLogin={handleLogin} />

      <p>¿No tienes una cuenta?</p>

      <button
        type="button"
        onClick={() => setPage('register')}
      >
        Registrarse
      </button>
    </div>
  );
}

export default App;
