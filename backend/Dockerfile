# Utiliser Node.js 20 LTS Alpine
FROM node:20-alpine AS base

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# ─── Stage développement ───────────────────────────────────────
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ─── Stage production ──────────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production

# Installer uniquement les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Créer les répertoires nécessaires
RUN mkdir -p uploads/temp logs

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
