import AmortizationCalculator from './components/AmortizationCalculator';
import './App.css';

function App() {
  return <AmortizationCalculator />;
}

export default App;
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Nosotros from './components/nosotros';
import Enosotros from './components/enosotros';


// Un componente rápido para tu página de inicio principal
function Home() {
  return (
    <div>
      <h1>Página Principal</h1>
      <p>Bienvenido a nuestra aplicación.</p>
      {/* Usamos <Link> en lugar de <a href="..."> para no recargar la página */}
      <Link to="/nosotros">Ir a Nosotros</Link>
      <Link to="/prueba">Ir a Nosotros</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Home />} />
        
        {/* Rutas secundarias */}
        <Route path="/nosotros" element={<Nosotros />} />
        
        /*Puedes añadir más aquí:*/
        <Route path="/enosotros" element={<Enosotros />} />
        <Route path="/prueba" element={<Prueba />} /> 
        
        
      </Routes>
    </Router>
  );
}
