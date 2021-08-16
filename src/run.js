import express from "express";
import exphbs from "express-handlebars";

import { router as islaiduTipaiRouter } from "./islaiduTipai.js";
import { router as parduotuvesRouter } from "./parduotuves.js";
import { router as mokejimuTipaiRouter } from "./mokejimuTipai.js";
import { router as cekiaiRouter } from "./cekiai.js";

const PORT = 3000;
const WEB = "web";

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
app.use(express.urlencoded({
  extended: true,
}));

app.use("/islaiduTipai", islaiduTipaiRouter);
app.use("/parduotuves", parduotuvesRouter);
app.use("/mokejimuTipai", mokejimuTipaiRouter);
app.use("/cekiai", cekiaiRouter);

app.listen(PORT);
console.log(`Server started on port ${PORT}`);
