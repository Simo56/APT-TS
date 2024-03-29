# Automated Penetration Testing Suite

<h1 align="center">
  <br>
  <img width="512" alt="APT-TS Logo" src="https://github.com/Simo56/APT-TS/assets/20564263/34d791e3-ab23-4fdd-a4e1-9751de34ba2d">
  <br>
  APT-TS
  <br>
</h1>

## Overview

This repository hosts an Automated Penetration Testing Suite developed using Node.js and TypeScript with Express. The suite is designed to automate various penetration testing tasks, making it easier to assess the security of systems and applications.

## Features

- **Scalable and Modular**: The suite is built with scalability and modularity in mind, allowing you to easily extend its capabilities with new tools and modules.

- **User-Friendly Interface**: An intuitive web-based interface makes it easy for users to configure and initiate tests.

- **Docker Integration**: The project is containerized with Docker, providing a consistent and isolated environment for testing.

- **Customization**: Tailor the suite to your needs by selecting from a range of scanning and exploitation tools.

## Technologies

- **Node.js**: The core of the project is built with Node.js, which enables efficient asynchronous operations.

- **TypeScript**: TypeScript is used to add static typing and improve code quality.

- **Express**: The Express.js framework simplifies building web applications, including the suite's interface.

- **Docker**: Docker containers make deployment and management straightforward.

## Usage

To get started, follow these steps:

Clone the repository:

```bash
git clone https://github.com/Simo56/APT-TS
cd APT-TS

```

Build and run the Docker container:

```bash
docker build --pull --rm -f "Dockerfile" -t apt-ts:latest "."
sudo docker run --name apt-ts-container -it -p 8080:8080 apt-ts:latest
# to get an interactive shell inside the container
sudo docker exec -it apt-ts-container bash
```

Access the web interface in your browser:

http://localhost:port (replace 'port' with the configured port)[Default is 8080]

the output files can be found at this path inside the docker container: /usr/src/app/resultFilesFolder

## To Develop
(Install theHarvester inside the root folder)
(Install metasploit)
Install requirements:

```bash
sudo npm install nodejs
sudo npm install npm
sudo npm install -g typescript
sudo npm install -g nodemon
cd ./src
npm run dev
```
## Contributing

We welcome contributions! If you'd like to contribute to the project, please read our Contribution Guidelines.

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback, feel free to contact us at tosatto.simonepio@gmail.com.

```

APT-TS
├─ .git
├─ .gitattributes
├─ .gitignore
├─ .prettierrc.js
├─ config
├─ Dockerfile
├─ LICENSE
├─ nodemon.json
├─ package.json
├─ public
│  ├─ css
│  │  └─ styles.css
│  ├─ images
│  │  ├─ defaultexploitoption.png
│  │  ├─ defaultscanoption.png
│  │  ├─ favicon.ico
│  │  ├─ metasploit.png
│  │  ├─ nmap.png
│  │  └─ openvas.png
│  └─ js
│     ├─ osint.js
│     └─ runTest.js
├─ README.md
├─ resultFilesFolder
├─ src
│  ├─ app.ts
│  ├─ index.ts
│  ├─ routes
│  │  ├─ gatherOSINTRoute.ts
│  │  ├─ homeRoute.ts
│  │  └─ runTestRoute.ts
│  └─ utils
│     └─ extractCVEsFromXML.ts
├─ tosattofruitcaorle.com
├─ tsconfig.json
└─ views
   ├─ home.ejs
   ├─ osint.ejs
   └─ runTest.ejs

```
