import { readFile, writeFile } from "fs/promises";
import express from "express";

export const router = express.Router();

class Cekis {

    #parduotuves;
    #mokejimuTipai;
    #islaiduTipai;
    #id;
    #data;
    #parduotuveId;
    #mokejimuTipasId;
    #prekes;

    constructor(parduotuves, mokejimuTipai, islaiduTipai, cekis) {
        if (!Array.isArray(parduotuves)) {
            throw new TypeError("parduotuves must be an array");
        }
        this.#parduotuves = parduotuves;
        if (!Array.isArray(mokejimuTipai)) {
            throw new TypeError("mokejimuTipai must be an array");
        }
        this.#mokejimuTipai = mokejimuTipai;
        if (!Array.isArray(islaiduTipai)) {
            throw new TypeError("islaiduTipai must be an array");
        }
        this.#islaiduTipai = islaiduTipai;
        if (typeof cekis !== "object") {
            throw new TypeError("cekis must be an object");
        }
        this.id = cekis.id;
        this.data = cekis.data;
        this.parduotuveId = cekis.parduotuveId;
        this.mokejimuTipasId = cekis.mokejimuTipasId;
        if (Array.isArray(cekis.prekes)) {
            this.prekes = cekis.prekes;
        } else {
            this.#prekes = [];
        }
    }

    get id() {
        return this.#id;
    }
    set id(value) {
        if (typeof value !== "number" && typeof value !== "undefined") {
            throw new TypeError("id must be a number");
        }
        if (value && !isFinite(value)) {
            throw new TypeError("id must be a finite number");
        }
        this.#id = value;
    }

    get data() {
        return this.#data;
    }
    set data(value) {
        if (typeof value === "string") {
            value = new Date(value);
        }
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new TypeError("data must be a valid date");
        }
        this.#data = value;
    }

    get parduotuveId() {
        return this.#parduotuveId;
    }
    set parduotuveId(value) {
        const parduotuve = this.#parduotuves.find(p => p.id === value);
        if (!parduotuve) {
            throw new TypeError("parduotuveId must point to valid object");
        }
        this.#parduotuveId = value;
    }

    get parduotuve() {
        const parduotuve = this.#parduotuves.find(p => p.id === this.#parduotuveId);
        return parduotuve.pavadinimas;
    }

    get mokejimuTipasId() {
        return this.#mokejimuTipasId;
    }
    set mokejimuTipasId(value) {
        const mokejimuTipas = this.#mokejimuTipai.find(mt => mt.id === value);
        if (!mokejimuTipas) {
            throw new TypeError("mokejimuTipasId must point to valid object");
        }
        this.#mokejimuTipasId = value;
    }

    get mokejimuTipas() {
        const mokejimuTipas = this.#mokejimuTipai.find(mt => mt.id === this.#mokejimuTipasId);
        return mokejimuTipas.pavadinimas;
    }

    get prekes() {
        return this.#prekes;
    }
    set prekes(value) {
        if (!Array.isArray(value)) {
            throw new TypeError("prekes must be an array");
        }
        const list = [];
        for (const preke of value) {
            const p = new Preke(this.#islaiduTipai, preke);
            list.push(p);
        }
        this.#prekes = list;
    }

    toJSON() {
        let data = this.#data.toISOString();
        data = data.substring(0, 10);
        return {
            id: this.#id,
            data,
            parduotuveId: this.#parduotuveId,
            mokejimuTipasId: this.#mokejimuTipasId,
            prekes: this.#prekes
        };
    }
}

class Preke {
    #islaiduTipai;
    #id;
    #pavadinimas;
    #kaina;
    #tipasId;

    constructor(islaiduTipai, preke) {
        if (!Array.isArray(islaiduTipai)) {
            throw new TypeError("islaiduTipai must be an array");
        }
        this.#islaiduTipai = islaiduTipai;
        if (typeof preke !== "object") {
            throw new TypeError("preke must be an object");
        }
        this.id = preke.id;
        this.pavadinimas = preke.pavadinimas;
        this.kaina = preke.kaina;
        this.tipasId = preke.tipasId;
    }

    get id() {
        return this.#id;
    }
    set id(value) {
        if (typeof value !== "number" && typeof value !== "undefined") {
            throw new TypeError("id must be a number");
        }
        if (value && !isFinite(value)) {
            throw new TypeError("id must be a finite number");
        }
        this.#id = value;
    }

    get pavadinimas() {
        return this.#pavadinimas;
    }
    set pavadinimas(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("pavadinimas must be non-empty string");
        }
        this.#pavadinimas = value;
    }

    get kaina() {
        return this.#kaina;
    }
    set kaina(value) {
        if (typeof value !== "number" && typeof value !== "undefined") {
            throw new TypeError("kaina must be a number");
        }
        if (value && !isFinite(value)) {
            throw new TypeError("kaina must be a finite number");
        }
        this.#kaina = value;
    }

    get tipasId() {
        return this.#tipasId;
    }
    set tipasId(value) {
        const islaiduTipas = this.#islaiduTipai.find(it => it.id === value);
        if (!islaiduTipas) {
            throw new TypeError("tipasId must point to valid object");
        }
        this.#tipasId = value;
    }

    get tipas() {
        const islaiduTipas = this.#islaiduTipai.find(it => it.id === this.#tipasId);
        return islaiduTipas.pavadinimas;
    }

    toJSON() {
        return {
            id: this.#id,
            pavadinimas: this.#pavadinimas,
            kaina: this.#kaina,
            tipasId: this.#tipasId
        };
    }
}

router.get("/", async (req, res) => {
    try {
        const islaiduTipai = JSON.parse(await readFile("data/islaiduTipai.json", {
            encoding: "utf-8"
        }));
        const mokejimuTipai = JSON.parse(await readFile("data/mokejimuTipai.json", {
            encoding: "utf-8"
        }));
        const parduotuves = JSON.parse(await readFile("data/parduotuves.json", {
            encoding: "utf-8"
        }));
        const cekiai = JSON.parse(await readFile("data/cekiai.json", {
            encoding: "utf-8"
        }));
        const list = [];
        for (const cekis of cekiai.cekiai) {
            list.push(new Cekis(parduotuves.sarasas, mokejimuTipai.tipai, islaiduTipai.tipai, cekis));
        }
        res.render("cekiai", {
            title: "Čekiai",
            list
        });
    }
    catch (err) {
        res.status(500).end(`Įvyko klaida: ${err.message}`);
    }
});
