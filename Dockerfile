# Use Node.js 18 as base
FROM node:18 as base

# Set the working directory in the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your application listens on
EXPOSE 8080

# Start the application when the container starts
CMD [ "node", "build/src/index.js" ]
