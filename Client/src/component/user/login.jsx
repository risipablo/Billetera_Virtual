// src/component/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./user.css"

// const serverFront = "http://localhost:3001";
const serverFront = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";



const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverFront}/api/auth/login`, { email, password });
      document.cookie = `token=${response.data.token}; path=/;`;

       // Guardar el token en localStorage para evitar que la sesion se cierra cuando se hace un refresh
       
       localStorage.setItem('token', response.data.token);

      setIsAuthenticated(true);
      navigate('/gasto')
    } catch (error) {
      setMessage(error.response.data.error || 'Error en el login');
    }
  };

  return (
    <div className='container-login'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
