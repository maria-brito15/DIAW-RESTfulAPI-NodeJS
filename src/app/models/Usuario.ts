// src/models/Usuario.ts

export interface Usuario {
  id: number;
  usuario: string;
  senha: string;
}

export interface UsuariosDB {
  usuarios: Usuario[];
}

export type UsuarioPublico = Omit<Usuario, "senha">;

export interface JwtPayload {
  id: number;
  usuario: string;
}
