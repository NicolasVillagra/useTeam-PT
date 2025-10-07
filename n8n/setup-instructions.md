# n8n – Kanban Backlog Export

Este flujo permite exportar el backlog del tablero Kanban a CSV y enviarlo por email.

## Requisitos

- n8n 1.106.3 (contenedor Docker en `docker-compose.yml` ya preparado)
- Backend corriendo en el host en `http://localhost:3001`
- MongoDB 

## Pasos

1) Levantar n8n:

```bash
# En la carpeta backend/
docker compose up -d n8n mongo
```

2) Acceder a n8n: http://localhost:5678

- Si se configuró BASIC AUTH en `docker-compose.yml`, usar `admin / admin123` (modifícalos en tu entorno real).

3) Importar el workflow

- En n8n: Import → pega el contenido de `n8n/workflow.json` o súbelo como archivo.
- Verás los nodos: Webhook → HTTP Tasks/Columns → Map to Rows → To CSV → Send Email.

4) Configurar Email

- Abre el nodo "Send Email".
- Crea la credencial SMTP (ejemplo: Gmail/SMTP corporativo) y asígnala.
- Ajusta `fromEmail` si es necesario.
- Ajusta `toEmail` a Expression.

5) Probar el flujo

- Desde el frontend, haz click en "Exportar Backlog", ingresa un email destino.
- El backend hará POST al webhook `POST /webhook/kanban-export` con `{ email, sources }`.
- n8n leerá `tasks` y `columns`, generará `backlog.csv` y lo enviará por email.

## Notas de red (muy importante)

- Si n8n corre en Docker y el backend corre en tu host (fuera de Docker), n8n no puede acceder a `http://localhost:3001` del host.
- Usa `http://host.docker.internal:3001` para que el contenedor n8n se comunique con el backend del host.
- Para eso, define la variable de entorno en el backend antes de arrancar:

```bash
# En Windows/PowerShell
$env:BACKEND_PUBLIC_URL = "http://host.docker.internal:3001"
# Luego inicia el backend (p.ej.)
npm run start:dev
```

- Si el backend también corre en Docker en la misma red de `docker-compose`, puedes usar el nombre del servicio y puerto interno, por ejemplo `http://backend:3001` y establecer `BACKEND_PUBLIC_URL` a esa URL.

## Endpoint de backend

- `POST /export/backlog` body:

```json
{
  "email": "usuario@correo.com"
}
```

- Respuesta positiva:

```json
{ "status": "ok", "message": "Solicitud de exportación enviada" }
```

- Errores comunes:
  - 400 Email inválido.
  - 5xx Problema conectando a n8n.

## CSV generado

Columnas: `id, title, description, column, createdAt`.

Puedes adaptar el mapeo en el nodo "Map to Rows" si agregas nuevos campos.
