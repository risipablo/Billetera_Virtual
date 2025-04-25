import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import "./user.css"

import { NavLink, useNavigate } from 'react-router-dom';
import {config} from '../../component/variables/config'
import Tooltip from '@mui/material/Tooltip';

const serverFront = config.apiUrl;



 function Login ({ setIsAuthenticated, setLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const switchButton = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post(
            `${serverFront}/api/auth/login`, 
            { email, password }, 
            { withCredentials: true }
        );
        
        localStorage.setItem('token', response.data.token);

        setIsAuthenticated(true);
        navigate('/gasto');
    } catch (error) {
        setMessage(error.response?.data?.error || 'Credenciales incorrectas');
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div 
      className="container-login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Iniciar Sesión
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          whileFocus={{ scale: 1.05 }}
        />


        <motion.div 
          className="password-container"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <input
            placeholder="Contraseña"
            value={password}
            type={show ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Tooltip title={show ? "Ocultar contraseña" : "Mostrar contraseña"} arrow>
            <span className="password-icon" onClick={switchButton}>
              {show ? <FaEyeSlash /> : <FaEye />}
            </span>
          </Tooltip>
          

        </motion.div>

        
        <div className="forgot">
            <NavLink to="/forgot-password">
              <p>¿Haz olvidado tu contraseña?</p>
            </NavLink>
          </div>
          

        <motion.button 
          type="submit"
        >
          Iniciar sesión
        </motion.button>
      </motion.form>

      {message && (
        <motion.p 
          className="message"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.p>
      )}

      <motion.div 
        className="count"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <NavLink to="/register">
          <p> ¿No tienes una cuenta? Crea una nueva cuenta</p>
        </NavLink>
      </motion.div>
    </motion.div>
  );
};

export default Login
