# 🎮 Tetris Arcade Edition

**Tetris Arcade Edition** es una implementación moderna del clásico videojuego Tetris, desarrollada con React 19 y TypeScript. El proyecto combina lógica de juego, renderizado mediante HTML5 Canvas, efectos de sonido generados con Web Audio API y una interfaz responsive con estética arcade neón.

El objetivo fue desarrollar una experiencia interactiva que integre buenas prácticas de desarrollo frontend, separación de responsabilidades, tipado estricto y funcionalidades compatibles con dispositivos desktop y móviles.

## 🚀 Demo online

**▶️ [Jugar Tetris Arcade Edition](PEGAR_URL_DE_VERCEL)**

**📂 [Ver código fuente en GitHub](PEGAR_URL_DEL_REPOSITORIO)**

## ✨ Funcionalidades principales

### 🎮 Motor y lógica de juego
- Tablero de juego de 10 columnas por 20 filas.
- Implementación de las siete piezas clásicas: I, O, T, S, Z, J y L.
- Generación de piezas mediante algoritmo 7-Bag Randomizer.
- Rotación de piezas con sistema Wall Kicks.
- Ghost Piece para visualizar la posición de aterrizaje.
- Detección de colisiones y bloqueo de piezas.
- Caída suave (Soft Drop) y caída instantánea (Hard Drop).
- Eliminación automática de líneas completas.

### 🏆 Sistema de puntuación y progresión
- Sistema de puntuación basado en líneas eliminadas y nivel actual.
- Puntuación adicional por caída manual e instantánea.
- Incremento de nivel cada 10 líneas completadas.
- Aumento progresivo de la velocidad de caída.
- Registro de récord personal mediante localStorage.

### 🔊 Audio y experiencia interactiva
- Efectos de sonido sintetizados en tiempo real mediante Web Audio API.
- Generación de sonidos con osciladores y envolventes ADSR.
- Efectos sonoros para movimientos, rotaciones, líneas completadas y Game Over.
- Sonido especial al completar cuatro líneas simultáneamente.
- Control para activar y desactivar el audio.

### 📱 Diseño responsive y accesibilidad de controles
- Interfaz adaptable a desktop, tablets y dispositivos móviles.
- Controles mediante teclado.
- Gamepad virtual táctil para dispositivos móviles.
- Vibración háptica cuando el dispositivo lo permite.
- Prevención del desplazamiento accidental de la página durante el juego.
- Controles para pausar, reanudar y reiniciar partidas.

## ⌨️ Controles

| Acción | Teclado |
|---|---|
| Mover izquierda | ← |
| Mover derecha | → |
| Rotar pieza | ↑ / X |
| Caída suave | ↓ |
| Caída instantánea | Espacio |
| Pausar / Reanudar | P |
| Reiniciar | R |

En dispositivos móviles se puede jugar mediante los controles táctiles integrados en la interfaz.

## 🛠️ Stack tecnológico

| Tecnología | Aplicación en el proyecto |
|---|---|
| React 19 | Desarrollo de la interfaz mediante componentes |
| TypeScript | Tipado estático y seguridad del código |
| Vite | Entorno de desarrollo y compilación |
| HTML5 Canvas | Renderizado del tablero y las piezas |
| Web Audio API | Generación de efectos de sonido |
| CSS3 | Diseño visual, animaciones y responsive design |
| localStorage | Persistencia del récord personal |

## 🏗️ Arquitectura del proyecto

El código está organizado por responsabilidades para facilitar el mantenimiento, la reutilización y la escalabilidad.

```text
tetris-web/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── GameBoard.tsx
│   │   ├── ScorePanel.tsx
│   │   ├── NextPiecePreview.tsx
│   │   ├── ControlsGuide.tsx
│   │   └── MobileControls.tsx
│   ├── constants/
│   │   └── tetris.ts
│   ├── hooks/
│   │   └── useTetris.ts
│   ├── types/
│   │   └── tetris.ts
│   ├── utils/
│   │   ├── audio.ts
│   │   └── tetrisLogic.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── vercel.json
├── package.json
└── README.md
```

### Decisiones técnicas destacadas

- **Separación de responsabilidades:** componentes visuales, lógica de juego, constantes y tipos se encuentran organizados en módulos independientes.
- **Custom Hook:** `useTetris` centraliza la gestión del estado, el ciclo de juego y los eventos de interacción.
- **Funciones reutilizables:** `tetrisLogic.ts` contiene operaciones relacionadas con rotaciones, colisiones, generación de piezas y eliminación de líneas.
- **Renderizado optimizado:** HTML5 Canvas permite dibujar el tablero y actualizar los elementos del juego.
- **Tipado estricto:** TypeScript permite definir estructuras y contratos para los datos del juego.

## ⚙️ Instalación y ejecución local

### Requisitos
- Node.js
- npm
- Git

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Ingresar al proyecto

```bash
cd tetris-web
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir en el navegador la dirección indicada por Vite, generalmente:

```text
http://localhost:5173
```

### 5. Generar la versión de producción

```bash
npm run build
```

## 🌐 Deploy

El proyecto está preparado para desplegarse en **Vercel** utilizando Vite.

Configuración:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

También se incluye `vercel.json` para la configuración del despliegue.

## 👨‍💻 Autor

**Agustín Spataro**  
Full Stack Developer | Backend & Frontend

- GitHub: https://github.com/spataro787
- LinkedIn: https://linkedin.com/in/agustin-spataro-dev
- Portfolio: https://agustin-spataro.vercel.app/

---

**Tetris Arcade Edition** — Un proyecto que combina lógica, desarrollo web y experiencia interactiva en una implementación moderna de un clásico de los videojuegos.