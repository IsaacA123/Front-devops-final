import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ( {setIsAuthenticated} ) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true); 
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('IdUser', data.user.id);
        localStorage.setItem('userName', data.user.nombre);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true)
      } else {
        /* console.error("Error en inicio de sesión", data.message); */
        toast.error(data.message, { autoClose: 7000 });
        setErrorMessage(data.error[0]);
        
      }
    } catch (error) {
      /* console.error('Error de conexión', error); */
      setErrorMessage('Error de conexión. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer/>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Iniciar Sesión</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-800 px-2 pb-1">E-mail</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="email@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 px-2 pb-1">Contraseña</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="********"
            />
          </div>
          {errorMessage && <p className="my-2  text-red-600">{errorMessage}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 mt-2 text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
          >
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
