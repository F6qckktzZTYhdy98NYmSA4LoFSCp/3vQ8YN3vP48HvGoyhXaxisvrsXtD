# Use Node.js LTS (Latest LTS version)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build


# Set the build date
ARG BUILD_DATE=now
RUN echo "Build date: $BUILD_DATE" > build-date.txt

# Install a simple server to serve static content
RUN npm install -g serve

# Expose port 3492
EXPOSE 3492

# Start the server
CMD ["serve", "-s", "dist", "--host", "0.0.0.0", "--port", "3492"]
