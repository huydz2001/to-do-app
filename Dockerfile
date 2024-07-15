# base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
# ReInstall bcrypr because docker run different os 
RUN apt-get update && \
    apt-get install -y make g++ python3 && \
    npm ci && \
    npm rebuild bcrypt --build-from-source && \
    apt-get remove -y make g++ python3 && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Bundle app source
COPY . /usr/src/app/

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

