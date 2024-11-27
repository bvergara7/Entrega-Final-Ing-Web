import React from 'react';
import './footer.css'; 

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Mis Mascotas. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="/terminos" className="footer-link">Términos de Servicio</a>
          <a href="/privacidad" className="footer-link">Política de Privacidad</a>
          <a href="/contacto" className="footer-link">Contacto</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
