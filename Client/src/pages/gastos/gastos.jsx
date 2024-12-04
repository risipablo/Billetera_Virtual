import  { useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import {Box,Button,useMediaQuery,FormControl,Grid,InputLabel,MenuItem,Select,Table,TableBody,
ListItemText,TableCell,TableContainer,TableHead,Typography, TableRow, TextField, Paper, IconButton, ListItem,
Collapse,} from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import  { Helmet } from 'react-helmet';
import './gastos.css'
import { Buscador } from '../../component/buscador/buscador';
import { Filtros } from '../../component/filtros/filtros';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ScrollTop } from '../../component/common/scrollTop';
import { Debounce } from '../../component/common/debounce';
import useSound from 'use-sound'
import Cash from "../../assets/cash.mp3"
import Ok from '../../assets/ok.mp3'


// const serverFront = "http://localhost:3001";
const serverFront = "https://billetera-virtual-1.onrender.com";


 function Gastos(){
    const [gastos, setGastos] = useState([]);
    const [gastosFiltrados, setGastosFiltrados] = useState([]);
    const [dia, setDia] = useState("");
    const [mes, setMes] = useState("");
    const [metodo, setMetodo] = useState("");
    const [producto, setProducto] = useState("");
    const [monto, setMonto] = useState("");
    const [año,setAño] = useState("")
    const [condicion, setCondicion] = useState("");
    const [limite,setLimite] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    console.log(token); 
    const [isAdmin, setIsAdmin] = useState(false);
    const [showInputs,setShowInputs] = useState(false)
    const isMobile = useMediaQuery('(max-width:500px)');
    const [play] = useSound(Cash)
    const [play2] = useSound(Ok)

    useEffect(() => {
        
        // Verificar si el usuario es administrador desde el token almacenado
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(storedIsAdmin);

        if (token) {
            axios.get(`${serverFront}/api/gasto`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, 
            })
            .then(response => {
                setGastos(response.data);
                setGastosFiltrados(response.data);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.status === 401) {
                    toast.error('Usuario no autorizado, por favor inicia sesión', { position: 'top-right' });
                }
            });
        } else {
            navigate('/');
        }
    }, [token,navigate]);
    
    

    const addGastos = () => {
        if (String(dia).trim() && String(mes).trim() && String(año).trim() && String(metodo).trim() && String(monto).trim() && String(condicion).trim() && String(producto).trim() !== "") {
            axios.post(`${serverFront}/api/add-gasto`, {
                dia: dia,
                mes: mes,
                año: año,
                metodo: metodo,
                producto: producto,
                monto: monto,
                condicion: condicion
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true, 
            })
            .then(response => {
                const nuevoGasto = response.data;
                setGastos(gastos => [...gastos, nuevoGasto]);
                setGastosFiltrados(gastos => [...gastos,nuevoGasto]);
                setDia("");
                setMes("");
                setAño("")
                setMetodo("");
                setProducto("");
                setMonto("");
                setCondicion("");
                play()
                toast.success('Gasto agregado con éxito', {
                    position: 'top-right',
                });

            })
            .catch(err => console.log(err));
        }
    };

    const handleAddGastoDebounced = useMemo(() => Debounce(addGastos, 100), [addGastos]);

    const deleteGastos = (id) => {
        axios.delete(`${serverFront}/api/delete-gasto/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true, 
        })
        .then(response => {
            setGastos(gastos.filter((gasto) => gasto._id !== id))
            setGastosFiltrados(gastosFiltrados.filter((gasto) => gasto._id !== id))
            toast.error('Gasto eliminado ', {
                position: 'top-right',
            });
        })
        .catch(err => console.log(err))
    }

    const searchGastos = (palabraClave) => {
        setGastosFiltrados(gastos.filter(gasto => {
            return palabraClave.every(palabra =>
                gasto.dia.toLowerCase().includes(palabra) ||
                gasto.mes.toLowerCase().includes(palabra) ||
                gasto.año.toLowerCase().includes(palabra) ||
                gasto.metodo.toLowerCase().includes(palabra) ||
                gasto.producto.toLowerCase().includes(palabra) ||
                gasto.monto.toString().includes(palabra) ||
                gasto.condicion.toLowerCase().includes(palabra) 
            )
        }))
    }

    const saveEdit = (id) => {
        console.log(`Cambios guardadoss: ${id}`);
        axios.patch(`${serverFront}/api/edit-gasto/${id}`, editingData, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true, 
        })
        .then(response => {
            setGastos(gastos.map(gasto => gasto._id === id ? response.data : gasto));
            setGastosFiltrados(gastosFiltrados.map(gasto => gasto._id === id ? response.data : gasto));
            cancelEdit();
            toast.success('Cambios realizados ', {
                position: 'top-right',
            })
            play2()
        })
        .catch(err => console.log(err))
    }

    const handleSaveEditDebounced = useMemo(() => Debounce(saveEdit, 300), [saveEdit]);

    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({
        dia: '',
        mes: '',
        año:'',
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
            año: gasto.año,
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
            año: '',
            metodo: '',
            producto: '',
            monto: '',
            condicion: ''
        })
    }

    const condicionPago = (condicion) => {
        return condicion.toLowerCase() === 'impago' || condicion.toLowerCase() ===  'me deben' ? 'rgba(218, 8, 25, 0.4)' : null 
         || condicion.toLowerCase() === 'cajero' ? 'rgba(206, 224, 14, 0.8)' : null 
         || condicion.toLowerCase() === 'cuotas'  ? 'rgba(218, 135, 34, 0.8)' : null 
         || condicion.toLowerCase() === 'inversion' ? 'rgba(34, 228, 24, 0.8)' : null
    }

    const lastSpend = (gastos) => {
        if (gastos.length === 0) {
          return 'No hay gastos'; 
        }
        const ultimoGasto = gastos[gastos.length - 1];
        return ` ${ultimoGasto.dia} de ${ultimoGasto.mes} ${ultimoGasto.año} ${ultimoGasto.producto} $${ultimoGasto.monto} `;
      }
      

      const totalMonto = (gastos) => {
        let total = 0;
    
        gastos.forEach(producto => {
          if (['impago', 'cajero', 'cuotas', 'deben', 'inversion'].includes(producto.condicion.toLowerCase())) {

          } else {
            total += producto.monto;
          }
        });
    
        return total.toLocaleString('en-US');
      };

      const limiteSpend = (gastos) => {
        const conditionsOptions = ['cajero', 'inversion', 'deben', 'cuotas']

        const gastosFiltrados = gastos.filter(gasto => 
            !conditionsOptions.includes(gasto.condicion.toLowerCase())
        )

        const totalLimiter = gastosFiltrados.reduce((acc,gasto) => acc + gasto.monto, 0)

        return limite < totalLimiter
        ? {monto:totalLimiter, color:"red"} : {monto:totalLimiter, color:"black"} 

      }

      // LocalStorage

      useEffect(() => {
        const limiteGuardado = localStorage.getItem('limiteGasto')
            if(limiteGuardado)
                setLimite(parseInt(limiteGuardado))
      },[])

      useEffect(() => {
        localStorage.setItem('limiteGasto', limite);
      }, [limite]);
    
    
    return (
        <Box className="gastos-container" sx={{ p: 3, marginTop:3, marginBottom:4 ,fontFamily: "Montserrat, sans-serif" }}>

            <Helmet>
                <title>Gastos Mensuales</title>
            </Helmet>

            <h1> Gastos Mensuales</h1> 

            <Grid container spacing={2} className="inputs-gastos">
 
            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
                <FormControl fullWidth sx={{ fontFamily: "Montserrat, sans-serif" }}>
                <InputLabel>Seleccionar Año</InputLabel>
                <Select value={año} onChange={(e) => setAño(e.target.value)}>
                    <MenuItem value=""><em>Ninguno</em></MenuItem>
                    {['2024','2025','2026','2027','2028'].map(año => (
                    <MenuItem key={año} value={año}>{año}</MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
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
                <TextField 
                fullWidth 
                sx={{ fontFamily: "Montserrat, sans-serif" }} 
                placeholder="Ingresar Productos" 
                value={producto} 
                onChange={(e) => setProducto(e.target.value)} 
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <TextField 
                fullWidth 
                sx={{ fontFamily: "Montserrat, sans-serif" }} 
                placeholder="Ingresar Monto" 
                value={monto}  
                onChange={(e) => setMonto(e.target.value)}  
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <FormControl fullWidth sx={{ fontFamily: "Montserrat, sans-serif" }}>
                <InputLabel>Seleccionar Estado</InputLabel>
                <Select value={condicion} onChange={(e) => setCondicion(e.target.value)}>
                    <MenuItem value=""><em>Ninguno</em></MenuItem>
                    {["Pagado", "Impago", "Deben", "Cuotas", "Devolver", "Cajero", "Inversion"].map(condicion => (
                    <MenuItem key={condicion} value={condicion}>{condicion}</MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Grid>
            </Grid>
                        
                    

            <Grid container gap={"10px"}  margin={"2.8rem auto"} className="botones" sx={{ fontFamily: "Montserrat, sans-serif" }}>

            {isAdmin && (
                <Button variant="contained" color="primary" onClick={addGastos}>
                    Agregar Gasto
                </Button>
            )}
            
                <Grid item>
                    <Button variant="contained" color="primary" className="agregar" sx={{ fontFamily: "Montserrat, sans-serif" }} onClick={handleAddGastoDebounced}> 
                        Agregar 
                    </Button>
                </Grid>
            

                <Grid item>
                    <Button variant="contained" color="secondary" className="limpiar" sx={{ fontFamily: "Montserrat, sans-serif", marginLeft:3 }} onClick={() => {
                        setCondicion(''); setDia(''); setMes(''); setMetodo(''); setMonto(''); setProducto('');}}> Limpiar </Button>
                </Grid>
                
            </Grid>

            <Filtros gastos={gastos} setGastosFiltrados={setGastosFiltrados} />

            <Buscador filtrarDatos={searchGastos} className="filtros" />

            
            <Button
                onClick={() => setShowInputs(!showInputs)}
                startIcon={showInputs ? <ExpandLess /> : <ExpandMore />}
                sx={{  margin: '2rem 0 0.2rem auto'}}
            >
                {showInputs ? '' : '' } 
            </Button>

            <TransitionGroup>
                {!showInputs &&
                    <Collapse>
                        <Box
                             display="flex"
                             flexDirection={isMobile ? 'column' : 'row'} 
                             justifyContent="center"
                             sx={{ margin:'.7rem auto'}}
                             >
                                 <ListItem>
                                 <ListItemText 
                                    primaryTypographyProps={{
                                     sx: {
                                     fontWeight: 'bold',
                                     fontFamily: "Montserrat, sans-serif",
                                     fontSize: '1rem',
                                     },
                                 }}>
                                     Último gasto agregado
                                     <Typography >{lastSpend(gastosFiltrados)}</Typography>
                                 </ListItemText>
                                 </ListItem>
         
                            <ListItem>
                                <ListItemText                                    
                                    primaryTypographyProps={{
                                     sx: {
                                     fontWeight: 'bold',
                                     fontFamily: "Montserrat, sans-serif",
                                     fontSize: '1rem',
                                     },
                                 }}>
                                     Total de gasto:
                                     <Typography sx={{ color: limiteSpend(gastosFiltrados).color, fontWeight:'bold', fontFamily: "Montserrat, sans-serif",
                                     fontSize: '1rem', }}>
                                        ${totalMonto(gastosFiltrados)}
                                    </Typography>

                                </ListItemText>
                            </ListItem>
                  
                
                            <ListItem sx={{ fontWeight: 'bold', fontFamily: "Montserrat, sans-serif", fontSize: '1rem' }}>

                            <TextField
                                fullWidth 
                                sx={{ fontFamily: "Montserrat, sans-serif" }} 
                                label="Establecer límite de gasto"
                                type="number"
                                value={limite}
                                onChange={(e) => setLimite(e.target.value)}/>
      
                                <Typography sx={{ color: limiteSpend(gastosFiltrados).color }}>

                                </Typography>
                            </ListItem>
                        </Box>
         
                    </Collapse>
  
                }
   
            </TransitionGroup>

    

            <TableContainer component={Paper} className="productos" sx={{ mt: 6, boxShadow: 4, fontFamily: "Montserrat, sans-serif" }} style={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>  
                        <TableRow className='fila' sx={{ mt: 2 }}>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Día</TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Mes</TableCell>
                            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: '600', fontFamily: "Montserrat, sans-serif", color:"rgb(245, 243, 239)" }}>Año</TableCell>
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
                                {editingId === element._id ? <input value={editingData.año} onChange={(e) => setEditingData({...editingData, año: e.target.value})} /> : element.año}</TableCell>
                                
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
                                                <IconButton className="check" sx={{ color: 'green', backgroundColor: 'lightgreen', borderRadius: '4px', padding: '5px' }} onClick={() => handleSaveEditDebounced(element._id)}>
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
                            <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', fontFamily: "Montserrat, sans-serif" }}>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell  align="center" sx={{ fontWeight: 'bold', fontFamily: "Montserrat, sans-serif", fontSize: '1rem' }}>${totalMonto(gastosFiltrados)}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </tfoot>
                </Table>
            </TableContainer>
            <Toaster/>
            <ScrollTop/>
        </Box>
    );
};

export default Gastos