import { useState, type ChangeEvent, type FormEvent, useRef } from 'react';
import { Send, User, FileText, MessageSquare, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import type { IContact } from '../../types/type.user';
import { config } from '../../../config';
import "./suggest.css"

export const SuggestionsComponent = () => {
  const [formData, setFormData] = useState<IContact>({
    name: '',
    message: '',
    reason: 'consulta'
  });

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.message.trim()) newErrors.message = 'El mensaje es requerido';
    if (!formData.reason) newErrors.reason = 'El motivo es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${config.Api}/api/auth/send-email`,
        {
          name: formData.name,
          message: formData.message,
          reason: formData.reason,
        },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        toast.success('¡Mensaje enviado correctamente! Gracias por escribirnos.', {
          duration: 4000,
          style: {
            background: '#E8F3E4',
            color: '#2E7D32',
            border: '1px solid #C9E4C0',
            borderRadius: '10px',
            padding: '14px 18px',
            fontSize: '14px',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#2E7D32',
            secondary: '#E8F3E4',
          },
        });

        setFormData({
          name: '',
          message: '',
          reason: 'consulta'
        });
        setErrors({});
      }

    } catch (error: unknown) {
      console.error('Error enviando mensaje:', error);
      const errorMessage = axios.isAxiosError<{ error?: string }>(error)
        ? (error.response?.data?.error ?? 'Error al enviar el mensaje. Por favor, intentá nuevamente.')
        : 'Error al enviar el mensaje. Por favor, intentá nuevamente.';
      toast.error(errorMessage, {
        style: {
          background: '#FBE9E9',
          color: '#A22E2E',
          border: '1px solid #F3D8D8',
          borderRadius: '10px',
          padding: '14px 18px',
          fontSize: '14px',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = () => {
    setFormData({
      name: '',
      message: '',
      reason: 'consulta'
    });
    setErrors({});
  };

  return (
    <motion.div
      id='contacto'
      className="table-container"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >

      <div className="roman-content">
        <motion.div
          className="roman-title-section"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="roman-accent-line"></div>
          <h1>Contactanos</h1>

          <div className="roman-divider">
            <span className="divider-dot" />
            <span className="divider-line"></span>
            <span className="divider-dot" />
          </div>
        </motion.div>

        <motion.p
          className="roman-description"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          ¿Tenés una pregunta o querés dejarnos una sugerencia? Completá el formulario y te respondemos a la brevedad.
        </motion.p>

        <motion.form
          className="roman-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="form-grid">
            <div className="form-left">
              <motion.div
                className="form-group"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label htmlFor="nombre">
                  <User size={14} />
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                  className={`roman-input ${errors.name ? 'error' : ''}`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <span className="roman-error">
                    <AlertCircle size={12} />
                    {errors.name}
                  </span>
                )}
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label htmlFor="reason">
                  <FileText size={14} />
                  Motivo
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className={`roman-select ${errors.reason ? 'error' : ''}`}
                  disabled={isLoading}
                >
                  <option value="consulta">Consulta general</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="queja">Queja / Reclamo</option>
                  <option value="trabajo">Propuesta laboral</option>
                </select>
                {errors.reason && (
                  <span className="roman-error">
                    <AlertCircle size={12} />
                    {errors.reason}
                  </span>
                )}
              </motion.div>
            </div>

            <div className="form-right">
              <motion.div
                className="form-group form-group-full"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label htmlFor="consulta">
                  <MessageSquare size={14} />
                  Mensaje
                </label>
                <textarea
                  id="consulta"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Escribí tu mensaje acá..."
                  rows={6}
                  className={`roman-textarea ${errors.message ? 'error' : ''}`}
                  disabled={isLoading}
                ></textarea>
                {errors.message && (
                  <span className="roman-error">
                    <AlertCircle size={12} />
                    {errors.message}
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          <motion.div
            className="contact-btn-row"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.button
              type="submit"
              className="contact-btn contact-btn--submit"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Enviar</span>
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={deleteMessage}
              className="contact-btn contact-btn--clear"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              disabled={isLoading}
            >
              <Trash2 size={18} />
              <span>Borrar</span>
            </motion.button>
          </motion.div>
        </motion.form>

        <div className="roman-footer">
          <p>Tu opinión es importante para nosotros</p>
        </div>
      </div>
    </motion.div>
  );
};