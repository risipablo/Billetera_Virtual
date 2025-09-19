import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../component/variables/config";
import toast from 'react-hot-toast';

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
            const validNotes = response.data.filter(note => note != null) // filtrar notas si son null/undefined
            setNotes(validNotes);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    const addNote = (titulo, descripcion, fecha, cuotas, precio) => {
        if (titulo.trim() !== '' && descripcion.trim() !== '') {
            const token = localStorage.getItem('token');
            axios.post(`${serverFront}/api/note`, {
                titulo: titulo,
                descripcion: descripcion,
                cuotas: cuotas,
                precio: precio,
                fecha: fecha
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            })
            .then(response => {
                setNotes([...notes, response.data]);
            toast.success('Nota agregado con éxito', {
                position: 'top-right',
            });
            })
            .catch(error => {
                console.log(error);
                toast.error('Nota incorrecta, no se ha podido agregar', {
                    position: 'top-right'
                })
            });
        } else {
                     toast.error('Nota incorrecta, completa todos los campos requeridos', {
                    position: 'top-right'
                })
        }
    };




    const addNoteWithDate = async (noteId, descripcion,fecha,precio) => {
        try{
            const token = localStorage.getItem('token')

            // Para esta funcion se debe mandar por separados los endpoint correspondiente de cada uno.
            await axios.put(`${serverFront}/api/note/${noteId}/add-note`,
                { newNote: descripcion},
                    {
                        headers:{
                            Authorization: `Bearer ${token}`
                        }
                    }
            );

            await axios.put(`${serverFront}/api/note/${noteId}/add-price`, 
                {newPrice: precio},
                    {
                        headers:{
                            Authorization: `Bearer ${token}`
                        }
                    }
            )

            await axios.put(`${serverFront}/api/note/${noteId}/add-date`,
                { newDate: fecha},
                    {
                        headers:{
                            Authorization: `Bearer ${token}`
                        }
                    }
            );
                    toast.success('Nota adicional agregada con éxito', {
                    position: 'top-right'
                })
            // Manejo de indices de cada uno atravez de un mapeo para ser añadidos en la misma posicion
            setNotes(notes.map(note =>{
                
                if (note._id === noteId){
                    return {
                        ...note,
                        descripcion: [...note.descripcion, descripcion],
                        precio: [...note.precio, precio],
                        fecha: [...note.fecha, new Date(fecha)],
                    }
                }

                return note;
            }))
        } catch (err) {
            console.error("Error al agregar:", err);
        }
    }


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
                toast.error('Nota eliminada', {
                    position: 'top-right'
                })
        })
        .catch(error => {
            console.log(error);
        });
    };

    
    const deleteNewIndex = (id, noteIndex) => {
        const token = localStorage.getItem('token');
      axios.delete(`${serverFront}/api/note/${id}/delete-note/${noteIndex}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })
        .then((response) => {
        
            setNotes(notes.map(note => 
                note._id === id ? response.data : note
            ));
                toast.error('Nota adicional eliminada', {
                    position: 'top-right'
                })
        })
        .catch(error => {
            console.log(error);
        });
    }

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
            
            toast.success('Cambios guardados con exito', {
                    position: 'top-right'
                })
        })
        .catch(error => {
            console.log(error);
        });
    };

    // editar notas y fechas nuevas
    const handleSaveItem = async (noteId, idx, descripcion, fecha, precio) => {
        try{
            const token = localStorage.getItem('token')
            const response = await axios.put(`${serverFront}/api/note/${noteId}/edit-note/${idx}`,
            { descripcion, fecha ,precio},  
            { headers: { Authorization: `Bearer ${token}` }}
        );

            setNotes(notes.map(note =>
                note._id === noteId ? response.data : note
            ));

            toast.success('Cambios guardados con exito', {
                    position: 'top-right'
                })
             return response.data
            
        } catch (error) {
            console.error("Error al guardar la edicion ")
        }
    }

    const completeNote = async (noteId) => {
        try{
            const token = localStorage.getItem('token');

            const currentNote = notes.find(note => note._id === noteId)
            if (!currentNote) return

            const newCompleted = !currentNote.completed

            const response = await axios.patch(`${serverFront}/api/note/${noteId}/completed`,
                {completed : newCompleted},
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    },
                     withCredentials: true,
                }
            )

            setNotes(notes.map(note => 
                note._id === noteId ? response.data : note
            ))

            toast.success(newCompleted ? 'Nota completada' : 'Nota reactivada', {
            position: 'top-right'
            });

        } catch (error){
            console.error("Error al completar la nota:", error);
            toast.error('Error al actualizar la nota');
        }   

    }

    return { notes, addNote, deleteNote, editNote,deleteNewIndex, addNoteWithDate,handleSaveItem, completeNote};
}