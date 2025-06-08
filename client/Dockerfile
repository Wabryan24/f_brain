FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json yarn.lock ./

# Installer les dépendances
RUN yarn install --frozen-lockfile

# Copier le code source
COPY . .

# Build pour la production
RUN yarn build

# Exposer le port
EXPOSE 4173

# Lancer en mode preview
CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "4173"]