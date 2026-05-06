-- Tuition Management System - Complete Schema with Sample Data
-- For MySQL (tuition_malee)
-- Generated: 2026-05-05T15:27:54.059Z
-- This version includes sample data for testing on Hostinger

SET FOREIGN_KEY_CHECKS=0;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
  grade VARCHAR(50),
  phone VARCHAR(20),
  profile_picture VARCHAR(500),
  tuition_class VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  current_session_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  title VARCHAR(255),
  grade VARCHAR(50),
  subject VARCHAR(100),
  day VARCHAR(50),
  time VARCHAR(50),
  fee INT,
  description TEXT,
  location VARCHAR(255),
  teacher_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Class Students Table
CREATE TABLE IF NOT EXISTS class_students (
  id VARCHAR(255) PRIMARY KEY,
  class_id VARCHAR(255) NOT NULL,
  student_id VARCHAR(255) NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE KEY unique_class_student (class_id, student_id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(255) PRIMARY KEY,
  payer_id VARCHAR(255),
  payer_name VARCHAR(255),
  class_id VARCHAR(255),
  amount INT,
  month INT,
  year INT,
  status VARCHAR(50) DEFAULT 'pending',
  gateway VARCHAR(50) DEFAULT 'manual',
  reference_id VARCHAR(255),
  paid_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  receipt_url VARCHAR(500),
  receipt_public_id VARCHAR(255),
  receipt_uploaded_at DATETIME,
  approved_by VARCHAR(255),
  approval_status VARCHAR(50) DEFAULT 'pending',
  approval_notes TEXT,
  FOREIGN KEY (payer_id) REFERENCES users(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  video_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  thumbnail_public_id VARCHAR(255),
  grade VARCHAR(50),
  subject VARCHAR(100),
  class_id VARCHAR(255),
  uploaded_by VARCHAR(255),
  views INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  class_id VARCHAR(255),
  file_url VARCHAR(500),
  file_type VARCHAR(50),
  uploaded_by VARCHAR(255),
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(255) PRIMARY KEY,
  class_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME,
  attachment_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(255) PRIMARY KEY,
  assignment_id VARCHAR(255) NOT NULL,
  student_id VARCHAR(255) NOT NULL,
  file_url VARCHAR(500),
  remarks TEXT,
  marks INT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  UNIQUE KEY unique_submission (assignment_id, student_id)
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(255) PRIMARY KEY,
  class_id VARCHAR(255),
  title VARCHAR(255),
  content TEXT,
  message TEXT,
  created_by VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  related_payment_id VARCHAR(255),
  read TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  KEY idx_notifications_user (user_id),
  KEY idx_notifications_read (user_id, read)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_students_class ON class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON class_students(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_payer ON payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_class ON payments(class_id);
CREATE INDEX IF NOT EXISTS idx_videos_class ON videos(class_id);
CREATE INDEX IF NOT EXISTS idx_notes_class ON notes(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_announcements_class ON announcements(class_id);

SET FOREIGN_KEY_CHECKS=0;

-- ==================== SAMPLE DATA ====================

-- ✅ Sample Users (Admin, Teachers, Students)
INSERT INTO users (id, name, email, password_hash, role, grade, phone, status, created_at) VALUES
('user-admin-001', 'Admin User', 'admin@tuitionsir.com', '$2b$10$admin', 'admin', NULL, '0771234567', 'active', NOW()),
('user-teacher-001', 'Mr. Silva', 'silva@tuitionsir.com', '$2b$10$teacher', 'teacher', NULL, '0771234568', 'active', NOW()),
('user-teacher-002', 'Ms. Perera', 'perera@tuitionsir.com', '$2b$10$teacher', 'teacher', NULL, '0771234569', 'active', NOW()),
('user-student-001', 'Anusha Kumari', 'anusha@student.com', '$2b$10$student', 'student', '10', '0771234570', 'active', NOW()),
('user-student-002', 'Kasun Wijesinghe', 'kasun@student.com', '$2b$10$student', 'student', '9', '0771234571', 'active', NOW()),
('user-student-003', 'Mithila Jayarathne', 'mithila@student.com', '$2b$10$student', 'student', '11', '0771234572', 'active', NOW()),
('user-student-004', 'Dilshan Perera', 'dilshan@student.com', '$2b$10$student', 'student', '8', '0771234573', 'active', NOW()),
('user-student-005', 'Tharushi Silva', 'tharushi@student.com', '$2b$10$student', 'student', '10', '0771234574', 'active', NOW());

-- ✅ Sample Classes
INSERT INTO classes (id, name, title, grade, subject, day, time, fee, description, location, teacher_id, created_at) VALUES
('class-001', 'Grade 10 Science', 'Grade 10 Science - Prebhashi', '10', 'Science', 'Tuesday', '4:00pm-7:00pm', 1500, 'Physics, Chemistry, Biology for Grade 10', 'Prebhashi - Hettipola', 'user-teacher-001', NOW()),
('class-002', 'Grade 9 Science', 'Grade 9 Science - Focus', '9', 'Science', 'Friday', '4:00pm-7:00pm', 1200, 'Science fundamentals for Grade 9', 'Focus - Hadungamuwa', 'user-teacher-002', NOW()),
('class-003', 'Grade 11 Science', 'Grade 11 Science - Prebhashi', '11', 'Science', 'Monday', '5:00pm-8:00pm', 2000, 'Advanced Science for Grade 11', 'Prebhashi - Hettipola', 'user-teacher-001', NOW());

-- ✅ Sample Class Enrollments
INSERT INTO class_students (id, class_id, student_id, joined_at) VALUES
('enrollment-001', 'class-001', 'user-student-001', NOW()),
('enrollment-002', 'class-001', 'user-student-005', NOW()),
('enrollment-003', 'class-002', 'user-student-002', NOW()),
('enrollment-004', 'class-002', 'user-student-004', NOW()),
('enrollment-005', 'class-003', 'user-student-003', NOW());

-- ✅ Sample Payments
INSERT INTO payments (id, payer_id, payer_name, class_id, amount, month, year, status, gateway, approval_status, created_at) VALUES
('payment-001', 'user-student-001', 'Anusha Kumari', 'class-001', 1500, 5, 2026, 'completed', 'manual', 'approved', '2026-05-01'),
('payment-002', 'user-student-005', 'Tharushi Silva', 'class-001', 1500, 5, 2026, 'pending', 'manual', 'pending', NOW()),
('payment-003', 'user-student-002', 'Kasun Wijesinghe', 'class-002', 1200, 5, 2026, 'pending', 'manual', 'pending', NOW()),
('payment-004', 'user-student-003', 'Mithila Jayarathne', 'class-003', 2000, 4, 2026, 'completed', 'manual', 'approved', '2026-04-15'),
('payment-005', 'user-student-001', 'Anusha Kumari', 'class-001', 1500, 4, 2026, 'completed', 'manual', 'approved', '2026-04-10');

-- ✅ Sample Videos
INSERT INTO videos (id, title, description, video_url, thumbnail_url, grade, subject, class_id, uploaded_by, views, created_at) VALUES
('video-001', 'Photosynthesis Process', 'Detailed explanation of photosynthesis in plants', 'https://example.com/video1.mp4', 'https://example.com/thumb1.jpg', '10', 'Science', 'class-001', 'user-teacher-001', 245, NOW()),
('video-002', 'Atomic Structure', 'Understanding atoms and their components', 'https://example.com/video2.mp4', 'https://example.com/thumb2.jpg', '9', 'Science', 'class-002', 'user-teacher-002', 180, NOW()),
('video-003', 'Quantum Mechanics Basics', 'Introduction to quantum physics', 'https://example.com/video3.mp4', 'https://example.com/thumb3.jpg', '11', 'Science', 'class-003', 'user-teacher-001', 320, NOW());

-- ✅ Sample Notes
INSERT INTO notes (id, title, class_id, file_url, file_type, uploaded_by, created_at) VALUES
('note-001', 'Chapter 3 - Cells', 'class-001', 'https://example.com/note1.pdf', 'pdf', 'user-teacher-001', NOW()),
('note-002', 'Matter and Energy', 'class-002', 'https://example.com/note2.pdf', 'pdf', 'user-teacher-002', NOW()),
('note-003', 'Relativity Summary', 'class-003', 'https://example.com/note3.pdf', 'pdf', 'user-teacher-001', NOW());

-- ✅ Sample Assignments
INSERT INTO assignments (id, class_id, title, description, due_date, created_at) VALUES
('assignment-001', 'class-001', 'Chapter 3 Exercise', 'Complete questions 1-20 from Chapter 3', '2026-05-10 23:59:59', NOW()),
('assignment-002', 'class-002', 'Atomic Theory Project', 'Research and present atomic models', '2026-05-12 23:59:59', NOW()),
('assignment-003', 'class-003', 'Physics Problem Set', 'Advanced problems on relativity', '2026-05-15 23:59:59', NOW());

-- ✅ Sample Submissions
INSERT INTO submissions (id, assignment_id, student_id, file_url, remarks, marks, submitted_at) VALUES
('submission-001', 'assignment-001', 'user-student-001', 'https://example.com/submission1.pdf', 'Good work!', 18, NOW()),
('submission-002', 'assignment-001', 'user-student-005', 'https://example.com/submission2.pdf', 'Needs improvement', 14, NOW()),
('submission-003', 'assignment-002', 'user-student-002', 'https://example.com/submission3.pdf', 'Excellent project', 20, NOW());

-- ✅ Sample Announcements
INSERT INTO announcements (id, class_id, title, content, created_by, created_at) VALUES
('announcement-001', 'class-001', 'Monthly Test Scheduled', 'Monthly science test will be held on May 20, 2026', 'user-teacher-001', NOW()),
('announcement-002', 'class-002', 'Study Materials Available', 'New study materials uploaded to course', 'user-teacher-002', NOW()),
('announcement-003', 'class-003', 'Exam Postponed', 'Final exam has been rescheduled to May 30', 'user-teacher-001', NOW());

-- ✅ Sample Notifications
INSERT INTO notifications (id, user_id, type, message, read, created_at) VALUES
('notif-001', 'user-student-001', 'payment_approved', 'Your payment has been approved!', 1, NOW()),
('notif-002', 'user-student-002', 'assignment_due', 'Assignment due: Chapter 3 Exercise in 2 days', 0, NOW()),
('notif-003', 'user-student-003', 'announcement', 'New announcement from your teacher', 0, NOW());

SET FOREIGN_KEY_CHECKS=1;

-- ✅ Database with sample data ready for Hostinger!
