# Tournament Management System (Backend – Initial Setup)

This repository contains the **initial backend foundation** for a tournament management system.  
At the current stage, the project focuses on **database design, PostgreSQL setup, and basic Node.js initialization**.

---

## Current Status

**Initial setup phase**

Implemented so far:
- Node.js project initialized using npm
- PostgreSQL database schema designed (`schema.sql`)
- Sample dummy data added for testing (`testdata.sql`)
- Git repository set up with proper `.gitignore`

Not implemented yet:
- Backend API (Express)
- Authentication
- Frontend
- Business logic (registrations, matchmaking, approvals)

---

## Tech Stack (Current)

- Node.js
- npm
- PostgreSQL
- SQL

---

## Project Structure
.       
├── schema.sql # Database schema           
├── testdata.sql # Dummy data for testing       
├── package.json         
├── package-lock.json       
├── .gitignore         
└── README.md       


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