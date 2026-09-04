// src/app/api/auth.ts

import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { Usuario, UsuarioPublico } from "../models/Usuario.js";
import { db_usuarios, salvarUsuarios } from "../data/db_usuarios.js";
import { AppError } from "../middlewares/errorHandler.js";
import { autenticar, gerarToken, NOME_COOKIE } from "../middlewares/auth.js";

const router = Router();

// configurações

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 8 * 60 * 60 * 1000,
};

// helpers

function paraPublico(usuario: Usuario): UsuarioPublico {
  const { senha, ...publico } = usuario;
  return publico;
}

// rotas

// POST /auth/registrar
router.post(
  "/registrar",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usuario, senha } = req.body;
      console.log(`[POST] /auth/registrar - tentativa de registro: ${usuario}`);

      if (!usuario || !senha) {
        throw new AppError("Campos obrigatórios: usuario, senha", 400);
      }

      if (typeof usuario !== "string" || usuario.trim().length < 3) {
        throw new AppError("Usuário deve ter pelo menos 3 caracteres", 400);
      }

      if (typeof senha !== "string" || senha.length < 6) {
        throw new AppError("Senha deve ter pelo menos 6 caracteres", 400);
      }

      const usuarioNormalizado = usuario.trim();

      const jaExiste = db_usuarios.usuarios.some(
        (u: Usuario) =>
          u.usuario.toLowerCase() === usuarioNormalizado.toLowerCase(),
      );

      if (jaExiste) {
        console.log(`[POST] /auth/registrar - falhou: usuário já existe`);
        throw new AppError("Usuário já existe", 409);
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const proximoId =
        db_usuarios.usuarios.reduce((max, u) => Math.max(max, u.id), 0) + 1;

      const novoUsuario: Usuario = {
        id: proximoId,
        usuario: usuarioNormalizado,
        senha: senhaHash,
      };

      db_usuarios.usuarios.push(novoUsuario);
      salvarUsuarios();

      const token = gerarToken({
        id: novoUsuario.id,
        usuario: novoUsuario.usuario,
      });

      res.cookie(NOME_COOKIE, token, COOKIE_OPTS);

      console.log(
        `[POST] /auth/registrar - registro bem-sucedido: ${usuarioNormalizado}`,
      );

      res.status(201).json({
        mensagem: "Usuário registrado com sucesso",
        usuario: paraPublico(novoUsuario),
      });
    } catch (err) {
      next(err);
    }
  },
);

// POST /auth/login
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usuario, senha } = req.body;
      console.log(`[POST] /auth/login - tentativa de login: ${usuario}`);

      if (!usuario || !senha) {
        throw new AppError("Campos obrigatórios: usuario, senha", 400);
      }

      const usuarioEncontrado = db_usuarios.usuarios.find(
        (u: Usuario) => u.usuario === usuario,
      );

      if (!usuarioEncontrado) {
        console.log(`[POST] /auth/login - falhou: usuário não encontrado`);
        throw new AppError("Usuário ou senha inválidos", 401);
      }

      const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);

      if (!senhaValida) {
        console.log(`[POST] /auth/login - falhou: senha incorreta`);
        throw new AppError("Usuário ou senha inválidos", 401);
      }

      const token = gerarToken({
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
      });

      res.cookie(NOME_COOKIE, token, COOKIE_OPTS);

      console.log(`[POST] /auth/login - login bem-sucedido: ${usuario}`);

      res.status(200).json({
        mensagem: "Login realizado com sucesso",
        usuario: paraPublico(usuarioEncontrado),
      });
    } catch (err) {
      next(err);
    }
  },
);

// POST /auth/logout
router.post("/logout", (req: Request, res: Response) => {
  console.log(`[POST] /auth/logout - encerrando sessão`);
  res.clearCookie(NOME_COOKIE, COOKIE_OPTS);
  res.status(200).json({ mensagem: "Logout realizado com sucesso" });
});

// GET /auth/me
router.get("/me", autenticar, (req: Request, res: Response) => {
  console.log(`[GET] /auth/me - usuário atual: ${req.usuario?.usuario}`);
  res.status(200).json({ usuario: req.usuario });
});

export default router;
