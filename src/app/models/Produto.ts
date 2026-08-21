// src/models/Produto.ts

export interface Produto {
  id: number;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
}

export interface ProdutosDB {
  produtos: Produto[];
}
