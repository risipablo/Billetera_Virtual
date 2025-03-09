// src/component/Register.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { NavLink, useNavigate } from 'react-router-dom';

import "../login/user.css"


// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";

const Register = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName] = useState('')
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const [show, setShow] = React.useState(false);
  const switchButton = () => setShow(!show);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverFront}/api/auth/register`, {  email, password, name });
      setMessage(response.data.message);
      navigate('/login'); // Redirigir al login tras el registro
    } catch (error) {
      setMessage(error.response.data.error || 'Error en el registro');
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
        Registrarse
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

        <motion.input
          type="name"
          placeholder="Nombre de usuario"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          <span className="password-icon" onClick={switchButton}>
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        </motion.div>

        <motion.button 
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
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
        <NavLink to="/login">
          <p> ¡Ya tengo cuenta! </p>
        </NavLink>
      </motion.div>
    </motion.div>

  );
};

export default Register