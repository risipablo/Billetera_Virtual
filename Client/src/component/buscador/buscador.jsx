
import { Grid,IconButton,TextField,Box, } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { useMemo, useState } from "react";

const SearchBox = styled(Box)(({ show }) => ({
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    maxWidth: show ? '300px' : '0',
    overflow: 'hidden',
    marginLeft: show ? '1rem' : '0',
}));



export function Debounce(func, delay) {
    let timeoutId;

    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}


export function Buscador({filtrarDatos}){
    const [showSearch, setShowSearch] = useState(false);
    const [buscar,setBuscar] = useState('')

    const filtrarDebounce = useMemo(() => Debounce((palabraClave) => {
        filtrarDatos(palabraClave);
    }, 300), [filtrarDatos]);


    const buscarChange = (event) => {
        const value = event.target.value;
        const palabraClave = value.trim().toLowerCase().split(/\s+/);
        setBuscar(value);
        // filtrarDatos(palabraClave);
        filtrarDebounce(palabraClave)
    }

    return(
        <Grid item sx={{  margin: '2rem 0 0.2rem auto' ,display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" aria-label="search" onClick={() => setShowSearch(!showSearch)} >
                <SearchIcon />
            </IconButton>
            <SearchBox show={showSearch} >
                
            <TextField
                label="Buscar"
                variant="outlined"
                fullWidth
                value={buscar}
                onChange={buscarChange} 
            />
         
            </SearchBox>
        </Grid>
    )

}