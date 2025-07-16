import React, { useState } from 'react';
import GameCharacter from '../patterns/prototype/GameCharacter';

const PrototypeDemo = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);

  // Estado para formulario de personajes
  const [charForm, setCharForm] = useState({
    name: 'Arthas',
    characterClass: 'Guerrero',
    level: 5
  });

  // Crear personaje original
  const createCharacter = () => {
    const char = new GameCharacter(
      charForm.name,
      charForm.characterClass,
      charForm.level
    );
    setCharacters(prev => [...prev, char]);
  };

  // Clonar personaje
  const cloneCharacter = (char) => {
    const cloned = char.clone();
    setCharacters(prev => [...prev, cloned]);
  };

  // Clonar personaje como variante
  const cloneCharacterAsVariant = (char) => {
    const variants = [
      {
        name: `${char.name} Elite`,
        modifications: {
          level: char.level + 5,
          statsBonus: { strength: 10, agility: 5, intelligence: 5 },
          equipment: [...char.equipment, 'Espada Legendaria', 'Armadura Mágica']
        }
      },
      {
        name: `${char.name} Novato`,
        modifications: {
          level: Math.max(1, char.level - 3),
          equipment: char.equipment.slice(0, 1) // Solo primer equipo
        }
      }
    ];

    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    const cloned = char.cloneAsVariant(randomVariant.name, randomVariant.modifications);
    setCharacters(prev => [...prev, cloned]);
  };

  const deleteCharacter = (id) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
    if (selectedChar && selectedChar.id === id) setSelectedChar(null);
  };

  return (
    <div className="prototype-demo">
      <h2>🔄 Patrón Prototype - Sistema de Personajes</h2>
      <p className="description">
        El patrón Prototype permite crear objetos nuevos clonando instancias existentes. 
        Ideal para crear personajes de videojuegos con configuraciones base que se pueden personalizar.
      </p>

      <div className="demo-section">
        <h3>⚔️ Sistema de Personajes de Juego</h3>
        <div className="demo-grid">
          {/* Formulario para crear personajes */}
          <div className="form-section">
            <h4>Crear Personaje Original</h4>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre del personaje"
                value={charForm.name}
                onChange={(e) => setCharForm(prev => ({...prev, name: e.target.value}))}
              />
              <select
                value={charForm.characterClass}
                onChange={(e) => setCharForm(prev => ({...prev, characterClass: e.target.value}))}
              >
                <option value="Guerrero">⚔️ Guerrero</option>
                <option value="Mago">🧙 Mago</option>
                <option value="Arquero">🏹 Arquero</option>
                <option value="Sanador">💚 Sanador</option>
              </select>
              <input
                type="number"
                placeholder="Nivel"
                min="1"
                max="100"
                value={charForm.level}
                onChange={(e) => setCharForm(prev => ({...prev, level: parseInt(e.target.value) || 1}))}
              />
              <button onClick={createCharacter} className="create-btn">
                ⭐ Crear Personaje
              </button>
            </div>
          </div>

          {/* Lista de personajes */}
          <div className="items-section">
            <h4>Personajes Creados ({characters.length})</h4>
            <div className="items-list">
              {characters.map(char => (
                <div key={char.id} className="item-card character-card">
                  <div className="item-header">
                    <strong>{char.name}</strong>
                    <span className="class-badge">{char.characterClass}</span>
                    <span className="level-badge">Nv. {char.level}</span>
                  </div>
                  <div className="item-details">
                    <div className="stats">
                      <span>💪 {char.stats.strength}</span>
                      <span>🏃 {char.stats.agility}</span>
                      <span>🧠 {char.stats.intelligence}</span>
                      <span>❤️ {char.stats.health}</span>
                    </div>
                    <p>🎒 Equipo: {char.equipment.length} items</p>
                    <p>⚡ Habilidades: {char.skills.length}</p>
                  </div>
                  <div className="item-actions">
                    <button 
                      onClick={() => setSelectedChar(char)}
                      className="select-btn"
                    >
                      👁️ Ver Detalles
                    </button>
                    <button 
                      onClick={() => cloneCharacter(char)}
                      className="clone-btn"
                    >
                      📄 Clonar
                    </button>
                    <button 
                      onClick={() => cloneCharacterAsVariant(char)}
                      className="clone-advanced-btn"
                    >
                      🌟 Crear Variante
                    </button>
                    <button 
                      onClick={() => deleteCharacter(char.id)}
                      className="delete-btn"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {characters.length === 0 && (
                <div className="empty-state">
                  <p>🎮 No hay personajes creados.</p>
                  <p>¡Crea tu primer héroe para empezar!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detalles del personaje seleccionado */}
        {selectedChar && (
          <div className="detail-section">
            <h4>🔍 Detalles del Personaje</h4>
            <div className="detail-card character-detail">
              <h5>{selectedChar.name} - {selectedChar.characterClass}</h5>
              <p><strong>🆔 ID:</strong> {selectedChar.id}</p>
              <p><strong>📊 Nivel:</strong> {selectedChar.level}</p>
              
              <div className="stats-detail">
                <h6>📈 Estadísticas:</h6>
                <div className="stats-grid">
                  <div>💪 Fuerza: {selectedChar.stats.strength}</div>
                  <div>🏃 Agilidad: {selectedChar.stats.agility}</div>
                  <div>🧠 Inteligencia: {selectedChar.stats.intelligence}</div>
                  <div>❤️ Salud: {selectedChar.stats.health}</div>
                </div>
              </div>

              <div className="equipment-detail">
                <h6>🎒 Equipamiento:</h6>
                <ul>
                  {selectedChar.equipment.map((item, index) => (
                    <li key={index}>🔸 {item}</li>
                  ))}
                </ul>
              </div>

              <div className="skills-detail">
                <h6>⚡ Habilidades:</h6>
                <ul>
                  {selectedChar.skills.map((skill, index) => (
                    <li key={index}>✨ {skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pattern-explanation">
        <h4>💡 ¿Cómo funciona el Patrón Prototype?</h4>
        <div className="explanation-content">
          <div className="explanation-step">
            <h5>🔄 1. Clonación Simple</h5>
            <p>Crear una copia exacta del personaje original con todas sus características.</p>
          </div>
          <div className="explanation-step">
            <h5>🌟 2. Crear Variantes</h5>
            <p>Generar versiones especializadas (Elite con mejores stats, Novato con menos equipo).</p>
          </div>
          <div className="explanation-step">
            <h5>⚡ 3. Ventajas del Patrón</h5>
            <p>• Evita configurar personajes desde cero<br/>
               • Permite reutilizar configuraciones base<br/>
               • Ideal para sistemas de plantillas de personajes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeDemo;
