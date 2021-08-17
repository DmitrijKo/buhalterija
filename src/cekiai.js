import { readFile, writeFile } from "fs/promises";
import express from "express";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const islaiduTipai = JSON.parse(
      await readFile("data/islaiduTipai.json", {
        encoding: "utf-8",
      }),
    );
    const mokejimuTipai = JSON.parse(
      await readFile("data/mokejimuTipai.json", {
        encoding: "utf-8",
      }),
    );
    const parduotuves = JSON.parse(
      await readFile("data/parduotuves.json", {
        encoding: "utf-8",
      }),
    );
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    for (const cekis of cekiai.cekiai) {
      const parduotuve = parduotuves.sarasas.find((p) =>
        p.id === cekis.parduotuveId
      );
      if (parduotuve) {
        cekis.parduotuve = parduotuve.pavadinimas;
      }
      const mokejimuTipas = mokejimuTipai.tipai.find((mt) =>
        mt.id === cekis.mokejimuTipasId
      );
      if (mokejimuTipas) {
        cekis.mokejimuTipas = mokejimuTipas.pavadinimas;
      }
      for (const preke of cekis.prekes) {
        const islaiduTipas = islaiduTipai.tipai.find((it) =>
          it.id === preke.tipasId
        );
        if (islaiduTipas) {
          preke.tipas = islaiduTipas.pavadinimas;
        }
      }
    }
    res.render("cekiai", {
      title: "Čekiai",
      list: cekiai.cekiai,
    });
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.get("/edit/:id?", async (req, res) => {
  try {
    const islaiduTipai = JSON.parse(
      await readFile("data/islaiduTipai.json", {
        encoding: "utf-8",
      }),
    );
    const mokejimuTipai = JSON.parse(
      await readFile("data/mokejimuTipai.json", {
        encoding: "utf-8",
      }),
    );
    const parduotuves = JSON.parse(
      await readFile("data/parduotuves.json", {
        encoding: "utf-8",
      }),
    );
    if (req.params.id) {
      const cekiai = JSON.parse(
        await readFile("data/cekiai.json", {
          encoding: "utf-8",
        }),
      );
      const id = parseInt(req.params.id);
      const cekis = cekiai.cekiai.find((tipas) => tipas.id === id);
      res.render("cekis", {
        title: "Redaguojam čekį",
        islaiduTipai: islaiduTipai.tipai,
        mokejimuTipai: mokejimuTipai.tipai,
        parduotuves: parduotuves.sarasas,
        cekis,
      });
    } else {
      res.render("cekis", {
        title: "Kuriam čekį",
        islaiduTipai: islaiduTipai.tipai,
        mokejimuTipai: mokejimuTipai.tipai,
        parduotuves: parduotuves.sarasas,
      });
    }
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.post("/save", async (req, res) => {
  try {
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    let cekis;
    if (req.body.id) {
      const id = parseInt(req.body.id);

      cekis = cekiai.cekiai.find((cekis) => cekis.id === id);
      if (!cekis) {
        res.redirect("/cekiai");
        return;
      }
      cekis.data = req.body.data;
      cekis.pavadinimas = req.body.pavadinimas;
      cekis.parduotuveId = parseInt(req.body.parduotuveId);
      cekis.mokejimuTipasId = parseInt(req.body.mokejimuTipasId);
    } else {
      cekis = {
        id: cekiai.nextId++,
        data: req.body.data,
        pavadinimas: req.body.pavadinimas,
        parduotuveId: parseInt(req.body.parduotuveId),
        mokejimuTipasId: parseInt(req.body.mokejimuTipasId),
      };
      cekiai.cekiai.push(cekis);
    }
    const prekes = JSON.parse(req.body.prekes);
    for (const preke of prekes) {
      preke.kaina = parseFloat(preke.kaina);
      if (preke.id < 0) {
        preke.id = cekiai.nextIdPreke++;
      }
    }
    cekis.prekes = prekes;
    await writeFile("data/cekiai.json", JSON.stringify(cekiai, null, 2), {
      encoding: "utf-8",
    });
    res.redirect("/cekiai");
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    const cekiai = JSON.parse(
      await readFile("data/cekiai.json", {
        encoding: "utf-8",
      }),
    );
    const id = parseInt(req.params.id);
    const index = cekiai.cekiai.findIndex((tipas) => tipas.id === id);
    if (index >= 0) {
      cekiai.cekiai.splice(index, 1);
      await writeFile("data/cekiai.json", JSON.stringify(cekiai, null, 2), {
        encoding: "utf-8",
      });
    }
    res.redirect("/cekiai");
  } catch (err) {
    res.status(500).end(`Įvyko klaida: ${err.message}`);
  }
});
