
import { Grid,IconButton,TextField,Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { useState } from "react";

const SearchBox = styled(Box)(({ show }) => ({
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    maxWidth: show ? '300px' : '0',
    overflow: 'hidden',
    marginLeft: show ? '1rem' : '0',
}));

export function Buscador({filtrarDatos}){
    const [showSearch, setShowSearch] = useState(false);
    const [buscar,setBuscar] = useState('')

    const buscarChange = (event) => {
        const value = event.target.value;
        const palabraClave = value.trim().toLowerCase().split(/\s+/);
        setBuscar(value);
        filtrarDatos(palabraClave);
    }

    return(
        <Grid item sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
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