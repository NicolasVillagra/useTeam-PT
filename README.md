# Kanban en Tiempo Real – Monorepo (Frontend + Backend + N8N)

Aplicación tipo Trello con columnas y tarjetas arrastrables, colaboración en tiempo real mediante WebSockets y exportación de backlog vía N8N.

## Contenido
- `backend/`: API NestJS + Socket.io, MongoDB (Mongoose), endpoint de exportación.
- `client/`: Next.js (App Router), Tailwind v4, socket.io-client.
- `n8n/`: flujo y guía para automatización de exportación.

---

## Requisitos
- Node.js 20+
- npm 9+
- Docker y Docker Compose (para MongoDB y N8N en local)

---

## Variables de Entorno

Backend (`backend/.env`):
```bash
MONGODB_URI=mongodb://localhost:27017/kanban-board
BACKEND_PUBLIC_URL=http://localhost:3001
N8N_WEBHOOK_URL=http://localhost:5678/webhook/kanban-export
```

Frontend (`client/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

> Si no configuras archivos `.env`, se usan defaults equivalentes a los de arriba.

---

## Levantar dependencias con Docker Compose (MongoDB + N8N)
Este repo incluye `backend/docker-compose.yml` con:
- MongoDB 6 en `localhost:27017` (volumen `mongo_data`).
- N8N en `localhost:5678`.

Pasos:
```bash
cd backend
docker compose up -d
```

Notas sobre N8N:
- Está configurado para desarrollo con setup simplificado, pero podría pedir autenticación según la versión/estado local. Verifica en `http://localhost:5678`. (REVISAR IMPORTANTE)
- ACORDARSE DE LEER LAS INSTRUCCIONES DE N8N, en "toEmail" se lo debe cambiar a Expresion

---

## Backend (NestJS)

Ubicación: `backend/`

Instalación de dependencias:
```bash
cd backend
npm install
```

Desarrollo (watch):
```bash
npm run start:dev
```

Producción:
```bash
npm run build
npm run start:prod
```

Pruebas:
```bash
npm run test      # unit
npm run test:e2e  # e2e
npm run test:cov  # coverage
```

Puntos clave:
- Conexión a MongoDB por `MONGODB_URI` (default `mongodb://localhost:27017/kanban-board`).
- WebSockets expuestos por `RealtimeGateway` en el mismo host:puerto.
- Exportación: `POST /export/backlog` llama al webhook `N8N_WEBHOOK_URL` y envía URLs construidas con `BACKEND_PUBLIC_URL`.

Endpoints principales:
- `GET /columns` – Inicializa y devuelve columnas por defecto si no existen.
- `POST /columns`, `PUT /columns/:id`, `DELETE /columns/:id` – CRUD + eventos WS (`columnCreated/Updated/Deleted`).
- `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` – CRUD + eventos WS (`taskCreated/Updated/Deleted`).

---

## Frontend (Next.js)

Ubicación: `client/`

Instalación:
```bash
cd client
npm install
```

Desarrollo:
```bash
npm run dev
```

Build y producción:
```bash
npm run build
npm run start
```

Integración con backend:
- HTTP: `src/services/api.ts` usa `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).
- WebSocket: `src/services/socket.ts` usa `NEXT_PUBLIC_WS_URL` (default `http://localhost:3001`).
- Eventos WS: definidos en `src/utils/constants.ts`.

---

## Descripción del Proyecto (Kanban)
El sistema permite:
- Crear/editar/eliminar columnas y tareas.
- Arrastrar tareas entre columnas (drag & drop).
- Ver los cambios en tiempo real en todos los clientes conectados (Socket.io).
- Disparar exportación de backlog (CSV) vía N8N desde el frontend.

Flujo de exportación:
```
Frontend → Backend (/export/backlog) → N8N Webhook → Extracción → CSV → Email → Notificación
```

---

## Troubleshooting
- MongoDB no conecta: confirma `docker compose up -d`, `MONGODB_URI` y contenedor `kanban-mongo` en running.
- N8N webhook falla: revisa `N8N_WEBHOOK_URL` y la UI en `http://localhost:5678`.
- WebSocket sin eventos: valida que el cliente apunte a `NEXT_PUBLIC_WS_URL` correcto.
- CORS/404: confirma que `NEXT_PUBLIC_API_URL` coincide con el host/puerto del backend.

---

## Estructura (alto nivel)
```
useTeam-PT/
├── backend/
├── client/
└── n8n/
```

Cada subcarpeta contiene su propio `README.md` con detalles específicos.
