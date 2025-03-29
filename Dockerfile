# Use node image for base image for all stages.
FROM node:22.12.0-alpine AS deps
WORKDIR /app

RUN apk add build-base

# This line installs Python 3 using the Alpine package manager. Python is required for some Node.js modules that have native dependencies.
RUN apk add python3

# This line installs the node-gyp package globally using npm. node-gyp is a tool for building native Node.js modules.
RUN npm install -g node-gyp

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install --force

# Copy the rest of the application source code to the container
COPY . .

RUN npm run build

# Expose the port your Nest.js application is listening on
EXPOSE 3000

# Command to start your Nest.js application
CMD [ "npm", "run", "start:prod" ]