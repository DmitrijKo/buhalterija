import express from "express";
import Handlebars from "handlebars";
import exphbs from "express-handlebars";

import { router as islaiduTipaiRouter } from "./islaiduTipai.js";
import { router as parduotuvesRouter } from "./parduotuves.js";
import { router as mokejimuTipaiRouter } from "./mokejimuTipai.js";
import { router as cekiaiRouter } from "./cekiai.js";
import { router as ataskaitosRouter } from "./ataskaitos.js";
import { router as jsonRouter } from "./json/jsonRouter.js";

const PORT = 3000;
const WEB = "web";

Handlebars.registerHelper("eq", function(p1, p2) {
  return p1 === p2;
});

const app = express();
app.engine(
  "handlebars",
  exphbs({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  }),
);
app.set("view engine", "handlebars");

app.use(express.static(WEB));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use("/islaiduTipai", islaiduTipaiRouter);
app.use("/parduotuves", parduotuvesRouter);
app.use("/mokejimuTipai", mokejimuTipaiRouter);
app.use("/cekiai", cekiaiRouter);
app.use("/ataskaitos", ataskaitosRouter);
app.use("/json", jsonRouter);

app.listen(PORT);
console.log(`Server started on port ${PORT}`);
