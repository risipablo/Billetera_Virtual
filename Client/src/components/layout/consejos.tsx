
export interface Consejo {
    id: number;
    titulo: string;
    descripcion: string | string[];
}

export interface DataConsejos {
    ahorro: Consejo[];
    inversion: Consejo[];
}


// Consejo.tsx
import { ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
} from "@mui/material";
import "../../style/consejo.css"
import { dataConsejos } from "../data/dataConsejos";

export const Consejo = () => {
    const { ahorro, inversion } = dataConsejos;

    const renderDescripcion = (descripcion: string | string[]) => {
        if (Array.isArray(descripcion)) {
            return (
                <ul className="consejo-lista">
                    {descripcion.map((item, index) => (
                        <li key={index} className="consejo-item">
                            {item}
                        </li>
                    ))}
                </ul>
            );
        }
        return <p className="consejo-descripcion">{descripcion}</p>;
    };

    return (
        <div className="table-container">
         {/* <Helmet>
                <title>Consejos Financieros</title>
            </Helmet> */}

            <h1 className="convertidor-title">Consejos Financieros</h1>
            <div className="gastos-table-wrapper">
                <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Grid container spacing={3}>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Accordion
                            className="consejo-accordion"
                            sx={{
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{
                                    backgroundColor: '#f8fafc',
                                    fontWeight: 700,
                                    '&:hover': {
                                        backgroundColor: '#f1f5f9',
                                    }
                                }}
                            >
                                <Typography variant="h6" className="consejo-accordion-title">
                                    Consejos de Ahorro
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    backgroundColor: '#ffffff',
                                    padding: '16px 20px',
                                }}
                            >
                                {ahorro.map((consejo) => (
                                    <div key={consejo.id} className="consejo-card">
                                        <h4 className="consejo-card-titulo">{consejo.titulo}</h4>
                                        {renderDescripcion(consejo.descripcion)}
                                    </div>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Accordion
                            className="consejo-accordion"
                            sx={{
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{
                                    backgroundColor: '#f8fafc',
                                    fontWeight: 700,
                                    '&:hover': {
                                        backgroundColor: '#f1f5f9',
                                    }
                                }}
                            >
                                <Typography variant="h6" className="consejo-accordion-title">
                                    Consejos de Inversión
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    backgroundColor: '#ffffff',
                                    padding: '16px 20px',
                                }}
                            >
                                {inversion.map((consejo) => (
                                    <div key={consejo.id} className="consejo-card">
                                        <h4 className="consejo-card-titulo">{consejo.titulo}</h4>
                                        {renderDescripcion(consejo.descripcion)}
                                    </div>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
                </motion.div>
            </div>
        
        </div>
             

    );
};

export default Consejo;