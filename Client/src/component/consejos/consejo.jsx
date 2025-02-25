import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { dataAhorro } from "./dataAhorro";
import { motion } from "framer-motion";
import "./consejo.css";


export function Consejo(){

    return (
        <div className="consejo-container">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <Accordion
                sx={{
                    border: '1px solid black',
                    borderRadius: 2,
                    boxShadow: 2 ,
                }}
                
            >
                <AccordionSummary
                    style={{ fontWeight: "bold" }}
                    expandIcon={<ExpandMore />}
                    id="panel1-header"
                    item xs={12} sm={5}
                >
                    <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        Consejos de ahorro
                    </Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: '#f8f8f8', 
                        color: '#000', 
                    }}
                >
                    {dataAhorro.ahorro.map((consejo) => (
                        <Typography key={consejo.id}>
                            <div className="ahorro-container">
                                <h4>{consejo.titulo}</h4>
                                <p>{consejo.descripcion}</p>
                            </div>
                        </Typography>
                    ))}
                </AccordionDetails>
            </Accordion>

            <Accordion
                className="accordion-container"
                sx={{
                    border: '1px solid black',
                    borderRadius: 2,
                    boxShadow: 2,
                }}
            >
                <AccordionSummary
                    style={{ fontWeight: "bold" }}
                    expandIcon={<ExpandMore />}
                    id="panel2-header"
                    item xs={12} sm={5}
                >
                    <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        Consejos de Inversión
                    </Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        backgroundColor: '#f8f8f8', 
                        color: '#000', 
                    }}
                >
                    {dataAhorro.inversion.map((consejo) => (
                        <Typography key={consejo.id}>
                            <div className="ahorro-container">
                                <h4>{consejo.titulo}</h4>
                                {Array.isArray(consejo.descripcion) ? (
                                    <ul>
                                        {consejo.descripcion.map((item, index) => (
                                            <p key={index}>{item}</p>
                                        ))}
                                    </ul>
                                ) : (
                                    consejo.descripcion
                                )}
                            </div>
                        </Typography>
                    ))}
                </AccordionDetails>
            </Accordion>
            </motion.div>
        </div>
    );
}