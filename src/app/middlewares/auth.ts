// src/app/middlewares/auth.ts

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../models/Usuario.js";

// configuracoes

export const NOME_COOKIE = "token";

function getSecret(): string {
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    throw new Error("SECRET_KEY não configurada no .env");
  }

  return secret;
}

// geracao de token

export function gerarToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "8h" });
}

// extensao de tipos do express

declare module "express-serve-static-core" {
  interface Request {
    usuario?: JwtPayload;
  }
}

// middleware para rotas de api

export function autenticar(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[NOME_COOKIE];

  if (!token) {
    console.log(
      `[AUTH] ${req.method} ${req.originalUrl} - acesso negado: sem token`,
    );

    res.status(401).json({ mensagem: "Não autenticado" });
    return;
  }

  try {
    const payload = jwt.verify(token, getSecret()) as JwtPayload;
    req.usuario = payload;

    next();
  } catch (err) {
    console.log(
      `[AUTH] ${req.method} ${req.originalUrl} - acesso negado: token inválido`,
    );

    res.status(401).json({ mensagem: "Sessão inválida ou expirada" });
  }
}

// middleware para rotas de pagina

export function autenticarPagina(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[NOME_COOKIE];

  if (!token) {
    res.redirect("/login");
    return;
  }

  try {
    const payload = jwt.verify(token, getSecret()) as JwtPayload;
    req.usuario = payload;

    next();
  } catch (err) {
    res.redirect("/login");
  }
}
