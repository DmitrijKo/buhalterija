import express from "express";

import { router as islaiduTipaiRouter } from "./islaiduTipai.js";
import { router as mokejimuTipaiRouter } from "./mokejimuTipai.js";
import { router as cekiaiRouter } from "./cekiai.js";


export const router = express.Router();

router.use("/islaiduTipai", islaiduTipaiRouter);
router.use("/mokejimuTipai", mokejimuTipaiRouter);
router.use("/cekiai", cekiaiRouter);
