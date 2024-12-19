# Use Node.js as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set the build date
ARG BUILD_DATE=now
RUN echo "Build date: $BUILD_DATE" > build-date.txt

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the default Wrangler development port
EXPOSE 8787

# Command to run Wrangler in development mode
CMD ["npm", "run", "dev"]
