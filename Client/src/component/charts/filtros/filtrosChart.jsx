import { useEffect, useState } from "react";
import { TextField, Select, MenuItem, IconButton, Grid, InputLabel, FormControl, Box } from '@mui/material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

export function FiltrosChart({ gastos, setGastosFiltrados }) {
    const [filterMonth, setFilterMonth] = useState('');
    const [filterProduct, setFilterProduct] = useState('');
    const [filterMetodo, serfilterMetodo] = useState('');

    const filtros = () => {
        let gastosFiltrados = gastos;

        if (filterMonth.trim() !== '')
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.mes.toLowerCase() === filterMonth.toLowerCase());

        if (filterProduct.trim() !== "")
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.producto.toLowerCase() === filterProduct.toLowerCase());

        if (filterMetodo.trim() !== "")
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.metodo.toLowerCase() === filterMetodo.toLowerCase());

        setGastosFiltrados(gastosFiltrados);
    };

    const resetFiltros = () => {
        setFilterMonth('');
        setFilterProduct('');
        serfilterMetodo('');
    };

    useEffect(() => {
        filtros();
    }, [filterMonth, filterMetodo, filterProduct, gastos]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} alignItems="center">
                {/* Caja que contiene todos los filtros + botón limpiar en una sola fila */}
                <Grid item xs={12} sm={12} md={11}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Seleccionar Mes</InputLabel>
                                <Select
                                    value={filterMonth}
                                    onChange={(event) => setFilterMonth(event.target.value)}
                                    label="Seleccionar Mes"
                                >
                                    <MenuItem value="">Seleccionar Mes</MenuItem>
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
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Producto"
                                value={filterProduct}
                                onChange={(e) => setFilterProduct(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Metodo de pago</InputLabel>
                                <Select
                                    value={filterMetodo}
                                    onChange={(event) => serfilterMetodo(event.target.value)}
                                    label="Metodo de pago"
                                >
                                    <MenuItem value="">Metodo de pago</MenuItem>
                                    <MenuItem value="Débito">Débito</MenuItem>
                                    <MenuItem value="Crédito">Crédito</MenuItem>
                                    <MenuItem value="Efectivo">Efectivo</MenuItem>
                                    <MenuItem value="Mercado Pago">Mercado Pago</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Icono de limpieza, alineado en el mismo renglón en pantallas grandes */}
                <Grid item xs={12} sm={12} md={1} textAlign={{ xs: "center", md: "right" }}>
                    <IconButton onClick={resetFiltros}>
                        <CleaningServicesIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
}
