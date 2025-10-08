## Frontend Kanban – Guía de Levantado

Aplicación Next.js (App Router) con React 19, Tailwind v4 y socket.io-client para tiempo real.

### Requisitos
- Node.js 20+
- npm 9+

### Variables de entorno
El cliente consume el backend vía Axios y WebSocket:
- `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`)
- `NEXT_PUBLIC_WS_URL` (default: `http://localhost:3001`)

Crea un archivo `.env.local` en `client/` (no se commitea):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

### Instalación
```bash
npm install
```

### Desarrollo
1) Asegúrate de que el backend esté arriba y accesible en `NEXT_PUBLIC_API_URL`.
2) Levanta el dev server:
```bash
npm run dev
```
App en `http://localhost:3000`.

### Build y producción
```bash
npm run build
npm run start
```
Por defecto, sirve en `http://localhost:3000`.

### Integración con backend
- HTTP: `src/services/api.ts` crea un Axios con `NEXT_PUBLIC_API_URL`.
- WebSocket: `src/services/socket.ts` usa `NEXT_PUBLIC_WS_URL`.
- Eventos usados: ver `src/utils/constants.ts`.

### Estructura relevante
- `src/components/*`: UI (atoms, molecules, organisms, templates)
- `src/context/TasksContext.tsx`: estado de tareas y columnas
- `src/hooks/*`: hooks de UI y datos (`useSocket`, `useTasks`, etc.)
- `src/services/*`: clientes Axios y Socket.io

### Troubleshooting
- CORS/404 desde API: revisa que `NEXT_PUBLIC_API_URL` apunte al backend correcto.
- Socket no conecta: valida `NEXT_PUBLIC_WS_URL` y que el backend exponga WS.
- Estilos no cargan: reinstala dependencias y reinicia el dev server.
