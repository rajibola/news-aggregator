# Use a lightweight Node.js image as a base
FROM node:18

# Install Bun
RUN npm install -g bun

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lock files
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port for Vite
EXPOSE 5173

# Start the app
CMD ["bun", "run", "dev", "--host"]
