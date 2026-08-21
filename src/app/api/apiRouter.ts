// src/app/api/apiRouter.ts

import { Router } from "express";
import produtosRouter from "./produtos.js";

const apiRouter = Router();

apiRouter.use("/produtos", produtosRouter);

export default apiRouter;
