// src/api/produtos.ts

import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import type { Produto } from "../models/Produto.js";
import { db_produtos, salvarProdutos } from "../data/db_produtos.js";
import { AppError } from "../middlewares/errorHandler.js";

const router = Router();

// GET /produtos
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`[GET] /produtos - listando todos os produtos`);
    res.status(200).json(db_produtos.produtos);
  } catch (err) {
    next(err);
  }
});

// GET /produtos/:id
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    console.log(`[GET] /produtos/${id} - buscando produto por id`);

    if (Number.isNaN(id)) {
      console.log(`[GET] /produtos/${req.params.id} - id inválido`);
      throw new AppError("Id inválido", 400);
    }

    const produto = db_produtos.produtos.find((p: Produto) => p.id === id);

    if (!produto) {
      console.log(`[GET] /produtos/${id} - produto não encontrado`);
      throw new AppError("Produto não encontrado", 404);
    }

    res.status(200).json(produto);
  } catch (err) {
    next(err);
  }
});

// POST /produtos
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { descricao, preco, categoria, estoque } = req.body;
    console.log(`[POST] /produtos - criando produto: ${descricao}`);

    if (
      !descricao ||
      preco === undefined ||
      !categoria ||
      estoque === undefined
    ) {
      console.log(`[POST] /produtos - falhou: campos obrigatórios ausentes`);
      throw new AppError(
        "Campos obrigatórios: descricao, preco, categoria, estoque",
        400,
      );
    }

    if (typeof preco !== "number" || Number.isNaN(preco) || preco < 0) {
      console.log(`[POST] /produtos - falhou: preco inválido`);
      throw new AppError("Campo preco deve ser um número positivo", 400);
    }

    if (typeof estoque !== "number" || Number.isNaN(estoque) || estoque < 0) {
      console.log(`[POST] /produtos - falhou: estoque inválido`);
      throw new AppError("Campo estoque deve ser um número positivo", 400);
    }

    const novoId =
      db_produtos.produtos.length > 0
        ? Math.max(...db_produtos.produtos.map((p: Produto) => p.id)) + 1
        : 1;

    const novoProduto: Produto = {
      id: novoId,
      descricao,
      preco,
      categoria,
      estoque,
    };

    db_produtos.produtos.push(novoProduto);

    salvarProdutos();

    console.log(`[POST] /produtos - produto criado com id ${novoId}`);

    res.status(201).json(novoProduto);
  } catch (err) {
    next(err);
  }
});

// PUT /produtos/:id
router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    console.log(`[PUT] /produtos/${id} - atualizando produto`);

    if (Number.isNaN(id)) {
      console.log(`[PUT] /produtos/${req.params.id} - id inválido`);
      throw new AppError("Id inválido", 400);
    }

    const index = db_produtos.produtos.findIndex((p: Produto) => p.id === id);

    if (index === -1) {
      console.log(`[PUT] /produtos/${id} - produto não encontrado`);
      throw new AppError("Produto não encontrado", 404);
    }

    const produtoExistente = db_produtos.produtos[index];

    if (!produtoExistente) {
      console.log(`[PUT] /produtos/${id} - produto não encontrado`);
      throw new AppError("Produto não encontrado", 404);
    }

    const { descricao, preco, categoria, estoque } = req.body;

    if (
      preco !== undefined &&
      (typeof preco !== "number" || Number.isNaN(preco) || preco < 0)
    ) {
      console.log(`[PUT] /produtos/${id} - falhou: preco inválido`);
      throw new AppError("Campo preco deve ser um número positivo", 400);
    }

    if (
      estoque !== undefined &&
      (typeof estoque !== "number" || Number.isNaN(estoque) || estoque < 0)
    ) {
      console.log(`[PUT] /produtos/${id} - falhou: estoque inválido`);
      throw new AppError("Campo estoque deve ser um número positivo", 400);
    }

    const produtoAtualizado: Produto = {
      id,
      descricao: descricao ?? produtoExistente.descricao,
      preco: preco ?? produtoExistente.preco,
      categoria: categoria ?? produtoExistente.categoria,
      estoque: estoque ?? produtoExistente.estoque,
    };

    db_produtos.produtos[index] = produtoAtualizado;

    salvarProdutos();

    console.log(`[PUT] /produtos/${id} - produto atualizado com sucesso`);

    res.status(200).json(produtoAtualizado);
  } catch (err) {
    next(err);
  }
});

// DELETE /produtos/:id
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    console.log(`[DELETE] /produtos/${id} - removendo produto`);

    if (Number.isNaN(id)) {
      console.log(`[DELETE] /produtos/${req.params.id} - id inválido`);
      throw new AppError("Id inválido", 400);
    }

    const index = db_produtos.produtos.findIndex((p: Produto) => p.id === id);

    if (index === -1) {
      console.log(`[DELETE] /produtos/${id} - produto não encontrado`);
      throw new AppError("Produto não encontrado", 404);
    }

    const [removido] = db_produtos.produtos.splice(index, 1);

    salvarProdutos();

    console.log(`[DELETE] /produtos/${id} - produto removido com sucesso`);

    res.status(200).json({ mensagem: "Produto removido", produto: removido });
  } catch (err) {
    next(err);
  }
});

export default router;
