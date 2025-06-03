import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from 'react';
import "./info.css";
import { Button, Grid } from '@mui/material';

export function GastoInfo() {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className='info-container'>
            <HelpOutlineIcon style={{ cursor: 'pointer' }} onClick={handleClick} />
            {open && (
                <div className="custom-modal-overlay" onClick={handleClose}>
                    <div className="custom-modal" onClick={e => e.stopPropagation()}>
                        <span className="close-btn" onClick={handleClose}>&times;</span>
                        <h2>¿Cómo funciona esta sección?</h2>
                        <p>
                            Aquí puedes registrar todos tus gastos diarios, mensuales o anuales.
                            Usa los métodos de pago y estados para organizarte.
                            Con el buscador puedes encontrar gastos específicos por precio, fecha, estado o tipo de pago.
                            Los filtros te ayudan a ver solo lo que necesitas.
                        </p>
                        <p>
                            Siempre verás tu último gasto registrado, un contador de gastos totales
                            (que se ajusta con los filtros) y un input para establecer un límite mensual.
                            El sistema te avisará cuando estés cerca de ese límite y marcará en rojo si lo superas.
                        </p>
                        <p>
                            A la izquierda, la campanita te permite agregar notas para recordar gastos fijos o estimados.
                        </p>
                        <p>
                            Nota: Los estados “Deben”, “Cuotas”, “Inversión” o “Cajero” no se suman al total.
                            El estado “Impago” sí se suma, para que tengas en cuenta los pagos futuros.
                            Puedes editar cualquier gasto cuando lo necesites.
                        </p>
                        <Grid item>
                            <Button variant="contained" color="primary" className="agregar" sx={{ fontFamily: "Montserrat, sans-serif", margin: "18px auto" }} onClick={handleClose}> 
                                Entendido 
                            </Button>
                        </Grid>
                    </div>
                </div>
                
            )}
       
        </div>
    );
}
