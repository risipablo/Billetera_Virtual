
import { useEffect, useState } from "react";
import { TextField, Select, MenuItem, IconButton, Grid, InputLabel, FormControl, Box, Button } from '@mui/material';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { motion } from 'framer-motion';

export function FiltrosChart({ gastos, setGastosFiltrados}) {
    const [filterMonth, setFilterMonth] = useState('');
    const [filterProduct, setFilterProduct] = useState('');
    const [filterMetodo, setfilterMetodo] = useState('');
    const [filterAño, setFilterAño] = useState('')
    const [filterCondition, setFilterCondition] = useState('')
    

    const filtros = () => {
        let gastosFiltrados = gastos;

        if (filterMonth.trim() !== '')
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.mes.toLowerCase() === filterMonth.toLowerCase());

        if (filterProduct.trim() !== "")
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.producto.toLowerCase() === filterProduct.toLowerCase());

        if (filterMetodo.trim() !== "")
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.metodo.toLowerCase() === filterMetodo.toLowerCase());
        
        if (filterAño.trim() !== '')
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.año.toLowerCase() === filterAño.toLocaleLowerCase());

        if (filterCondition.trim() !== '')
            gastosFiltrados = gastosFiltrados.filter(gasto => gasto.necesario === filterCondition)

        setGastosFiltrados(gastosFiltrados);
    };

    const resetFiltros = () => {
        setFilterMonth('');
        setFilterProduct('');
        setfilterMetodo('');
        setFilterAño('')
        setFilterCondition('')
    };

    useEffect(() => {
        filtros();
    }, [filterMonth, filterMetodo, filterProduct, filterAño,filterCondition, gastos]);


    const containerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: i => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2, 
                duration: 0.5,
            },
        }),
    };

    return (
        <Box sx={{ flexGrow: 1, marginTop: 8 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Mes */}
                        <Grid item xs={6} sm={4} md={2}>
                            <motion.div
                                custom={0}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <FormControl fullWidth size="small">
                                    <InputLabel>Mes</InputLabel>
                                    <Select
                                        value={filterMonth}
                                        onChange={(event) => setFilterMonth(event.target.value)}
                                        label="Mes"
                                    >
                                        <MenuItem value="">Todos</MenuItem>
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
                            </motion.div>
                        </Grid>

                        {/* Año */}
                        <Grid item xs={6} sm={4} md={2}>
                            <motion.div
                                custom={0}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <FormControl fullWidth size="small">
                                    <InputLabel>Año</InputLabel>
                                    <Select
                                        value={filterAño}
                                        onChange={(event) => setFilterAño(event.target.value)}
                                        label="Año"
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        <MenuItem value="2024">2024</MenuItem>
                                        <MenuItem value="2025">2025</MenuItem>
                                        <MenuItem value="2026">2026</MenuItem>
                                        <MenuItem value="2027">2027</MenuItem>
                                        <MenuItem value="2028">2028</MenuItem>
                                    </Select>
                                </FormControl>
                            </motion.div>
                        </Grid>

                        {/* Producto */}
                        <Grid item xs={6} sm={4} md={2}>
                            <motion.div
                                custom={1}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Producto"
                                    value={filterProduct}
                                    onChange={(e) => setFilterProduct(e.target.value)}
                                    variant="outlined"
                                />
                            </motion.div>
                        </Grid>

                        {/* Método de pago */}
                        <Grid item xs={6} sm={4} md={2}>
                            <motion.div
                                custom={2}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <FormControl fullWidth size="small">
                                    <InputLabel>Método</InputLabel>
                                    <Select
                                        value={filterMetodo}
                                        onChange={(event) => setfilterMetodo(event.target.value)}
                                        label="Método"
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        <MenuItem value="Débito">Débito</MenuItem>
                                        <MenuItem value="Crédito">Crédito</MenuItem>
                                        <MenuItem value="Efectivo">Efectivo</MenuItem>
                                        <MenuItem value="Mercado Pago">Mercado Pago</MenuItem>
                                    </Select>
                                </FormControl>
                            </motion.div>
                        </Grid>

                        {/* Condición */}
                        <Grid item xs={6} sm={4} md={2}>
                            <motion.div
                                custom={2}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <FormControl fullWidth size="small">
                                    <InputLabel>Condición</InputLabel>
                                    <Select
                                        value={filterCondition}
                                        onChange={(event) => setFilterCondition(event.target.value)}
                                        label="Condición"
                                    >
                                        <MenuItem value="">Todas</MenuItem>
                                        <MenuItem value="Fijo">Fijo</MenuItem>
                                        <MenuItem value="Necesario">Necesario</MenuItem>
                                        <MenuItem value="Innecesario">Innecesario</MenuItem>
                                    </Select>
                                </FormControl>
                            </motion.div>
                        </Grid>

                        
                        <Grid item xs={6} sm={4} md={2}>
                            <motion.div
                                custom={3}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Button 
                                    variant="outlined" 
                                    onClick={resetFiltros}
                                    fullWidth
                                    startIcon={<CleaningServicesIcon />}
                                    size="small"
                                    sx={{ height: '40px' }}
                                >
                                    Limpiar
                                </Button>
                            </motion.div>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}
