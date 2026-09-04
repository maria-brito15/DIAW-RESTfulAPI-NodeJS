# CRUD de Produtos

API REST + interface web para gerenciamento de produtos, com Node.js, Express e JavaScript puro. Acesso protegido por login com JWT em cookie httpOnly.

🔗 **App:** https://diaw-restfulapi-nodejs.onrender.com

## Páginas

| Rota      | Descrição                                              |
|-----------|---------------------------------------------------------|
| /login    | Tela de login                                            |
| /home     | Tela de boas-vindas (protegida), com link para /estoque |
| /estoque  | Gerenciamento de produtos (protegida)                   |

## Rotas da API

### Autenticação (`/auth`)

| Método | Rota          | Descrição                          |
|--------|---------------|--------------------------------------|
| POST   | /auth/login   | Login (usuario, senha) → seta cookie |
| POST   | /auth/logout  | Logout → limpa cookie                |
| GET    | /auth/me      | Retorna o usuário autenticado        |

### Produtos (`/produtos`) — requer estar autenticado

| Método | Rota          | Descrição                |
|--------|---------------|---------------------------|
| GET    | /produtos     | Lista todos os produtos   |
| GET    | /produtos/:id | Busca um produto          |
| POST   | /produtos     | Cria um produto           |
| PUT    | /produtos/:id | Atualiza um produto       |
| DELETE | /produtos/:id | Remove um produto         |

## Autenticação

O login é feito com usuário e senha (senha armazenada com hash `bcrypt` em `src/app/data/usuarios.json`). Ao logar, o servidor gera um JWT (`id`, `usuario`) assinado com `SECRET_KEY` (variável de ambiente) e o envia como cookie `httpOnly`. Esse cookie é exigido para acessar `/produtos` (API) e as páginas `/home` e `/estoque`.

Usuário de exemplo já cadastrado (`src/app/data/usuarios.json`):

```
usuario: admin
senha:   123456
```

## Rodando localmente

```bash
npm install
npm run dev
```

Configure a variável `SECRET_KEY` no `.env` (já existe um exemplo em `.env`). Acesse `http://localhost:3000`, você será redirecionado para `/login`.