// Notas de recordatorios

import { useState, useEffect } from 'react';
import axios from 'axios';

import { config } from "../../component/variables/config";
const serverFront = config.apiUrl;

export const useNotas = () => {
    const [notas, setNotas] = useState([]);
    const [newNota, setNewNota] = useState("");
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({ titulo: '' });

    const handleOpen = () => setOpen(true);
    const close = () => setOpen(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > window.innerHeight / 3) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No hay token disponible");
            return;
        }
        axios.get(`${serverFront}/api/notas`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        })
        .then(response => setNotas(response.data))
        .catch(error => console.log(error));
    }, []);

    const addNota = () => {
        if (newNota.trim() !== '') {
            const token = localStorage.getItem('token');
            axios.post(`${serverFront}/api/notas`, { titulo: newNota }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
            .then(response => {
                setNotas([...notas, response.data]);
                setNewNota('');
            })
            .catch(error => console.log(error));
        }
    };

    const deleteNota = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`${serverFront}/api/notas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setNotas(notas.filter(nota => nota._id !== id)))
        .catch(error => console.log(error));
    };

    const editNota = (nota) => {
        setEditingId(nota._id);
        setEditingData({ titulo: nota.titulo });
    };

    const saveEditNotas = (id) => {
        const token = localStorage.getItem('token');
        axios.patch(`${serverFront}/api/notas/${id}`, { titulo: editingData.titulo }, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            setNotas(notas.map(nota => (nota._id === id ? response.data : nota)));
            setEditingId(null);
        })
        .catch(error => console.log(error));
    };

    return {
        notas,
        newNota,
        setNewNota,
        open,
        handleOpen,
        close,
        visible,
        addNota,
        deleteNota,
        editingId,
        setEditingId,
        editingData,
        setEditingData,
        editNota,
        saveEditNotas,
    };
};