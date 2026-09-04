// src/app/middlewares/errorHandler.ts

import type { NextFunction, Request, Response } from "express";

// classe de erro customizada

export class AppError extends Error {
  status: number;

  constructor(mensagem: string, status = 400) {
    super(mensagem);
    this.name = "AppError";
    this.status = status;
  }
}

// rota nao encontrada (404)

export function rotaNaoEncontrada(req: Request, res: Response): void {
  console.log(`[404] ${req.method} ${req.originalUrl} - rota não encontrada`);
  res.status(404).json({ mensagem: "Rota não encontrada" });
}

// middleware central de tratamento de erros

export function tratarErros(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    console.log(
      `[ERRO] ${req.method} ${req.originalUrl} - ${err.status}: ${err.message}`,
    );

    res.status(err.status).json({ mensagem: err.message });
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    console.log(
      `[ERRO] ${req.method} ${req.originalUrl} - JSON inválido no corpo da requisição`,
    );

    res.status(400).json({ mensagem: "JSON inválido no corpo da requisição" });
    return;
  }

  const mensagem = err instanceof Error ? err.message : "Erro desconhecido";
  console.log(`[ERRO] ${req.method} ${req.originalUrl} - 500: ${mensagem}`);

  res.status(500).json({ mensagem: "Erro interno do servidor" });
}
