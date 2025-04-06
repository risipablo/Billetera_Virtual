import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../component/variables/config";

const serverFront = config.apiUrl;


export function useNotes() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No hay token disponible");
            return;
        }
        axios.get(`${serverFront}/api/note`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })
        .then(response => {
            setNotes(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    const addNote = (titulo, descripcion, fecha) => {
        if (titulo.trim() !== '' && descripcion.trim() !== '') {
            const token = localStorage.getItem('token');
            axios.post(`${serverFront}/api/note`, {
                titulo: titulo,
                descripcion: descripcion,
                fecha: fecha
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            })
            .then(response => {
                setNotes([...notes, response.data]);
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            console.error("El título y la descripción no pueden estar vacíos");
        }
    };

    const deleteNote = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`${serverFront}/api/note/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })
        .then(() => {
            setNotes(notes.filter(note => note._id !== id));
        })
        .catch(error => {
            console.log(error);
        });
    };

    const editNote = (id, newData) => {
        const token = localStorage.getItem('token');
        axios.patch(`${serverFront}/api/note/${id}`, newData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setNotes(notes.map(note => {
                if (note._id === id) {
                    return response.data;
                }
                return note;
            }));
        })
        .catch(error => {
            console.log(error);
        });
    };

    return { notes, addNote, deleteNote, editNote };
}