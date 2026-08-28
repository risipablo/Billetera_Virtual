// data/dataConsejos.ts

import type { DataConsejos } from "../layout/consejos";




export const dataConsejos: DataConsejos = {
    ahorro: [
        {
            id: 1,
            titulo: "Prioriza el ahorro en moneda dura (USD)",
            descripcion: "Compra Dolar Mep o Dolar Blue a través de tu banco o casa de cambio de confianza. Si no sabes como hacerlo, te recomendamos que te asesores con un profesional."
        },
        {
            id: 2,
            titulo: "Instrumentos ajustados por inflación",
            descripcion: "Plazos fijos UVA, bonos ajustados por CER, FCI que inviertan en instrumentos ajustados por inflación."
        },
        {
            id: 3,
            titulo: "Billeteras digitales",
            descripcion: "Aplicaciones como Mercado Pago, Ualá o Personal Pay ofrecen rendimientos diarios en fondos de inversión de baja volatilidad. Aunque no superan la inflación, son mejores que tener el dinero inactivo."
        },
        {
            id: 4,
            titulo: "Mantén un fondo de emergencia",
            descripcion: "Guarda al menos 3-6 meses de gastos esenciales en dólares para cubrir imprevistos sin depender del peso."
        },
        
        {
            id: 5,
            titulo: "Ahorro automatizado: la clave del éxito",
            descripcion: "Configura transferencias automáticas el día que cobras hacia una cuenta de ahorro o inversión. Así ahorras sin pensarlo y evitas la tentación de gastar. El 10% de tu sueldo debería ir directo a tu fondo de ahorro."
        },
        
        {
            id: 6,
            titulo: "Regla 50/30/20 para tus finanzas",
            descripcion: "Destina el 50% de tus ingresos a necesidades básicas (alquiler, alimentos, servicios), 30% a deseos (ocio, entretenimiento, viajes) y 20% a ahorro e inversión. Esta regla te ayudará a mantener un equilibrio financiero saludable."
        }
    ],
    inversion: [
        {
            id: 1,
            titulo: "El 20% como punto de partida",
            descripcion: "Destinar al menos el 20% de tus ingresos a ahorro e inversión. A medida que vayas adquiriendo más conocimientos, podrás aumentar este porcentaje."
        },
        {
            id: 2,
            titulo: "Como ajustar el porcentaje",
            descripcion: [
                "Comenzar con un 10-15% y aumentar gradualmente. Prioriza un fondo de emergencias.",
                "Destina más del 20% en pagar deudas y luego en invertir.",
                "Si tienes deudas, paga primero las deudas con tasas de interés más altas y luego las de tasas más bajas."
            ]
        },
        
        {
            id: 3,
            titulo: "Diversificación: no pongas todos los huevos en la misma canasta",
            descripcion: [
                "Distribuye tus inversiones entre diferentes activos: acciones, bonos, bienes raíces y criptomonedas.",
                "La diversificación reduce el riesgo y protege tu capital ante caídas de un sector específico.",
                "Invierte en distintos sectores: tecnología, salud, energía, consumo, fintech."
            ]
        },
        
        {
            id: 4,
            titulo: "Invierte en ti mismo: el mejor activo",
            descripcion: [
                "La mejor inversión que puedes hacer es en tu educación financiera y desarrollo profesional.",
                "Lee libros de finanzas (recomendados: 'El inversor inteligente', 'Padre rico, padre pobre').",
                "Realiza cursos de inversión, finanzas personales y análisis de mercado.",
                "Aprende a leer balances, estados financieros e indicadores económicos."
            ]
        }
    ]
};