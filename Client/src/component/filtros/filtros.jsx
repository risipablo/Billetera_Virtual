
import { useEffect, useState } from "react";
import {  Grid, Select, MenuItem, Button, Hidden } from "@mui/material";

export function Filtros({ gastos, setGastosFiltrados }) {
    const [mes, setMes] = useState('');
    const [metodo, setMetodo] = useState('');
    const [condicion, setCondicion] = useState('');
    const [año, setAño] = useState('')

    const filtros = () => {
        let gastosFiltrados = gastos;

        if (mes.trim() !== '') {
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.mes.toLowerCase() === mes.toLowerCase());
        }
        if (metodo.trim() !== '') {
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.metodo.toLowerCase() === metodo.toLowerCase());
        }
        if (condicion.trim() !== '') {
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.condicion.toLowerCase() === condicion.toLowerCase());
        }
        if (año.trim() !== '') {
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.año.toLowerCase() === año.toLowerCase());
        }


        setGastosFiltrados(gastosFiltrados);
    };

    const ResetFilter = () => {
        setMes("");
        setMetodo("");
        setCondicion("");
        setAño('')
    };

    useEffect(() => {
        filtros();
    }, [mes, metodo, condicion, año]);

    return (
        <>
            <Hidden smDown>
                <Grid container spacing={2} alignItems="center" marginTop={1} marginBottom={2}>
                    <Grid item xs>
                        <Select
                            fullWidth
                            value={mes}
                            onChange={(e) => setMes(e.target.value)}
                            displayEmpty
                            size="small" 
                        >
                            <MenuItem value=""><em>Seleccionar Mes</em></MenuItem>
                            <MenuItem value="enero">Enero</MenuItem>
                            <MenuItem value="febrero">Febrero</MenuItem>
                            <MenuItem value="marzo">Marzo</MenuItem>
                            <MenuItem value="abril">Abril</MenuItem>
                            <MenuItem value="mayo">Mayo</MenuItem>
                            <MenuItem value="junio">Junio</MenuItem>
                            <MenuItem value="julio">Julio</MenuItem>
                            <MenuItem value="agosto">Agosto</MenuItem>
                            <MenuItem value="septiembre">Septiembre</MenuItem>
                            <MenuItem value="octubre">Octubre</MenuItem>
                            <MenuItem value="noviembre">Noviembre</MenuItem>
                            <MenuItem value="diciembre">Diciembre</MenuItem>
                        </Select>
                    </Grid>
    
                    <Grid item xs>
                        <Select
                            fullWidth
                            value={metodo}
                            onChange={(e) => setMetodo(e.target.value)}
                            displayEmpty
                            size="small" 
                        >
                            <MenuItem value=""><em>Seleccionar Pago</em></MenuItem>
                            <MenuItem value="Débito">Débito</MenuItem>
                            <MenuItem value="Crédito">Crédito</MenuItem>
                            <MenuItem value="Efectivo">Efectivo</MenuItem>
                            <MenuItem value="Mercado Pago">Mercado Pago</MenuItem>
                        </Select>
                    </Grid>

                                        <Grid item xs>
                        <Select
                            fullWidth
                            value={año}
                            onChange={(e) => setAño(e.target.value)}
                            displayEmpty
                            size="small" 
                        >
                            <MenuItem value=""><em>Seleccionar Año</em></MenuItem>
                            <MenuItem value="2024">2024</MenuItem>
                            <MenuItem value="2025">2025</MenuItem>
                            <MenuItem value="2026">2026</MenuItem>
                            <MenuItem value="2027">2027</MenuItem>
                            <MenuItem value="2028">2028</MenuItem>
                        </Select>
                    </Grid>
    
    
                    <Grid item xs>
                        <Select
                            fullWidth
                            value={condicion}
                            onChange={(e) => setCondicion(e.target.value)}
                            displayEmpty
                            size="small" 
                        >
                            <MenuItem value=""><em>Estado</em></MenuItem>
                            <MenuItem value="Pagado">Pagado</MenuItem>
                            <MenuItem value="Impago">Impago</MenuItem>
                            <MenuItem value="Cuotas">Cuotas</MenuItem>
                            <MenuItem value="Devolver"> Devolver</MenuItem>
                            <MenuItem value="Deben">Deben</MenuItem>
                            <MenuItem value="Cajero">Cajero</MenuItem>
                            <MenuItem value="Inversion">Inversion</MenuItem>
                        </Select>
                    </Grid>


                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={ResetFilter}
                            size="small" 
                            style={{ padding: '6px 16px', backgroundColor: '#5a6ee9', color: '#ffff'}}
                        >
                            Limpiar
                        </Button>
                    </Grid>
                </Grid>
            </Hidden>
    
            {/* Vista de mobile */}
            <Hidden smUp>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Select
                            fullWidth
                            value={mes}
                            onChange={(e) => setMes(e.target.value)}
                            displayEmpty
                            size="small" 
                        >
                            <MenuItem value=""><em>Seleccionar Mes</em></MenuItem>
                            <MenuItem value="enero">Enero</MenuItem>
                            <MenuItem value="febrero">Febrero</MenuItem>
                            <MenuItem value="marzo">Marzo</MenuItem>
                            <MenuItem value="abril">Abril</MenuItem>
                            <MenuItem value="mayo">Mayo</MenuItem>
                            <MenuItem value="junio">Junio</MenuItem>
                            <MenuItem value="julio">Julio</MenuItem>
                            <MenuItem value="agosto">Agosto</MenuItem>
                            <MenuItem value="septiembre">Septiembre</MenuItem>
                            <MenuItem value="octubre">Octubre</MenuItem>
                            <MenuItem value="noviembre">Noviembre</MenuItem>
                            <MenuItem value="diciembre">Diciembre</MenuItem>
                        </Select>
                    </Grid>
    
                    <Grid item xs={12}>
                        <Select
                            fullWidth
                            value={metodo}
                            onChange={(e) => setMetodo(e.target.value)}
                            displayEmpty
                            size="small" 
                        >
                            <MenuItem value=""><em>Seleccionar Pago</em></MenuItem>
                            <MenuItem value="Débito">Débito</MenuItem>
                            <MenuItem value="Crédito">Crédito</MenuItem>
                            <MenuItem value="Efectivo">Efectivo</MenuItem>
                            <MenuItem value="Mercado Pago">Mercado Pago</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs>
                        <Select
                            fullWidth
                            value={año}
                            onChange={(e) => setAño(e.target.value)}
                            displayEmpty
                            size="small" 
                        >
                            <MenuItem value=""><em>Seleccionar Año</em></MenuItem>
                            <MenuItem value="2024">2024</MenuItem>
                            <MenuItem value="2025">2025</MenuItem>
                            <MenuItem value="2026">2026</MenuItem>
                            <MenuItem value="2027">2027</MenuItem>
                            <MenuItem value="2028">2028</MenuItem>
                        </Select>
                    </Grid>
    
    
                    <Grid item xs={12}>
                        <Select
                            fullWidth
                            value={condicion}
                            onChange={(e) => setCondicion(e.target.value)}
                            displayEmpty
                            size="small" 
                        >
                            <MenuItem value=""><em>Estado</em></MenuItem>
                            <MenuItem value="Pagado">Pagado</MenuItem>
                            <MenuItem value="Impago">Impago</MenuItem>
                        </Select>
                    </Grid>
    
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={ResetFilter}
                            fullWidth
                            size="small" 
                            style={{ padding: '6px 16px', backgroundColor: '#5a6ee9', color: '#ffff'}}
                        >
                            Limpiar
                        </Button>
                    </Grid>
                </Grid>
            </Hidden>
        </>
    );
}
