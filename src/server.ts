import express from "express";
import apiRouter from "./app/api/apiRouter.js";
import { rotaNaoEncontrada, tratarErros } from "./app/middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
