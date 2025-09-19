import { Helmet } from "react-helmet";
import { useList } from "../../utils/hooks/useList";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, Container, Grid, IconButton, TextField, Typography, Tooltip, Box, CircularProgress } from "@mui/material";
import { Add, Cancel, Check, Delete, Edit, Save } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { ListInfo } from "../../component/common/Info/listInfo";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

export function Listado() {
    // Estados para manejar el listado principal
    const { list, addList, deleteNoteList, addListNote, deleteNewNote, editListNote, toggleCompleteDescription } = useList();
    const [titulo, setTitulo] = useState(""); 
    const [newNote, setNewNote] = useState({ 
        descripcion: '',
    });
    const [fecha, setFecha] = useState('0000-00-00');

    // Estados para el reconocimiento de voz
    const [isListeningItems, setIsListeningItems] = useState(false); // Controla si está escuchando artículos
    const [currentListId, setCurrentListId] = useState(null); // ID del listado actual siendo modificado por voz

    // Función para agregar un nuevo listado
    const addNoteList = () => {
        addList(titulo, fecha); 
        setTitulo(''); 
        setFecha('0000-00-00'); 
    };

    // Función para limpiar todos los inputs
    const cleanInputs = () => {
        setFecha("");
        setTitulo("");
    };

    // Función para agregar una nueva nota/artículo a un listado existente
    const handleAddNote = (noteId) => {
        if (!newNote) {
            alert("La nota está vacía");
            return;
        }

        if (newNote.descripcion.trim() === "") {
            alert("Notas no pueden estar vacías");
            return;
        }

        addListNote(noteId, newNote.descripcion); // Agregar la nota al listado
        setNewNote({ descripcion: "" });
    };

    
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('es-ES', { timeZone: 'UTC' });

    // Función para eliminar una nota específica de un listado
    const deleteNewNoteList = (id, listIndex) => {
        deleteNewNote(id, listIndex);
    };

    // Estados para manejar la edición de notas
    const [editingState, setEditingState] = useState({ id: null, idx: null }); // Almacena qué nota se está editando (id del listado e índice de la nota)
    const [editingItem, setEditingItem] = useState({ 
        descripcion: ''
    });

    // Función para iniciar la edición de una nota
    const editingNotesList = (lis, idx) => {
        setEditingState({ id: lis._id, idx }); // Establece qué nota editar
        setEditingItem({
            descripcion: typeof lis.descripcion[idx] === 'string'
                ? lis.descripcion[idx] // Si es string, usa directamente
                : lis.descripcion[idx]?.text || '' // Si es objeto, extrae el texto
        });
    };

    // Función para guardar los cambios de una nota editada
    const saveNewItem = async () => {
        editListNote(editingState.id, editingState.idx, editingItem.descripcion); 
        setEditingState({ id: null, idx: null }); 
        setEditingItem({ descripcion: '' });
    };

    // Referencia y estado para el reconocimiento de voz
    const recognition = useRef(null);
    const [loading, setLoading] = useState(false); // Loading durante reconocimiento de voz

    // Efecto para configurar el reconocimiento de voz
    useEffect(() => {
        recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.current.lang = 'es-ES'; // Configura idioma español
        recognition.current.interimResults = false; // Solo resultados finales

        // Evento cuando inicia el reconocimiento
        recognition.current.onstart = () => {
            setLoading(true);
        };

        // Evento cuando termina el reconocimiento
        recognition.current.onend = () => {
            setLoading(false);
        };

        // Evento cuando se obtiene resultado del reconocimiento
        recognition.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase(); // Texto reconocido

            if (!titulo) {
                setTitulo(transcript); // Si no hay título, establece el título
            } else if (!fecha || fecha === '0000-00-00') {
                // Lógica para procesar fechas por voz (comentada)
                // const parsedDate = parseSpeechDate(transcript);
                // if (parsedDate) {
                //     setFecha(parsedDate);
                // }
            }

            // Si hay título y fecha válida, agrega el listado
            if (titulo.trim() && fecha !== '0000-00-00') {
                addNoteList();
            }
        };

        // eslint-disable-next-line
    }, [titulo, fecha]);

    // Función para iniciar reconocimiento de voz para título/fecha
    const iniciarReconocimiento = () => {
        if (recognition.current) {
            recognition.current.start();
        }
    };

    // Función para iniciar reconocimiento de voz para artículos (simulación)
    const startListeningItems = (listId) => {
        setIsListeningItems(true);
        setCurrentListId(listId);
        // Simulación de reconocimiento de voz para artículos
        setTimeout(() => {
            setIsListeningItems(false);
        }, 2000);
    };

    return (
        <div className="gastos-container">
            <Helmet>
                <title> Listado de compras </title>
            </Helmet>

            <Box display="flex" justifyContent="flex-end" alignItems="flex-start" sx={{ width: '100%' }}>
                <Tooltip title="Términos" arrow>
                    <ListInfo />
                </Tooltip>
            </Box>

            <h1> Listado de compras </h1>

            {/* Sección de inputs para crear nuevo listado */}
            <Container>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                        <Box display="flex" gap={2}>
                            {/* Input para título del listado */}
                            <TextField
                                fullWidth
                                label="Título"
                                variant="outlined"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                size="medium"
                                InputProps={{ style: { height: 56 } }}
                            />

                            {/* Botón de reconocimiento de voz */}
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={iniciarReconocimiento}
                                    style={{ height: 56, minWidth: 56 }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : <RecordVoiceOverIcon />}
                                </Button>
                            </Grid>

                            {/* Input para fecha del listado */}
                            <TextField
                                fullWidth
                                label="Fecha"
                                variant="outlined"
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                size="medium"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ style: { height: 56 } }}
                            />

                            {/* Botón para agregar listado */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={addNoteList}
                                style={{ height: 56, minWidth: 56 }}
                                disabled={!titulo || fecha === '0000-00-00'}
                            >
                                <Check />
                            </Button>

                            {/* Botón para limpiar inputs */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={cleanInputs}
                                style={{ height: 56, minWidth: 56 }}
                            >
                                <CleaningServicesIcon />
                            </Button>
    
                        </Box>
                    </Grid>
                 
                </Grid>
            </Container>
            
            {/* Sección que muestra todos los listados de compras */}
            <Container style={{ marginTop: 50 }}>
                <Grid container spacing={6}>
                    {list.map((lis, index) => (
                        <Grid item xs={12} sm={6} md={4} key={lis._id || index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <Card
                                    className="note-card"
                                    sx={{
                                        borderRadius: 2,
                                        border: '2px solid rgba(105, 104, 104, 0.1)',
                                        boxShadow: "0 4px 8px 0 rgba(56, 56, 56, 0.2)",
                                    }}
                                >
                                    <CardContent sx={{ backgroundColor: "rgba(248, 246, 246, 0.1)" }}>
                                        <motion.div style={{ position: "relative", width: "100%" }}>
                                            {/* Botón para eliminar listado completo */}
                                            <IconButton
                                                color="error"
                                                onClick={() => deleteNoteList(lis._id)}
                                                style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
                                            >
                                                <Delete />
                                            </IconButton>

                                            {/* Información del listado (título y fecha) */}
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingRight: 40 }}>
                                                <Typography variant="h6" style={{ fontWeight: "bold", margin: "8px 0" }}>
                                                    {lis.titulo}
                                                </Typography>
                                                <Typography variant="body2" style={{ margin: '2px 0' }}>
                                                    {formatDate(lis.fecha)}
                                                </Typography>
                                            </div>
                                        </motion.div>

                                        {/* Lista de artículos/notas del listado */}
                                        <div style={{ marginTop: 18 }}>
                                            {Array.isArray(lis.descripcion) && lis.descripcion.map((desc, idx) => {
                                                // Maneja diferentes formatos de descripción (string u objeto)
                                                const descText = typeof desc === 'string' ? desc : desc?.text || '';
                                                const isCompleted = typeof desc === 'string' ? false : Boolean(desc?.completed);

                                                return (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            marginBottom: '8px',
                                                            padding: '8px',
                                                            backgroundColor: isCompleted ? '#f5f5f5' : 'transparent',
                                                            borderRadius: '4px',
                                                            flexDirection: editingState.id === lis._id && editingState.idx === idx ? 'column' : 'row'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                                                            {/* Botón para marcar/desmarcar como completado */}
                                                            <button
                                                                onClick={() => toggleCompleteDescription(lis._id, idx)}
                                                                style={{
                                                                    minWidth: '24px',
                                                                    height: '24px',
                                                                    borderRadius: '4px',
                                                                    border: `1px solid ${isCompleted ? '#4CAF50' : '#ccc'}`,
                                                                    backgroundColor: isCompleted ? '#4CAF50' : 'white',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: isCompleted ? 'white' : 'transparent',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '16px'
                                                                }}
                                                                aria-label="Completar artículo"
                                                            >
                                                                {isCompleted ? <Check fontSize="small" /> : ''}
                                                            </button>

                                                            {/* Texto de la nota/artículo */}
                                                            <Typography
                                                                style={{
                                                                    flex: 1,
                                                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                                                    color: isCompleted ? '#757575' : 'inherit',
                                                                    wordBreak: 'break-word',
                                                                }}
                                                            >
                                                                {descText || '(Nota vacía)'}
                                                            </Typography>

                                                            {/* Botones de acción según modo edición/normal */}
                                                            {editingState.id === lis._id && editingState.idx === idx ? (
                                                                // Botones durante edición (guardar/cancelar)
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <IconButton
                                                                        onClick={saveNewItem}
                                                                        size="small"
                                                                        color="primary"
                                                                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                                                                    >
                                                                        <Save />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => setEditingState({ id: null, idx: null })}
                                                                        size="small"
                                                                        color="secondary"
                                                                        style={{ backgroundColor: '#f44336', color: 'white' }}
                                                                    >
                                                                        <Cancel />
                                                                    </IconButton>
                                                                </div>
                                                            ) : (
                                                                // Botones en modo normal (eliminar/editar)
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <IconButton
                                                                        onClick={() => deleteNewNoteList(lis._id, idx)}
                                                                        size="small"
                                                                        color="error"
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => editingNotesList(lis, idx)}
                                                                        size="small"
                                                                        color="primary"
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Input de edición cuando está en modo edición */}
                                                        {editingState.id === lis._id && editingState.idx === idx && (
                                                            <div style={{ width: '100%', marginTop: '8px' }}>
                                                                <TextField
                                                                    fullWidth
                                                                    size="small"
                                                                    label="Editar nota"
                                                                    variant="outlined"
                                                                    value={editingItem.descripcion}
                                                                    onChange={(e) => setEditingItem({ ...editingItem, descripcion: e.target.value })}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Sección para agregar nuevos artículos al listado */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Nuevo artículo"
                                                    value={newNote.descripcion}
                                                    onChange={(e) => setNewNote({ ...newNote, descripcion: e.target.value })}
                                                    variant="standard"
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(lis._id)}
                                                />
                                                <Button
                                                    onClick={() => handleAddNote(lis._id)}
                                                    style={{ minWidth: 40, height: 40 }}
                                                >
                                                    <Add />
                                                </Button>
                                                <Button
                                                    onClick={() => startListeningItems(lis._id)}
                                                    style={{
                                                        minWidth: 40,
                                                        height: 40,
                                                        backgroundColor: isListeningItems && currentListId === lis._id ? '#ffebee' : 'transparent'
                                                    }}
                                                    disabled={loading}
                                                >
                                                    {loading ? <CircularProgress size={20} /> : <RecordVoiceOverIcon />}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Toaster />
        </div>
    );
}




          // const getDescText = (descItem) => {
                                                //     if (typeof descItem === 'string') return descItem;
                                                //     if (descItem && typeof descItem === 'object') return descItem.text || '';
                                                //     return '';
                                                // };

                              
                                                // const getIsCompleted = (descItem) => {
                                                //     if (typeof descItem === 'string') return false;
                                                //     if (descItem && typeof descItem === 'object') return descItem.completed || false;
                                                //     return false;
                                                // };
