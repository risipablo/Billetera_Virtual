import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, TextField, Button, IconButton, Typography } from "@mui/material";
import { Delete, Edit, Save, Cancel, Check } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Consejo } from "../../component/consejos/consejo";
import "./notasPage.css";

// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";

export function NotasPage() {
    const [note, setNote] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

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
            setNote(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    const addNote = () => {
        if (titulo.trim() !== '' && descripcion.trim() !== '') {
            const token = localStorage.getItem('token');
            axios.post(`${serverFront}/api/note`, {
                titulo: titulo,
                descripcion: descripcion
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            })
            .then(response => {
                setNote([...note, response.data]);
                setTitulo('');
                setDescripcion('');
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
        .then(response => {
            setNote(note.filter(nota => nota._id !== id));
        })
        .catch(error => {
            console.log(error);
        });
    };

    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({
        titulo: '',
        descripcion: ''
    });

    const editNote = (nota) => {
        setEditingId(nota._id);
        setEditingData({
            titulo: nota.titulo,
            descripcion: nota.descripcion
        });
    };

    const saveEditNote = (id) => {
        const token = localStorage.getItem('token');
        axios.patch(`${serverFront}/api/note/${id}`, {
            titulo: editingData.titulo,
            descripcion: editingData.descripcion
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setNote(note.map(nota => {
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
    };

    return (
        <div className="gastos-container">
            <Helmet>
                <title> Notas </title>
            </Helmet>
            
            <h1>Notas</h1>

            <Container>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                            <TextField 
                                fullWidth
                                label="Título"
                                variant="outlined"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                            <TextField 
                                fullWidth
                                label="Descripción"
                                variant="outlined"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={2} style={{ display: "flex", justifyContent: "center" }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={addNote}
                        >
                            <Check/>
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            
            <Container style={{ marginTop: 40 }}>
                <Grid container spacing={2}>
                    {note.map((nota, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Card className="note-card">
                                    <CardContent>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="h6" style={{ fontWeight: "bold" }}>
                                                {nota.titulo}
                                            </Typography>
                                            <div>
                                                <IconButton color="warning" onClick={() => editNote(nota)}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => deleteNote(nota._id)}>
                                                    <Delete />
                                                </IconButton>
                                            </div>
                                        </div>
                                        <Typography variant="h8" style={{ marginTop: 12 }}>
                                            {nota.descripcion}
                                        </Typography>
                                        {editingId === nota._id && (
                                            <div style={{ marginTop: 12 }}>
                                                <TextField 
                                                    fullWidth
                                                    size="small"
                                                    label="Editar título"
                                                    variant="outlined"
                                                    value={editingData.titulo}
                                                    onChange={(e) => setEditingData({ ...editingData, titulo: e.target.value })}
                                                />
                                                <TextField 
                                                    fullWidth
                                                    size="small"
                                                    label="Editar descripción"
                                                    variant="outlined"
                                                    value={editingData.descripcion}
                                                    onChange={(e) => setEditingData({ ...editingData, descripcion: e.target.value })}
                                                    style={{ marginTop: 8 }}
                                                />
                                                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
                                                    <Button 
                                                        variant="contained" 
                                                        color="success" 
                                                        startIcon={<Save />} 
                                                        onClick={() => saveEditNote(nota._id)}
                                                        size="small"
                                                    />
                                                    <Button 
                                                        variant="contained" 
                                                        color="secondary" 
                                                        startIcon={<Cancel />} 
                                                        onClick={() => setEditingId(null)}
                                                        size="small"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Consejo/>
        </div>
    );
}