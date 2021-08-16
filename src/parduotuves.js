import { readFile, writeFile } from "fs/promises";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const parduotuves = JSON.parse(await readFile("data/parduotuves.json", {
            encoding: "utf-8"
        }));
        res.render("parduotuves", {
            title: "Parduotuvės",
            sarasas: parduotuves.sarasas
        });
    }
    catch (err) {
        res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
});

router.get("/edit/:id?", async (req, res) => {
    if (req.params.id) {
        try {
            const parduotuves = JSON.parse(await readFile("data/parduotuves.json", {
                encoding: "utf-8"
            }));
            const id = parseInt(req.params.id);
            const parduotuve = parduotuves.sarasas.find(parduotuve => parduotuve.id === id);
            if (parduotuve) {
                res.render("parduotuve", {
                    title: "Redaguojam parduotuvę",
                    parduotuve
                });
            } else {
                res.redirect("/parduotuves");
            }
        }
        catch (err) {
            res.status(500).end(`Įvyko klaida: ${err.message}`);
        }
    } else {
        res.render("parduotuve", {
            title: "Kuriam parduotuvę"
        });
    }
});

router.post("/save", async (req, res) => {
    if (req.body.pavadinimas && req.body.pavadinimas.trim() !== "") {
        try {
            const parduotuves = JSON.parse(await readFile("data/parduotuves.json", {
                encoding: "utf-8"
            }));
            if (req.body.id) {
                const id = parseInt(req.body.id);
                const parduotuve = parduotuves.sarasas.find(parduotuve => parduotuve.id === id);
                if (parduotuve) {
                    parduotuve.pavadinimas = req.body.pavadinimas.trim();
                }
            } else {
                const parduotuve = {
                    id: parduotuves.nextId++,
                    pavadinimas: req.body.pavadinimas.trim()
                };
                parduotuves.sarasas.push(parduotuve);
            }
            await writeFile("data/parduotuves.json", JSON.stringify(parduotuves, null, 2), {
                encoding: "utf-8"
            });
            res.redirect("/parduotuves");
        }
        catch (err) {
            res.status(500).end(`Įvyko klaida: ${err.message}`);
        }
    } else {
        res.redirect("/parduotuves");
    }
});

router.get("/delete/:id", async (req, res) => {
    try {
        const parduotuves = JSON.parse(await readFile("data/parduotuves.json", {
            encoding: "utf-8"
        }));
        const id = parseInt(req.params.id);
        const index = parduotuves.sarasas.findIndex(parduotuve => parduotuve.id === id);
        if (index >= 0) {
            parduotuves.sarasas.splice(index, 1);
            await writeFile("data/parduotuves.json", JSON.stringify(parduotuves, null, 2), {
                encoding: "utf-8"
            });
        }
        res.redirect("/parduotuves");
    }
    catch (err) {
        res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
});
