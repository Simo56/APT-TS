FROM nikolaik/python-nodejs:python3.9-nodejs18

RUN apt-get update
# Install Git to clone theHarvester repository
RUN apt-get install -y git
# Install snapd and the metasploit-framework
RUN apt-get install snapd -y

RUN apt-get install -y gnupg2
RUN curl -o metasploit_installer.sh https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb
RUN chmod +x metasploit_installer.sh
RUN ./metasploit_installer.sh
# Install nmap and add the vuln scripts
RUN apt-get install -y nmap

# Install theHarvester
WORKDIR /usr/src/app/theHarvester
RUN git clone https://github.com/laramies/theHarvester .

# Install Python dependencies for theHarvester
RUN pip install -r requirements/base.txt

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
