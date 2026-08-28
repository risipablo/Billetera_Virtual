import { useContext } from "react"
import { UserContext } from "../../context/userProvider"

export const useUser = () => {
    const context = useContext(UserContext)
    if(!context){
        throw new Error ("Error con el userProvider")
    }
    return context
}