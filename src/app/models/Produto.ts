// src/models/Produto.ts

export interface Produto {
  id: number;
  descricao: string;
  valor: number;
  marca: string;
}

export interface ProdutosDB {
  produtos: Produto[];
}
