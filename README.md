# Webnovel Platform Scaffold

This repository contains a simple full-stack scaffold for a webnovel platform.
It uses **React** for the frontend and **Node/Express** with **PostgreSQL** for the backend.

## Project Structure

- `backend/` – Express API with Sequelize models.
- `client/` – React SPA using React Router.

## Getting Started

1. **Install dependencies**
   ```bash
   cd backend && npm install
   cd ../client && npm install
   ```
2. **Configure environment**
   - Copy `backend/.env.example` to `backend/.env` and update the database URL and JWT secret.
3. **Run development servers**
   ```bash
   # In one terminal
   cd backend && npm run dev

   # In another terminal
   cd client && npm start
   ```

The React dev server proxies API requests to the Express backend.

### Logo

Place a logo image at `client/logo.png` to appear in the header.

### Browse Page

The homepage lists available fictions and includes a search bar, genre filter,
and sorting by latest update or popularity. Each fiction card links to its full
page.

### Authentication

Use `/api/auth/signup` and `/api/auth/login` to create author accounts and obtain
JWT tokens. Signup automatically assigns the `author` role and returns a token
which can be stored in `localStorage` for authenticated requests.

### Chapters and Comments

Authors can create chapters from a fiction page once logged in. Each chapter page shows the chapter text and a comment thread. Comments are posted to `/api/comments/:chapterId` and fetched from the same endpoint.
