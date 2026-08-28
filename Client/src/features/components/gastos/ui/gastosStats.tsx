import { Box, ListItem, ListItemText, TextField, Typography, useMediaQuery } from "@mui/material";
import type { GastosStatsProps } from "../types/type.gastosStats";

export const GastosStats = ({
    lastSpend,
    limite,
    limiteSpend,
    loading = false,
    totalMonto,
    setLimite
}:GastosStatsProps) => {
    const isMobile = useMediaQuery('(max-width:500px)');

    return(
        <Box
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                margin: '.7rem auto 1.2rem',  
            }}
        >
            <ListItem>
                <ListItemText
                    sx={{
                        '& .MuiListItemText-primary': {
                            fontWeight: 'bold',
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: '.9rem',
                        },
                    }}
                >
                    Último gasto agregado
                    <Typography >{lastSpend}</Typography>
                </ListItemText>
            </ListItem>


            <ListItem>
                <ListItemText
                    sx={{
                        '& .MuiListItemText-primary': {
                            fontWeight: 'bold',
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: '.9rem',
        
                            transition: 'color 0.3s ease',
                        },
                    }}
                >
                    Total de gasto:
                            <Typography sx={{color: limiteSpend.color,fontWeight:'600'}} >${totalMonto}</Typography>
                </ListItemText>
            </ListItem>

            <ListItem sx={{ fontWeight: 'bold', fontFamily: "Montserrat, sans-serif", fontSize: '.9rem',}}>
                <TextField
                    fullWidth 
                    sx={{ fontFamily: "Montserrat, sans-serif" }} 
                    label="Establecer límite de gasto"
                    type="number"
                    value={limite}
                    onChange={(e) => setLimite(e.target.value)}/>

                <Typography sx={{ color: limiteSpend.color }}>

                </Typography>
            </ListItem>
                        
        </Box>
    )
}