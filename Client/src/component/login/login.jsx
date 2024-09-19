import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({onAuthenticate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', { email, password });
            localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento local
            onAuthenticate()
            // Redirige o realiza otras acciones aquí
        } catch (err) {
            setError(err.response.data.msg || 'Error en el servidor');
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
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
}

export default LoginForm;
