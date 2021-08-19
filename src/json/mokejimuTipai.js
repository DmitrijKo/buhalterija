import { readFile, writeFile } from "fs/promises";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const mokejimuTipai = JSON.parse(
      await readFile("data/mokejimuTipai.json", {
        encoding: "utf-8",
      }),
    );
    res.send(JSON.stringify(mokejimuTipai.tipai));
  } catch (err) {
    res.status(500).end(JSON.stringify({
      message: "Įvyko klaida",
      err,
    }));
  }
});

router.get("/:id", async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const mokejimuTipai = JSON.parse(
      await readFile("data/mokejimuTipai.json", {
        encoding: "utf-8",
      }),
    );
    const id = parseInt(req.params.id);
    const tipas = mokejimuTipai.tipai.find((tipas) => tipas.id === id);
    if (tipas) {
      res.send(JSON.stringify(tipas));
    } else {
      res.send("null");
    }
  } catch (err) {
    res.status(500).end(JSON.stringify({
      message: "Įvyko klaida",
      err,
    }));
  }
});

router.post("/", async (req, res) => {
  res.set("Content-Type", "application/json");
  if (req.body.pavadinimas && req.body.pavadinimas.trim() !== "") {
    try {
      const mokejimuTipai = JSON.parse(
        await readFile("data/mokejimuTipai.json", {
          encoding: "utf-8",
        }),
      );
      const tipas = {
        id: mokejimuTipai.nextId++,
        pavadinimas: req.body.pavadinimas.trim(),
      };
      mokejimuTipai.tipai.push(tipas);
      await writeFile(
        "data/mokejimuTipai.json",
        JSON.stringify(mokejimuTipai, null, 2),
        {
          encoding: "utf-8",
        },
      );
      res.send(JSON.stringify(tipas));
    } catch (err) {
      res.status(500).end(JSON.stringify({
        message: "Įvyko klaida",
        err,
      }));
    }
  } else {
    res.send("null");
  }
});

router.put("/:id", async (req, res) => {
  res.set("Content-Type", "application/json");
  if (req.body.pavadinimas && req.body.pavadinimas.trim() !== "") {
    try {
      const mokejimuTipai = JSON.parse(
        await readFile("data/mokejimuTipai.json", {
          encoding: "utf-8",
        }),
      );
      const id = parseInt(req.params.id);
      const tipas = mokejimuTipai.tipai.find((tipas) => tipas.id === id);
      if (tipas) {
        tipas.pavadinimas = req.body.pavadinimas.trim();
        await writeFile(
          "data/mokejimuTipai.json",
          JSON.stringify(mokejimuTipai, null, 2),
          {
            encoding: "utf-8",
          },
        );
        res.send(JSON.stringify(tipas));
      } else {
        res.send("null");
      }
    } catch (err) {
      res.status(500).end(JSON.stringify({
        message: "Įvyko klaida",
        err,
      }));
    }
  } else {
    res.send("null");
  }
});

router.delete("/:id", async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const mokejimuTipai = JSON.parse(
      await readFile("data/mokejimuTipai.json", {
        encoding: "utf-8",
      }),
    );
    const id = parseInt(req.params.id);
    const index = mokejimuTipai.tipai.findIndex((tipas) => tipas.id === id);
    if (index >= 0) {
      const [tipas] = mokejimuTipai.tipai.splice(index, 1);
      await writeFile(
        "data/mokejimuTipai.json",
        JSON.stringify(mokejimuTipai, null, 2),
        {
          encoding: "utf-8",
        },
      );
      res.send(JSON.stringify(tipas));
    } else {
      res.send("null");
    }
  } catch (err) {
    res.status(500).end(JSON.stringify({
      message: "Įvyko klaida",
      err,
    }));
  }
});
