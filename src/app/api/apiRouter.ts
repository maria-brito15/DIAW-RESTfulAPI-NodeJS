// src/app/api/apiRouter.ts

import { Router } from "express";
import produtosRouter from "./produtos.js";
import authRouter from "./auth.js";
import { autenticar } from "../middlewares/auth.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/produtos", autenticar, produtosRouter);

export default apiRouter;
