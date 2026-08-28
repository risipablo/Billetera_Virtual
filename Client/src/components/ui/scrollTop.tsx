
import { useEffect, useState } from "react";
import { animateScroll as scroll } from "react-scroll";
import { ArrowUp } from "lucide-react";  

export const ScrollTop = () => {
    const [visible, setVisible] = useState(false);  

    const clickUp = () => {
        scroll.scrollToTop({ smooth: true, duration: 500 });
    };

    const toggleVisibility = () => {
        if (window.pageYOffset > 400) {  
            setVisible(true);
        } else {
            setVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            onClick={clickUp}
            className={`btn-up ${visible ? 'visible' : 'hidden'}`}
            aria-label="Volver arriba"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                padding: '12px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'opacity 0.3s ease',
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <ArrowUp size={24} />
        </button>
    );
};