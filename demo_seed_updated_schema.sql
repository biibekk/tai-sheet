-- Demo Seed Data for Updated Tournament Schema
-- Run after creating the schema

-- =========================
-- USERS
-- =========================

('Instructor A','a@test.com','hash','INSTRUCTOR'),
('Instructor B','b@test.com','hash','INSTRUCTOR'),
('Instructor C','c@test.com','hash','INSTRUCTOR'),
('Instructor D','d@test.com','hash','INSTRUCTOR');

-- =========================
-- DOJOS
-- =========================
INSERT INTO dojos (name,city,owner_id)
SELECT dojo_name,city,u.id
FROM (
VALUES
('Tiger TKD','Delhi','a@test.com'),
('Dragon TKD','Delhi','b@test.com'),
('Phoenix TKD','Noida','c@test.com'),
('Warrior TKD','Gurgaon','d@test.com')
) x(dojo_name,city,email)
JOIN users u ON u.email=x.email;

-- =========================
-- INSTRUCTORS
-- =========================
INSERT INTO instructors(user_id,dojo_id,belt_rank)
SELECT u.id,d.id,'BLACK'
FROM users u
JOIN dojos d ON d.owner_id=u.id
WHERE u.role='INSTRUCTOR';

-- =========================
-- STUDENTS
-- =========================
-- INSERT INTO students(
-- first_name,
-- last_name,
-- date_of_birth,
-- gender,
-- current_belt,
-- current_weight,
-- fight_experience,
-- total_fights,
-- dojo_id,
-- instructor_id
-- )
-- SELECT
-- 'Athlete'||gs,
-- 'Test',
-- DATE '2011-01-01'+(gs*25),
-- CASE WHEN gs%4=0 THEN 'FEMALE'::gender ELSE 'MALE'::gender END,
-- CASE
-- WHEN gs%5=0 THEN 'BLACK'
-- WHEN gs%4=0 THEN 'RED'
-- WHEN gs%3=0 THEN 'BLUE'
-- WHEN gs%2=0 THEN 'GREEN'
-- ELSE 'WHITE'
-- END,
-- 35+(gs%30),
-- CASE WHEN gs%3=0 THEN 'FRESHER'::fight_experience ELSE 'EXPERIENCED'::fight_experience END,
-- CASE WHEN gs%3=0 THEN 0 ELSE 1+(gs%10) END,
-- d.id,
-- i.id
-- FROM generate_series(1,48) gs
-- JOIN LATERAL (
-- SELECT * FROM dojos ORDER BY id OFFSET ((gs-1)%4) LIMIT 1
-- )d ON TRUE
-- JOIN LATERAL (
-- SELECT * FROM instructors ORDER BY id OFFSET ((gs-1)%4) LIMIT 1
-- )i ON TRUE;

-- =========================
-- TOURNAMENT
-- =========================
INSERT INTO tournaments(
name,
location,
start_date,
end_date,
registration_deadline,
status,
created_by
)
VALUES(
'Delhi Open 2026',
'Delhi',
'2026-07-01',
'2026-07-02',
'2026-06-20',
'OPEN',
(SELECT id FROM users WHERE email='admin@test.com')
);

-- =========================
-- AGE DIVISIONS
-- =========================
INSERT INTO age_divisions(tournament_id,name,age_min,age_max)
SELECT t.id,x.name,x.age_min,x.age_max
FROM tournaments t
CROSS JOIN (
VALUES
('Kids',8,10),
('Cadet',11,13),
('Junior',14,17)
) x(name,age_min,age_max)
WHERE t.name='Delhi Open 2026';

CREATE TEMP TABLE student_pool AS
SELECT s.*,ROW_NUMBER() OVER(ORDER BY first_name) rn
FROM students s;

-- =========================
-- REGISTRATIONS
-- category_id intentionally NULL
-- =========================
INSERT INTO registrations(
student_id,
tournament_id,
age_division_id,
registered_weight,
registered_belt,
instructor_id,
approval_status,
seed
)
SELECT
sp.id,
t.id,
ad.id,
sp.current_weight,
sp.current_belt,
sp.instructor_id,
'APPROVED',
sp.rn
FROM student_pool sp
JOIN tournaments t ON t.name='Delhi Open 2026'
JOIN age_divisions ad
ON ad.tournament_id=t.id
AND ad.name='Junior'
WHERE sp.rn BETWEEN 1 AND 16;

INSERT INTO registrations(
student_id,tournament_id,age_division_id,
registered_weight,registered_belt,
instructor_id,approval_status
)
SELECT
sp.id,t.id,ad.id,
sp.current_weight,
sp.current_belt,
sp.instructor_id,
'APPROVED'
FROM student_pool sp
JOIN tournaments t ON t.name='Delhi Open 2026'
JOIN age_divisions ad
ON ad.tournament_id=t.id
AND ad.name='Cadet'
WHERE sp.rn BETWEEN 17 AND 32;

INSERT INTO registrations(
student_id,tournament_id,age_division_id,
registered_weight,registered_belt,
instructor_id,approval_status
)
SELECT
sp.id,t.id,ad.id,
sp.current_weight,
sp.current_belt,
sp.instructor_id,
'PENDING'
FROM student_pool sp
JOIN tournaments t ON t.name='Delhi Open 2026'
JOIN age_divisions ad
ON ad.tournament_id=t.id
AND ad.name='Kids'
WHERE sp.rn BETWEEN 33 AND 48;

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO categories(
tournament_id,
age_division_id,
gender,
weight_min,
weight_max,
name
)
SELECT
t.id,
ad.id,
'MALE',
45,48,
'Junior Male 45-48kg'
FROM tournaments t
JOIN age_divisions ad
ON ad.tournament_id=t.id
WHERE t.name='Delhi Open 2026'
AND ad.name='Junior';

INSERT INTO categories(
tournament_id,
age_division_id,
gender,
weight_min,
weight_max,
name
)
SELECT
t.id,
ad.id,
'MALE',
49,52,
'Junior Male 49-52kg'
FROM tournaments t
JOIN age_divisions ad
ON ad.tournament_id=t.id
WHERE t.name='Delhi Open 2026'
AND ad.name='Junior';

INSERT INTO categories(
tournament_id,
age_division_id,
gender,
weight_min,
weight_max,
name
)
SELECT
t.id,
ad.id,
'MALE',
53,60,
'Junior Male 53-60kg'
FROM tournaments t
JOIN age_divisions ad
ON ad.tournament_id=t.id
WHERE t.name='Delhi Open 2026'
AND ad.name='Junior';

-- =========================
-- ASSIGN CATEGORIES
-- =========================
UPDATE registrations r
SET category_id=c.id
FROM categories c
WHERE r.age_division_id=c.age_division_id
AND r.registered_weight BETWEEN c.weight_min AND c.weight_max
AND c.gender=(
SELECT s.gender
FROM students s
WHERE s.id=r.student_id
);

-- =========================
-- PAYMENTS
-- =========================
INSERT INTO payments(
registration_id,
paid_by,
payment_mode,
reference_id,
amount,
status
)
SELECT
id,
'Instructor',
'CASH',
NULL,
1000,
'SUCCESS'
FROM registrations
WHERE approval_status='APPROVED';

-- =========================
-- APPROVAL LOGS
-- =========================
INSERT INTO approval_logs(
registration_id,
approved_by,
status,
comment
)
SELECT
r.id,
u.id,
r.approval_status,
'Seed data'
FROM registrations r
CROSS JOIN (
SELECT id FROM users
WHERE role='ADMIN'
LIMIT 1
) u;
