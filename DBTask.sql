--1. Top 5 most enrolled courses

SELECT course_id, title, total_enrollments
FROM (
    SELECT 
        c.id AS course_id,
        c.title,
        COUNT(e.id) AS total_enrollments,
        DENSE_RANK() OVER (ORDER BY COUNT(e.id) DESC) AS rnk
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    GROUP BY c.id, c.title
) ranked
WHERE rnk <= 5;

--2. Number of active students in last 30 days
SELECT COUNT(*) AS active_students
FROM users
WHERE role = 'student' 
  AND last_login >= NOW() - INTERVAL 30 DAY;

--3. Indexing Strategies
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
