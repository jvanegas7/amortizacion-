
import React from 'react';
import { Link } from 'react-router-dom';

export const Nosotros: React.FC = () => {
  return (
    <>
      <header>
        <nav>
          <div className="logo">Nosotros</div>
          <ul className="nav-links">
            {/* Usamos Link en lugar de <a href="..."> para páginas internas */}
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            {/* Los enlaces de anclaje (#) se pueden mantener igual */}
            <li><a href="#simuladores">Simuladores</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="hero2">
          <h1>Quiénes Somos</h1>
          <p>
            Data FinancePro es una empresa que aporta información financiera para la 
            mejor toma de decisiones por los usuarios.
          </p>
          <button className="cta-button">Más detalles</button>
        </section>

        <section id="hero3">
          <h1>Misión</h1>
          <p>
            Ser una organización que crea y desarrolla mejores oportunidades de negocio, 
            ofreciendo servicios de consultoría financiera, información útil para una mejor 
            tranquilidad financiera, simuladores financieros, software que proveen la 
            información que sea clara para tomar las mejores decisiones.
          </p>
        </section>

        <section id="hero4">
          <h1>Visión</h1>
          <p>
            Dar soluciones mediante información actualizada, más precisa, capacitando a las 
            personas en aspectos financieros para que puedan tomar las mejores decisiones al 
            momento de invertir o adquirir un crédito.
          </p>
        </section>

        <section id="contacto">
          <h2>Contacto</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Nombre" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Mensaje" required></textarea>
            <button type="submit">Enviar</button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; Premium simulator. Todos los derechos reservados</p>
      </footer>
    </>
  );
};

export default Nosotros;

