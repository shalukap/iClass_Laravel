-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2025 at 04:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iclass_laravel`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `cid` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `grade` tinyint(4) NOT NULL CHECK (`grade` between 1 and 13),
  `classroom_id` varchar(10) DEFAULT NULL,
  `lid` varchar(10) DEFAULT NULL,
  `fee` decimal(10,2) DEFAULT 2000.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `medium` enum('english','sinhala','tamil') NOT NULL DEFAULT 'english',
  `syllabus` enum('local','london') NOT NULL DEFAULT 'local'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`cid`, `name`, `time_start`, `time_end`, `grade`, `classroom_id`, `lid`, `fee`, `created_at`, `updated_at`, `medium`, `syllabus`) VALUES
('CLS000001', 'Haircut m', '14:00:00', '16:00:00', 3, 'CR000001', 'LEC000001', 2000.00, '2025-07-27 10:01:37', '2025-07-28 09:39:56', 'english', 'local'),
('CLS000002', 'bea', '02:00:00', '03:00:00', 1, 'CR000001', 'LEC000001', 2000.00, '2025-07-28 09:34:10', '2025-07-28 09:34:10', 'english', 'local'),
('CLS000003', 'mt', '16:00:00', '18:00:00', 1, 'CR000001', 'LEC000001', 2000.00, '2025-08-03 01:48:47', '2025-08-08 00:59:39', 'sinhala', 'local'),
('CLS000004', 'jbhgfb', '10:00:00', '12:00:00', 1, 'CR000001', 'LEC000001', 2000.00, '2025-08-08 04:02:38', '2025-08-08 04:02:38', 'sinhala', 'local'),
('CLS000005', 'nim', '14:00:00', '17:41:00', 4, 'CR000001', 'LEC000001', 2000.00, '2025-08-08 04:41:30', '2025-08-08 04:43:14', 'sinhala', 'local'),
('CLS000006', 'Chemestry 12', '16:47:00', '18:47:00', 12, 'CR000001', 'LEC000002', 2000.00, '2025-08-08 04:47:45', '2025-08-08 04:47:45', 'sinhala', 'local');

-- --------------------------------------------------------

--
-- Table structure for table `classrooms`
--

CREATE TABLE `classrooms` (
  `classroomId` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classrooms`
--

INSERT INTO `classrooms` (`classroomId`, `name`, `created_at`, `updated_at`) VALUES
('CR000001', 'Com 2', '2025-07-27 09:34:05', '2025-07-27 09:34:12');

-- --------------------------------------------------------

--
-- Table structure for table `class_student`
--

