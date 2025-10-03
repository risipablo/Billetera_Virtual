
import { Grid,IconButton,TextField,Box} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import { useMemo, useState } from "react";
import { CloseOutlined } from "@mui/icons-material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

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
    // const [buscar,setBuscar] = useState('')
    const [inputValue,setInputValue] = useState('')
    const [searching, setSearching] = useState(false)

    const filtrarDebounce = useMemo(() => Debounce((palabraClave) => {
        filtrarDatos(palabraClave);
    }, 300), [filtrarDatos]);


    const buscarChange = (event) => {
        event.preventDefault();
        
            const value = inputValue; // se toma el valor
            const palabraClave = value.trim().toLowerCase().split(/\s+/);
            // setBuscar(value);
            filtrarDatos(palabraClave);
            filtrarDebounce(palabraClave)
            setSearching(true)
        
    }

    const Reset = () => {
        setInputValue("")
        filtrarDatos([])
        setSearching(false)
    }

    return(
        <Grid item sx={{  margin: '3rem auto 1.5rem' ,display: 'flex', alignItems: 'center' }}>
           
            <IconButton color="primary" aria-label="search" onClick={() => setShowSearch(!showSearch)} >
                <RemoveRedEyeIcon />
            </IconButton>

            <SearchBox show={showSearch} >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && buscarChange(e)}
                        InputProps={{
                            endAdornment: (
                                <>
                                    {searching && (
                                        <IconButton onClick={Reset} size="small">
                                            <CloseOutlined />
                                        </IconButton>
                                    )}
                                </>
                            ),
                        }}
                    />

                    <IconButton onClick={buscarChange} size="small">
                        <SearchIcon />
                    </IconButton>
                </Box>
            </SearchBox>

        </Grid>
    )

}