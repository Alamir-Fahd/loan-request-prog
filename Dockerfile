FROM node:18-alpine

WORKDIR /usr/src/app

# Efficient Layer Caching
COPY package*.json ./
RUN npm install

COPY . . 

# Security: Run as non-root user
USER node

EXPOSE 3000

CMD ["npm", "start"]
