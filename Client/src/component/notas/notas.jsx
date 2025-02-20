
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Button, IconButton, Input } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from "axios";
import "./notas.css";
import { Cancel } from '@mui/icons-material';

// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";

export function Notas(){
    const [notas,setNotas] = useState([])
    const [newNota,setNewNota] = useState("")   
    const [open,setOpen] = useState(false);
    
    const handleOPen = () => {
        setOpen(true);
    }

    const close = () => {  
        setOpen(false);
    }

    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        if (window.pageYOffset > window.innerHeight / 3) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll',toggleVisibility)
        return() => {
            window.removeEventListener('scroll',toggleVisibility)
        }
    },[])
    

    useEffect(() => {
        const token = localStorage.getItem('token'); // Obtener el token aquí
        if (!token) {
            console.error("No hay token disponible");
            return;
        }
        axios.get(`${serverFront}/api/notas`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            },
            withCredentials: true, 
        })
        .then(response => {
            setNotas(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])
    

    const addNota = () => {
        if(newNota.trim() !== '') {
            const token = localStorage.getItem('token'); // Obtener el token aquí
            axios.post(`${serverFront}/api/notas`,
                { titulo: newNota }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true, 
                })
                .then(response => {
                    setNotas([...notas, response.data])
                    setNewNota('')
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }


    const deleteNota = (id) => {
        const token = localStorage.getItem('token'); // Obtener el token aquí
        axios.delete(`${serverFront}/api/notas/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setNotas(notas.filter(nota => nota._id !== id))
        })
        .catch(error => {
            console.log(error)  
        })   
    }

    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({
        titulo: '',
    });

    const editNota = (nota) => {
        setEditingId(nota._id);
        setEditingData({
            titulo: nota.titulo,
        })
    }

    const saveEditNotas = (id) => {
        const token = localStorage.getItem('token'); 
        axios.patch(`${serverFront}/api/notas/${id}`, { titulo: editingData.titulo }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setNotas(notas.map(nota => {
                if (nota._id === id) {
                    return response.data;
                }
                return nota;
            }));
            setEditingId(null);
        })
        .catch(error => {
            console.log(error);
        });
    }


    return(
        <div className="notas-container">
            <Button className='outlined' onClick={handleOPen}>
                <CircleNotificationsIcon style={{ display: visible ? 'block' : 'none' }}  />
            </Button>

            <Dialog open={open} onClose={close}>
            <DialogActions className="icon-noti">
                    <Button onClick={close}  color="primary"><Cancel/></Button>
                </DialogActions>

                <DialogTitle>Notas</DialogTitle>
                <DialogContent>
                    
                    <div className="input-notas">
                    <input  type="text" value={newNota} onChange={(e) => setNewNota(e.target.value)} placeholder="Escribe una nota" />
                    <Button onClick={addNota} color="primary"><AddIcon/></Button>
                    </div>
                    
                    <DialogContentText>
                    <table className='notas-table'>
                        <tbody>
                            {notas.map((nota, index) => (
                                <tr key={index} className="nota-row">
                                    <td>{editingId === nota._id ? <input value={editingData.titulo} onChange={(e) => setEditingData({...editingData, titulo: e.target.value})} /> : nota.titulo}</td>
                                    
                                    {editingId === nota._id ? (
                                            <>
                                                <IconButton className="check" sx={{ color: 'green', backgroundColor: 'lightgreen', borderRadius: '4px', padding: '5px' }} onClick={() => saveEditNotas(nota._id)}>
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton className="cancel" sx={{ color: 'white', backgroundColor: 'red', borderRadius: '4px', padding: '5px' }} onClick={() => setEditingId(null)}>
                                                    <Cancel />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton className="edit" sx={{ color: 'grey', fontFamily: "Montserrat, sans-serif" }} onClick={() => editNota(nota)}>
                                                <EditIcon />
                                            </IconButton>
                                        )}

                                        <IconButton className="trash" sx={{ color: 'red', fontFamily: "Montserrat, sans-serif" }} onClick={() => deleteNota(nota._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </DialogContentText>
                </DialogContent>

            </Dialog>
        </div>
    )
}