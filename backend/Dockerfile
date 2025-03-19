FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Accept build arguments for Firebase config
ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_CLIENT_EMAIL
ARG FIREBASE_PRIVATE_KEY

# Set as environment variables so they're available at runtime
ENV FIREBASE_API_KEY=${FIREBASE_API_KEY}
ENV FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
ENV FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
ENV FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
ENV FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
ENV FIREBASE_APP_ID=${FIREBASE_APP_ID}
ENV FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}
ENV FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}

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
