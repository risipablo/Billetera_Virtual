import { useState, type ChangeEvent, type FormEvent } from "react"
import type { AuthenticatedProps } from "../../features/types/type.auth"
import type { RegisterData } from "../../features/types/type.user"
import { UseAuth } from "../../features/hooks/useAuth"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthLayout } from "../../components/auth/authLayout"
import { motion } from "framer-motion"
import { AuthButton } from "../../components/auth/authButton"
import { PasswordInput } from "../../components/auth/passwordInput"
import { PasswordRequirements } from "../../components/auth/passwordRequirements"

interface RegisterFromData extends RegisterData{
    confirmPassword:string
}


const RegisterPage = ({setIsAuthenticated}:AuthenticatedProps) => {
  const[formData,setFormData] = useState<RegisterFromData>({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
  })

  const [show,setSHow] = useState<boolean>(true)
  const {register,loading,error,succes} = UseAuth()
  const navigate = useNavigate()

 const handleChange = (e: ChangeEvent<HTMLInputElement>): void =>{
        const {name,value,type} = e.target

        if(type === 'email'){
            setFormData({...formData, email:value})
        } else {
            setFormData({...formData, [name]:value})
        }
    }

    const handleSubmit = async(e:FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()

        if(formData.password !== formData.confirmPassword){
            alert("Las contraseñas no coinciden")
            return
        }

        try{
            await register({
                email: formData.email,
                password: formData.password,
                name: formData.name
            })
            setIsAuthenticated(true)
            navigate('/dashboard')
        } catch(err){
            console.error(err)
        }
    }

  
    return (
    <AuthLayout title='Registrarse' >
      <title>Tegister</title>
       <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            >
                
            <motion.input
            type="email"
            name="email"
            placeholder="Ingrese Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.05 }}
            />

            <motion.input
            type="text"
            name="name"
            placeholder="Ingrese Nombre de Usuario"
            value={formData.name}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.05 }}
            />

            <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Crea una Contraseña"
            delay={0.2}
            />

            <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirme Contraseña"
            delay={0.3}
            />

            <AuthButton loading={loading} text="Confirmar" />

            {(error || succes) && (
            <motion.p 
                className={`message ${error ? 'error' : 'success'}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {error || succes}
            </motion.p>
            )}
        </motion.form>

        <motion.div 
            className="count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <NavLink to="/login">
            <p>¡Ya tengo cuenta!</p>
            </NavLink>
        </motion.div>

        <PasswordRequirements 
            show={show}
            onToggle={() => setSHow(!show)}
        />
    </AuthLayout>
  )
}

export default RegisterPage
