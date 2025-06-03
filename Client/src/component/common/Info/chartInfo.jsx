import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from 'react';
import "./info.css";
import { Button, Grid } from '@mui/material';

export function ChartInfo() {
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
                          <div class="info-content">
                            <p>
                              <strong>En esta sección encontrarás todos tus datos de gastos organizados en gráficos y estadísticas.</strong>
                            </p>
                            <ul>
                              <li>✅ Qué producto fue el más comprado.</li>
                              <li>✅ Qué tipo de pago fue el más utilizado.</li>
                              <li>✅ Tus inversiones.</li>
                              <li>✅ Qué mes y año registraron los mayores gastos.</li>
                            </ul>
                            <p>
                              También tendrás filtros para seleccionar y comparar los datos que más te interesan.
                            </p>
                            <p>
                              Al final, verás un cuadro resumen con los promedios finales de tus gastos.
                            </p>

                          </div>
                          
                              <Grid item>
                                  <Button variant="contained" color="primary" className="agregar" sx={{ fontFamily: "Montserrat, sans-serif" }} onClick={handleClose}> 
                                      Entendido 
                                  </Button>
                              </Grid>
                    </div>
                </div>
                
            )}
       
        </div>
    );
}