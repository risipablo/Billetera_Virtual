import type { AuthLayoutProps } from '../../features/types/type.user';
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import logo1 from "../../../public/logo.png";
import "../../style/auth.css";

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="login-background">
      <motion.div
        className="container-login"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
       
        <Box
          component={motion.img}
          src={logo1}
          alt="Guita"
          className="login-logo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

       
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
        </motion.h2>

        {children}
      </motion.div>
    </div>
  );
};