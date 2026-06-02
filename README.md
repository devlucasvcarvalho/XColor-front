# XColor — Front-end

Interface em React 19 + Vite consumindo a API XColor.

## Pré-requisitos

- [Node.js 18+](https://nodejs.org)
- Back-end XColor rodando em http://localhost:5257

## Como rodar

```bash
npm install
npm run dev
```

Acesse: **http://localhost:5173**

## Telas

| Rota | Descrição |
|------|-----------|
| `/` | Login |
| `/cadastro` | Criar conta |
| `/usuarios` | Gerenciar usuários |
| `/produtos` | Gerenciar produtos (requer login) |

## Observações

- O token JWT é salvo automaticamente no `localStorage` após o login
- Rotas protegidas redirecionam para o login se não houver token
- O back-end precisa estar rodando antes de abrir o front
