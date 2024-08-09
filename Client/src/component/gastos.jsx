import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Box,Button,FormControl,Grid,InputLabel,MenuItem,Select,Table,TableBody,TableCell,TableContainer,TableHead, TableRow, TextField, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import "./styles/gastos.css"
import { Buscador } from './buscador';
import { Filtros } from './filtros';

// const serverFront = "http://localhost:3001";
const serverFront =  'https://billetera-virtual-eight.vercel.app'


export function Gastos() {
    const [gastos, setGastos] = useState([]);
    const [gastosFiltrados, setGastosFiltrados] = useState([]);
    const [dia, setDia] = useState("");
    const [mes, setMes] = useState("");
    const [metodo, setMetodo] = useState("");
    const [producto, setProducto] = useState("");
    const [monto, setMonto] = useState("");
    const [condicion, setCondicion] = useState("");


    useEffect(() => {
        axios.get(`${serverFront}/gasto`)
            .then(response => {
                setGastos(response.data);
                setGastosFiltrados(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const addGastos = () => {
        if (String(dia).trim() && String(mes).trim() && String(metodo).trim() && String(monto).trim() && String(condicion).trim() && String(producto).trim() !== "") {
            axios.post(`${serverFront}/add-gasto`, {
                dia: dia,
                mes: mes,
                metodo: metodo,
                producto: producto,
                monto: monto,
                condicion: condicion
            })
            .then(response => {
                const nuevoGasto = response.data;
                setGastos(gastos => [...gastos, nuevoGasto]);
                setGastosFiltrados(gastos => [...gastos,nuevoGasto]);
                setDia("");
                setMes("");
                setMetodo("");
                setProducto("");
                setMonto("");
                setCondicion("");
            })
            .catch(err => console.log(err));
        }
    };

    const deleteGastos = (id) => {
        axios.delete(`${serverFront}/delete-gasto/` + id)
        .then(response => {
            setGastos(gastos.filter((gasto) => gasto._id !== id));
        })
        .catch(err => console.log(err))
    }

    const searchGastos = (palabraClave) => {
        setGastosFiltrados(gastos.filter(gasto => {
            return palabraClave.every(palabra =>
                gasto.dia.toLowerCase().includes(palabra) ||
                gasto.mes.toLowerCase().includes(palabra) ||
                gasto.metodo.toLowerCase().includes(palabra) ||
                gasto.producto.toLowerCase().includes(palabra) ||
                gasto.monto.toString().includes(palabra) ||
                gasto.condicion.toLowerCase().includes(palabra) 
            )
        }))
    }

    const saveEdit = (id) => {
        console.log(`Cambios guardados: ${id}`);
        axios.patch(`${serverFront}/edit-gasto/${id}`, editingData)
        .then(response => {
            setGastos(gastos.map(gasto => gasto._id === id ? response.data : gasto));
            setGastosFiltrados(gastosFiltrados.map(gasto => gasto._id === id ? response.data : gasto));
            cancelEdit();
        })
        .catch(err => console.log(err))
    }

    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({
        dia: '',
        mes: '',
        metodo: '',
        producto: '',
        monto: '',
        condicion: ''
    });

    const editGastos = (gasto) => {
        setEditingId(gasto._id);
        setEditingData({
            dia: gasto.dia,
            mes: gasto.mes,
            metodo: gasto.metodo,
            producto: gasto.producto,
            monto: gasto.monto,
            condicion: gasto.condicion
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditingData({
            dia: '',
            mes: '',
            metodo: '',
            producto: '',
            monto: '',
            condicion: ''
        })
    }

    const condicionPago = (condicion) => {
        return  condicion.toLowerCase() === 'impago' || condicion.toLowerCase() ===  'me deben' ? 'rgba(218, 8, 25, 0.4)' : null  || condicion.toLowerCase() === 'cajero' ? 'rgba(206, 224, 14, 0.8)' : null || condicion.toLowerCase() === 'cuotas'  ? 'rgba(218, 135, 34, 0.8)' : null ;
    }

    const totalMonto = (gastos) => {
        let total = 0;

        gastos.forEach(product => {
            if(product.condicion.toLowerCase() === 'impago' || product.condicion.toLowerCase() === 'cajero' || product.condicion.toLowerCase() === 'cuotas' || product.condicion.toLowerCase() === 'me deben'   ){
                total == product.monto
            } else {
                total += product.monto
            }
        });
        
        return total.toLocaleString('en-US');
    }



    return (
        <Box className="gastos-container" sx={{ p: 2, fontFamily: "Montserrat, sans-serif" }}>
            <h1>Gastos Mensuales</h1>
            <Grid container spacing={2} className="inputs-gastos">
                {/* Inputs de selección y texto */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth sx={{ fontFamily: "Montserrat, sans-serif" }}>
                        <InputLabel>Seleccionar Día</InputLabel>
                        <Select value={dia} onChange={(e) => setDia(e.target.value)}>
                            <MenuItem value=""><em>Ninguno</em></MenuItem>
                            {[...Array(31)].map((_, index) => (
                                <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth sx={{ fontFamily: "Montserrat, sans-serif" }}>
                        <InputLabel>Seleccionar Mes</InputLabel>
                        <Select value={mes} onChange={(e) => setMes(e.target.value)}>
                            <MenuItem value=""><em>Ninguno</em></MenuItem>
                            {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map(mes => (
                                <MenuItem key={mes} value={mes}>{mes}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth sx={{ fontFamily: "Montserrat, sans-serif" }}>
                        <InputLabel>Seleccionar Método</InputLabel>
                        <Select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                            <MenuItem value=""><em>Ninguno</em></MenuItem>
                            {["Débito", "Crédito", "Efectivo", "Mercado Pago"].map(metodo => (
                                <MenuItem key={metodo} value={metodo}>{metodo}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField fullWidth sx={{ fontFamily: "Montserrat, sans-serif" }} placeholder="Ingresar Productos" value={producto} onChange={(e) => setProducto(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField fullWidth sx={{ fontFamily: "Montserrat, sans-serif" }} placeholder="Ingresar Monto" value={monto} onChange={(e) => setMonto(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth sx={{ fontFamily: "Montserrat, sans-serif" }}>
                        <InputLabel>Seleccionar Estado</InputLabel>
                        <Select value={condicion} onChange={(e) => setCondicion(e.target.value)}>
                            <MenuItem value=""><em>Ninguno</em></MenuItem>
                            <MenuItem value="Pagado">Pagado</MenuItem>
                            <MenuItem value="Impago">Impago</MenuItem>
                            <MenuItem value="Cuotas">Cuotas</MenuItem>
                            <MenuItem value="Devolver"> Devolver</MenuItem>
                            <MenuItem value="Me deben">Me deben</MenuItem>
                            <MenuItem value="Cajero">Cajero</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container gap={"10px"} margin={"2.8rem auto"} className="botones" sx={{ fontFamily: "Montserrat, sans-serif" }}>
                <Grid item marginRight={'2rem'}>
                    <Button variant="contained" color="primary" className="agregar" sx={{ fontFamily: "Montserrat, sans-serif" }} onClick={addGastos}> Agregar </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" className="limpiar" sx={{ fontFamily: "Montserrat, sans-serif" }} onClick={() => {
                        setCondicion(''); setDia(''); setMes(''); setMetodo(''); setMonto(''); setProducto('');}}> Limpiar </Button>
                </Grid>
                <Buscador filtrarDatos={searchGastos} className="filtros" />
            </Grid>

            <Filtros gastos={gastos} setGastosFiltrados={setGastosFiltrados} />
                        
            <TableContainer component={Paper} className="productos" sx={{ mt: 8, boxShadow: 4, fontFamily: "Montserrat, sans-serif" }}>
                <Table>
                    <TableHead>  
                        <TableRow className='fila' sx={{ mt: 2 }}>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Día</TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Mes</TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Producto</TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Monto</TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Método</TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Estado</TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gastosFiltrados.map((element, index) => (
                            <TableRow key={index} style={{ background: condicionPago(element.condicion || '') }}>
                                <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}> 
                                    {editingId === element._id ? <input value={editingData.dia} onChange={(e) => setEditingData({...editingData, dia: e.target.value})} /> : element.dia}</TableCell>
                                
                                <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}> 
                                    {editingId === element._id ? <input value={editingData.mes} onChange={(e) => setEditingData({...editingData, mes: e.target.value})} /> : element.mes}</TableCell>
                                
                                <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}> 
                                    {editingId === element._id ? <input value={editingData.producto} onChange={(e) => setEditingData({...editingData, producto: e.target.value})} /> : element.producto}</TableCell>
                                
                                <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif", fontWeight: 'bold' }}> $
                                    {editingId === element._id ? <input value={editingData.monto} onChange={(e) => setEditingData({...editingData, monto: e.target.value})} /> : element.monto}</TableCell>
                                
                                <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}> 
                                    {editingId === element._id ? <input value={editingData.metodo} onChange={(e) => setEditingData({...editingData, metodo: e.target.value})} /> : element.metodo}</TableCell>
                                
                                <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" , fontWeight: '600' }}> 
                                    {editingId === element._id ? <input value={editingData.condicion} onChange={(e) => setEditingData({...editingData, condicion: e.target.value})} /> : element.condicion}</TableCell>
                               
                                <TableCell align="center">
                                    <Box className="actions" sx={{ display: 'flex', gap: 1, justifyContent: 'center', fontFamily: "Montserrat, sans-serif" }}>
                                        <IconButton className="trash" sx={{ color: 'red', fontFamily: "Montserrat, sans-serif" }} onClick={() => deleteGastos(element._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        {editingId === element._id ? (
                                            <>
                                                <IconButton className="check" sx={{ color: 'green', backgroundColor: 'lightgreen', borderRadius: '4px', padding: '5px' }} onClick={() => saveEdit(element._id)}>
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton className="cancel" sx={{ color: 'white', backgroundColor: 'red', borderRadius: '4px', padding: '5px' }} onClick={cancelEdit}>
                                                    <CancelIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton className="edit" sx={{ color: 'grey', fontFamily: "Montserrat, sans-serif" }} onClick={() => editGastos(element)}>
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <tfoot>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell colSpan={1} align="center" sx={{ fontWeight: 'bold', fontFamily: "Montserrat, sans-serif" }}>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell  align="center" sx={{ fontWeight: 'bold', fontFamily: "Montserrat, sans-serif", fontSize: '1rem' }}>${totalMonto(gastosFiltrados)}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </tfoot>
                </Table>
            </TableContainer>
        </Box>
    );
};


