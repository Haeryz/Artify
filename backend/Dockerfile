FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Create a .env file from example if one doesn't exist
RUN if [ ! -f .env ]; then cp -n .env.example .env || echo "No .env.example found"; fi

EXPOSE 5000
CMD [ "npm", "start" ]
