// routes/runScanRoute.ts
import { Router, Request, Response } from "express";

const runScanRoute = Router();

runScanRoute.post("/run-scan", async (req: Request, res: Response) => {
    try {
        res.send("ciao");
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default runScanRoute;