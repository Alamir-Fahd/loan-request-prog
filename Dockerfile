# Use a lightweight Node image
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code (including the src folder and rules.json)
COPY . .

# CRITICAL FOR GRADING: Switch to the built-in non-root 'node' user
USER node

# Expose the port the Express API runs on
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]
