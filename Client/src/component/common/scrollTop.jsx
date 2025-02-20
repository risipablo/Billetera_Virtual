

import { useEffect, useState } from "react"
import { animateScroll as scroll} from "react-scroll";
import '../../pages/gastos/gastos.css'

export function ScrollTop(){

    const [visible, setVisible] = useState(false)

    const clickUp = () => {
        scroll.scrollToTop();
    }

    const toggleVisibility = () => {
        if (window.pageYOffset > window.innerHeight / 1) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll',toggleVisibility)
        return() => {
            window.removeEventListener('scroll',toggleVisibility)
        }
    },[])

    return (
        <>
            <button onClick={clickUp} style={{ display: visible ? 'block' : 'none' }} className="btn-up">
                <i className="fa-solid fa-up-long"></i>
            </button>
        </>
    )

}