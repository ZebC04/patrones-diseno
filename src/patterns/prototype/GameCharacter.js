// Patrón Prototype para personajes de juego
class GameCharacter {
  constructor(name, characterClass, level = 1) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.name = name;
    this.characterClass = characterClass;
    this.level = level;
    this.stats = this.generateBaseStats();
    this.equipment = this.getDefaultEquipment();
    this.skills = this.getClassSkills();
    this.experience = 0;
  }

  generateBaseStats() {
    const baseStats = {
      'Guerrero': { strength: 15, agility: 10, intelligence: 8, health: 120 },
      'Mago': { strength: 8, agility: 12, intelligence: 16, health: 80 },
      'Arquero': { strength: 10, agility: 16, intelligence: 10, health: 100 },
      'Sanador': { strength: 9, agility: 11, intelligence: 14, health: 90 }
    };

    const base = baseStats[this.characterClass] || baseStats['Guerrero'];
    
    // Ajustar stats según el nivel
    const levelBonus = this.level - 1;
    return {
      strength: base.strength + levelBonus * 2,
      agility: base.agility + levelBonus * 2,
      intelligence: base.intelligence + levelBonus * 2,
      health: base.health + levelBonus * 10
    };
  }

  getDefaultEquipment() {
    const equipment = {
      'Guerrero': ['Espada de Hierro', 'Escudo de Madera', 'Armadura de Cuero'],
      'Mago': ['Báculo Místico', 'Túnica Encantada', 'Amuleto de Maná'],
      'Arquero': ['Arco Élfico', 'Carcaj de Flechas', 'Botas de Cuero'],
      'Sanador': ['Bastón Sagrado', 'Capa Bendita', 'Cristal Curativo']
    };

    return equipment[this.characterClass] || equipment['Guerrero'];
  }

  getClassSkills() {
    const skills = {
      'Guerrero': ['Golpe Poderoso', 'Defensa Férrea', 'Grito de Guerra'],
      'Mago': ['Bola de Fuego', 'Escudo Mágico', 'Teletransporte'],
      'Arquero': ['Disparo Certero', 'Lluvia de Flechas', 'Camuflaje'],
      'Sanador': ['Curación Menor', 'Bendición', 'Resurrección']
    };

    return skills[this.characterClass] || skills['Guerrero'];
  }

  // Método clone del patrón Prototype
  clone() {
    const cloned = new GameCharacter(
      this.name + ' (Clon)',
      this.characterClass,
      this.level
    );

    // Copia profunda de propiedades complejas
    cloned.stats = { ...this.stats };
    cloned.equipment = [...this.equipment];
    cloned.skills = [...this.skills];
    cloned.experience = this.experience;

    return cloned;
  }

  // Método para crear variantes especializadas
  cloneAsVariant(variantName, modifications = {}) {
    const cloned = this.clone();
    cloned.name = variantName;

    // Aplicar modificaciones específicas
    if (modifications.level) {
      cloned.level = modifications.level;
      cloned.stats = cloned.generateBaseStats();
    }

    if (modifications.equipment) {
      cloned.equipment = modifications.equipment;
    }

    if (modifications.statsBonus) {
      Object.keys(modifications.statsBonus).forEach(stat => {
        if (cloned.stats[stat]) {
          cloned.stats[stat] += modifications.statsBonus[stat];
        }
      });
    }

    return cloned;
  }

  getCharacterInfo() {
    return {
      id: this.id,
      name: this.name,
      characterClass: this.characterClass,
      level: this.level,
      stats: this.stats,
      equipment: this.equipment,
      skills: this.skills,
      experience: this.experience
    };
  }

  levelUp() {
    this.level++;
    this.stats = this.generateBaseStats();
    this.experience = 0;
  }
}

export default GameCharacter;
