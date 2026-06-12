# docker-compose-watch-example

`node --watch` reloads on the first Compose sync, then stops.
See [docker/compose #11090](https://github.com/docker/compose/issues/11090).

## What works

Three approaches. Pick one.

### 1. tsx watch (recommended)

```yaml
# compose.yaml
services:
  web:
    build: .
    command: 'tsx watch web/index.js'
    develop:
      watch:
        - action: sync
          path: web/
          target: /app/web/
          initial_sync: true
```

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
RUN npm install -g tsx
COPY . .
CMD ["tsx", "watch", "web/index.js"]
```

### 2. nodemon

```yaml
# compose.yaml
services:
  web:
    build: .
    command: 'nodemon --legacy-watch web/index.js'
    develop:
      watch:
        - action: sync
          path: web/
          target: /app/web/
          initial_sync: true
```

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
RUN npm install -g nodemon
COPY . .
CMD ["nodemon", "--legacy-watch", "web/index.js"]
```

### 3. Compose `sync+restart`

```yaml
# compose.yaml
services:
  web:
    build: .
    command: 'node web/index.js'
    develop:
      watch:
        - action: sync+restart
          path: web/
          target: /app/web/
          initial_sync: true
```

Compose restarts the container on each edit. Slower than the other two but needs no extra dependencies.

## Test results

Docker Compose v5.1.2, Docker Engine 29.4.0, Node 20 Alpine.

| approach | edit 1 | edit 2 | edit 3 | edit 4 |
|---|---|---|---|---|
| `node --watch` + `sync` | yes | no | no | no |
| `tsx watch` + `sync` | yes | yes | yes | yes |
| `nodemon --legacy-watch` + `sync` | yes | yes | yes | yes |
| `node` + `sync+restart` | yes | yes | yes | yes |

## Usage

```bash
docker compose up --watch --build
```
