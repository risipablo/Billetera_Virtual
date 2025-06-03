import { Helmet } from "react-helmet";
import { useList } from "../../utils/hooks/useList";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, Container, Grid, IconButton, TextField, Typography ,Tooltip, Box} from "@mui/material";
import { Add, Cancel, Check, Delete, Edit, Save } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { ListInfo } from "../../component/common/Info/listInfo";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

export function Listado(){
    const {list, addList, deleteNoteList, addListNote, deleteNewNote, editListNote, toggleCompleteDescription} = useList()
    const [titulo, setTitulo] = useState("")
    const [newNote, setNewNote] = useState({
        descripcion: '',
    })
    const [fecha, setFecha] = useState('0000-00-00')

    const addNoteList = () => {
        addList(titulo, fecha)
        setTitulo('')
        setFecha('0000-00-00')
    }

    const handleAddNote = (noteId) => {
        if(!newNote){
            alert("La nota esta vacía")
            return;
        }

        if(newNote.descripcion.trim() === ""){
            alert("Notas no pueden estar vacias")
            return;
        }

        addListNote(noteId, newNote.descripcion)
        setNewNote({descripcion:""})
    }

    const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC' });

    const deleteNewNoteList  = (id, listIndex) => {
        deleteNewNote(id, listIndex)
    }

    // edicion de nota
    const [editingState, setEditingState] = useState({ id: null, idx: null })
    const [editingItem, setEditingItem] = useState({
        descripcion: ''
    })

    const editingNotesList = (lis, idx) => {
        setEditingState({ id: lis._id, idx })
        setEditingItem({
            descripcion: lis.descripcion[idx]
        })
    }

const saveNewItem = async () => {
    
        editListNote(editingState.id, editingState.idx, editingItem.descripcion);
        setEditingState({ id: null, idx: null });
        setEditingItem({ descripcion: '' });
    
};


    const recognition = useRef(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.current.lang = 'es-ES'; // Idioma en español
        recognition.current.interimResults = false;
    
        recognition.current.onstart = () => {
            setLoading(true);
        };
    
        recognition.current.onend = () => {
            setLoading(false);
        };
    
        recognition.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();

    
            if (!titulo) {
                setTitulo(transcript); // tarea
            } else if (!fecha || fecha === '0000-00-00') {
                const parsedDate = parseSpeechDate(transcript)
                if (parsedDate){
                    setFecha(parsedDate)
                }
            }
    
            // Si ambos campos están llenos, agrega la nota automáticamente
            if (titulo.trim() && fecha !== '0000-00-00') {
                addTarea();
            }
        };
    }, [titulo, fecha]);
    
    const iniciarReconocimiento = () => {
        if (recognition.current) {
            recognition.current.start();
        }
    };

    return(
        <div className="gastos-container">
            <Helmet>
                <title> Listado de compras </title>
            </Helmet>

            <Box display="flex" justifyContent="flex-end" alignItems="flex-start" sx={{ width: '100%' }}>
                <Tooltip title="Términos" arrow>
                    <ListInfo/>
                </Tooltip>
            </Box>
            

            <h1> Listado de compras </h1>
            
            {/* inputs */}
            <Container>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                            <TextField 
                                fullWidth
                                label="Título"
                                variant="outlined"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                size="medium"
                                InputProps={{ style: { height: 56 } }} // Ajusta la altura
                            />
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                            <TextField 
                                fullWidth
                                label="Fecha"
                                variant="outlined"
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                size="medium"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{ style: { height: 56 } }} // Ajusta la altura
                            />
                        </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Box display="flex" gap={3}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={addNoteList}
                                style={{ height: 56, minWidth: 56 }}
                            >
                                <Check/>
                            </Button>

                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={iniciarReconocimiento}
                                style={{ height: 56, minWidth: 56 }}
                            >
                                <RecordVoiceOverIcon/>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* listado */}
            <Container style={{ marginTop: 50}}>
                <Grid container spacing={6}>
                    {list.map((lis, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <Card className="note-card" 
                                    sx={{
                                    borderRadius: 2,
                                    border:'2px solid rgba(105, 104, 104, 0.1)' ,
                                    boxShadow: "0 4px 8px 0 rgba(56, 56, 56, 0.2)",
                                    }}>

                                    <CardContent   
                                    sx={{
                                        backgroundColor: "rgba(248, 246, 246, 0.1)", 
                                    }}>
                                        <motion.div style={{ position: "relative", width: "100%" }}>
                                            <IconButton
                                                color="error"
                                                onClick={() => deleteNoteList(lis._id)}
                                                style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
                                                aria-label="Eliminar lista"
                                            >
                                                <Delete />
                                            </IconButton>

                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingRight: 40 }}>
                                                <Typography variant="h6" style={{ fontWeight: "bold", margin:"8px 0" }}>
                                                    {lis.titulo}
                                                </Typography>
                                                <Typography 
                                                variant="body2"
                                                    style={{
                                                        // fontWeight: '700',
                                                        margin: '2px 0',
                                                        display: 'inline-block',
                                                    }}>
                                                    {formatDate(lis.fecha)}
                                                </Typography>
                                            </div>

                                        </motion.div>

                                        <div style={{ marginTop: 18 }}>
                                        {Array.isArray(lis.descripcion) && lis.descripcion.map((desc, idx) => {
                                            const getDescText = (descItem) => 
                                            typeof descItem === 'string' ? descItem : descItem?.text || '';
                                            
                                            const getIsCompleted = (descItem) => 
                                            typeof descItem === 'string' ? false : Boolean(descItem?.completed);
                                            
                                            const descText = getDescText(desc);
                                            const isCompleted = getIsCompleted(desc);

                                            return (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '8px',
                                                padding: '8px',
                                                backgroundColor: isCompleted ? '#f5f5f5' : 'transparent',
                                                borderRadius: '4px',
                                                flexDirection: editingState.id === lis._id && editingState.idx === idx ? 'column' : 'row'
                                            }}>
                                                {/* Checkbox - siempre visible */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
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
                                                    flexShrink: 0,
                                                    }}
                                                >
                                                    {isCompleted && '✓'}
                                                </button>

                                                {/* Mostrar siempre el texto */}
                                                <Typography 
                                                    style={{ 
                                                    flex: 1,
                                                    textAlign: "left",
                                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                                    color: isCompleted ? '#757575' : 'inherit',
                                                    wordBreak: 'break-word',
                                                    display: editingState.id === lis._id && editingState.idx === idx ? 'block' : 'block'
                                                    }}
                                                >
                                                    {descText || '(Nota vacía)'}
                                                </Typography>

                                                {/* Botones de acción (eliminar/editar o guardar/cancelar) */}
                                                {editingState.id === lis._id && editingState.idx === idx ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                    <IconButton 
                                                        onClick={saveNewItem}
                                                        size="small"
                                                        color="primary"
                                                        aria-label="Guardar"
                                                        style={{ backgroundColor: '#4CAF50', color: 'white' }}
                                                    >
                                                        <Save />
                                                    </IconButton>
                                                    
                                                    <IconButton 
                                                        onClick={() => setEditingState({ id: null, idx: null })}
                                                        size="small"
                                                        color="secondary"
                                                        aria-label="Cancelar"
                                                        style={{ backgroundColor: '#f44336', color: 'white' }}
                                                    >
                                                        <Cancel />
                                                    </IconButton>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                    <IconButton 
                                                        onClick={() => deleteNewNoteList(lis._id, idx)}
                                                        size="small"
                                                        color="error"
                                                        aria-label="Eliminar nota"
                                                    >
                                                        <Delete />
                                                    </IconButton>

                                                    <IconButton 
                                                        onClick={() => editingNotesList(lis, idx)}
                                                        size="small"
                                                        color="primary"
                                                        aria-label="Editar nota"
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    </div>
                                                )}
                                                </div>

                                                {/* Campo de edición (solo en modo edición) */}
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
                                            )
                                        })}

                                        {/* Sección para añadir nuevas notas */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                            <TextField
                                            fullWidth
                                            size="small"
                                            label="Nueva descripción"
                                            value={newNote.descripcion}
                                            onChange={(e) => setNewNote({ ...newNote, descripcion: e.target.value })}
                                            variant="standard"
                                            InputProps={{
                                                disableUnderline: false,
                                                style: { background: 'transparent' }
                                            }}
                                            />
                                            <Button
                                            onClick={() => handleAddNote(lis._id)}
                                            style={{
                                                minWidth: 40,
                                                height: 40,
                                                padding: 0,
                                                background: 'none',
                                                boxShadow: 'none',
                                                transition: 'background 0.2s, color 0.2s',
                                                color: '#1976d2'
                                            }}
                                            disableElevation
                                            variant="text"
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(25, 118, 210, 0.08)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'none'}
                                            >
                                            <Add />
                                            </Button>
                                        </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </motion.div>
                        </Grid>
                        
                    ))}
                    <Toaster/>
                </Grid>
            </Container>


        </div>
    )
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
