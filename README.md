<div align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>

  # Movie Seek API
</div>

## 📋 Description

Movie seek api is built with [Nest](https://github.com/nestjs/nest) framework v10, TypeScript v5.1 and Node v20.16.

## 💡 Features

- [Axios](https://www.npmjs.com/package/@nestjs/axios) HttpModule module exposes Axios-based methods to perform HTTP requests.
- [Class-transformer](https://www.npmjs.com/package/class-transformer) to handle with data transformation.
- [Class-validator](https://www.npmjs.com/package/class-validator) data validation.
- [Cross-env](https://www.npmjs.com/package/cross-env) environment variable.
- [Docker-compose](https://docs.docker.com/compose/) to run containerized api.
- [Dotenv](https://www.npmjs.com/package/dotenv) environment variable.
- [Event-emitter](https://www.npmjs.com/package/@nestjs/event-emitter) events module for Nest built on top of the eventemitter2 package.
- [Editor-config](https://editorconfig.org/) general editors settings.
- [Eslint](https://eslint.org/) code lint.
- [Express-basic-auth](https://www.npmjs.com/package/express-basic-auth) basic auth to swagger documentation.
- [Husky](https://typicode.github.io/husky/) settings (pre-commit and commit-msg scripts).
- [Jest](https://jestjs.io/pt-BR/) framework to testing.
- [Lint-staged](https://www.npmjs.com/package/lint-staged?activeTab=readme) to run script in commit time.
- [Pg](https://node-postgres.com/) to handle with postgreSQL database.
- [Prettier](https://prettier.io/) to ensure style and syntax code.
- [Swagger](https://swagger.io/) to build API documentation.
- [Typeorm](https://typeorm.io/) ORM to help on database handling.
- [Vscode](https://code.visualstudio.com/) settings.

## 📋 API Endpoints

### 1. **GET api/v1/movies/re-index**
   - **Descrição:** Indexa novos filmes da API TMDB para a base de dados.

### 2. **GET api/v1/movies**
   - **Descrição:** Retorna uma lista paginada de filmes indexados.
   - **Parâmetros de query:**
     - `page` (opcional): Número da página para paginação.
     - `limit` (opcional): Limite de filmes por página.

### 3. **GET  api/v1/movies/:id/details**
   - **Descrição:** Retorna os detalhes de um filme específico.
   - **Parâmetros de URL:**
     - `id`: ID do filme.

### 4. **GET /api/v1/index-histories**
   - **Descrição:** Retorna uma lista paginada de registros de histórico de indexações.
  - **Parâmetros de query:**
     - `page` (opcional): Número da página para paginação.
     - `limit` (opcional): Limite de filmes por página.

### 5. **GET /api/v1/index-histories/latest**
   - **Descrição:** Retorna o registro de indexação mais atual.


## 🐋 Running the app in container
Turning ON
```bash
docker compose up -d
```

Turning OFF
```bash
docker compose down
```

## 🛠️ Installation locally

```bash
yarn
```

## 🚀 Running the app locally

Development
```bash
yarn start
```

Watch mode
```bash
yarn start:debug
```

Production mode
```bash
yarn start:prod
```

## 💣 Tests

Unit tests
```bash
yarn test
```

Test coverage
```bash
yarn test:cov
```

## ✨ Migrations

Migration create
```bash
yarn migration:create ./src/database/migrations/<fileName>
```

Migration generate
```bash
yarn migration:generate ./src/database/migrations/<fileName>
```

Migration up
```bash
yarn migration:up
```

Migration down
```bash
yarn migration:down
```

## 👨🏽‍💻 Author

[Stefferson Thallys](https://www.linkedin.com/in/stefferson-thallys/)

## 👏🏽 Credits

All credits is to NestJs team that maintain it as an MIT-licensed open source project.</br>
It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## 🧾 License

movie-seek-backend is [MIT licensed](LICENSE).
