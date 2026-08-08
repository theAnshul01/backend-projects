import { Router } from "express";
import { convertLength, lengthUnits } from "../convertors/length.js";
import { convertWeight, weightUnits } from "../convertors/weight.js";
import { error } from "node:console";
import { convertTemperature, temperatureUnits } from "../convertors/temperature.js";

const router = Router();

router.get("/length", (req, res) => {
    res.render("length", { units: lengthUnits });
})

router.post("/length", (req, res) => {
    const value = parseFloat(req.body.value);
    const from = req.body.from;
    const to = req.body.to;

    if(!lengthUnits.includes(from) || !lengthUnits.includes(to)){
        res.render("length", {units: lengthUnits, value, from, to, error: "Invalid unit selected"});
        return;
    }

    if(isNaN(value)){
        res.render("length", { units: lengthUnits, value, from, to, error: "Invalid value"});
        return;
    }

    const result = convertLength(value, from, to);
    res.render("length", {units: lengthUnits, value, from, to, result})
})

router.get("/weight", (req, res) => {
    res.render("weight", {units: weightUnits})
})

router.post("/weight", (req, res) => {
    const value = parseFloat(req.body.value);
    const from = req.body.from;
    const to = req.body.to;

    if(!weightUnits.includes(from) || !weightUnits.includes(to)){
        res.render("weight", {units: weightUnits, value, from, to, error: "invalid unit selected"});
    }

    if(isNaN(value)){
        res.render("weight", {units: weightUnits, value, from, to, error: "Invalid value"});
        return;
    }

    const result = convertWeight(value, from, to);
    res.render("weight", {units: weightUnits, value, from, to, result})
})


router.get("/temperature", (req, res) => {
    res.render("temperature", {units: temperatureUnits})
})

router.post("/temperature", (req, res) => {
    const value = parseFloat(req.body.value);
    const from = req.body.from;
    const to = req.body.to;

    if(!temperatureUnits.includes(from) || !temperatureUnits.includes(to)){
        res.render("temperature", {units: temperatureUnits, value, from, to, error: "invalid unit selected"});
    }

    if(isNaN(value)){
        res.render("temperature", {units: temperatureUnits, value, from, to, error: "Invalid value"});
        return;
    }

    const result = convertTemperature(value, from, to);
    res.render("temperature", {units: temperatureUnits, value, from, to, result: result.toFixed(3)})
})

export default router;