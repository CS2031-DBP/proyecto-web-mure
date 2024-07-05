import React from "react";

const Footer = () => {
  return (
    <footer className="footer bg-gradient-to-r from-gradient1 via-gradient2 to-gradient5 text-white py-3 fixed bottom-0 left-0 right-0">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Mure - Share Your Music Taste. Todos los derechos reservados.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
