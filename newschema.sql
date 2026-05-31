-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- ENUM TYPES
-- =========================

CREATE TYPE user_role AS ENUM ('ADMIN', 'INSTRUCTOR');

CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'MIXED');

CREATE TYPE tournament_status AS ENUM (
'DRAFT',
'OPEN',
'CLOSED',
'ONGOING',
'COMPLETED'
);

CREATE TYPE payment_mode AS ENUM ('CASH', 'ONLINE');

CREATE TYPE payment_status AS ENUM (
'PENDING',
'SUCCESS',
'FAILED'
);

CREATE TYPE approval_status AS ENUM (
'PENDING',
'APPROVED',
'REJECTED'
);

CREATE TYPE fight_experience AS ENUM (
'FRESHER',
'EXPERIENCED'
);

CREATE TYPE match_status AS ENUM (
'SCHEDULED',
'ONGOING',
'COMPLETED'
);

-- =========================
-- USERS
-- =========================

CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL,
email VARCHAR(150) UNIQUE NOT NULL,
phone VARCHAR(20),
password_hash TEXT NOT NULL,
role user_role NOT NULL,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- DOJOS
-- =========================

CREATE TABLE dojos (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(150) NOT NULL,
city VARCHAR(100),
owner_id UUID REFERENCES users(id),
created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- INSTRUCTORS
-- =========================

CREATE TABLE instructors (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
dojo_id UUID REFERENCES dojos(id),
belt_rank VARCHAR(50),
created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- STUDENTS
-- =========================

CREATE TABLE students (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100),
date_of_birth DATE NOT NULL,
gender gender NOT NULL,
belt VARCHAR(50),
weight DECIMAL(5,2),
fight_experience fight_experience NOT NULL DEFAULT 'FRESHER',
total_fights INT DEFAULT 0,
instructor_id UUID REFERENCES instructors(id),
dojo_id UUID REFERENCES dojos(id),
created_at TIMESTAMP DEFAULT NOW(),
CHECK (
NOT (fight_experience = 'FRESHER' AND total_fights > 0)
)
);

-- =========================
-- TOURNAMENTS
-- =========================

CREATE TABLE tournaments (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(200) NOT NULL,
location VARCHAR(200),
event_date DATE NOT NULL,
registration_deadline DATE,
status tournament_status DEFAULT 'DRAFT',
created_by UUID REFERENCES users(id),
created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- CATEGORIES
-- =========================

CREATE TABLE categories (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
age_min INT,
age_max INT,
belt_min VARCHAR(50),
belt_max VARCHAR(50),
weight_min DECIMAL(5,2),
weight_max DECIMAL(5,2),
gender gender DEFAULT 'MIXED',
allowed_experience fight_experience,
created_at TIMESTAMP DEFAULT NOW(),
UNIQUE (
tournament_id,
age_min, age_max,
belt_min, belt_max,
weight_min, weight_max,
gender
)
);

-- =========================
-- REGISTRATIONS
-- =========================

CREATE TABLE registrations (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES students(id),
tournament_id UUID REFERENCES tournaments(id),
category_id UUID REFERENCES categories(id),
instructor_id UUID REFERENCES instructors(id),
approval_status approval_status DEFAULT 'PENDING',
seed INT, -- for match seeding
remarks TEXT,
created_at TIMESTAMP DEFAULT NOW(),
UNIQUE (student_id, tournament_id)
);

-- =========================
-- PAYMENTS (CLEANED)
-- =========================

CREATE TABLE payments (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
registration_id UUID UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
paid_by VARCHAR(20),
payment_mode payment_mode,
reference_id VARCHAR(100),
amount DECIMAL(8,2),
status payment_status DEFAULT 'PENDING',
created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- MATCHES (UPDATED)
-- =========================

CREATE TABLE matches (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
tournament_id UUID REFERENCES tournaments(id),
category_id UUID REFERENCES categories(id),
round INT,
match_order INT,
next_match_id UUID REFERENCES matches(id), -- bracket progression
winner_id UUID REFERENCES students(id),
status match_status DEFAULT 'SCHEDULED',
is_bye BOOLEAN DEFAULT FALSE,
score JSONB,
created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- MATCH PARTICIPANTS (UPDATED)
-- =========================

CREATE TABLE match_participants (
match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
student_id UUID REFERENCES students(id),
position INT, -- 1 or 2
seed INT,
PRIMARY KEY (match_id, student_id)
);

-- =========================
-- APPROVAL LOGS
-- =========================

CREATE TABLE approval_logs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
registration_id UUID REFERENCES registrations(id),
approved_by UUID REFERENCES users(id),
status approval_status,
comment TEXT,
timestamp TIMESTAMP DEFAULT NOW()
);

-- =========================
-- INDEXES
-- =========================

CREATE INDEX idx_students_instructor ON students(instructor_id);
CREATE INDEX idx_students_dojo ON students(dojo_id);

CREATE INDEX idx_registrations_tournament ON registrations(tournament_id);
CREATE INDEX idx_registrations_instructor ON registrations(instructor_id);
CREATE INDEX idx_registrations_approval ON registrations(approval_status);

CREATE INDEX idx_categories_tournament ON categories(tournament_id);

CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_category ON matches(category_id);

CREATE INDEX idx_payments_status ON payments(status);
