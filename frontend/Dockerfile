# ─── Stage build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Arguments de build
ARG VITE_API_URL=/api/v1
ARG VITE_SOCKET_URL=http://localhost:5000

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage production avec Nginx ──────────────────────────────
FROM nginx:1.25-alpine AS production

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier le build Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]
