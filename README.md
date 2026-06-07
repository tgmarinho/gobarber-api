# GoBarber API

The backend API for a barbershop scheduling app, built during Rocketseat's GoStack bootcamp (turma 8).

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=flat&logo=yarn&logoColor=white)

## What it does

- User signup and login with JWT authentication.
- Provider accounts that offer services.
- Appointment booking between users and providers.
- A daily schedule view for each provider.
- Notifications for providers when a new appointment is created.
- Cancellation emails sent through a background job queue.
- File uploads for user avatars.

## Stack

- Node.js and Express for the HTTP server.
- Sequelize with PostgreSQL for the main relational data.
- Mongoose with MongoDB for notifications.
- Redis with Bee-Queue for the background job queue.
- JWT for authentication, with bcryptjs for password hashing.
- Yup for request validation.
- Multer for file uploads.
- Nodemailer with Handlebars templates for emails.
- Sentry and Youch for error tracking.

## Run locally

This project uses Yarn.

1. Clone the repository and install the dependencies.

   ```bash
   git clone git@github.com:tgmarinho/gobarber-api.git
   cd gobarber-api
   yarn install
   ```

2. Copy the example environment file and fill in your own values.

   ```bash
   cp .env.example .env
   ```

   You need a PostgreSQL database, a MongoDB instance, and a Redis server running. Set the database, Mongo, Redis, mail, and auth variables in `.env`.

3. Run the database migrations.

   ```bash
   yarn sequelize db:migrate
   ```

4. Start the API server.

   ```bash
   yarn dev
   ```

5. In a separate terminal, start the queue worker that sends emails.

   ```bash
   yarn queue
   ```

The API runs on `http://localhost:3333` by default.

## Companion articles (Portuguese)

- [GoBarber: aplicação backend](https://www.tgmarinho.com/gobarber-aplicacao-backend/)
- [Continuando a API do GoBarber](https://www.tgmarinho.com/continuando-api-do-gobarber/)
