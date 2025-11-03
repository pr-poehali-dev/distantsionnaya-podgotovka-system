-- Создание таблицы для хранения прогресса по адаптивному тесту
CREATE TABLE IF NOT EXISTS adaptive_test_progress (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    correct_streak INTEGER DEFAULT 0,
    is_mastered BOOLEAN DEFAULT FALSE,
    is_in_active_set BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, question_id)
);

-- Создание таблицы для хранения результатов экзаменов
CREATE TABLE IF NOT EXISTS exam_attempts (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    time_spent_seconds INTEGER,
    correct_answers INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 20,
    status VARCHAR(20) CHECK (status IN ('passed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы для детальных ответов на экзамене
CREATE TABLE IF NOT EXISTS exam_answers (
    id SERIAL PRIMARY KEY,
    exam_attempt_id INTEGER NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    selected_answer INTEGER,
    correct_answer INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_adaptive_progress_student_course ON adaptive_test_progress(student_id, course_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_progress_active ON adaptive_test_progress(student_id, course_id, is_in_active_set);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student ON exam_attempts(student_id, course_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_attempt ON exam_answers(exam_attempt_id);