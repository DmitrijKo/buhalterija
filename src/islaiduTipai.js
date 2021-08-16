import { readFile, writeFile } from "fs/promises";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const islaiduTipai = JSON.parse(await readFile("data/islaiduTipai.json", {
            encoding: "utf-8"
        }));
        res.render("islaiduTipai", {
            title: "Išlaidų tipai",
            tipai: islaiduTipai.tipai
        });
    }
    catch (err) {
        res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
});

router.get("/edit/:id?", async (req, res) => {
    if (req.params.id) {
        try {
            const islaiduTipai = JSON.parse(await readFile("data/islaiduTipai.json", {
                encoding: "utf-8"
            }));
            const id = parseInt(req.params.id);
            const tipas = islaiduTipai.tipai.find(tipas => tipas.id === id);
            if (tipas) {
                res.render("islaiduTipas", {
                    title: "Redaguojam išlaidų tipą",
                    tipas
                });
            } else {
                res.redirect("/islaiduTipai");
            }
        }
        catch (err) {
            res.status(500).end(`Įvyko klaida: ${err.message}`);
        }
    } else {
        res.render("islaiduTipas", {
            title: "Kuriam išlaidų tipą"
        });
    }
});

router.post("/save", async (req, res) => {
    if (req.body.pavadinimas && req.body.pavadinimas.trim() !== "") {
        try {
            const islaiduTipai = JSON.parse(await readFile("data/islaiduTipai.json", {
                encoding: "utf-8"
            }));
            if (req.body.id) {
                const id = parseInt(req.body.id);
                const tipas = islaiduTipai.tipai.find(tipas => tipas.id === id);
                if (tipas) {
                    tipas.pavadinimas = req.body.pavadinimas.trim();
                }
            } else {
                const tipas = {
                    id: islaiduTipai.nextId++,
                    pavadinimas: req.body.pavadinimas.trim()
                };
                islaiduTipai.tipai.push(tipas);
            }
            await writeFile("data/islaiduTipai.json", JSON.stringify(islaiduTipai, null, 2), {
                encoding: "utf-8"
            });
            res.redirect("/islaiduTipai");
        }
        catch (err) {
            res.status(500).end(`Įvyko klaida: ${err.message}`);
        }
    } else {
        res.redirect("/islaiduTipai");
    }
});

router.get("/delete/:id", async (req, res) => {
    try {
        const islaiduTipai = JSON.parse(await readFile("data/islaiduTipai.json", {
            encoding: "utf-8"
        }));
        const id = parseInt(req.params.id);
        const index = islaiduTipai.tipai.findIndex(tipas => tipas.id === id);
        if (index >= 0) {
            islaiduTipai.tipai.splice(index, 1);
            await writeFile("data/islaiduTipai.json", JSON.stringify(islaiduTipai, null, 2), {
                encoding: "utf-8"
            });
        }
        res.redirect("/islaiduTipai");
    }
    catch (err) {
        res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
});
