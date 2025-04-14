
# ✂️ URL Shortener — Fullstack Project with Next.js & NestJS

This project is a modern, full-stack **URL Shortener** built using:

- 🔐 **Backend**: [NestJS](https://nestjs.com/) with PostgreSQL, JWT Auth, and TypeORM
- 💻 **Frontend**: [Next.js 15](https://nextjs.org/) with React 19 and Tailwind CSS
- 🐘 **Database**: PostgreSQL
- 🐳 Fully containerized using Docker & Docker Compose

    
    Should be able to check it [here](https://www.loom.com/share/01709ba10b6344fea1706e78f8808d08?sid=29a6bc62-76af-4f0c-b1b6-af9d679e7f4d)
---

## 🗂️ Project Structure

```plaintext
shortner-nextjs-nestjs/
├── api/               # NestJS Backend
├── ui/                # Next.js Frontend
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started (Manual Setup)

### 🧩 Prerequisites

- Node.js >= 18
- PostgreSQL (local or remote)
- pnpm / npm
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (`npm i -g @nestjs/cli`)

---

### 🔧 Backend (NestJS)

1. **Install dependencies**
   ```bash
   cd api
   npm install
   ```

2. **Set up `.env`**  
   Copy `.env.example` to `.env` and update values as needed:
   ```plaintext
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=urlshortener
   PORT=4000
   JWT_SECRET=your-secret
   ```

3. **Run the app**
   ```bash
   npm run start:dev
   ```

### 💻 Frontend (Next.js)

1. **Install dependencies**
   ```bash
   cd ui
   npm install
   ```

2. **Set up `.env.local`**  
   Example:
   ```plaintext
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

Frontend will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Running with Docker

### 📦 Build & Run

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)
- Postgres: port 5432 exposed

### 🌍 Environment Variables in Docker

- **api/.env** (used by backend service)
  ```plaintext
  DATABASE_HOST=db
  DATABASE_PORT=5432
  DATABASE_USERNAME=postgres
  DATABASE_PASSWORD=postgres
  DATABASE_NAME=urlshortener
  PORT=4000
  JWT_SECRET=my-super-secret
  ```

- **ui/.env.local** (used by frontend service)
  ```plaintext
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```

---

## ✅ Available Scripts

### Backend (NestJS - in `api/`)

- **Start in watch mode**: 
  ```bash
  npm run start:dev
  ```

- **Run unit tests**: 
  ```bash
  npm run test
  ```

- **Build app**: 
  ```bash
  npm run build
  ```

### Frontend (Next.js - in `ui/`)

- **Start dev server**: 
  ```bash
  npm run dev
  ```

- **Production build**: 
  ```bash
  npm run build
  ```

- **Start production server**: 
  ```bash
  npm run start
  ```
