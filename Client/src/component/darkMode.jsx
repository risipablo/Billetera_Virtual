import { useEffect, useState } from "react"


export function DarkMode(){
    const [darkMode,setDarkMode] = useState(false)

    const changeMode = () => {
        setDarkMode(!darkMode)
    }

    useEffect(() => {
        const modoLocal = 'modoOscuro'
        const modoGuardado = localStorage.getItem(modoLocal)

        if (modoGuardado === 'oscuro') 
            setDarkMode(true);

        const modoActual
    })


    return(

    )
}