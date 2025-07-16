# Patrones de Diseño - Prototype y Adapter con React

Este proyecto contiene ejemplos funcionales e interactivos de dos patrones de diseño fundamentales implementados con React:

## 1. Patrón Prototype
El patrón Prototype permite crear nuevos objetos clonando instancias existentes, evitando la necesidad de crear objetos desde cero.

**Casos de uso:**
- Cuando la creación de objetos es costosa
- Cuando necesitas copiar objetos complejos
- Para evitar subclases de un factory

**Ejemplo en la app:** Sistema de clonación de personajes de videojuegos con diferentes variantes.

## 2. Patrón Adapter
El patrón Adapter permite que clases con interfaces incompatibles trabajen juntas, actuando como un puente entre ellas.

**Casos de uso:**
- Integrar bibliotecas de terceros
- Hacer que código legacy funcione con nuevas interfaces
- Convertir datos entre diferentes formatos

**Ejemplo en la app:** Sistema de pagos unificado que integra múltiples proveedores.

## Estructura del Proyecto

```
/src/
  /components/
    - App.jsx                    - Componente principal
    - PrototypeDemo.jsx         - Demo interactiva del patrón Prototype
    - AdapterDemo.jsx           - Demo interactiva del patrón Adapter
  
  /patterns/
    /prototype/
      - GameCharacter.js        - Clase base para personajes
    
    /adapter/
      - PaymentAdapter.js       - Adaptador para sistemas de pago
  
  /styles/
    - App.css                   - Estilos de la aplicación

package.json                    - Dependencias del proyecto
```

## Instalación y Ejecución

```bash
npm install
npm start
```
