// src/component/Register.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { NavLink, useNavigate } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import "../login/user.css"
import { Button, Collapse } from '@mui/material';


// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name,setName] = useState('')
  const [showInputs,setShowInputs] = useState(true)
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const [show, setShow] = React.useState(false);
  const switchButton = () => setShow(!show);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
  
    try {
      const response = await axios.post(`${serverFront}/api/auth/register`, {
        email,
        password,
        name
      });
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      
      if (error.response) {
        
        setMessage(error.response.data?.error || 'Error en el registro');
      } else if (error.request) {
      
        setMessage('El servidor no respondió. Intenta más tarde.');
      } else {
      
        setMessage('Error al enviar la solicitud');
      }
      console.error('Detalles del error:', error);
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
          placeholder="Ingrese Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          whileFocus={{ scale: 1.05 }}
        />

        <motion.input
          type="name"
          placeholder="Ingrese Nombre de Usuario"
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
            placeholder="Crea una Contraseña"
            value={password}
            type={show ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-icon" onClick={switchButton}>
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        </motion.div>

        <motion.div 
          className="password-container"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <input
            placeholder="Confirme Contraseña"
            value={confirmPassword}
            type={show ? 'text' : 'password'}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Confirmar
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


      <div   onClick={() => setShowInputs(!showInputs)}  style={{ display: 'flex', alignItems: 'center', color: 'red', fontWeight: 600, marginTop: '1rem', cursor: 'pointer' }}>
          <InfoIcon 
            sx={{ marginRight: '0.5rem', cursor: 'pointer' }} 
          />
          <p style={{ margin: 0 }}>Requisitos</p>
        </div>

      <TransitionGroup>
        {!showInputs && 
        <Collapse>
        
          <ul className='p3'>
            
            {[
              "La contraseña debe tener al menos 8 caracteres.",
              "Incluir al menos una mayúscula.",
              "Incluir al menos un número.",
              "Incluir al menos un carácter especial (opcional).",
              "No incluir espacios en blanco."
            ].map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        </Collapse>

        }
      </TransitionGroup>


    </motion.div>

  );
};

export default Register