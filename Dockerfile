FROM nikolaik/python-nodejs:python3.9-nodejs18

RUN apt-get update
# Install Git to clone theHarvester repository
RUN apt-get install -y git
# Install nmap and add the vuln scripts
RUN apt-get install -y nmap
WORKDIR /usr/share/nmap/script
RUN git clone https://github.com/scipag/vulscan vulscan
RUN ln -s `pwd`/vulscan /usr/share/nmap/scripts/vulscan
RUN git clone https://github.com/vulnersCom/nmap-vulners.git /usr/share/nmap/nmap-vulners
RUN cp /usr/share/nmap/nmap-vulners/vulners.nse /usr/share/nmap/scripts/
RUN nmap --script-updatedb

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
