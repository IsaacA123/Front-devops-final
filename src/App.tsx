import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoutes from './components/ProtectedRoutes';
import ProjectsView from './components/ProjectsView';
import TasksView from './components/TasksView';
import Statistics from './components/EstadisticasView';
import Settings from './pages/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Ruta principal de redirección */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/:projectId/tasks" element={<TasksView />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          {/* Agregar más rutas protegidas aquí si es necesario */}
        </Route>

        {/* Ruta para página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
