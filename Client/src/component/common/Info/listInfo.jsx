import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from 'react';
import "./info.css"
import { Button, Grid } from '@mui/material';

export function ListInfo(){
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
                        En esta sección podrás crear un listado de compras para asegurarte de no olvidar nada. Dentro del listado tendrás la opción de ir tachando uno por uno los productos a medida que los vayas consiguiendo, ayudándote a mantener un control visual claro y ordenado. Además, podrás agregar, editar o eliminar productos fácilmente, adaptando la lista según tus necesidades.
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
