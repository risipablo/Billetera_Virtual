import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import "./user.css";
import { UserContext } from './userContext';

// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";

const Login = ({ setIsAuthenticated, setLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const switchButton = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await axios.post(`${serverFront}/api/auth/login`, { email, password }, { withCredentials: true });
      localStorage.setItem('token', response.data.token);
      
      setUser({ email });
      setIsAuthenticated(true);
      setLoading(false);
      navigate('/gasto');

    } catch (error) {
      setLoading(false); 
      console.error('Error de Axios:', error);
      if (error.response) {
        setMessage(error.response.data.error || 'Error en el login');
      }
    }
  };

  return (
    <div className="container-login">
      <h2>Iniciar Sesion</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-container">
          <input
            placeholder="Contraseña"
            value={password}
            type={show ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-icon" onClick={switchButton}>
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Iniciar sesión</button>
      </form>
      {message && <p className="message">{message}</p>}

      <div className="count">
        <NavLink to="/register">
          <p> ¿No tienes una cuenta? Crea una nueva cuenta</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
