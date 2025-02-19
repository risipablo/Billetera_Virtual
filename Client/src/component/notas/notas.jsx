
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Button } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from "axios";
import "./notas.css";

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

    

    useEffect(() => {
        const token = localStorage.getItem('token'); // Obtener el token aquí
        axios.get(`${serverFront}/api/notas`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
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
                {nota:newNota},{
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true, 
                })
                .then(response => {
                    setNotas([...notas,response.data])
                    setNewNota('')
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    return(
        <div className="notas-container">
            <Button className='outlined' onClick={handleOPen}>
                <CircleNotificationsIcon style={{ color: 'rgba(134, 10, 180)' }} />
            </Button>

            <Dialog open={open} onClose={close}>
                <DialogTitle>Notas</DialogTitle>
                <DialogContent>
                    <input type="text" value={newNota} onChange={(e) => setNewNota(e.target.value)} placeholder="Escribe una nota" />
                    <Button onClick={addNota} color="primary">Agregar</Button>
                    <DialogContentText>
                        {notas.map((nota,index) =>{
                            return(
                                <div key={index}>
                                    <p>{nota.nota}</p>
                                </div>
                            )
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="icon-noti">
                    <Button onClick={close}  color="primary">Cerrar</Button>
                </DialogActions>

            </Dialog>
        </div>
    )
}