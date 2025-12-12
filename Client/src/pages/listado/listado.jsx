import { Helmet } from "react-helmet";
import { useList } from "../../utils/hooks/useList";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Container, Grid, IconButton, TextField, Typography, Tooltip, Box, Menu, MenuItem } from "@mui/material";
import { Add, Cancel, Check, Delete, Edit, MoreVert, Save, Undo } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { ListInfo } from "../../component/common/Info/listInfo";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import "../listado/listado.css"
import ModalConfirmacion from "../../component/modal/modalConfirm";
import ReactPaginate from "react-paginate";

export function Listado() {
    
    const { list, addList, deleteNoteList, addListNote, deleteNewNote, editListNote, listComplete,toggleCompleteDescription, deleteAllList } = useList();
    const [titulo, setTitulo] = useState(""); 
    const [newNote, setNewNote] = useState({ 
        descripcion: '',
    });
    const [fecha, setFecha] = useState('0000-00-00');
  
    // Estados para el reconocimiento de voz
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [currentListId, setCurrentListId] = useState(null);
    const [itemsListening, setItemsListening] = useState(false)
    const recognitionRef = useRef(null);



    // Configurar el reconocimiento de voz
    useEffect(() => {
        // Verificar si el navegador soporta reconocimiento de voz
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'es-ES';

            recognitionRef.current.onstart = () => {
                setLoading(true);
                setIsListening(true);
                console.log(isListening)
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                
                // Agregar el texto reconocido como nuevo artículo si estamos en modo items
                if (itemsListening && currentListId && transcript.trim()) {
                    addListNote(currentListId, transcript.trim());
                    // Detener automáticamente después de agregar la nota
                    stopListeningItems();
                }
                
                setLoading(false);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Error en reconocimiento de voz:', event.error);
                setLoading(false);
                setIsListening(false);
                setItemsListening(false);
                setCurrentListId(null);
                
                // Mostrar mensaje de error al usuario
                if (event.error === 'not-allowed') {
                    alert('Permiso de micrófono denegado. Por favor, permite el acceso al micrófono.');
                } else {
                    alert('Error en el reconocimiento de voz. Intenta nuevamente.');
                }
            };

            recognitionRef.current.onend = () => {
                setLoading(false);
                setIsListening(false);
                setItemsListening(false);
                setCurrentListId(null);
            };
        } else {
            console.warn('El reconocimiento de voz no es compatible con este navegador');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [itemsListening, currentListId]);

    // Función para iniciar el reconocimiento de voz para items
    const startListeningItems = (listId) => {
        if (!recognitionRef.current) {
            alert('El reconocimiento de voz no está disponible en tu navegador');
            return;
        }

        setCurrentListId(listId);
        setItemsListening(true);

        try {
            // Detener cualquier reconocimiento previo e iniciar nuevo
            recognitionRef.current.stop();
            setTimeout(() => {
                recognitionRef.current.start();
            }, 100);

        } catch (error) {
            console.error('Error al iniciar reconocimiento para items:', error);
            setItemsListening(false);
            setCurrentListId(null);
        }
    };

    const stopListeningItems = () => {
        if (recognitionRef.current && itemsListening) {
            recognitionRef.current.stop();
            setItemsListening(false);
            setCurrentListId(null);
        }
    };

    const addNoteList = () => {
        addList(titulo, fecha); 
        setTitulo(''); 
        setFecha('0000-00-00'); 
    };

    
    const cleanInputs = () => {
        setFecha("");
        setTitulo("");
    };

    
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

    
    const deleteNewNoteList = (id, listIndex) => {
        deleteNewNote(id, listIndex);
    };

    
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


        const [showModal,setShowModal] = useState(false)

        const deleteAll = () => {
            setShowModal(true)
        }

        const handleDeleteAll = () => {
            deleteAllList()
            setShowModal(false)
        }


        const [currentPage, setCurrentPage] = useState(0)
        const [itemPerPage, setItemsPerPage] = useState(3)
    
        const pageCount = Math.ceil(list.length / itemPerPage)
        const offset = currentPage * itemPerPage
        const currentItems = list.slice(offset, offset + itemPerPage)
        
        
        

   return (
    <Box className="gastos-container">
        <Helmet>
            <title>Listado de compras</title>
        </Helmet>

        {/* Título centrado */}
     

        <Box display="flex" justifyContent="flex-end" alignItems="flex-start" sx={{ width: '100%' }}>
            <Tooltip title="Términos" arrow>
                <ListInfo />
            </Tooltip>
        </Box>

           <h1 >
            Listado de compras
        </h1>

        {/* Sección de inputs para crear nuevo listado */}
        <Container
            maxWidth="md"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={10} lg={8}>
                    <Box
                        display="flex"
                        gap={2}
                        alignItems="center"
                        justifyContent="center"
                    >
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

   <Button 
    onClick={deleteAll}
    variant="contained"
    color="error"
    size="small"
    startIcon={<Delete fontSize="small" />}
    sx={{
        mt: 3,
        mb: 2,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        padding: '7px 18px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: '#dc2626',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
        },
        '&:active': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
        }
    }}
>
    Eliminar todo
</Button>

        {/* Sección que muestra todos los listados de compras */}

        {
            list.length === 0 &&
            <Typography variant="h6" align="center" sx={{ mt: 4, color: '#757575' }}>
                No hay listados de compras disponibles por el momento
            </Typography>
        }
        <Container style={{ marginTop: 50 }}>
            <Grid container spacing={6}>
                {currentItems.map((lis, index) => (
                    <React.Fragment key={lis._id || index}>
                        <Grid item xs={12} sm={6} md={4}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: lis.completed ? 1 : 1.01 }}
                            >
                                <Card
                                    className={`note-card ${lis.completed ? 'completed-note' : 'active-note'}`}
                                    sx={{
                                        borderRadius: 2,
                                        border: '2px solid rgba(105, 104, 104, 0.3)',
                                        boxShadow: "0 4px 8px 0 rgba(56, 56, 56, 0.3)",
                                        // Si quieres que toda la card tenga menor opacidad al completarla:
                                        opacity: lis.completed ? 0.85 : 1,
                                    }}
                                    onClick={() => { /* si tienes acción al click de la card, mantén o elimina */ }}
                                >
                                    <CardContent sx={{ paddingBottom: 2 }}>
                                        {/* HEADER: título/fecha a la izquierda, botones a la derecha */}
                                        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    className={`note-title ${lis.completed ? 'completed-title' : ''}`}
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        margin: '8px 0',
                                                        textDecoration: lis.completed ? 'line-through' : 'none'
                                                    }}
                                                >
                                                    {lis.titulo}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    className={`note-date ${lis.completed ? 'completed-date' : ''}`}
                                                    sx={{ margin: '2px 0', color: lis.completed ? '#757575' : 'inherit' }}
                                                >
                                                    {formatDate(lis.fecha)}
                                                </Typography>
                                            </Box>

                                            {/* Controles a la derecha */}
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {/* Botón completar / deshacer (derecha) */}
                                                <IconButton
                                                    color={lis.completed ? "success" : "primary"}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        listComplete(lis._id);
                                                    }}
                                                    size="small"
                                                    aria-label={lis.completed ? "Deshacer" : "Completar"}
                                                >
                                                    {lis.completed ? <Undo /> : <Check />}
                                                </IconButton>

                                                {/* Botón de tres puntos que abre el menu */}
                                                <IconButton
                                                    color="primary"
                                                    onClick={(e) => handleMenuOpen(e, lis._id, null)}
                                                    size="small"
                                                    aria-label="Más opciones"
                                                >
                                                    <MoreVert />
                                                </IconButton>

                                                {/* Menu con la opción eliminar adentro */}
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && menuNoteId === lis._id && menuIdx === null}
                                                    onClose={handleMenuClose}
                                                >
                                                    <MenuItem
                                                        onClick={() => { handleMenuClose(); deleteNoteList(lis._id); }}
                                                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                                    >
                                                        <Delete fontSize="small" color="error" /> Eliminar
                                                    </MenuItem>
                                                </Menu>
                                            </Box>
                                        </Box>

                                        {/* Lista de artículos/notas del listado */}
                                        <div className="note-items-container" style={{ marginTop: 18 }}>
                                            {Array.isArray(lis.descripcion) && lis.descripcion.map((desc, idx) => {
                                                const descText = typeof desc === 'string' ? desc : desc?.text || '';
                                                const isCompleted = typeof desc === 'string' ? false : Boolean(desc?.completed);

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`note-item ${isCompleted ? 'completed-item' : 'active-item'} ${lis.completed ? 'parent-completed' : ''}`}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            marginBottom: '8px',
                                                            padding: '8px',
                                                            backgroundColor: isCompleted ? '#f5f5f5' : 'transparent',
                                                            borderRadius: '4px',
                                                            flexDirection: editingState.id === lis._id && editingState.idx === idx ? 'column' : 'row',
                                                            border: isCompleted ? '1px solid #e0e0e0' : '1px solid transparent',
                                                            opacity: lis.completed ? 0.7 : 1,
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                                                            {/* Botón para marcar/desmarcar como completado */}
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleCompleteDescription(lis._id, idx); }}
                                                                className={`complete-toggle ${isCompleted ? 'item-completed' : 'item-active'}`}
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
                                                                className={`item-text ${isCompleted ? 'item-text-completed' : ''}`}
                                                                style={{
                                                                    flex: 1,
                                                                    textDecoration: (isCompleted || lis.completed) ? 'line-through' : 'none',
                                                                    color: (isCompleted || lis.completed) ? '#757575' : 'inherit',
                                                                    wordBreak: 'break-word',
                                                                }}
                                                            >
                                                                {descText || '(Nota vacía)'}
                                                            </Typography>

                                                            {/* Botones de acción según modo edición/normal */}
                                                            {editingState.id === lis._id && editingState.idx === idx ? (
                                                                <div className="editing-buttons" style={{ display: 'flex', gap: '8px' }}>
                                                                    <IconButton
                                                                        onClick={(e) => { e.stopPropagation(); saveNewItem(); }}
                                                                        size="small"
                                                                        color="primary"
                                                                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                                                                    >
                                                                        <Save />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={(e) => { e.stopPropagation(); setEditingState({ id: null, idx: null }); }}
                                                                        size="small"
                                                                        color="secondary"
                                                                        style={{ backgroundColor: '#f44336', color: 'white' }}
                                                                    >
                                                                        <Cancel />
                                                                    </IconButton>
                                                                </div>
                                                            ) : (
                                                                <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                                                                    <IconButton
                                                                        onClick={(e) => { e.stopPropagation(); deleteNewNoteList(lis._id, idx); }}
                                                                        size="small"
                                                                        color="error"
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={(e) => { e.stopPropagation(); editingNotesList(lis, idx); }}
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
                                                            <div className="editing-input" style={{ width: '100%', marginTop: '8px' }}>
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
                                            <div className={`add-item-section ${lis.completed ? 'completed-add-section' : ''}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    marginBottom: 12,
                                                    opacity: lis.completed ? 0.6 : 1
                                                }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={lis.completed ? "Lista completada" : "Nuevo artículo"}
                                                    value={newNote.descripcion}
                                                    onChange={(e) => setNewNote({ ...newNote, descripcion: e.target.value })}
                                                    variant="standard"
                                                    onKeyDown={(e) => e.key === 'Enter' && !lis.completed && handleAddNote(lis._id)}
                                                    disabled={lis.completed}
                                                />
                                                <Button
                                                    onClick={(e) => { e.stopPropagation(); !lis.completed && handleAddNote(lis._id); }}
                                                    style={{ minWidth: 40, height: 40 }}
                                                    disabled={lis.completed}
                                                >
                                                    <Add />
                                                </Button>

                                                {/* Botón de reconocimiento de voz para items */}
                                                <Tooltip
                                                    title={lis.completed
                                                        ? "Lista completada"
                                                        : itemsListening && currentListId === lis._id
                                                            ? "Detener reconocimiento"
                                                            : "Agregar artículo por voz"}
                                                    arrow
                                                >
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!lis.completed) {
                                                                itemsListening && currentListId === lis._id
                                                                    ? stopListeningItems()
                                                                    : startListeningItems(lis._id);
                                                            }
                                                        }}
                                                        style={{
                                                            minWidth: 40,
                                                            height: 40,
                                                            backgroundColor: itemsListening && currentListId === lis._id ? '#f44336' : 'transparent',
                                                            color: itemsListening && currentListId === lis._id ? 'white' : 'inherit'
                                                        }}
                                                        disabled={loading || lis.completed}
                                                    >
                                                        {itemsListening && currentListId === lis._id ? (
                                                            <Box
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'white',
                                                                    animation: 'pulse 1s infinite'
                                                                }}
                                                            />
                                                        ) : (
                                                            <RecordVoiceOverIcon />
                                                        )}
                                                    </Button>
                                                </Tooltip>
                                            </div>

                                            {/* Indicador de estado de reconocimiento para items */}
                                            {itemsListening && currentListId === lis._id && !lis.completed && (
                                                <Box
                                                    sx={{
                                                        mt: 1,
                                                        p: 1,
                                                        backgroundColor: '#fff3cd',
                                                        borderRadius: 1,
                                                        border: '1px solid #ffeaa7'
                                                    }}
                                                >
                                                    <Typography variant="body2" color="#856404" align="center">
                                                        🎤 Escuchando... Di el artículo que quieres agregar
                                                    </Typography>
                                                </Box>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Container>


        <Toaster />
        <ModalConfirmacion isOpen={showModal} onClose={() => setShowModal(false)}  onConfirm={handleDeleteAll} />
               {
                pageCount > 1 && (
                    <ReactPaginate
                    previousLabel="Anterior"
                    nextLabel="Siguiente"
                    pageCount={pageCount}
                    onPageChange={({ selected }) => setCurrentPage(selected)}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item previous"
                    previousLinkClassName="page-link"
                    nextClassName="page-item next"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item break"
                    breakLinkClassName="page-link"
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    />
                )
            }
    </Box>
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
