import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message : "TODO API is running fine!"
    })
})

export default router;
