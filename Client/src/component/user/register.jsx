// src/component/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { NavLink, useNavigate } from 'react-router-dom';
import "./user.css"


// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";

const Register = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const [show, setShow] = React.useState(false);
  const switchButton = () => setShow(!show);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverFront}/api/auth/register`, {  email, password });
      setMessage(response.data.message);
      navigate('/login'); // Redirigir al login tras el registro
    } catch (error) {
      setMessage(error.response.data.error || 'Error en el registro');
    }
  };

  return (
    <div className='container-login'>
      <h2> Registrarse </h2>
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

        <button type="submit">Registrar</button>
      </form>
      {message && <p>{message}</p>}
      
      <div className="count" >
        <NavLink to="/login" >
         <p> Ya tengo cuenta </p> 
        </NavLink>
      </div>

    </div>
  );
};

export default Register;
