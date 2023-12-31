import express = require("express");
import { Express } from "express";
import bodyParser = require('body-parser');

import homeRouter from "./routes/homeRoute"; // Import your specific route file
import runTestRoute from "./routes/runTestRoute"; // Import your specific route file
import gatherOSINTRoute from "./routes/gatherOSINTRoute"; // Import your specific route file

import path = require("path");

class App {
    public server: Express;

    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();

        this.server.use(express.static(path.join(__dirname, '../public')));

        // Define a route to serve the favicon
        this.server.get("/favicon.ico", (req, res) => {
            res.sendFile(path.join(__dirname, '../public/images/favicon.ico'));
        });
    }

    middlewares() {
        this.server.use(express.json());

        // Configure bodyParser middleware
        this.server.use(bodyParser.urlencoded({ extended: false }));
        this.server.use(bodyParser.json());
    }

    routes() {
        // Use the specific route for the root path
        this.server.use("/", homeRouter);

        // Add other routes by importing their respective route files
        this.server.use("/", runTestRoute);
        this.server.use("/", gatherOSINTRoute);

    }
}

export default new App().server;