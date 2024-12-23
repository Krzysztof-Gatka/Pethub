# Use a lightweight Node.js image
FROM node:bullseye

# Set the working directory inside the container
WORKDIR /usr/pethub/frontend

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Default command
CMD ["npm", "run", "dev"]
