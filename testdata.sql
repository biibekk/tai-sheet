-- Create an ADMIN user

INSERT INTO users (name, email, phone, password_hash, role)
VALUES ('Admin User', 'admin@taekwondo.com', '9999999999', 'hashed_password', 'ADMIN');

-- Create an INSTRUCTOR user
INSERT INTO users (name, email, phone, password_hash, role)
VALUES ('Instructor One', 'inst1@dojo.com', '8888888888', 'hashed_password', 'INSTRUCTOR');


-- Create a DOJO
INSERT INTO dojos (name, city, owner_id)
SELECT 'Elite Taekwondo Academy', 'Delhi', id
FROM users
WHERE email = 'inst1@dojo.com';

-- Create INSTRUCTOR profile
INSERT INTO instructors (user_id, dojo_id, belt_rank)
SELECT u.id, d.id, '4th Dan'
FROM users u
JOIN dojos d ON d.owner_id = u.id
WHERE u.email = 'inst1@dojo.com';

-- Create a STUDENT (Fresher)
INSERT INTO students (
  first_name,
  last_name,
  date_of_birth,
  gender,
  belt,
  weight,
  fight_experience,
  instructor_id,
  dojo_id
)
SELECT
  'Aarav',
  'Sharma',
  '2012-05-15',
  'MALE',
  'Yellow',
  35.5,
  'FRESHER',
  i.id,
  d.id
FROM instructors i
JOIN dojos d ON i.dojo_id = d.id;


-- Create a TOURNAMENT
INSERT INTO tournaments (
  name,
  location,
  event_date,
  registration_deadline,
  status,
  created_by
)
SELECT
  'Delhi State Taekwondo Championship',
  'Talkatora Stadium',
  '2026-03-20',
  '2026-03-01',
  'OPEN',
  id
FROM users
WHERE role = 'ADMIN';


-- Create a CATEGORY (Fresher)
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
  12,
  14,
  'Yellow',
  'Green',
  30,
  40,
  'MALE',
  'FRESHER'
FROM tournaments t;


-- Register STUDENT in tournament
INSERT INTO registrations (
  student_id,
  tournament_id,
  category_id,
  instructor_id,
  payment_mode,
  amount
)
SELECT
  s.id,
  t.id,
  c.id,
  i.id,
  'CASH',
  1200
FROM students s
JOIN instructors i ON s.instructor_id = i.id
JOIN tournaments t ON t.status = 'OPEN'
JOIN categories c ON c.allowed_experience = 'FRESHER';



-- SELECT * FROM students;

-- SELECT
--   s.first_name,
--   s.belt,
--   s.fight_experience,
--   t.name AS tournament,
--   r.payment_status,
--   r.approval_status
-- FROM registrations r
-- JOIN students s ON r.student_id = s.id
-- JOIN tournaments t ON r.tournament_id = t.id;

