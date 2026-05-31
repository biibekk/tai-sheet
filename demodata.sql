-- ADMIN + INSTRUCTORS
INSERT INTO users (
  name,
  email,
  password_hash,
  role
)
VALUES
('Admin','admin@test.com','hash','ADMIN'),

('Instructor A','a@test.com','hash','INSTRUCTOR'),
('Instructor B','b@test.com','hash','INSTRUCTOR'),
('Instructor C','c@test.com','hash','INSTRUCTOR'),
('Instructor D','d@test.com','hash','INSTRUCTOR');


-- DOJOS
INSERT INTO dojos (
  name,
  city,
  owner_id
)
SELECT
  dojo_name,
  city,
  u.id
FROM (
  VALUES
  ('Tiger TKD','Delhi','a@test.com'),
  ('Dragon TKD','Delhi','b@test.com'),
  ('Phoenix TKD','Noida','c@test.com'),
  ('Warrior TKD','Gurgaon','d@test.com')
) x(dojo_name,city,email)
JOIN users u
ON u.email = x.email;


-- INSTRUCTOS
INSERT INTO instructors (
  user_id,
  dojo_id,
  belt_rank
)
SELECT
  u.id,
  d.id,
  'BLACK'
FROM users u
JOIN dojos d
ON d.owner_id = u.id
WHERE u.role = 'INSTRUCTOR';

-- Instructor A -> Tiger TKD
-- Instructor B -> Dragon TKD
-- Instructor C -> Phoenix TKD
-- Instructor D -> Warrior TKD


-- TOURNAMENTS
INSERT INTO tournaments (
  name,
  location,
  start_date,
  end_date,
  registration_deadline,
  status,
  created_by
)
VALUES (
  'Delhi Open 2026',
  'Delhi',
  '2026-07-01',
  '2026-07-02',
  '2026-06-20',
  'OPEN',
  (SELECT id FROM users WHERE email='admin@test.com')
);

-- CATEGORIES
INSERT INTO categories (
  tournament_id,
  age_min,
  age_max,
  belt_min,
  belt_max,
  weight_min,
  weight_max,
  gender,
  allowed_experience
)
SELECT
  t.id,
  age_min,
  age_max,
  belt_min,
  belt_max,
  weight_min,
  weight_max,
  gender::gender,
  experience::fight_experience
FROM tournaments t,
(
VALUES

(8,10,'WHITE','GREEN',25,35,'MALE','FRESHER'),
(8,10,'WHITE','GREEN',25,35,'FEMALE','FRESHER'),

(11,13,'GREEN','BLUE',35,45,'MALE','EXPERIENCED'),
(11,13,'GREEN','BLUE',35,45,'FEMALE','EXPERIENCED'),

(14,17,'BLUE','BLACK',45,60,'MALE','EXPERIENCED'),
(14,17,'BLUE','BLACK',45,60,'FEMALE','EXPERIENCED')

) c(
age_min,
age_max,
belt_min,
belt_max,
weight_min,
weight_max,
gender,
experience
)
WHERE t.name='Delhi Open 2026';


-- STUDENTS
INSERT INTO students (
  first_name,
  last_name,
  date_of_birth,
  gender,
  belt,
  weight,
  fight_experience,
  total_fights,
  dojo_id,
  instructor_id
)
SELECT
  'Athlete'||gs,
  'Test',

  DATE '2012-01-01' + (gs * 20),

  CASE
    WHEN gs % 4 = 0 THEN 'FEMALE'::gender
    ELSE 'MALE'::gender
  END,

  CASE
    WHEN gs % 5 = 0 THEN 'BLACK'
    WHEN gs % 4 = 0 THEN 'RED'
    WHEN gs % 3 = 0 THEN 'BLUE'
    WHEN gs % 2 = 0 THEN 'GREEN'
    ELSE 'WHITE'
  END,

  25 + (gs % 30),

  CASE
    WHEN gs % 3 = 0
    THEN 'FRESHER'::fight_experience
    ELSE 'EXPERIENCED'::fight_experience
  END,

  CASE
    WHEN gs % 3 = 0
    THEN 0
    ELSE 1 + (gs % 15)
  END,

  d.id,
  i.id

FROM generate_series(1,48) gs

JOIN LATERAL (
  SELECT *
  FROM dojos
  ORDER BY id
  OFFSET ((gs-1)%4)
  LIMIT 1
) d ON TRUE

