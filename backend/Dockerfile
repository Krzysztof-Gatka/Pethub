FROM node:16

# Set the working directory
WORKDIR /usr/pethub/backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g nodemon
# Copy application code
COPY . .

# Expose API port
EXPOSE 3000

# Start the API
CMD ["nodemon","--legacy-watch", "index.js"]