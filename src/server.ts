import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import apiRouter from "./app/api/apiRouter.js";
import {
  rotaNaoEncontrada,
  tratarErros,
} from "./app/middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "app", "site")));

app.use(apiRouter);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
