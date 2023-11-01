FROM nikolaik/python-nodejs:python3.9-nodejs18

# Install Git to clone theHarvester repository
RUN apt-get install -y git
# Install nmap
RUN apt-get install -y nmap

### INSTALL THEHARVESTER ###
WORKDIR /usr/src/app/theHarvester
RUN git clone https://github.com/laramies/theHarvester .

# Install Python dependencies for theHarvester
RUN pip install -r requirements/base.txt
### END INSTALL THEHARVESTER ###

WORKDIR /usr/src/app

# Copy the Node.js application files
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run start

### ADD THEHARVESTER IN PATH ###
ENV PATH="${PATH}:/usr/src/app/theHarvester"
### END THEHARVESTER IN PATH ###

# Expose the port for the Node.js application
EXPOSE 8080

# Start the Node.js application and theHarvester
CMD [ "node", "/usr/src/app/build/src/index.js" ]
