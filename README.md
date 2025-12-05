# Cuestionario de Criptografía - UCE

Aplicación web de cuestionarios para estudiar conceptos de criptografía y seguridad informática.

## Características

- 🎯 Dos unidades de estudio con 20 preguntas cada una
- 📊 Múltiples tipos de preguntas (opción múltiple, verdadero/falso, completar, etc.)
- 🎨 Diseño moderno y responsivo con modo oscuro
- ✨ Animaciones suaves y efectos visuales premium
- 📱 Compatible con dispositivos móviles y tablets
- 🚀 Desplegable en Vercel

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
│   ├── index.html      # Página principal
│   ├── quiz.html       # Interfaz del cuestionario
│   ├── styles.css      # Estilos CSS
│   └── app.js          # Lógica del frontend
├── data/               # Datos de los cuestionarios
│   ├── unidad1.json    # Preguntas Unidad 1
│   └── unidad2.json    # Preguntas Unidad 2
├── server.js           # Servidor Express
├── package.json        # Dependencias
├── vercel.json         # Configuración de Vercel
└── README.md           # Este archivo
```

## Tecnologías Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Diseño**: CSS Grid, Flexbox, Animaciones CSS
- **Fuentes**: Google Fonts (Inter)
- **Despliegue**: Vercel

## Contenido de los Cuestionarios

### Unidad 1
Fundamentos de Criptografía, cifrados clásicos, criptografía simétrica y asimétrica, funciones hash, algoritmos de cifrado.

### Unidad 2
Protocolos criptográficos, algoritmos modernos (RSA, AES, DES), funciones hash (MD5, SHA), seguridad en redes, modelo OSI.

## Autor

Universidad Central del Ecuador - Facultad de Ingeniería

## Licencia

ISC
