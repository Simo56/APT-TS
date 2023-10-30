import express = require("express");
import { Express } from "express";

import homeRouter from "./routes/homeRoute"; // Import your specific route file
import runScanRoute from "./routes/runScanRoute"; // Import your specific route file
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
    }

    routes() {
        // Use the specific route for the root path
        this.server.use("/", homeRouter);

        // Add other routes by importing their respective route files
        this.server.use("/", runScanRoute);
        this.server.use("/", gatherOSINTRoute);

    }
}

export default new App().server;