CREATE TABLE `class_student` (
  `sid` varchar(25) NOT NULL,
  `cid` varchar(25) NOT NULL,
  `due_amount` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class_student`
--

INSERT INTO `class_student` (`sid`, `cid`, `due_amount`, `created_at`, `updated_at`) VALUES
('STU000001', 'CLS000001', 2000.00, '2025-08-03 01:59:36', '2025-08-03 01:59:36'),
('STU000001', 'CLS000002', 2000.00, '2025-08-03 02:04:46', '2025-08-03 02:04:46'),
('STU000001', 'CLS000003', 2000.00, '2025-08-04 09:50:04', '2025-08-04 09:50:04'),
('STU000002', 'CLS000001', 2000.00, '2025-08-04 09:51:35', '2025-08-04 09:51:35'),
('STU000004', 'CLS000006', 2000.00, '2025-08-08 04:48:27', '2025-08-08 04:48:27');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lectures`
--

CREATE TABLE `lectures` (
  `lid` varchar(10) NOT NULL,
  `lec_name` varchar(100) NOT NULL,
  `lec_address` varchar(255) NOT NULL,
  `lec_dob` date NOT NULL,
  `qualification` varchar(100) NOT NULL,
  `tp_no` varchar(15) NOT NULL,
  `whatsapp_no` varchar(15) NOT NULL,
  `lec_email` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_employed` tinyint(1) DEFAULT 0,
  `bank_account` varchar(20) DEFAULT NULL,
  `bank_name` varchar(50) DEFAULT NULL,
  `bank_branch` varchar(50) DEFAULT NULL,
  `vehicle_no` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lectures`
--

INSERT INTO `lectures` (`lid`, `lec_name`, `lec_address`, `lec_dob`, `qualification`, `tp_no`, `whatsapp_no`, `lec_email`, `status`, `created_at`, `updated_at`, `is_employed`, `bank_account`, `bank_name`, `bank_branch`, `vehicle_no`) VALUES
('LEC000001', 'Nimal', 'Malabe', '2025-07-28', 'BSC', '0743690781', '9876', 'dkvnnd@hmnk.fv', 1, '2025-07-27 08:18:24', '2025-08-08 01:23:29', 1, '2345', 'fgbg', 'gdbg', '456'),
('LEC000002', 'Amal', 'Seeduwa', '1990-07-27', 'BSC', '0987654321', '0987654321', 'amal@gmail.com', 1, '2025-08-08 04:47:01', '2025-08-08 04:47:01', 1, '12345678', 'BOC', 'Seeduwa', '2345');

-- --------------------------------------------------------

--
-- Table structure for table `lecture_class`
--

CREATE TABLE `lecture_class` (
  `lid` varchar(10) NOT NULL,
  `cid` varchar(10) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lecture_class`
--

INSERT INTO `lecture_class` (`lid`, `cid`, `created_at`, `updated_at`) VALUES
('LEC000001', 'CLS000001', '2025-08-08 10:06:28', '2025-08-08 10:06:28'),
('LEC000001', 'CLS000002', '2025-08-08 10:06:28', '2025-08-08 10:06:28'),
('LEC000001', 'CLS000005', NULL, NULL),
('LEC000002', 'CLS000006', '2025-08-08 04:47:45', '2025-08-08 04:47:45');

-- --------------------------------------------------------

--
-- Table structure for table `lecture_payments`
--

CREATE TABLE `lecture_payments` (
  `lpid` varchar(10) NOT NULL,
  `lid` varchar(10) NOT NULL,
  `cid` varchar(10) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lecture_payments`
--

INSERT INTO `lecture_payments` (`lpid`, `lid`, `cid`, `year`, `month`, `amount`, `payment_date`, `created_at`, `updated_at`) VALUES
('LPY000001', 'LEC000001', 'CLS000001', 2025, 8, 1000.00, '2025-08-08', '2025-08-08 03:14:51', '2025-08-08 03:14:51'),
('LPY000002', 'LEC000002', 'CLS000006', 2025, 8, 750.00, '2025-08-08', '2025-08-08 04:51:34', '2025-08-08 04:51:34');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_07_27_060303_create_schools_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `schoolId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`schoolId`, `name`, `created_at`, `updated_at`) VALUES
('SCH000001', 'AMC 2', '2025-07-27 01:28:53', '2025-07-27 01:43:21');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('EpU5xBN1s7fsfwIuQctfMAcbiGs67ngnBumPkB34', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWGE1QXh3OVdqelFZdXdrV0dRZnJTSzdEaGhCU2J0ZDZjelh2TXFGdSI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo1OToiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2xlY3R1cmUtcGF5bWVudHMvc2VhcmNoP2xpZD1MRUMwMDAwMDIiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1754926853),
('ooF0smyw2LTRfavGp18Mi2QBwpzLXpE2I8nH8KKV', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoidUFRUkZaWHJqOVVFUmJLQ2JOeVg0WHFnRTlXQ0lCeGp6SE5GeVJlNCI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czozMDoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3N0dWRlbnRzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1754649064),
('TglqU9kNv0FJ5L9zuj9rdQP3E7vbne9NGlX0dqde', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoieWhzVlpIb3VrMGtrRndHWThRNDJqaXhZdE9nc1pYMWRoWjRhTzdkcSI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czozODoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2xlY3R1cmUtcGF5bWVudHMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1755249988);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `sid` varchar(25) NOT NULL,
  `sname` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `address` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `schoolId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentName` varchar(255) NOT NULL,
  `tpNo` varchar(255) NOT NULL,
  `watsapp` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`sid`, `sname`, `image`, `gender`, `address`, `dob`, `schoolId`, `parentName`, `tpNo`, `watsapp`, `isActive`, `created_at`, `updated_at`) VALUES
('STU000001', 'Annes', 'default.jpg', 'male', 'Negombo', '2006-07-03', 'SCH000001', 'Nimal', '0774443216', '0773857751', 1, '2025-07-27 01:30:44', '2025-08-07 10:48:38'),
('STU000002', 'Ramani', 'default.jpg', 'female', 'Polhena', '2008-02-08', NULL, 'lesara', '0762223456', '0775558899', 1, '2025-08-03 01:37:05', '2025-08-07 23:24:11'),
('STU000004', 'Amaya', 'default.jpg', 'male', '456 Palm Street 2', '2025-08-24', 'SCH000001', 'jknk', '234', '13', 1, '2025-08-07 11:01:09', '2025-08-08 04:48:07'),
('STU000005', 'wdfc', 'default.jpg', 'female', 'edsv', '2008-02-12', NULL, 'Unknown Parent', '234', '123', 1, '2025-08-08 00:24:10', '2025-08-08 00:24:10'),
('STU000006', '213decc', 'default.jpg', 'female', 'cec', '2025-07-28', 'SCH000001', 'wckm', '1234', '345', 1, '2025-08-08 00:37:17', '2025-08-08 00:37:17');

-- --------------------------------------------------------

--
-- Table structure for table `student_payments`
--

CREATE TABLE `student_payments` (
  `pid` varchar(10) NOT NULL,
  `sid` varchar(25) NOT NULL,
  `cid` varchar(10) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL CHECK (`month` between 1 and 12),
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_payments`
--

INSERT INTO `student_payments` (`pid`, `sid`, `cid`, `year`, `month`, `amount`, `payment_date`, `created_at`, `updated_at`) VALUES
('PAY000001', 'STU000001', 'CLS000001', 2025, 8, 2000.00, '2025-08-03', '2025-08-03 02:17:27', '2025-08-03 02:17:27'),
('PAY000002', 'STU000002', 'CLS000001', 2025, 8, 2000.00, '2025-08-04', '2025-08-04 09:52:09', '2025-08-04 09:52:09'),
('PAY000003', 'STU000004', 'CLS000006', 2025, 8, 1000.00, '2025-08-08', '2025-08-08 04:49:38', '2025-08-08 04:49:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Shaluka', 'shaluka@gmail.com', NULL, '$2y$12$zWwizI3VCtDqFXSToeVQdOQHLrFa6R72EgJHcZUme4SpwO3fXByZK', 'TfQ6SeO1RH1P3gaCSddOMBGBB92ZVdtAnyVWeI46vH5x9clJeiCvjskzn3ep', '2025-07-27 00:36:13', '2025-07-27 00:36:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`cid`),
  ADD KEY `classroom_id` (`classroom_id`),
  ADD KEY `lid` (`lid`);

--
-- Indexes for table `classrooms`
--
ALTER TABLE `classrooms`
  ADD PRIMARY KEY (`classroomId`);

--
-- Indexes for table `class_student`
--
ALTER TABLE `class_student`
  ADD PRIMARY KEY (`sid`,`cid`),
  ADD KEY `cid` (`cid`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lectures`
--
ALTER TABLE `lectures`
  ADD PRIMARY KEY (`lid`);

--
-- Indexes for table `lecture_class`
--
ALTER TABLE `lecture_class`
  ADD PRIMARY KEY (`lid`,`cid`),
  ADD KEY `cid` (`cid`);

--
-- Indexes for table `lecture_payments`
--
ALTER TABLE `lecture_payments`
  ADD PRIMARY KEY (`lpid`),
  ADD KEY `lid` (`lid`),
  ADD KEY `cid` (`cid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`schoolId`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`sid`),
  ADD KEY `fk_students_school` (`schoolId`);

--
-- Indexes for table `student_payments`
--
ALTER TABLE `student_payments`
  ADD PRIMARY KEY (`pid`),
  ADD UNIQUE KEY `unique_payment` (`sid`,`cid`,`year`,`month`),
  ADD KEY `cid` (`cid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`classroomId`) ON DELETE SET NULL,
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`lid`) REFERENCES `lectures` (`lid`) ON DELETE SET NULL;

--
-- Constraints for table `class_student`
--
ALTER TABLE `class_student`
  ADD CONSTRAINT `class_student_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `students` (`sid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_student_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `classes` (`cid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lecture_class`
--
ALTER TABLE `lecture_class`
  ADD CONSTRAINT `lecture_class_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `lectures` (`lid`) ON DELETE CASCADE,
  ADD CONSTRAINT `lecture_class_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `classes` (`cid`) ON DELETE CASCADE;

--
-- Constraints for table `lecture_payments`
--
ALTER TABLE `lecture_payments`
  ADD CONSTRAINT `lecture_payments_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `lectures` (`lid`),
  ADD CONSTRAINT `lecture_payments_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `classes` (`cid`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_school` FOREIGN KEY (`schoolId`) REFERENCES `schools` (`schoolId`) ON DELETE SET NULL;

--
-- Constraints for table `student_payments`
--
ALTER TABLE `student_payments`
  ADD CONSTRAINT `student_payments_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `students` (`sid`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_payments_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `classes` (`cid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
