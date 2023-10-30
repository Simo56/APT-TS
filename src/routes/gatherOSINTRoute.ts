// routes/gatherOSINTRoute.ts
import { Router, Request, Response } from "express";

const gatherOSINTRoute = Router();

gatherOSINTRoute.get("/osint", async (req: Request, res: Response) => {
    try {
        res.render("osint.ejs");
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default gatherOSINTRoute;