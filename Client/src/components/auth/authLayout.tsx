import type { AuthLayoutProps } from '../../features/types/type.user';
import { motion } from "framer-motion";


export const AuthLayout = ({
    children,
    title
    }:AuthLayoutProps) => {
  return (
            <div>
              <motion.div 
                className="container-login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2 
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {title}
                </motion.h2>
                {children}
              </motion.div>
            </div>
          );
}