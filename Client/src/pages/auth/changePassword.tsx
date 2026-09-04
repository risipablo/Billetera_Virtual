import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeClosed, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { AnimatePresence } from "framer-motion";
import type { IChangeUserName, ResetPasswordData, VerifyEmailData } from "../../features/types/type.user";
import { UseAuth } from "../../features/hooks/useAuth";
import "../../style/auth-forms.css";

interface ShowState {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

 function ResetPasswordPage({ setIsAuthenticated }: IChangeUserName) {

  const [formData, setFormData] = useState<ResetPasswordData>({
    currentPassword: '',
    newPassword: '',
  })

  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [emailData, setEmailData] = useState<VerifyEmailData>({
    email: ''
  })

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string>('');
  const [passwordStep, setPasswordStep] = useState<'verify' | 'change'>('verify');

  const [show, setShow] = useState<ShowState>({
    current: false,
    new: false,
    confirm: false
  });

  const { changePassword, verifyEmail, loading, error,succes } = UseAuth()
  const navigate = useNavigate()

  const toggleShow = (field: keyof ShowState): void => {
    setShow(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleVerifyEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowError('')

    try {
      await verifyEmail(emailData)
      setPasswordStep('change')
      setShowError('')
    } catch (err) {
      setShowError('El correo no es válido. Verificalo e intentá nuevamente.')
      console.error(err)
    }
  }

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setShowError('')

    if (formData.newPassword !== confirmPassword) {
      setShowError('Las contraseñas no coinciden')
      return
    }

    if (formData.newPassword === formData.currentPassword) {
      setShowError('No podés usar la misma contraseña anterior')
      return
    }

    if (formData.newPassword.length < 8) {
      setShowError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    try {
      await changePassword(formData)
      setShowSuccess(true)

      setTimeout(() => {
        setIsAuthenticated(true)
        navigate('/dashboard')
      }, 3000)
    } catch (err) {
      setShowError('Error al cambiar la contraseña. Intentá nuevamente.')
      console.error('Error cambiando contraseña:', err)
    }
  }

  return (
    <div className="table-container">
            <div className="form-wrapper">
        <motion.div
          className="form-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-icon lock-icon-large">
            <Lock size={32} />
          </div>
          <h2>Cambiar contraseña</h2>
          <p>Actualizá tu contraseña de forma segura</p>
        </motion.div>

        {passwordStep === 'verify' && !showSuccess && (
          <motion.form
            onSubmit={handleVerifyEmail}
            className="auth-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="verify-email">Verificá tu correo electrónico</label>
              <p className="form-hint">Por seguridad, primero debemos confirmar tu identidad</p>
              <input
                id="verify-email"
                type="email"
                placeholder="tu@correo.com"
                value={emailData.email}
                onChange={(e) => setEmailData({ email: e.target.value })}
                required
                disabled={loading}
                className="auth-input"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="submit-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {loading ? "Verificando..." : "Verificar correo"}
            </motion.button>
          </motion.form>
        )}

        {passwordStep === 'change' && !showSuccess && (
          <motion.form
            onSubmit={handleChangePassword}
            className="auth-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="current-password">Contraseña actual</label>
              <div className="password-field">
                <input
                  id="current-password"
                  type={show.current ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({
                    ...formData,
                    currentPassword: e.target.value
                  })}
                  required
                  disabled={loading}
                  className="auth-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShow('current')}
                  tabIndex={-1}
                >
                  {show.current ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="new-password">Nueva contraseña</label>
              <div className="password-field">
                <input
                  id="new-password"
                  type={show.new ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({
                    ...formData,
                    newPassword: e.target.value
                  })}
                  required
                  minLength={8}
                  disabled={loading}
                  className="auth-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShow('new')}
                  tabIndex={-1}
                >
                  {show.new ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
              <p className="form-hint">Mínimo 8 caracteres</p>
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="confirm-password">Confirmar contraseña</label>
              <div className="password-field">
                <input
                  id="confirm-password"
                  type={show.confirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                  className="auth-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShow('confirm')}
                  tabIndex={-1}
                >
                  {show.confirm ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="submit-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </motion.button>
          </motion.form>
        )}

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="message success-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle size={20} />
              <div>
                <p className="message-title">Contraseña actualizada</p>
                <p className="message-subtitle">Serás redirigido en unos segundos...</p>
              </div>
            </motion.div>
          )}

          {(showError || error) && !showSuccess && (
            <motion.div
              className="message error-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={20} />
              <div>
                <p className="message-title">Error</p>
                <p className="message-subtitle">{showError || error}</p>
              </div>
            </motion.div>
          )}

          {succes && !showError && !showSuccess && (
            <motion.p
              className="message success-message"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {succes}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ResetPasswordPage