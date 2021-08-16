import { readFile, writeFile } from "fs/promises";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const mokejimuTipai = JSON.parse(await readFile("data/mokejimuTipai.json", {
            encoding: "utf-8"
        }));
        res.render("mokejimuTipai", {
            title: "Mokėjimų tipai",
            tipai: mokejimuTipai.tipai
        });
    }
    catch (err) {
        res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
});

router.get("/edit/:id?", async (req, res) => {
    if (req.params.id) {
        try {
            const mokejimuTipai = JSON.parse(await readFile("data/mokejimuTipai.json", {
                encoding: "utf-8"
            }));
            const id = parseInt(req.params.id);
            const tipas = mokejimuTipai.tipai.find(tipas => tipas.id === id);
            if (tipas) {
                res.render("mokejimuTipas", {
                    title: "Redaguojam mokėjimų tipą",
                    tipas
                });
            } else {
                res.redirect("/mokejimuTipai");
            }
        }
        catch (err) {
            res.status(500).end(`Įvyko klaida: ${err.message}`);
        }
    } else {
        res.render("mokejimuTipas", {
            title: "Kuriam mokėjimų tipą"
        });
    }
});

router.post("/save", async (req, res) => {
    if (req.body.pavadinimas && req.body.pavadinimas.trim() !== "") {
        try {
            const mokejimuTipai = JSON.parse(await readFile("data/mokejimuTipai.json", {
                encoding: "utf-8"
            }));
            if (req.body.id) {
                const id = parseInt(req.body.id);
                const tipas = mokejimuTipai.tipai.find(tipas => tipas.id === id);
                if (tipas) {
                    tipas.pavadinimas = req.body.pavadinimas.trim();
                }
            } else {
                const tipas = {
                    id: mokejimuTipai.nextId++,
                    pavadinimas: req.body.pavadinimas.trim()
                };
                mokejimuTipai.tipai.push(tipas);
            }
            await writeFile("data/mokejimuTipai.json", JSON.stringify(mokejimuTipai, null, 2), {
                encoding: "utf-8"
            });
            res.redirect("/mokejimuTipai");
        }
        catch (err) {
            res.status(500).end(`Įvyko klaida: ${err.message}`);
        }
    } else {
        res.redirect("/mokejimuTipai");
    }
});

router.get("/delete/:id", async (req, res) => {
    try {
        const mokejimuTipai = JSON.parse(await readFile("data/mokejimuTipai.json", {
            encoding: "utf-8"
        }));
        const id = parseInt(req.params.id);
        const index = mokejimuTipai.tipai.findIndex(tipas => tipas.id === id);
        if (index >= 0) {
            mokejimuTipai.tipai.splice(index, 1);
            await writeFile("data/mokejimuTipai.json", JSON.stringify(mokejimuTipai, null, 2), {
                encoding: "utf-8"
            });
        }
        res.redirect("/mokejimuTipai");
    }
    catch (err) {
        res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
});
