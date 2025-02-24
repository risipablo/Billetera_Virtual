
import { useEffect, useState } from "react";

import { addNotas, getNotas } from "../service/notasService";

export const useNotas = (token) => {
    const [notas,setNotas] = useState([]);
    const [newNota, setNewNota] = useState("");


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No hay token disponible");
            return;
        }
        getNotas(token).then(data => setNotas(data));
    }, []);

    const handleAddNota = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No hay token disponible");
            return;
        }
        addNotas({ titulo: newNota }, token).then(data => {
            setNotas([...notas, data]);
            setNewNota("");
        });
    };

    return {
        notas,
        handleAddNota
    }
}