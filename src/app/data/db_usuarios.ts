// src/app/data/db_usuarios.ts

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { UsuariosDB } from "../models/Usuario.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CAMINHO_JSON = join(__dirname, "usuarios.json");

// leitura/escrita em disco

export function lerUsuarios(): UsuariosDB {
  const conteudo = readFileSync(CAMINHO_JSON, "utf-8");
  return JSON.parse(conteudo) as UsuariosDB;
}

export function salvarUsuariosNoArquivo(db: UsuariosDB): void {
  writeFileSync(CAMINHO_JSON, JSON.stringify(db, null, 2), "utf-8");
}

// estado em memória

export const db_usuarios: UsuariosDB = lerUsuarios();

export function salvarUsuarios(): void {
  salvarUsuariosNoArquivo(db_usuarios);
}
