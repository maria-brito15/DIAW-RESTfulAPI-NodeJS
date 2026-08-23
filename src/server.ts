import express from "express";
import cors from "cors";
import apiRouter from "./app/api/apiRouter.js";
import {
  rotaNaoEncontrada,
  tratarErros,
} from "./app/middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    mensagem: "API de Produtos rodando com sucesso",
    rotas: {
      listarProdutos: "GET /produtos",
      buscarProduto: "GET /produtos/:id",
      criarProduto: "POST /produtos",
      atualizarProduto: "PUT /produtos/:id",
      excluirProduto: "DELETE /produtos/:id",
    },
  });
});

app.use(apiRouter);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
