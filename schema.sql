-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- ENUM TYPES
-- =========================

CREATE TYPE user_role AS ENUM (
    'ADMIN',
    'INSTRUCTOR'
);

CREATE TYPE gender AS ENUM (
    'MALE',
    'FEMALE'
);

CREATE TYPE tournament_status AS ENUM (
    'DRAFT',
    'OPEN',
    'CLOSED',
    'ONGOING',
    'COMPLETED'
);

CREATE TYPE payment_mode AS ENUM (
    'CASH',
    'ONLINE'
);

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
-- Permanent Dojo Student Database
-- =========================

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),

    date_of_birth DATE NOT NULL,

    gender gender NOT NULL,

    current_belt VARCHAR(50),

    current_weight DECIMAL(5,2),

    fight_experience fight_experience DEFAULT 'FRESHER',

    total_fights INT DEFAULT 0,

    instructor_id UUID REFERENCES instructors(id),

    dojo_id UUID REFERENCES dojos(id),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),

    CHECK (
        NOT (
            fight_experience = 'FRESHER'
            AND total_fights > 0
        )
    )
);

-- =========================
-- TOURNAMENTS
-- =========================

CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200) NOT NULL,

    location VARCHAR(200),

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    registration_deadline DATE,

    status tournament_status DEFAULT 'DRAFT',

    created_by UUID REFERENCES users(id),

    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- AGE DIVISIONS
-- Created After Tournament
-- =========================

CREATE TABLE age_divisions (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tournament_id UUID NOT NULL
        REFERENCES tournaments(id)
        ON DELETE CASCADE,

    name VARCHAR(50) NOT NULL,

    age_min INT NOT NULL,

    age_max INT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(tournament_id, name)
);

-- =========================
-- REGISTRATIONS
-- Student Snapshot For Tournament
-- =========================

CREATE TABLE registrations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES students(id),

    tournament_id UUID NOT NULL
        REFERENCES tournaments(id),

    age_division_id UUID
        REFERENCES age_divisions(id),

    category_id UUID,

    registered_weight DECIMAL(5,2),

    registered_belt VARCHAR(50),

    instructor_id UUID
        REFERENCES instructors(id),

    approval_status approval_status
        DEFAULT 'PENDING',

    seed INT,

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, tournament_id)
);

-- =========================
-- CATEGORIES
-- Created After Registration Closes
-- =========================

CREATE TABLE categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tournament_id UUID NOT NULL
        REFERENCES tournaments(id)
        ON DELETE CASCADE,

    age_division_id UUID NOT NULL
        REFERENCES age_divisions(id),

    gender gender NOT NULL,

    weight_min DECIMAL(5,2),

    weight_max DECIMAL(5,2),

    name VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE registrations
ADD CONSTRAINT fk_registration_category
FOREIGN KEY (category_id)
REFERENCES categories(id);

-- =========================
-- PAYMENTS
-- =========================

CREATE TABLE payments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    registration_id UUID UNIQUE
        REFERENCES registrations(id)
        ON DELETE CASCADE,

    paid_by VARCHAR(100),

    payment_mode payment_mode,

    reference_id VARCHAR(100),

    amount DECIMAL(8,2),

    status payment_status
        DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- MATCHES
-- =========================

CREATE TABLE matches (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tournament_id UUID
        REFERENCES tournaments(id),

    category_id UUID
        REFERENCES categories(id),

    round INT,

    match_order INT,

    next_match_id UUID
        REFERENCES matches(id),

    winner_registration_id UUID
        REFERENCES registrations(id),

    status match_status
        DEFAULT 'SCHEDULED',

    is_bye BOOLEAN DEFAULT FALSE,

    score JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================
-- MATCH PARTICIPANTS
-- =========================

CREATE TABLE match_participants (

    match_id UUID
        REFERENCES matches(id)
        ON DELETE CASCADE,

    registration_id UUID
        REFERENCES registrations(id),

    position INT,

    seed INT,

    PRIMARY KEY(match_id, registration_id)
);

-- =========================
-- APPROVAL LOGS
-- =========================

CREATE TABLE approval_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    registration_id UUID
        REFERENCES registrations(id),

    approved_by UUID
        REFERENCES users(id),

    status approval_status,

    comment TEXT,

    timestamp TIMESTAMP DEFAULT NOW()
);

-- =========================
-- INDEXES
-- =========================

CREATE INDEX idx_students_dojo
ON students(dojo_id);

CREATE INDEX idx_students_instructor
ON students(instructor_id);

CREATE INDEX idx_registrations_tournament
ON registrations(tournament_id);

CREATE INDEX idx_registrations_student
ON registrations(student_id);

CREATE INDEX idx_categories_tournament
ON categories(tournament_id);

CREATE INDEX idx_categories_age_division
ON categories(age_division_id);

CREATE INDEX idx_matches_tournament
ON matches(tournament_id);

CREATE INDEX idx_matches_category
ON matches(category_id);

CREATE INDEX idx_matches_next_match
ON matches(next_match_id);