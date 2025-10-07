## Backend Kanban – Guía de Levantado

Este backend está construido con NestJS y usa MongoDB como base de datos. Incluye soporte para WebSockets (`RealtimeGateway`) y un flujo de exportación vía N8N.

### Requisitos
- Node.js 18+
- npm 9+
- Docker y Docker Compose (opcional, recomendado)

### Variables de entorno
- `MONGODB_URI`: conexión a MongoDB. Por defecto: `mongodb://localhost:27017/kanban-board`.
- `BACKEND_PUBLIC_URL`: URL pública usada por el módulo de exportación para construir endpoints (por defecto: `http://localhost:3001`).
- `N8N_WEBHOOK_URL`: webhook de N8N para exportación (por defecto: `http://localhost:5678/webhook/kanban-export`).

Puedes crear un archivo `.env` en la raíz del backend con, por ejemplo:

```bash
MONGODB_URI=mongodb://localhost:27017/kanban-board
BACKEND_PUBLIC_URL=http://localhost:3001
N8N_WEBHOOK_URL=http://localhost:5678/webhook/kanban-export
```

> Nota: Nest se inicializa con `MONGODB_URI` desde `src/app.module.ts`. Si no defines `.env`, se usarán los valores por defecto.

### Levantado con Docker Compose (MongoDB y N8N)
Este repo incluye `docker-compose.yml` con:
- `mongo:6` expuesto en `27017` y volumen `mongo_data`.
- `n8n` expuesto en `5678` con autenticación deshabilitada para desarrollo.

Pasos:
1. Inicia servicios:
   ```bash
   docker compose up -d
   ```
2. Verifica que MongoDB esté arriba: `docker ps` (contenedor `kanban-mongo`).
3. Verifica que N8N esté arriba: `http://localhost:5678`.

### Instalación de dependencias
```bash
npm install
```

### Ejecutar en desarrollo
- Asegúrate de tener MongoDB corriendo (local o vía Docker Compose).
- Inicia Nest en modo watch:
```bash
npm run start:dev
```

Por defecto el backend expone HTTP en `http://localhost:3001` (ajusta tu proxy/PM2/Nginx si lo corres detrás de otro puerto) y WebSockets vía `RealtimeGateway` en el mismo host.

### Scripts útiles
- Desarrollo: `npm run start:dev`
- Producción (build + run):
  ```bash
  npm run build
  npm run start:prod
  ```
- Linter: `npm run lint`
- Tests unitarios: `npm run test`
- Tests e2e: `npm run test:e2e`
- Cobertura: `npm run test:cov`

### Endpoints principales
- `GET /columns` – Inicializa y devuelve columnas por defecto si no existen.
- `POST /columns` – Crea columna y emite `columnCreated` por WebSocket.
- `PUT /columns/:id` – Actualiza columna y emite `columnUpdated`.
- `DELETE /columns/:id` – Elimina columna y emite `columnDeleted`.
- `GET /tasks` – Lista tareas.
- `POST /tasks` – Crea tarea y emite `taskCreated`.
- `PUT /tasks/:id` – Actualiza tarea y emite `taskUpdated`.
- `DELETE /tasks/:id` – Elimina tarea y emite `taskDeleted`.
- `POST /export/backlog` – Dispara flujo N8N para exportar backlog (usa `N8N_WEBHOOK_URL`).

### Notas sobre N8N y exportación
- Si corres N8N con Docker Compose, expone `http://localhost:5678` y el webhook por defecto `http://localhost:5678/webhook/kanban-export`.
- El servicio de exportación envía las URLs de `tasks` y `columns` usando `BACKEND_PUBLIC_URL`.

### Troubleshooting
- Error de conexión a MongoDB: verifica `MONGODB_URI` y que el contenedor `kanban-mongo` esté en `running`.
- Webhooks de N8N fallan: revisa `N8N_WEBHOOK_URL` y logs del contenedor `kanban-n8n`.
- WebSockets no emiten: confirma que el cliente esté conectado al mismo host/puerto del backend.

### Licencia
Uso interno del portafolio.
