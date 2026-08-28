import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import { Grid, IconButton, TextField } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { Debounce } from "../../../../components/common/debounceSearch";

const SearchBox = styled(Box)(({ show }: { show: boolean }) => ({
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    maxWidth: show ? '300px' : '0',
    overflow: 'hidden',
    marginLeft: show ? '1rem' : '0',
}));

export function Buscador({ filtrarDatos }: { filtrarDatos: (value: string) => void }) {
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [searching, setSearching] = useState<boolean>(false);

    const filtrarDebounce = useMemo(() => Debounce((value: string) => {
        filtrarDatos(value);
    }, 300), [filtrarDatos]);

    const handleInputChange = () => {
        const value = inputValue.trim();

        if (value) {
            const palabrasClave = value.toLowerCase().split(/\s+/);
            const textoBusqueda = palabrasClave.join(' ');
            filtrarDebounce(textoBusqueda);
            setSearching(true);
        } else {
            setSearching(false);
            filtrarDatos('');
        }
    }

    const Reset = () => {
        setInputValue("");
        setSearching(false);
        filtrarDatos('');
    }

    return (
        <Grid sx={{ margin: '3rem auto 1.5rem', display: 'flex', alignItems: 'center' }}>
            <IconButton
                color="primary"
                aria-label="search"
                onClick={() => setShowSearch(!showSearch)}
            >
                <Eye size={20} />
            </IconButton>

            <SearchBox show={showSearch}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInputChange()}
                        slotProps={{  
                            input: {
                                endAdornment: (
                                    <>
                                        {searching && (
                                            <IconButton 
                                                onClick={Reset} 
                                                size="small"
                                            >
                                                <CloseOutlined fontSize="small" />
                                            </IconButton>
                                        )}
                                    </>
                                ),
                            }
                        }}
                    />

                    <IconButton onClick={handleInputChange} size="small">
                        <Search size={20} />
                    </IconButton>
                </Box>
            </SearchBox>
        </Grid>
    );
}