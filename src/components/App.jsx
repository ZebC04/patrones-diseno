import React, { useState } from 'react';
import PrototypeDemo from './PrototypeDemo';
import AdapterDemo from './AdapterDemo';

const App = () => {
  const [activeTab, setActiveTab] = useState('prototype');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Patrones de Diseño Interactivos</h1>
        <p>Ejemplos funcionales de los patrones Prototype y Adapter con React</p>
        
        <nav className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'prototype' ? 'active' : ''}`}
            onClick={() => setActiveTab('prototype')}
          >
            🔄 Prototype
          </button>
          <button 
            className={`tab-btn ${activeTab === 'adapter' ? 'active' : ''}`}
            onClick={() => setActiveTab('adapter')}
          >
            🔌 Adapter
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'prototype' && <PrototypeDemo />}
        {activeTab === 'adapter' && <AdapterDemo />}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <h3>📚 Sobre los Patrones</h3>
          <div className="pattern-summary">
            <div className="pattern-card">
              <h4>🔄 Prototype</h4>
              <p>
                Permite crear objetos nuevos clonando instancias existentes, 
                evitando la necesidad de recrear configuraciones complejas.
              </p>
              <ul>
                <li>✅ Reduce complejidad de creación</li>
                <li>✅ Mejora rendimiento</li>
                <li>✅ Facilita configuraciones predefinidas</li>
              </ul>
            </div>
            
            <div className="pattern-card">
              <h4>🔌 Adapter</h4>
              <p>
                Permite que clases con interfaces incompatibles trabajen juntas, 
                actuando como traductor entre diferentes sistemas.
              </p>
              <ul>
                <li>✅ Integra sistemas legacy</li>
                <li>✅ Unifica APIs diferentes</li>
                <li>✅ Facilita intercambio de proveedores</li>
              </ul>
            </div>
          </div>
          
          <div className="tech-info">
            <p>
              💻 Desarrollado con <strong>React 18</strong> | 
              🎨 Estilos CSS personalizados | 
              🔧 Implementación práctica de patrones
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
