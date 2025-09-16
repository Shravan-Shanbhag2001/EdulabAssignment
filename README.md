# EdulabAssignment
Usage / Quick start
1. Create a directory and copy files.
2. npm install
3. Create .env with DB credentials and JWT_SECRET.
4. Run the SQL in create_tables.sql (e.g. mysql -u root -p < create_tables.sql)
5. npm run dev (or npm start)


API Endpoints
- POST /api/auth/register { name, email, password, role? }
- POST /api/auth/login { email, password }
- GET /api/courses?page=1&limit=10 (public)
- GET /api/courses/:id
- POST /api/courses (admin only)
- POST /api/courses/:id/enroll (student only)
- GET /api/users/me/enrollments (authenticated)
