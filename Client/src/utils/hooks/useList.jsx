import toast from 'react-hot-toast';
import {config} from '../../component/variables/config'
import { useEffect, useState } from 'react';
import axios from 'axios';

const serverFront = config.apiUrl

export function useList(){
    const [list, setList] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token){
            console.error("No hay token disponible")
            return;
        }
        axios.get(`${serverFront}/api/list`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })
        .then(response => { 
            setList(response.data)
        })
        .catch(error => {console.log(error)})
    }, [])


    const addList = (titulo, fecha) => {
        if (titulo.trim() !== '' && fecha.trim() !== ''){
            const token = localStorage.getItem('token')
            axios.post(`${serverFront}/api/list`, {
                titulo: titulo,
                fecha:fecha,
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            .then(response => {
                setList([...list,response.data])
                toast.success('Listado Agregado con exito', {
                    position: 'top-right'
                })
            })
            .catch(err => {
                console.log(err)
                toast.error('Listado invalido', {
                    position: 'top-right'
                })
            })
        }
    }

    const deleteNoteList = (id) => {
        const token = localStorage.getItem('token')
        axios.delete(`${serverFront}/api/list/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })
        .then(() => {
            setList(list.filter(lis => lis._id !== id))
            toast.error('Listado eliminado', {
                    position: 'top-right'
            })
        })
        .catch(error => {
            console.log(error);
        });
    }


    // Notas para el listado
    const addListNote = async (noteId, descripcion) => {
        try{
            const token = localStorage.getItem('token')

            await axios.put(`${serverFront}/api/list/${noteId}/add-list`,
                {
                    newNote: descripcion
                },
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            )
            toast.success('Nota agregada con exito',{
                position: 'top-right'
            })
            setList(list.map(lis => {
                if (lis._id === noteId){
                    return{
                        ...lis,
                        descripcion:[...lis.descripcion, descripcion]
                    }
                } else{
                    toast.error('Error al ingresar la nota',{
                    position: 'top-right'
            })
                }
                return lis;
            }))
        } catch(err){
            console.error("Error al agregar notas:", err)
        }
    }

    const deleteNewNote = (id, indexList) => {
        const token = localStorage.getItem('token')

        axios.delete(`${serverFront}/api/list/${id}/delete-list/${indexList}`,{
            headers:{
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })
        .then((response) => {
            setList(list.map(lis =>
                lis._id === id 
                ? {
                    ...lis,
                    descripcion: lis.descripcion.filter((_,idx) => idx !== indexList)
                }
                
                :lis
                
            ))
            console.log(response)
            toast.error('Nota de la lista eliminada', {
                position: 'top-right'
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    const editListNote = async (noteId, idx, descripcion ) => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.put(`${serverFront}/api/list/${noteId}/edit-list/${idx}`,
                { descripcion},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setList(list.map(lis => 
                lis._id === noteId ? response.data : lis
            ))

            toast.success("Cambios guardados con exito", {
                position: 'top-right'
            })
            return response.data
        } catch (error) {
            console.error("Error al guadar la nota")
        }
    }

    const listComplete = async (noteId) => {
    try {
        const token = localStorage.getItem('token');
        const currentList = list.find(note => note._id === noteId);
        if (!currentList) {
            console.warn('listComplete: no se encontró la nota con id', noteId);
            return;
        }

        const newCompleted = !currentList.completed;

        // Actualización optimista
        setList(prev => prev.map(n => n._id === noteId ? { ...n, completed: newCompleted } : n));

        // Llamada al backend
        const response = await axios.patch(
            `${serverFront}/api/list/${noteId}/completed`,
            { completed: newCompleted },
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            }
        );

        // Si el backend responde correctamente, usar esa data
        if (response?.data && response.data._id) {
            setList(prev => prev.map(n => n._id === noteId ? response.data : n));
        }

        toast.success(newCompleted ? 'Lista completada' : 'Lista incompleta', {
            position: 'top-right'
        });

    } catch (error) {
        console.error("Error al completar la nota:", error);

        // Revertir cambio optimista
        // setList(prev => prev.map(n => n._id === noteId ? { ...n, completed: !newCompleted } : n));

        toast.error('Error al actualizar la nota');
    }
    };


    const toggleCompleteDescription = async (noteId, idx) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${serverFront}/api/list/${noteId}/toggle-complete/${idx}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

                //    toast.success("Nota completada", {
                // position: 'top-right'
                // });

            setList(list.map(lis => 
                lis._id === noteId ? response.data : lis
            ));

        } catch (error) {
            console.log(err => err.message)
        }
    }

    const deleteAllList = () => {
        axios.delete(`${serverFront}/api/delete-all`)
        .then(response => {
            setList([])
            toast.success('Todas las listas eliminadas',{
                position: 'top-center'
            })
        })
        .catch(err => {
                console.error("Error deleting tasks:", err);
                toast.error('Error al eliminar las tareas', {
                    position: 'top-center',
                });
            });
    }

    return {list, listComplete ,addList, deleteNoteList, addListNote, deleteNewNote, editListNote,toggleCompleteDescription, deleteAllList}
}