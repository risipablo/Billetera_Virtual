// Este prop es para el uso de limitespend, totalMonto y lastSpend

export interface GastosStatsProps{
    lastSpend:string
    totalMonto:string
    limiteSpend:{
        excede: boolean
        monto:number
        color:string
    }
    limite:string
    setLimite: (value:string) => void
    loading?:boolean
}

