import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Wallet,
    BarChart3,
    CreditCard,
    ShoppingCart,
    ArrowRightLeft,
    Lightbulb,
    Mail,
    Sparkles
} from 'lucide-react';
import "./style/about.css"
import img1 from "../../../../public/logo.png"

interface Seccion {
    to: string;
    label: string;
    descripcion: string;
    icono: React.ReactNode;
    color: string;
}

const SECCIONES: Seccion[] = [
    {
        to: '/gastos',
        label: 'Gastos',
        descripcion: 'Registrá cada pago y descubrí en qué se va tu plata.',
        icono: <Wallet size={20} />,
        color: '#3b82f6'
    },
    {
        to: '/estadisticas',
        label: 'Estadísticas',
        descripcion: 'Mirá tus gastos por mes o año, y qué productos pegan más fuerte.',
        icono: <BarChart3 size={20} />,
        color: '#8b5cf6'
    },
    {
        to: '/cuotas',
        label: 'Cuotas',
        descripcion: 'Seguí el pago de tus productos en cuotas sin perderte ninguna.',
        icono: <CreditCard size={20} />,
        color: '#10b981'
    },
    {
        to: '/listado',
        label: 'Lista de compras',
        descripcion: 'Armá tu lista del súper y no te olvides de nada.',
        icono: <ShoppingCart size={20} />,
        color: '#f59e0b'
    },
    {
        to: '/convertidor',
        label: 'Convertidor',
        descripcion: 'Pasá montos entre monedas y conocé el valor actual.',
        icono: <ArrowRightLeft size={20} />,
        color: '#06b6d4'
    },
    {
        to: '/consejos',
        label: 'Consejos',
        descripcion: 'Tips simples de ahorro e inversión para mejorar tus finanzas.',
        icono: <Lightbulb size={20} />,
        color: '#eab308'
    }
];



export const AboutApp = () => {
    


    return (
        <div className="about-app">
            <motion.header
                className="about-app__hero"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="about-app__hero-icon">
                    <img src={img1} alt="logo" />
                </div>
                <h2>Sobre Guita</h2>
                <p className="about-app__tagline">
                    Tu billetera virtual para saber <strong>en qué se va tu plata</strong> y
                    tomar mejores decisiones.
                </p>
            </motion.header>

            <motion.section
                className="about-app__intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <p>
                    Guita nació para que lleves un registro claro de tus pagos, sin
                    planillas ni complicaciones. Cargás tus gastos, los clasificás y
                    listo: empezás a ver patrones que antes no veías.
                </p>
                <p>
                    Marcá si un gasto fue <strong>necesario</strong>,{' '}
                    <strong>innecesario</strong>, <strong>fijo</strong> o una{' '}
                    <strong>inversión</strong>, y entendé tu comportamiento mes a mes.
                </p>
            </motion.section>

            <section className="about-app__secciones">
                <h2>¿Qué encontrás adentro?</h2>
                <div className="about-app__grid">
                    {SECCIONES.map((s, i) => (
                        <motion.div
                            key={s.to}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                        >
                            <NavLink to={s.to} className="about-app__card">
                                <div
                                    className="about-app__card-icon"
                                    style={{ background: `${s.color}22`, color: s.color }}
                                >
                                    {s.icono}
                                </div>
                                <div className="about-app__card-body">
                                    <h3>{s.label}</h3>
                                    <p>{s.descripcion}</p>
                                </div>
                                <span className="about-app__card-arrow">›</span>
                            </NavLink>
                        </motion.div>
                    ))}
                </div>
            </section>
{/* 
            <motion.section
                className="about-app__contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
            >
                <Mail size={20} />
                <div>
                    <h3>¿Tenés dudas o ideas?</h3>
                    <p>
                        Escribinos en esta seccion 
                        <a>   </a> y te
                        respondemos a la brevedad.
                    </p>
                </div>
            </motion.section> */}
        </div>
    );
};