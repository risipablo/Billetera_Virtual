import { useState } from "react";
import { useNotas } from "../../component/logica/hook/useNotas";


export function NotasPage({token}){
    const {notas, handleAddNota} = useNotas(token);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');

    const handleAddNote = () => {
        handleAddNota({titulo, descripcion, fecha});
        setFecha('')
        setDescripcion('')
        setTitulo('')
    }

    return(
        <div className="">
            <h2>Notas</h2>
            <div>
                <input type="text"  onChange={(e) => setTitulo(e.target.value)} />
                <input type="text"  onChange={(e) => setDescripcion(e.target.value)} />
                <input type="text"  onChange={(e) => setFecha(e.target.value)} />
                <button onClick={handleAddNote}>Agregar</button>
            </div>
            <ul>
                {notas.map((nota,index) => (
                    <li key={index}>
                        <h3>{nota.titulo}</h3>
                        <p>{nota.descripcion}</p>
                        <p>{nota.fecha}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}