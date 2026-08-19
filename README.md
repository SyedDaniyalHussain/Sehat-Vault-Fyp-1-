# Sehat Vault — React + Express + MySQL

This version uses **MySQL/SQL instead of MongoDB/Mongoose**.

## Database tables

- `users` — account + patient information
- `reports` — uploaded medical report metadata
- `shares` — secure share links, PIN hash, expiry and revoke time
- `share_reports` — many-to-many relation between shares and reports

## Setup

1. Install Node.js 20+.
2. Install MySQL Server (or XAMPP and start MySQL).
3. Open MySQL/phpMyAdmin and run `server/schema.sql`.
4. Copy `server/.env.example` to `server/.env`.
5. Put your MySQL credentials in `.env`:
   - `DB_HOST=127.0.0.1`
   - `DB_PORT=3306`
   - `DB_USER=root`
   - `DB_PASSWORD=`
   - `DB_NAME=sehat_vault`
6. From the project root run:
   `npm install`
7. Run:
   `npm run install-all`
8. Start the app:
   `npm run dev`

Frontend: http://localhost:5173  
Backend: http://localhost:5001/api

## Important

No MongoDB is required by this version. The backend uses `mysql2` and normal SQL queries.

Uploaded files are still stored on the server filesystem; MySQL stores their metadata and paths.
