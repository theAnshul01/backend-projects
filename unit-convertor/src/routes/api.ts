import { Router } from "express";
import { convertLength, lengthUnits } from "../convertors/length.js";
import { convertWeight, weightUnits } from "../convertors/weight.js";
import { convertTemperature, temperatureUnits } from "../convertors/temperature.js";

const router = Router();

router.post("/api/length", (req, res) => {
    const value = parseFloat(req.body.value);
    const { from, to } = req.body;

    if(!lengthUnits.includes(from) || !lengthUnits.includes(to)){
        res.status(400).json({error: "Invalid unit selected"});
        return;
    }

    if(Number.isNaN(value)){
        res.status(400).json({error: "Invalid value"});
        return;
    }

    const result = convertLength(value, from, to);
    res.json({result});
})

router.post("/api/weight", (req, res) => {
    const value = parseFloat(req.body.value);
    const { from, to } = req.body;

    if(!weightUnits.includes(from) || !weightUnits.includes(to)){
        res.status(400).json({error: "Invalid unit selected"});
        return;
    }
    if(isNaN(value)){
        res.status(400).json({error: "Invalid value"});
        return;
    }

    const result = convertWeight(value, from, to);
    res.json({result})
})

router.post("/api/temperature", (req, res) => {
    const value = parseFloat(req.body.value);
    const { from, to } = req.body;

    if(!temperatureUnits.includes(from) || !temperatureUnits.includes(to)){
        res.status(400).json({error: "Invalid unit selected"});
        return;
    }

    if(isNaN(value)){
        res.status(400).json({error: "Invalid value"});
        return;
    }

    const result = convertTemperature(value, from, to);
    res.json({result});
})

export default router;