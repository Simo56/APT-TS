import path = require('path');
import App from './app';
import * as dotenv from 'dotenv';
import { AppConfig } from '../config/configApp';

// Load environment variables from .env file
dotenv.config();
// Access environment variables
const serverPort = process.env.SERVER_PORT;

const viewsPath = path.resolve(__dirname, "../views");

App.set("views", viewsPath);
App.set("view engine", "ejs");

App.listen(serverPort);

console.log("Server in ascolto sulla porta: " + serverPort);