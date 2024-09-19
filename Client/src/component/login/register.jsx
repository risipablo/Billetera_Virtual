import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({onAuthenticate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/register', { email, password });
            localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento loca
            onAuthenticate()
            // Redirige o realiza otras acciones aquí
        } catch (err) {
            setError(err.response.data.error || 'Error en el servidor');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Contraseña:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p>{error}</p>}
            <button type="submit">Registrarse</button>
        </form>
    );
}

export default RegisterForm;
