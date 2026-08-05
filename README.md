# Drachen Forum — MVP

Dieses Branch enthält ein kleines Next.js + Prisma MVP‑Scaffold für ein Forum mit Video‑Upload‑Demo.

Quickstart (lokal):

1. Node-Version >=16 empfohlen
2. npm install
3. cp .env.example .env && edit .env (NEXTAUTH_SECRET setzen)
4. npx prisma generate
5. npx prisma migrate dev --name init
6. npm run dev

Uploads: das Demo speichert hochgeladene Dateien unter /public/uploads.

Deployment: Für Produktion empfehle ich Postgres + S3/MinIO. Es gibt eine docker-compose.yml für lokale MinIO falls gewünscht.
