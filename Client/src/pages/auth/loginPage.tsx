import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { AuthenticatedProps } from '../../features/types/type.auth';
import type { LoginData } from '../../features/types/type.user';
import { UseAuth } from '../../features/hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/authLayout';
import { motion } from 'framer-motion';
import { GoogleLoginButton } from '../../components/auth/googleLogin';
import { PasswordInput } from '../../components/auth/passwordInput';
import { AuthButton } from '../../components/auth/authButton';
import "../../style/auth.css"




export const LoginPage = ({setIsAuthenticated}:AuthenticatedProps) => {

    const [formData,setFormData] = useState<LoginData>({
        email:'',
        password:''
    })

    const {login,loading, error} = UseAuth()
    const navigate = useNavigate()

    const handleChange = (e:ChangeEvent<HTMLInputElement>): void => {
        const {name, value, type} = e.target

        if(type === 'email'){
            setFormData({...formData, email:value})
        } else {
            setFormData({...formData,[name]:value})
        }
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault()
        await login(formData)
        setIsAuthenticated(true)
        navigate('/dashboard')
    }

    return(
        <AuthLayout title='Iniciar Sesión'>
            {/* <Helmet><title>Login</title></Helmet> */}
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

                <PasswordInput
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingrese Contraseña"
                    delay={0.2}
                />

                <AuthButton loading={loading} text="Iniciar Sesión" />

                {error && (
                <motion.p 
                    className="message error"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    {error}
                </motion.p>
                )}
            </motion.form>

            <motion.div 
                className="count"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >

                <NavLink to="/register">
                <p>¿No tienes cuenta? Regístrate</p>
                </NavLink>

                <NavLink to="/forgot-password">
                <p>¿Olvidaste tu contraseña?</p>
                </NavLink>

                
            <div className="divider">
                    <span>o</span>
                </div>

                <GoogleLoginButton/>
                
            </motion.div>
        </AuthLayout>
    )
    
}