FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create a config directory if it doesn't exist
RUN mkdir -p config

# Don't try to copy .env.example to .env as it should be provided through environment variables
# Instead log a message if no .env file exists
RUN if [ ! -f .env ]; then echo "No .env file found. Make sure to provide environment variables in deployment."; fi

# Set default values for environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the app port
EXPOSE 5000

# Start the server
CMD [ "node", "server.js" ]
