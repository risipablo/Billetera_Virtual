import  React, { useState, useEffect, useMemo, useRef} from 'react';
import axios from 'axios';
import {Box,Button,useMediaQuery,FormControl,Grid,InputLabel,MenuItem,Select,Table,TableBody,
ListItemText,TableCell,TableContainer,TableHead,Typography, TableRow, TextField, Paper, IconButton, ListItem,
Collapse,
Skeleton,
Tooltip,} from '@mui/material';
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
import { Notas } from '../../component/notas/notas';
import { config } from '../../component/variables/config';
import { GastoInfo } from '../../component/common/Info/gastoInfo';


const serverFront = config.apiUrl;

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
    const [limite, setLimite] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    console.log(token); 
    const [isAdmin, setIsAdmin] = useState(false);
    const [showInputs,setShowInputs] = useState(true)
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
                setTimeout(() => {
                    setGastos(response.data);
                    setGastosFiltrados(response.data);
                    setLoading(false);
                }, 2000);
                
            })
            .catch(err => {
                console.log(err);
                setLoading
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
        return condicion.toLowerCase() === 'devolver' ? 'rgba(22, 206, 176, 0.8)' : null
         || condicion.toLowerCase() ===  'deben' ? 'rgba(218, 8, 162, 0.4)' : null 
         || condicion.toLowerCase() === 'impago' ? 'rgba(235, 122, 122, 0.93)' : null
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
          if ([ 'cajero', 'cuotas', 'deben', 'inversion'].includes(producto.condicion.toLowerCase())) {

          } else {
            total += producto.monto;
          }
        });
    
        return total.toLocaleString('en-US');
      };


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
    
      const limiteSpend = (gastos) => {
        const conditionsOptions = ['cajero', 'inversion', 'deben', 'cuotas',]

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
    
      useEffect(() => {
        setShowInputs(isMobile)
      },[isMobile])


    
    return (
        <Box className="gastos-container" sx={{ p: 3, marginTop:3, marginBottom:4 ,fontFamily: "Montserrat, sans-serif" }}>
            <Helmet>
                
                <title>Gastos Mensuales</title>
            </Helmet>

            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="flex-start"
            >
                <Tooltip title="Términos" arrow>
                    <GastoInfo />
                </Tooltip>
            </Box>

            <h1> Gastos Mensuales</h1> 

            <div className="form-container">
                <select  value={dia} onChange={(e) => setDia(e.target.value)}>
                    <option value="">Seleccionar Día</option>
                    {[...Array(31)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                    ))}
                </select>

                <select  value={mes} onChange={(e) => setMes(e.target.value)}>
                    <option value="">Seleccionar Mes</option>
                    {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
                    .map(mes => <option key={mes} value={mes}>{mes}</option>)}
                </select>

                <select value={año} onChange={(e) => setAño(e.target.value)}>
                    <option value="">Seleccionar Año</option>
                    {["2024", "2025", "2026", "2027", "2028"].map(año => <option key={año} value={año}>{año}</option>)}
                </select>

                <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                    <option value="">Seleccionar Método</option>
                    {["Débito", "Crédito", "Efectivo", "Mercado Pago"].map(metodo => <option key={metodo} value={metodo}>{metodo}</option>)}
                </select>

                <select  value={condicion} onChange={(e) => setCondicion(e.target.value)}>
                    <option value="">Seleccionar Estado</option>
                    {["Pagado", "Impago", "Deben", "Cuotas", "Devolver", "Cajero", "Inversion"].map(condicion => <option key={condicion} value={condicion}>{condicion}</option>)}
                </select>

                <input type="text"  placeholder="Ingresar Productos" value={producto} onChange={(e) => setProducto(e.target.value)} />

                <input type="number"  placeholder="Ingresar Monto" value={monto} onChange={(e) => setMonto(e.target.value)} />

  
            </div>    
                    

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
                        setCondicion(''); setDia(''); setMes(''); setMetodo(''); setMonto(''); setProducto('');}}> Borrar </Button>
                </Grid>

                
            </Grid>

            <Filtros gastos={gastos} setGastosFiltrados={setGastosFiltrados} />

            <Buscador filtrarDatos={searchGastos} className="filtros" />

            
            <Button
                onClick={() => setShowInputs(prev => !prev)}
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
                                    <Typography sx={{ color: limiteSpend(gastosFiltrados).color, fontWeight: 'bold', fontFamily: "Montserrat, sans-serif", fontSize: '1rem', }}>
                                    $ {totalMonto(gastosFiltrados)}
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
                        {loading ? (
                            [...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center"><Skeleton variant="text" width={50} /></TableCell>
                                    <TableCell align="center"><Skeleton variant="text" width={80} /></TableCell>
                                    <TableCell align="center"><Skeleton variant="text" width={60} /></TableCell>
                                    <TableCell align="center"><Skeleton variant="text" width={100} /></TableCell>
                                    <TableCell align="center"><Skeleton variant="text" width={70} /></TableCell>
                                    <TableCell align="center"><Skeleton variant="text" width={90} /></TableCell>
                                    <TableCell align="center"><Skeleton variant="text" width={80} /></TableCell>
                                    <TableCell align="center"><Skeleton variant="circular" width={40} height={40} /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            gastosFiltrados.map((element, index) => (
                                <React.Fragment key={index}>
                                    <TableRow style={{ background: condicionPago(element.condicion || '') }}                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(10, 49, 191, 0.2)',
                                                    transition: 'all 0.1s ease-in',
                                                }
                                            }}>
                                        <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}>
                                            {element.dia}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}>
                                            {element.mes}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}>
                                            {element.año}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}>
                                            {element.producto}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif", fontWeight: 'bold' }}>
                                            ${element.monto}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif" }}>
                                            {element.metodo}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: '1rem', fontFamily: "Montserrat, sans-serif", fontWeight: '600' }}>
                                            {element.condicion}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box className="actions" sx={{ display: 'flex', gap: 1, justifyContent: 'center', fontFamily: "Montserrat, sans-serif" }}>
                                                <IconButton className="trash" sx={{ color: 'red', fontFamily: "Montserrat, sans-serif" }} onClick={() => deleteGastos(element._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                {editingId === element._id ? null : (
                                                    <IconButton className="edit" sx={{ color: 'grey', fontFamily: "Montserrat, sans-serif" }} onClick={() => editGastos(element)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>


                                    {editingId === element._id && (
                                        <TableRow
                                            className="edit-row"
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(69, 111, 179, 0.2)',
                                                    transition: 'all 0.1s ease-in',
                                                }
                                            }}
                                        >
                                            <TableCell align="center">
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={editingData.dia}
                                                        onChange={(e) => setEditingData({ ...editingData, dia: e.target.value })}
                                                        size="small"
                                                    >
                                                        {[...Array(31)].map((_, idx) => (
                                                            <MenuItem key={idx + 1} value={idx + 1}>{idx + 1}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="center">
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={editingData.mes}
                                                        onChange={(e) => setEditingData({ ...editingData, mes: e.target.value })}
                                                        size="small"
                                                    >
                                                        {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map(mes => (
                                                            <MenuItem key={mes} value={mes}>{mes}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    value={editingData.año}
                                                    onChange={(e) => setEditingData({ ...editingData, año: e.target.value })}
                                                    size="small"
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    value={editingData.producto}
                                                    onChange={(e) => setEditingData({ ...editingData, producto: e.target.value })}
                                                    size="small"
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    type="number"
                                                    value={editingData.monto}
                                                    onChange={(e) => setEditingData({ ...editingData, monto: e.target.value })}
                                                    size="small"
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={editingData.metodo}
                                                        onChange={(e) => setEditingData({ ...editingData, metodo: e.target.value })}
                                                        size="small"
                                                    >
                                                        {["Débito", "Crédito", "Efectivo", "Mercado Pago"].map(metodo => (
                                                            <MenuItem key={metodo} value={metodo}>{metodo}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="center">
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={editingData.condicion}
                                                        onChange={(e) => setEditingData({ ...editingData, condicion: e.target.value })}
                                                        size="small"
                                                    >
                                                        {["Pagado", "Impago", "Deben", "Cuotas", "Devolver", "Cajero", "Inversion"].map(condicion => (
                                                            <MenuItem key={condicion} value={condicion}>{condicion}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="center" className="actions">
                                                <Box className="btn-edit" sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <IconButton className="check" sx={{ color: 'green', backgroundColor: 'lightgreen', borderRadius: '4px', padding: '5px' }} onClick={() => handleSaveEditDebounced(element._id)}>
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton className="cancel" sx={{ color: 'white', backgroundColor: 'red', borderRadius: '4px', padding: '5px' }} onClick={cancelEdit}>
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                </React.Fragment>
                            ))
                        )}
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
            <Notas/>
            <Toaster/>
            <ScrollTop/>
        </Box>
    );
};

export default Gastos