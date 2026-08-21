// src/app/data/db_produtos.ts

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { ProdutosDB } from "../models/Produto.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CAMINHO_JSON = join(__dirname, "produtos.json");

export function lerProdutos(): ProdutosDB {
  const conteudo = readFileSync(CAMINHO_JSON, "utf-8");
  return JSON.parse(conteudo) as ProdutosDB;
}

export function salvarProdutosNoArquivo(db: ProdutosDB): void {
  writeFileSync(CAMINHO_JSON, JSON.stringify(db, null, 2), "utf-8");
}

export const db_produtos: ProdutosDB = lerProdutos();

export function salvarProdutos(): void {
  salvarProdutosNoArquivo(db_produtos);
}