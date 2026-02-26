FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (layer caching — npm install only reruns if package.json changes)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy rest of the source code
COPY . .

# Expose app port
EXPOSE 9090

# Start the server
CMD ["node", "index.js"]