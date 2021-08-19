/*
/json/cekiai
GET / - grazina sarasa
GET /id - grazina viena irasa su nurodytu id
POST / - sukuria nauja irasa ir grazina (naujai sukurta)
PUT /id - pakeicia esama irasa su nurodytu id ir grazina (pakoreguta)
DELETE /id - istrina esama irasa su nurodytu id ir grazina (istrinta)

GET /cekisId/prekes - grazina nurodyto cekio prekiu sarasa
GET /cekisId/prekes/id - grazina nurodyto cekio viena preke su nurodytu id
POST /cekisId/prekes - sukuria nauja preke ir grazina (naujai sukurta)
PUT /cekisId/prekes/id - pakeicia esama preke su nurodytu id ir grazina (pakoreguta)
DELETE /cekisId/prekes/id - istrina esama preke su nurodytu id ir grazina (istrinta)

REST
*/

import { readFile, writeFile } from "fs/promises";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    res.send(JSON.stringify(cekiai.cekiai));
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
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    const id = parseInt(req.params.id);
    const cekis = cekiai.cekiai.find((cekis) => cekis.id === id);
    if (cekis) {
      res.send(JSON.stringify(cekis));
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
      const cekiai = JSON.parse(
        await readFile("data/cekiai.json", {
          encoding: "utf-8",
        }),
      );
      const cekis = {
        id: cekiai.nextId++,
        data: req.body.data,
        pavadinimas: req.body.pavadinimas,
        parduotuveId: parseInt(req.body.parduotuveId),
        mokejimuTipasId: parseInt(req.body.mokejimuTipasId),
      };
      cekiai.cekiai.push(cekis);
      const prekes = JSON.parse(req.body.prekes);
      for (const preke of prekes) {
        preke.kaina = parseFloat(preke.kaina);
        if (preke.id < 0) {
          preke.id = cekiai.nextIdPreke++;
        }
      }
      cekis.prekes = prekes;
      await writeFile(
        "data/cekiai.json",
        JSON.stringify(cekiai, null, 2),
        {
          encoding: "utf-8",
        },
      );
      res.send(JSON.stringify(cekis));
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
      const cekiai = JSON.parse(
        await readFile("data/cekiai.json", {
          encoding: "utf-8",
        }),
      );
      const id = parseInt(req.params.id);
      const cekis = cekiai.cekiai.find((cekis) => cekis.id === id);
      if (cekis) {
        cekis.data = req.body.data;
        cekis.pavadinimas = req.body.pavadinimas;
        cekis.parduotuveId = parseInt(req.body.parduotuveId);
        cekis.mokejimuTipasId = parseInt(req.body.mokejimuTipasId);
        const prekes = JSON.parse(req.body.prekes);
        for (const preke of prekes) {
          preke.kaina = parseFloat(preke.kaina);
          if (preke.id < 0) {
            preke.id = cekiai.nextIdPreke++;
          }
        }
        cekis.prekes = prekes;
        await writeFile(
          "data/cekiai.json",
          JSON.stringify(cekiai, null, 2),
          {
            encoding: "utf-8",
          },
        );
        res.send(JSON.stringify(cekis));
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
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    const id = parseInt(req.params.id);
    const index = cekiai.cekiai.findIndex((cekis) => cekis.id === id);
    if (index >= 0) {
      const [cekis] = cekiai.cekiai.splice(index, 1);
      await writeFile(
        "data/cekiai.json",
        JSON.stringify(cekiai, null, 2),
        {
          encoding: "utf-8",
        },
      );
      res.send(JSON.stringify(cekis));
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

router.get("/:cekisId/prekes", async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    const cekisId = parseInt(req.params.cekisId);
    const cekis = cekiai.cekiai.find((cekis) => cekis.id === cekisId);
    if (cekis) {
      res.send(JSON.stringify(cekis.prekes));
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

router.get("/:cekisId/prekes/:id", async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    const cekisId = parseInt(req.params.cekisId);
    const prekeId = parseInt(req.params.id);
    const cekis = cekiai.cekiai.find((cekis) => cekis.id === cekisId);
    if (cekis) {
      const preke = cekis.prekes.find((preke) => preke.id === prekeId);
      if (preke) {
        res.send(JSON.stringify(preke));
        return;
      }
    }
    res.send("null");
  } catch (err) {
    res.status(500).end(JSON.stringify({
      message: "Įvyko klaida",
      err,
    }));
  }
});

router.delete("/:cekisId/prekes/:id", async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    const cekisId = parseInt(req.params.cekisId);
    const prekeId = parseInt(req.params.id);
    const cekis = cekiai.cekiai.find((cekis) => cekis.id === cekisId);
    if (cekis) {
      const index = cekis.prekes.findIndex((preke) => preke.id === prekeId);
      if (index >= 0) {
        const [preke] = cekis.prekes.splice(index, 1);
        await writeFile(
          "data/cekiai.json",
          JSON.stringify(cekiai, null, 2),
          {
            encoding: "utf-8",
          },
        );
        res.send(JSON.stringify(preke));
        return;
      }
    }
    res.send("null");
  } catch (err) {
    res.status(500).end(JSON.stringify({
      message: "Įvyko klaida",
      err,
    }));
  }
});
