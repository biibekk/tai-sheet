# Tournament Management System (Backend)

This repository contains the **early backend foundation** for a tournament management system designed to manage taekwondo (or similar sports) tournaments.

At this stage, the project focuses on:
- solid **database design**
- **PostgreSQL setup with sample data**
- **Node.js + Express backend initialization**
- **read-only APIs** to validate the data model

No frontend, authentication, or business logic has been implemented yet.

---

## Purpose of This Phase

The goal of the current phase is to:
- validate the database schema
- expose data via simple APIs
- identify schema/query issues early
- build a stable backend foundation before UI or complex logic

This avoids frequent schema changes later when features like matchmaking or payments are added.

---

## Current Status

### Implemented
- PostgreSQL database schema (`schema.sql`)
- Sample dummy data for testing (`testdata.sql`)
- Node.js project initialized using npm
- Express server setup
- PostgreSQL connection using `pg`
- Read-only backend API (GET endpoints)
- Clean separation of routes, controllers, and DB layer
- `.gitignore` configured for environment safety

### Not Implemented Yet
- Write APIs (POST / PUT / DELETE)
- Authentication & authorization
- Role-based access (admin / instructor)
- Frontend UI
- Registration approvals
- Matchmaking logic
- Payments or payment gateway integration

---

## Tech Stack

**Backend**
- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- dotenv

**Other**
- npm
- SQL

---

## Project Structure

```text
backend/
├── controllers/
│   └── tournaments.controller.js
├── routes/
│   └── tournaments.routes.js
├── db/
│   └── pool.js
├── schema.sql
├── testdata.sql
├── index.js
├── package.json
├── package-lock.json
├── .env
└── README.me   
```  


Ignored via `.gitignore`:
- `node_modules/`
- `pgdata/`
- `.env`

---

## Database Setup

1. Create a PostgreSQL database
2. Run the schema:
   ```sql
   \i schema.sql
    ```
3. Load dataset
   ```sql
   \i testdata.sql
   ```