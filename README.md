# XColor-front

Projeto frontend do XColor, desenvolvido em React com Vite.

## 🚀 Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)

## 🌿 Estratégia de Branches

| Branch | Ambiente | Descrição |
|--------|----------|-----------|
| `dev`  | Desenvolvimento | Branch principal de desenvolvimento. Todas as novas features devem ser criadas a partir desta branch. |
| `test` | Homologação | Branch de testes e validação antes de ir para produção. |
| `prod` | Produção | Branch estável com o código em produção. Merge somente via `test`. |

### Fluxo de trabalho

```
feature/* → dev → test → prod
```

## ⚙️ Variáveis de Ambiente

| Arquivo | Ambiente |
|---------|----------|
| `.env.development` | Desenvolvimento local |
| `.env.test` | Homologação |
| `.env.production` | Produção |

## 🛠️ Como rodar o projeto

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Pré-visualizar o build
npm run preview
```
