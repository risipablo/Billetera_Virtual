import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from 'react';
import "./info.css"
import { Button, Grid } from '@mui/material';

export function NoteInfo(){
    const [open , setOpen] = useState(false)

    const handleClick = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return(
        <div className='info-container'>
            <HelpOutlineIcon style={{ cursor: 'pointer' }} onClick={handleClick} />
            {open && (
                <div className="custom-modal-overlay" onClick={handleClose}>
                    <div className="custom-modal" onClick={e => e.stopPropagation()}>
                        <span className="close-btn" onClick={handleClose}>&times;</span>
                        <p className="modal-text">
                            <strong>📝 Sección de Notas Adicionales</strong><br /><br />
                            En esta sección podrás registrar gastos masivos que serán pagados en cuotas, o simplemente productos cuyo precio quieras recordar.<br /><br />
                            🔹 Podrás anotar el número de cuotas y la fecha correspondiente.<br />
                            🔹 Una vez ingresado el gasto principal, podrás añadir notas internas para llevar un seguimiento de los pagos realizados.<br /><br />
                            <strong>Ejemplo práctico:</strong><br />
                            📌 "Remera - 3 cuotas. Total a pagar: $12.000. Fecha: 19 de abril de 2025."<br />
                            Después, puedes agregar una nota como:<br />
                            📌 "Primera cuota: $4.000. Fecha: 19 de mayo de 2025."<br /><br />
                            Esto te ayudará a tener un control detallado de cuánto ya pagaste y cuánto te queda por pagar.<br /><br />
                            ✏️ Además, podrás editar cualquier dato cuando lo necesites.

                            
                        </p>
                        <Grid item>
                            <Button variant="contained" color="primary" className="agregar" sx={{ fontFamily: "Montserrat, sans-serif" }} onClick={handleClose}> 
                                Entendido 
                            </Button>
                        </Grid>
                    </div>

                </div>
            )}
        </div>
    )
}
