// routes/homeRoute.ts
import { Router, Request, Response } from "express";

const homeRouter = Router();

homeRouter.get("/", async (req: Request, res: Response) => {
    try {
        res.render("home.ejs");
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default homeRouter;