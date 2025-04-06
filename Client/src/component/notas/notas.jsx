import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Cancel } from '@mui/icons-material';
import { useNotas } from '../../utils/hooks/useNotas';
import "./notas.css";

export function Notas() {
    const {
        notas,
        newNota,
        setNewNota,
        open,
        handleOpen,
        close,
        visible,
        addNota,
        deleteNota,
        editingId,
        setEditingId,
        editingData,
        setEditingData,
        editNota,
        saveEditNotas,
    } = useNotas();

    return (
        <div className="notas-container">
            <Button className='outlined' onClick={handleOpen}>
                <CircleNotificationsIcon style={{ display: visible ? 'block' : 'none' }} />
            </Button>

            <Dialog open={open} onClose={close}>
                <DialogActions className="icon-noti">
                    <Button onClick={close} color="primary"><Cancel /></Button>
                </DialogActions>

                <DialogTitle>Notas Adicionales</DialogTitle>
                <DialogContent>
                    <div className="input-notas">
                        <input
                            type="text"
                            value={newNota}
                            onChange={(e) => setNewNota(e.target.value)}
                            placeholder="Escribe una nota"
                        />
                        <Button onClick={addNota} color="primary"><AddIcon /></Button>
                    </div>

                    <DialogContentText>
                        <table className='notas-table'>
                            <tbody>
                                {notas.map((nota, index) => (
                                    <tr key={index} className="nota-row">
                                        <td>
                                            <Typography variant="body1" style={{ fontWeight: "bold" }}>
                                                {nota.titulo}
                                            </Typography>
                                            {editingId === nota._id && (
                                                <div style={{ marginTop: 8 }}>
                                                    <TextField 
                                                        fullWidth
                                                        size="small"
                                                        label="Editar título"
                                                        variant="outlined"
                                                        value={editingData.titulo}
                                                        onChange={(e) => setEditingData({ ...editingData, titulo: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <div className="actions">
                                            {editingId === nota._id ? (
                                                <>
                                                    <IconButton
                                                        className="check"
                                                        sx={{ color: 'green', backgroundColor: 'lightgreen', borderRadius: '4px', padding: '5px' }}
                                                        onClick={() => saveEditNotas(nota._id)}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        className="cancel"
                                                        sx={{ color: 'white', backgroundColor: 'red', borderRadius: '4px', padding: '5px' }}
                                                        onClick={() => {
                                                            setEditingId(null); 
                                                            setEditingData({ titulo: '' }); 
                                                        }}    
                                                    >
                                                        <Cancel />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <IconButton
                                                    className="edit"
                                                    sx={{ color: 'grey', fontFamily: "Montserrat, sans-serif" }}
                                                    onClick={() => editNota(nota)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                className="trash"
                                                sx={{ color: 'red', fontFamily: "Montserrat, sans-serif" }}
                                                onClick={() => deleteNota(nota._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
