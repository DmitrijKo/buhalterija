/*
/json/islaiduTipai
GET / - grazina sarasa
GET /id - grazina viena irasa su nurodytu id
POST / - sukuria nauja irasa ir grazina (naujai sukurta)
PUT /id - pakeicia esama irasa su nurodytu id ir grazina (pakoreguta)
DELETE /id - istrina esama irasa su nurodytu id ir grazina (istrinta)
*/

import { readFile, writeFile } from "fs/promises";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const islaiduTipai = JSON.parse(
      await readFile("data/islaiduTipai.json", {
        encoding: "utf-8",
      }),
    );
    res.send(JSON.stringify(islaiduTipai.tipai));
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
    const islaiduTipai = JSON.parse(
      await readFile("data/islaiduTipai.json", {
        encoding: "utf-8",
      }),
    );
    const id = parseInt(req.params.id);
    const tipas = islaiduTipai.tipai.find((tipas) => tipas.id === id);
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
      const islaiduTipai = JSON.parse(
        await readFile("data/islaiduTipai.json", {
          encoding: "utf-8",
        }),
      );
      const tipas = {
        id: islaiduTipai.nextId++,
        pavadinimas: req.body.pavadinimas.trim(),
      };
      islaiduTipai.tipai.push(tipas);
      await writeFile(
        "data/islaiduTipai.json",
        JSON.stringify(islaiduTipai, null, 2),
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
      const islaiduTipai = JSON.parse(
        await readFile("data/islaiduTipai.json", {
          encoding: "utf-8",
        }),
      );
      const id = parseInt(req.params.id);
      const tipas = islaiduTipai.tipai.find((tipas) => tipas.id === id);
      if (tipas) {
        tipas.pavadinimas = req.body.pavadinimas.trim();
        await writeFile(
          "data/islaiduTipai.json",
          JSON.stringify(islaiduTipai, null, 2),
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
    const islaiduTipai = JSON.parse(
      await readFile("data/islaiduTipai.json", {
        encoding: "utf-8",
      }),
    );
    const id = parseInt(req.params.id);
    const index = islaiduTipai.tipai.findIndex((tipas) => tipas.id === id);
    if (index >= 0) {
      const [tipas] = islaiduTipai.tipai.splice(index, 1);
      await writeFile(
        "data/islaiduTipai.json",
        JSON.stringify(islaiduTipai, null, 2),
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
