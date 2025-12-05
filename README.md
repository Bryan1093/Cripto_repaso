# Cuestionarios UCE - Criptografía y Dispositivos Móviles

Aplicación web de cuestionarios para estudiar conceptos de criptografía, seguridad informática y desarrollo de dispositivos móviles.

## 🚀 Demo en Vivo

**[https://cripto-repaso.vercel.app](https://cripto-repaso.vercel.app)**

## Características

- 🎯 **Dos materias disponibles:** Criptografía y Dispositivos Móviles
- 📚 Cuatro unidades de estudio (2 por materia) con 20 preguntas cada una
- 📊 Múltiples tipos de preguntas (opción múltiple, verdadero/falso, completar, emparejar, etc.)
- 🎨 Diseño moderno y responsivo con modo oscuro
- ✨ Animaciones suaves y efectos visuales premium
- 🎵 Reproductor de música integrado y persistente
- 🔄 Modo de revisión con feedback visual (verde/rojo)
- 📱 Compatible con dispositivos móviles y tablets
- 💾 PWA (Progressive Web App) - funciona offline
- 🚀 Desplegado en Vercel

## Instalación Local

1. Clona o descarga este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor:
   ```bash
   npm start
   ```

4. Abre tu navegador en `http://localhost:3000`

## Desarrollo

Para ejecutar en modo desarrollo:

```bash
npm run dev
```

## Despliegue en Vercel

### Opción 1: Usando Vercel CLI

1. Instala Vercel CLI globalmente:
   ```bash
   npm install -g vercel
   ```

2. Inicia sesión en Vercel:
   ```bash
   vercel login
   ```

3. Despliega la aplicación:
   ```bash
   vercel
   ```

4. Para despliegue en producción:
   ```bash
   vercel --prod
   ```

### Opción 2: Usando Vercel Dashboard

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Haz clic en "New Project"
3. Importa este repositorio desde GitHub (o sube los archivos)
4. Vercel detectará automáticamente la configuración
5. Haz clic en "Deploy"

## Estructura del Proyecto

```
quiz-app/
├── public/              # Archivos estáticos
│   ├── assets/         # Recursos (iconos, documentos)
│   ├── css/            # Estilos CSS
│   │   ├── styles.css
│   │   ├── music-player.css
│   │   └── review-mode.css
│   ├── js/             # Scripts JavaScript
│   │   ├── app.js
│   │   ├── music-player.js
│   │   ├── firebase-config.js
│   │   └── auth.js
│   ├── index.html      # Página principal (selector de materias)
│   ├── quiz.html       # Interfaz del cuestionario
│   ├── manifest.json   # Configuración PWA
│   └── service-worker.js
├── data/               # Datos de los cuestionarios
│   ├── criptografia/
│   │   ├── unidad1.json
│   │   └── unidad2.json
│   └── dispositivos/
│       ├── unidad1.json
│       └── unidad2.json
├── server.js           # Servidor Express
├── package.json        # Dependencias
├── vercel.json         # Configuración de Vercel
└── README.md           # Este archivo
```

## Tecnologías Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Diseño**: CSS Grid, Flexbox, Animaciones CSS, Glassmorphism
- **Fuentes**: Google Fonts (Inter)
- **PWA**: Service Workers, Cache API
- **Despliegue**: Vercel

## Contenido de los Cuestionarios

### 📚 Criptografía

#### Unidad 1
Fundamentos de Criptografía, cifrados clásicos, criptografía simétrica y asimétrica, funciones hash, algoritmos de cifrado.

#### Unidad 2
Protocolos criptográficos, algoritmos modernos (RSA, AES, DES), funciones hash (MD5, SHA), seguridad en redes, modelo OSI.

### 📱 Dispositivos Móviles

#### Unidad 1
Hardware de dispositivos móviles, sistemas operativos (iOS, Android), generaciones de telefonía móvil (1G-5G), frameworks de desarrollo (Flutter, React Native), tecnologías emergentes (IoT, IA Generativa).

#### Unidad 2
Componentes de desarrollo móvil, navegación (Navigation Component, NavController), componentes de UI (TextField, Button, RecyclerView), arquitectura Android (Activity, Fragment, Service), diseño de interfaces (UI/UX, diseño responsivo).

## Autor

Universidad Central del Ecuador - Facultad de Ingeniería

## Licencia

ISC
