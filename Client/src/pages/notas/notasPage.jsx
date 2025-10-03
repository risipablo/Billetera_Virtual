import { useMemo, useState } from "react";
import { Container, Grid, Card, CardContent, TextField, Button, IconButton, Typography, Tooltip, Box, Collapse } from "@mui/material";
import { Delete, Edit, Save, Cancel, Check, Add, Close, ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useNotes } from "../../utils/hooks/useNotes";
import "./notasPage.css";
import { Skeleton } from "@mui/material";
import { TransitionGroup } from 'react-transition-group'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from "@mui/material";
import { Toaster } from 'react-hot-toast';
import { ScrollTop } from "../../component/common/scrollTop";
import { NoteInfo } from "../../component/common/Info/noteInfo";
import ModalConfirmacion from "../../component/modal/modalConfirm";
import UndoIcon from '@mui/icons-material/Undo';
import React from "react";
import { Debounce } from "../../component/common/debounce";

export function NotasPage() {
    const { notes, addNote, deleteNote, editNote, addNoteWithDate, deleteNewIndex, handleSaveItem, completeNote } = useNotes();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");   
    const [cuotas,setCuotas] = useState("") 
    const [precio,setPrecio] = useState("")

    const [expandedNoteId, setExpandedNoteId] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({
        titulo: '',
        cuotas:''
    });

    const [newItem, setNewItem] = useState({
        descripcion: '',
        fecha: '',
        precio: ''
    });
    const [showInputs, setShowInputs] = useState({}) // {} => para ir tarjeta por tarjeta

    // const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const modalDelete = (id) => {
        setShowModal(true)
        setDeleteId(id)
    }



    const handleAddNote = () => {

        addNote(titulo, descripcion, fecha, cuotas, precio);
        setTitulo(''); 
        setDescripcion('');
        setCuotas('')
        setPrecio(0)
        setFecha(getTodayDate()); 
    };

    const handleDebounce = useMemo(() => Debounce(handleAddNote,100), [handleAddNote])

    const handleEditNote = (nota) => {
        setEditingId(nota._id);
        setEditingData({
            titulo: nota.titulo,
            cuotas: nota.cuotas
        });
    };

    const handleSaveEditNote = (id) => {
        editNote(id, editingData);
        setEditingId(null);
    };

    // const getTodayDate = () => {
    //     const today = new Date();
    //     const yyyy = today.getFullYear();
    //     const mm = String(today.getMonth() + 1).padStart(2, '0');
    //     const dd = String(today.getDate()).padStart(2, '0');
    //     return `${yyyy}-${mm}-${dd}`;
    // };


    const getTodayDate = (dateString) => {
        new Date(dateString).toLocaleDateString('es-ES',{timeZone: 'UTC' })
    }

    const [fecha, setFecha] = useState(getTodayDate());

    // CRUD de notas y fechas nuevas

    const handleAddItem = (noteId) => {
        // Verifica que newItem y newItem.descripcion existan
        if (!newItem || !newItem.descripcion || !newItem.fecha || !newItem.precio) {
            alert("Descripción, fecha Y precio son requeridas");
            return;
        }

        // Elimina espacios en blanco y verifica que no esté vacío
        if (newItem.descripcion.trim() === "" || newItem.fecha === "" || newItem.precio === "") {
            alert("Descripción y fecha no pueden estar vacías");
            return;
        }

        // Si todo está bien, procede a agregar
        addNoteWithDate(noteId, newItem.descripcion, newItem.fecha, newItem.precio);
        setNewItem({ descripcion: "", fecha: "", precio: "" });  
        setExpandedNoteId(null)
    };

    const [editingState, setEditingState] = useState(null); // id de la nota
    const [editingIdx, setEditingIdx] = useState(null);     // índice del ítem
    const [editingItem, setEditingItem] = useState({ fecha: '', descripcion: ''});

    const editingRoutine = (nota, idx) => {
        setEditingState(nota._id);
        setEditingIdx(idx);
        setEditingItem({
            fecha: nota.fecha[idx] || '',
            descripcion: nota.descripcion[idx] || '',
            precio: nota.precio[idx] || '',
        });
    };

    const saveNewItem = async (noteId) => {
        await handleSaveItem(noteId, editingIdx, editingItem.descripcion, editingItem.fecha, editingItem.precio);
        setEditingState(null);
        setEditingIdx(null);
        setEditingItem({ descripcion: '', fecha: '', precio: '' });
    };

    const deleteNoteIndex = (id, noteIndex ) => {
        deleteNewIndex(id, noteIndex)
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const [menuNoteId, setMenuNoteId] = useState(null);
    const [menuIdx, setMenuIdx] = useState(null);

    const handleMenuOpen = (event, noteId, idx) => {
        setAnchorEl(event.currentTarget);
        setMenuNoteId(noteId);
        setMenuIdx(idx);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuNoteId(null);
        setMenuIdx(null);
    };



    return (
        <div className="gastos-container">
            <Helmet>
                <title> Notas </title>
            </Helmet>

            <Box display="flex" justifyContent="flex-end" alignItems="flex-start" sx={{ width: '100%' }}>
                <Tooltip title="Términos" arrow>
                    <NoteInfo/>
                </Tooltip>
            </Box>
            
            <h1>Notas</h1>

            <Container>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2.5}>
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

                    <Grid item xs={12} sm={2}>
                        <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }}>
                            <TextField
                                select
                                fullWidth
                                label="Cuotas"
                                value={cuotas}
                                onChange={(e) => setCuotas(e.target.value)}
                                variant="outlined"
                            >
                                
                                <MenuItem value="">Seleccionar Cuotas</MenuItem>
                                
                                {[...Array(100)].map((_, index) => (
                                    <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
                                ))}
                            </TextField>
                        </motion.div>
                    </Grid>
                    
                     <Grid item xs={12} sm={2.5}>
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
                    
                    <Grid item xs={12} sm={1.5}>
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                            <TextField 
                                fullWidth
                                label="Monto"
                                variant="outlined"
                                type="number"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={2.5}>
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                            <TextField
                                fullWidth
                                label="Establecer fecha límite"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={1} style={{ marginTop: 4 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleDebounce}
                            disabled={!titulo || !descripcion || !cuotas || !precio || !fecha}
                            fullWidth
                        >
                            <Check/>
                        </Button>
                    </Grid>
                </Grid>
            </Container>

            <Container style={{ marginTop: "5rem" }}>
                <Grid container spacing={6}>
                     {( notes.length === 0)
                        ? Array.from({ length: 3 }).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card className="note-card" sx={{ borderRadius: 2, minHeight: 180 }}>
                                    <CardContent>
                                        <Skeleton variant="text" width="60%" height={32} />
                                        <Skeleton variant="text" width="40%" height={24} />
                                        <Skeleton variant="rectangular" width="100%" height={60} style={{ marginTop: 16 }} />
                                        <Skeleton variant="circular" width={32} height={32} style={{ marginTop: 16 }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                         : notes.map((nota, index) => {
                         if(!nota) return null;
                            return (
                                <React.Fragment key={nota._id || index}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <Card
                                                className={`note-card${nota.completed ? ' completed-note' : ''}`}
                                                sx={{
                                                    borderRadius: 2,
                                                    border: '2px solid rgba(105, 104, 104, 0.3)',
                                                    boxShadow: "0 4px 8px 0 rgba(56, 56, 56, 0.3)",
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        backgroundColor: "rgba(248, 246, 246, 0.3)",
                                                    }}
                                                >
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <Typography variant="h6" style={{ fontWeight: "bold" }}>
                                                                {nota.titulo}
                                                            </Typography>
                                                            <Typography variant="body2" style={{ display: 'block', marginTop: 2 }}>
                                                                {nota.cuotas} Cuotas
                                                            </Typography>
                                                        </div>

                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Button
                                                                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                                                            >
                                                                <IconButton
                                                                    color={nota.completed ? "success" : "primary"}
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        completeNote(nota._id);
                                                                    }}
                                                                    size="small"
                                                                >
                                                                    {nota.completed ? <UndoIcon /> : <Check />}
                                                                </IconButton>
                                                            </Button>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={(e) => handleMenuOpen(e, nota._id, null)}
                                                            >
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            <Menu
                                                                anchorEl={anchorEl}
                                                                open={Boolean(anchorEl) && menuNoteId === nota._id && menuIdx === null}
                                                                onClose={handleMenuClose}
                                                            >
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        handleEditNote(nota);
                                                                        handleMenuClose();
                                                                    }}
                                                                >
                                                                    <Edit fontSize="small" color="warning" style={{ marginRight: 8 }} /> <Typography color="warning">Editar</Typography>
                                                                </MenuItem>
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        modalDelete(nota._id);
                                                                        handleMenuClose();
                                                                    }}
                                                                >
                                                                    <Delete fontSize="small" color="error" style={{ marginRight: 8 }} /> <Typography color="error">Eliminar nota</Typography>
                                                                </MenuItem>
                                                            </Menu>
                                                            <Button
                                                                onClick={() => setShowInputs(prev => ({ ...prev, [nota._id]: !prev[nota._id] }))}
                                                                startIcon={showInputs[nota._id] ? <ExpandLess /> : <ExpandMore />}
                                                                sx={{ minWidth: 36, padding: 0 }}
                                                            />
                                                        </Box>
                                                        
                                                    </div>

                                                    <TransitionGroup>
                                                        {showInputs[nota._id] && (
                                                            <Collapse>
                                                                <div style={{ marginTop: 12 }}>
                                                                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                setExpandedNoteId(expandedNoteId === nota._id ? null : nota._id)
                                                                            }
                                                                        >
                                                                            {expandedNoteId === nota._id ? <Close /> : <Add />}
                                                                        </IconButton>
                                                                    </div>

                                                                    {Array.isArray(nota.descripcion) && nota.descripcion.map((desc, idx) => {
                                                                        const isExpanded = expandedNoteId === `${nota._id}-${idx}`;
                                                                        return (
                                                                            <div
                                                                                key={idx}
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    justifyContent: 'space-between',
                                                                                    alignItems: 'center',
                                                                                    marginBottom: 4,
                                                                                    padding: "4px 8px",
                                                                                    borderRadius: 4,
                                                                                    cursor: 'pointer',
                                                                                    backgroundColor: isExpanded ? '#f5f5f5' : 'transparent'
                                                                                }}
                                                                                onClick={() => setExpandedNoteId(isExpanded ? null : `${nota._id}-${idx}`)}
                                                                            >
                                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, }}>
                                                                                        <Typography variant="body2"
                                                                                            style={{
                                                                                                fontWeight: '700',
                                                                                                borderRadius: 4,
                                                                                                fontSize: "1rem",
                                                                                                margin: '7px 0',
                                                                                                display: 'inline-block',
                                                                                            }}
                                                                                        >
                                                                                            {desc}
                                                                                        </Typography>

                                                                                        <Typography variant="body2"
                                                                                            style={{
                                                                                                fontSize: "1rem",
                                                                                                fontWeight: '700',
                                                                                                fontFamily: 'Poppins'
                                                                                            }}>
                                                                                            ${(
                                                                                                Array.isArray(nota.precio)
                                                                                                    ? Number(nota.precio[idx] ?? 0)
                                                                                                    : Number(nota.precio ?? 0)
                                                                                            ).toLocaleString('en-US')}
                                                                                        </Typography>
                                                                                    </div>

                                                                                    {nota.fecha && nota.fecha[idx] && (
                                                                                        <Typography variant="body2" style={{ display: 'block', marginTop: 1 }}>
                                                                                            {nota.fecha[idx] &&
                                                                                                new Date(nota.fecha[idx]).toLocaleDateString('es-ES', {
                                                                                                    day: 'numeric',
                                                                                                    month: 'long',
                                                                                                    year: 'numeric'
                                                                                                })
                                                                                            }
                                                                                        </Typography>
                                                                                    )}
                                                                                </div>

                                                                                <div style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
                                                                                    <IconButton
                                                                                        size="small"
                                                                                        onClick={e => {
                                                                                            e.stopPropagation();
                                                                                            handleMenuOpen(e, nota._id, idx);
                                                                                        }}
                                                                                    >
                                                                                        <MoreVertIcon fontSize="small" />
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}

                                                                </div>
                                                            </Collapse>
                                                        )}
                                                    </TransitionGroup>

                                                    {/* Edicion de notas */}
                                                    {editingState === nota._id && (
                                                        <div style={{ marginTop: 18, display: "block", gap: 12, alignItems: 'center' }}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label="Editar notas"
                                                                variant="outlined"
                                                                value={editingItem.descripcion}
                                                                onChange={(e) => setEditingItem({ ...editingItem, descripcion: e.target.value })}
                                                                style={{ margin: '8px auto' }}
                                                            />

                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                type="number"
                                                                variant="outlined"
                                                                value={editingItem.precio || ''}
                                                                onChange={(e) => setEditingItem({ ...editingItem, precio: e.target.value })}
                                                            />

                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                type="date"
                                                                variant="outlined"
                                                                value={editingItem.fecha || ''}
                                                                onChange={(e) => setEditingItem({ ...editingItem, fecha: e.target.value })}
                                                            />

                                                            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12, alignItems: 'center' }}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    startIcon={<Save />}
                                                                    onClick={() => saveNewItem(nota._id)}
                                                                    size="small"
                                                                />
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    startIcon={<Cancel />}
                                                                    onClick={() => setEditingState(null)}
                                                                    size="small"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/*agregar nueva descripción, fecha y precios */}
                                                    {expandedNoteId === nota._id && (
                                                        <div
                                                            style={{
                                                                marginTop: 12,
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: 12,
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label="Nueva descripción"
                                                                value={newItem.descripcion}
                                                                onChange={(e) =>
                                                                    setNewItem({ ...newItem, descripcion: e.target.value })
                                                                }
                                                            />

                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                type="number"
                                                                label="Nueva precio"
                                                                InputLabelProps={{ shrink: true }}
                                                                value={newItem.precio}
                                                                onChange={(e) =>
                                                                    setNewItem({ ...newItem, precio: e.target.value })
                                                                }
                                                            />

                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                type="date"
                                                                label="Nueva fecha"
                                                                InputLabelProps={{ shrink: true }}
                                                                value={newItem.fecha}
                                                                onChange={(e) =>
                                                                    setNewItem({ ...newItem, fecha: e.target.value })
                                                                }
                                                            />

                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleAddItem(nota._id)}
                                                            >
                                                                <Check />
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {/* despliegue de ediciones */}
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl) && menuNoteId === nota._id && menuIdx !== null}
                                                        onClose={handleMenuClose}
                                                    >
                                                        <MenuItem
                                                            onClick={() => {
                                                                editingRoutine(notes.find(n => n._id === menuNoteId), menuIdx);
                                                                handleMenuClose();
                                                            }}
                                                        >
                                                            <Edit fontSize="small" color="warning" style={{ marginRight: 8 }} /> <Typography color="warning">Editar</Typography>
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => {
                                                                deleteNoteIndex(menuNoteId, menuIdx);
                                                                handleMenuClose();
                                                            }}
                                                        >
                                                            <Delete fontSize="small" color="error" style={{ marginRight: 8 }} /> <Typography color="error">Eliminar</Typography>
                                                        </MenuItem>
                                                    </Menu>

                                                    {/* edición de título principal */}
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
                                                                label="Editar Cuotas"
                                                                variant="outlined"
                                                                value={editingData.cuotas}
                                                                onChange={(e) => setEditingData({ ...editingData, cuotas: e.target.value })}
                                                            />

                                                            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    startIcon={<Save />}
                                                                    onClick={() => handleSaveEditNote(nota._id)}
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
                                </React.Fragment>
                            )

                            })}
                </Grid>
                <ModalConfirmacion isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={() => {
                    deleteNote(deleteId)
                    setShowModal(false)
                }}/>
            </Container>

            <Toaster/>
            <ScrollTop/>
        </div>
    );
}