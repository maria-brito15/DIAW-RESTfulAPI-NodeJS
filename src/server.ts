import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import apiRouter from "./app/api/apiRouter.js";
import { autenticarPagina } from "./app/middlewares/auth.js";
import {
  rotaNaoEncontrada,
  tratarErros,
} from "./app/middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middlewares globais

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const SITE_DIR = path.join(__dirname, "app", "site");

// páginas
app.get("/", (req, res) => res.redirect("/home"));
app.get("/login", (req, res) =>
  res.sendFile(path.join(SITE_DIR, "login.html")),
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(SITE_DIR, "register.html")),
);
app.get("/home", autenticarPagina, (req, res) =>
  res.sendFile(path.join(SITE_DIR, "home.html")),
);
app.get("/estoque", autenticarPagina, (req, res) =>
  res.sendFile(path.join(SITE_DIR, "index.html")),
);

app.use(express.static(SITE_DIR));

// api

app.use("/", apiRouter);

// tratamento de erros

app.use(rotaNaoEncontrada);
app.use(tratarErros);

// inicialização

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