JOIN LATERAL (
  SELECT *
  FROM instructors
  ORDER BY id
  OFFSET ((gs-1)%4)
  LIMIT 1
) i ON TRUE;


CREATE TEMP TABLE student_pool AS
SELECT
  s.*,
  ROW_NUMBER() OVER (ORDER BY s.first_name) rn
FROM students s;


-- REGISTRATIONS
-- 16 PLAYER BRACKET CATEGORY
INSERT INTO registrations (
  student_id,
  tournament_id,
  category_id,
  instructor_id,
  approval_status,
  seed
)
SELECT
  sp.id,
  t.id,
  c.id,
  sp.instructor_id,
  'APPROVED',
  sp.rn
FROM student_pool sp
CROSS JOIN tournaments t
JOIN categories c
ON c.tournament_id=t.id
WHERE t.name='Delhi Open 2026'
AND c.age_min=14
AND c.gender='MALE'
AND sp.rn BETWEEN 1 AND 16;


-- 8 PLAYER BRACKET CATEGORY
INSERT INTO registrations (
  student_id,
  tournament_id,
  category_id,
  instructor_id,
  approval_status
)
SELECT
  sp.id,
  t.id,
  c.id,
  sp.instructor_id,
  'APPROVED'
FROM student_pool sp
CROSS JOIN tournaments t
JOIN categories c
ON c.tournament_id=t.id
WHERE t.name='Delhi Open 2026'
AND c.age_min=14
AND c.gender='FEMALE'
AND sp.rn BETWEEN 17 AND 24;


-- 5 PLAYER BRACKET CATEGORY
INSERT INTO registrations (
  student_id,
  tournament_id,
  category_id,
  instructor_id,
  approval_status
)
SELECT
  sp.id,
  t.id,
  c.id,
  sp.instructor_id,
  'APPROVED'
FROM student_pool sp
CROSS JOIN tournaments t
JOIN categories c
ON c.tournament_id=t.id
WHERE t.name='Delhi Open 2026'
AND c.age_min=11
AND c.gender='MALE'
AND sp.rn BETWEEN 25 AND 29;

-- 3 PLAYER BRACKET CATEGORY
INSERT INTO registrations (
  student_id,
  tournament_id,
  category_id,
  instructor_id,
  approval_status
)
SELECT
  sp.id,
  t.id,
  c.id,
  sp.instructor_id,
  'APPROVED'
FROM student_pool sp
CROSS JOIN tournaments t
JOIN categories c
ON c.tournament_id=t.id
WHERE t.name='Delhi Open 2026'
AND c.age_min=8
AND c.gender='MALE'
AND sp.rn BETWEEN 30 AND 32;

-- 2 PLAYER BRACKET CATEGORY
INSERT INTO registrations (
  student_id,
  tournament_id,
  category_id,
  instructor_id,
  approval_status
)
SELECT
  sp.id,
  t.id,
  c.id,
  sp.instructor_id,
  'APPROVED'
FROM student_pool sp
CROSS JOIN tournaments t
JOIN categories c
ON c.tournament_id=t.id
WHERE t.name='Delhi Open 2026'
AND c.age_min=8
AND c.gender='FEMALE'
AND sp.rn BETWEEN 33 AND 34;



-- PENDING REGISTRATIONS
INSERT INTO registrations (
  student_id,
  tournament_id,
  category_id,
  instructor_id,
  approval_status
)
SELECT
  sp.id,
  t.id,
  c.id,
  sp.instructor_id,
  'PENDING'
FROM student_pool sp
CROSS JOIN tournaments t
JOIN categories c
ON c.tournament_id = t.id
WHERE t.name='Delhi Open 2026'
AND c.age_min = 11
AND c.gender = 'MALE'
AND sp.rn BETWEEN 35 AND 42;

-- REJECTED REGISTRATIONS
INSERT INTO registrations (
  student_id,
  tournament_id,
  category_id,
  instructor_id,
  approval_status
)
SELECT
  sp.id,
  t.id,
  c.id,
  sp.instructor_id,
  'REJECTED'
FROM student_pool sp
CROSS JOIN tournaments t
JOIN categories c
ON c.tournament_id = t.id
WHERE t.name='Delhi Open 2026'
AND c.age_min = 11
AND c.gender = 'FEMALE'
AND sp.rn BETWEEN 43 AND 48;