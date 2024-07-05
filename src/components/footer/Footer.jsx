import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="footer bg-gradient-to-r from-gradient1 via-gradient2 to-gradient5 text-white py-3 fixed bottom-0 left-0 right-0"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © 2024 Mure - Share Your Music Taste. Todos los derechos reservados.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
