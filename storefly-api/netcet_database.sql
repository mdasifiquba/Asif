-- ====================================================================
-- NETCET COMPUTERS - CCTV IT AND COMPUTER
-- MySQL Database & Tables Full Dump / Schema & Seed Data
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `storefly_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `storefly_db`;

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for `admins`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'staff') DEFAULT 'admin',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `admins`
INSERT INTO `admins` (`id`, `name`, `email`, `password_hash`, `role`, `status`) VALUES
(1, 'NETCET Admin', 'admin@storefly.in', '$2b$12$TstmYhstUNIJbw37bH5o8ecsfYYhjMZYw01mSdoxIVokrL0Jm3qbi', 'super_admin', 'active');

-- --------------------------------------------------------
-- Table structure for `hero`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `hero`;
CREATE TABLE `hero` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) DEFAULT NULL,
  `subtitle` TEXT DEFAULT NULL,
  `button_text` VARCHAR(100) DEFAULT NULL,
  `button_url` VARCHAR(255) DEFAULT NULL,
  `background_image` VARCHAR(500) DEFAULT NULL,
  `overlay_opacity` DECIMAL(3,2) DEFAULT 0.50,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `hero`
INSERT INTO `hero` (`id`, `title`, `subtitle`, `button_text`, `button_url`, `overlay_opacity`, `status`) VALUES
(1, 'Expert IT, CCTV & Security Solutions', 'Your trusted partner for Computer repairs, High-Definition CCTV security systems, and Networking solutions in Jamui.', 'Explore Services', '#services', 0.60, 1);

-- --------------------------------------------------------
-- Table structure for `announcements`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `label` VARCHAR(100) DEFAULT 'NEW ANNOUNCEMENT',
  `text` TEXT NOT NULL,
  `link` VARCHAR(500) DEFAULT NULL,
  `status` TINYINT(1) DEFAULT 1,
  `start_date` DATETIME NULL,
  `end_date` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `announcements`
INSERT INTO `announcements` (`id`, `label`, `text`, `link`, `status`) VALUES
(1, 'NEW ANNOUNCEMENT', 'Jamui\'s premier CCTV & IT Hardware Hub is now open! Visit us near Luv Kush Gas Agency, Jamui Khaira Kawakol Rd.', '/contact', 1);

-- --------------------------------------------------------
-- Table structure for `statistics`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `statistics`;
CREATE TABLE `statistics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `value` VARCHAR(50) NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `statistics`
INSERT INTO `statistics` (`id`, `value`, `label`, `icon`, `sort_order`, `status`) VALUES
(1, '300+', 'Happy Clients', 'users', 1, 1),
(2, '500+', 'Repairs Done', 'wrench', 2, 1),
(3, '100%', 'Satisfaction', 'thumbs-up', 3, 1),
(4, '24/7', 'Support Hotline', 'headphones', 4, 1);

-- --------------------------------------------------------
-- Table structure for `service_categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `service_categories`;
CREATE TABLE `service_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `description` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `service_categories`
INSERT INTO `service_categories` (`id`, `name`, `slug`, `description`, `sort_order`) VALUES
(1, 'IT Services', 'it-services', 'Computer, laptop, printer repair and hardware services', 1),
(2, 'Security Services', 'security-services', 'CCTV camera surveillance, biometric, and security systems', 2);

-- --------------------------------------------------------
-- Table structure for `services`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) UNIQUE NOT NULL,
  `short_description` TEXT DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `price` VARCHAR(100) DEFAULT NULL,
  `availability` ENUM('available', 'unavailable', 'coming_soon') DEFAULT 'available',
  `featured` TINYINT(1) DEFAULT 0,
  `status` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_services_category` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `services`
INSERT INTO `services` (`id`, `category_id`, `name`, `slug`, `short_description`, `description`, `icon`, `price`, `availability`, `featured`, `status`, `sort_order`) VALUES
(1, 1, 'Printer Services', 'printer-services', 'Cartridge refilling, drum replacement, paper jam fixing, and complete printer support.', '<h3>Our Printer Services Include:</h3><ul><li>✓ Cartridge Refill & Replacement</li><li>✓ Drum Replacement</li><li>✓ Paper Jam Fixing</li><li>✓ Printer Maintenance & Repair</li><li>✓ New Printer Setup</li><li>✓ Network Printer Configuration</li></ul><p>We service all major brands including HP, Canon, Epson, Brother, and Samsung.</p><p><strong>Starting From ₹200</strong></p>', 'printer', '₹200', 'available', 1, 1, 1),
(2, 1, 'Laptop Services', 'laptop-services', 'Screen replacement, battery replacement, keyboard repair, software installation & hardware repair.', '<h3>Our Laptop Services Include:</h3><ul><li>✓ Screen Replacement</li><li>✓ Battery Replacement</li><li>✓ Keyboard Repair</li><li>✓ Software Installation</li><li>✓ Hardware Repair & Upgrade</li><li>✓ Virus Removal</li><li>✓ Data Recovery</li></ul><p>Expert technicians for all laptop brands.</p><p><strong>Starting From ₹300</strong></p>', 'laptop', '₹300', 'available', 1, 1, 2),
(3, 1, 'PC Services', 'pc-services', 'Custom PC building, hardware upgrade, virus removal, Windows installation & troubleshooting.', '<h3>Our PC Services Include:</h3><ul><li>✓ Custom PC Building</li><li>✓ Hardware Upgrade</li><li>✓ Virus Removal</li><li>✓ Windows Installation</li><li>✓ Troubleshooting</li><li>✓ Data Backup & Recovery</li><li>✓ Performance Optimization</li></ul><p><strong>Starting From ₹250</strong></p>', 'monitor', '₹250', 'available', 1, 1, 3),
(4, 2, 'CCTV Services', 'cctv-services', 'CCTV installation, DVR configuration, wiring, and mobile viewing setup.', '<h3>Our CCTV Services Include:</h3><ul><li>✓ CCTV Camera Installation</li><li>✓ DVR/NVR Configuration</li><li>✓ Professional Wiring</li><li>✓ Mobile Viewing Setup</li><li>✓ Night Vision Cameras</li><li>✓ Remote Monitoring</li></ul><p>Complete surveillance solutions for homes and businesses.</p><p><strong>Starting From ₹1,500</strong></p>', 'camera', '₹1,500', 'available', 1, 1, 4),
(5, 2, 'Biometric Services', 'biometric-services', 'Fingerprint attendance machine, face attendance, access control & attendance software.', '<h3>Our Biometric Services Include:</h3><ul><li>✓ Fingerprint Attendance Machine</li><li>✓ Face Recognition Systems</li><li>✓ Access Control Systems</li><li>✓ Attendance Software Setup</li><li>✓ Integration & Support</li></ul><p>Modern biometric solutions for offices, schools, and institutions.</p><p><strong>Starting From ₹3,000</strong></p>', 'fingerprint', '₹3,000', 'available', 1, 1, 5),
(6, 2, 'PA System Services', 'pa-system-services', 'Public announcement, speaker installation, amplifier & school/office audio setup.', '<h3>Our PA System Services Include:</h3><ul><li>✓ Public Announcement Systems</li><li>✓ Speaker Installation</li><li>✓ Amplifier Setup</li><li>✓ School & Office Audio Systems</li><li>✓ Conference Room Audio</li></ul><p>Professional audio solutions for every need.</p><p><strong>Starting From ₹2,000</strong></p>', 'volume-2', '₹2,000', 'available', 1, 1, 6);

-- --------------------------------------------------------
-- Table structure for `customers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `bookings`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_number` VARCHAR(20) UNIQUE NOT NULL,
  `customer_id` INT DEFAULT NULL,
  `service_id` INT DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `problem` TEXT DEFAULT NULL,
  `preferred_date` DATE DEFAULT NULL,
  `preferred_time` TIME DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  `admin_note` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_status` (`status`),
  KEY `idx_booking_number` (`booking_number`),
  CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bookings_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `features`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `features`;
CREATE TABLE `features` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `badge` VARCHAR(100) DEFAULT 'NETCET VERIFIED',
  `sort_order` INT DEFAULT 0,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `features`
INSERT INTO `features` (`id`, `title`, `description`, `icon`, `badge`, `sort_order`, `status`) VALUES
(1, 'Doorstep Service', 'Expert help when you need it, right from your home, office or shop in Jamui.', 'home', 'NETCET VERIFIED', 1, 1),
(2, 'Genuine Parts', 'We provide 100% quality verified OEM replacement components for your devices.', 'shield-check', 'NETCET VERIFIED', 2, 1),
(3, 'Expert Handling', 'Experienced certified chip-level technicians handle your hardware with utmost care.', 'award', 'NETCET VERIFIED', 3, 1),
(4, 'Fair Pricing', 'Transparent service quotes without hidden charges or inflated replacement costs.', 'dollar-sign', 'NETCET VERIFIED', 4, 1);

-- --------------------------------------------------------
-- Table structure for `how_it_works`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `how_it_works`;
CREATE TABLE `how_it_works` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `step_number` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `how_it_works`
INSERT INTO `how_it_works` (`id`, `step_number`, `title`, `description`, `icon`, `status`) VALUES
(1, 1, 'Book Online / Call', 'Submit the online booking form or call +91 821 010 1223 to schedule an engineer.', 'calendar', 1),
(2, 2, 'Expert Visit', 'Our certified technician inspects your device at your location or Jamui service center.', 'user-check', 1),
(3, 3, 'Tested & Delivered', 'Your setup/repair is tested thoroughly and delivered with service warranty.', 'check-circle', 1);

-- --------------------------------------------------------
-- Table structure for `founder`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `founder`;
CREATE TABLE `founder` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) DEFAULT NULL,
  `designation` VARCHAR(200) DEFAULT NULL,
  `profile_image` VARCHAR(500) DEFAULT NULL,
  `experience` VARCHAR(50) DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `short_description` TEXT DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `specializations` JSON DEFAULT NULL,
  `facebook` VARCHAR(500) DEFAULT NULL,
  `instagram` VARCHAR(500) DEFAULT NULL,
  `linkedin` VARCHAR(500) DEFAULT NULL,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `founder`
INSERT INTO `founder` (`id`, `name`, `designation`, `experience`, `description`, `short_description`, `phone`, `email`, `specializations`, `status`) VALUES
(1, 'Kunal Sharma', 'Founder & Lead IT Expert', '7+', 'Founded by Kunal Sharma, NETCET is Jamui\'s trusted destination for all IT infrastructure, CCTV, and computer needs. With 7+ years of specialized experience in computer hardware, networking, CCTV installation, and biometric systems, Kunal has built a reputation for delivering reliable solutions at fair prices. Under his leadership, NETCET has served 300+ satisfied clients across Jamui and surrounding areas.', 'Jamui\'s premier IT, Computer & security solutions expert with 7+ years of experience.', '+91 821 010 1223', 'contact@netcet.in', '["Biometric Systems", "Advanced Hardware", "CCTV Installation", "Network Setup"]', 1);

-- --------------------------------------------------------
-- Table structure for `testimonials`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(100) NOT NULL,
  `review` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `photo` VARCHAR(500) DEFAULT NULL,
  `location` VARCHAR(200) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `testimonials`
INSERT INTO `testimonials` (`id`, `customer_name`, `review`, `rating`, `location`, `sort_order`, `status`) VALUES
(1, 'Rahul Verma', 'Excellent service! Got my laptop repaired quickly and at a very reasonable price. Highly recommended in Jamui!', 5, 'Jamui', 1, 1),
(2, 'Priya Singh', 'NETCET installed CCTV cameras at our commercial shop. Very neat wiring and crystal clear night vision.', 5, 'Jamui', 2, 1),
(3, 'Amit Kumar', 'Best computer repair service in Jamui. Quick response, doorstep visit and genuine parts.', 5, 'Jamui', 3, 1),
(4, 'Sunita Devi', 'Got biometric attendance system installed at our institution. Very helpful and professional team.', 5, 'Jamui', 4, 1);

-- --------------------------------------------------------
-- Table structure for `contact_messages`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `subject` VARCHAR(300) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `coming_soon`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coming_soon`;
CREATE TABLE `coming_soon` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `launch_date` DATE DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `coming_soon`
INSERT INTO `coming_soon` (`id`, `title`, `description`, `launch_date`, `category`, `status`) VALUES
(1, 'Smart Home & Office Automation', 'Complete smart automation solutions including remote locks, smart switches, and voice controls.', '2026-12-01', 'Technology', 1),
(2, 'Enterprise Networking & Server Rack', 'Structured cabling, optical fiber splicing, enterprise WiFi routers, and server setup.', '2026-11-01', 'IT Services', 1),
(3, 'Custom Web & Software Development', 'Modern websites and billing software development for local businesses in Jamui.', '2027-01-15', 'Software', 1);

-- --------------------------------------------------------
-- Table structure for `media`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `media`;
CREATE TABLE `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) DEFAULT NULL,
  `mime_type` VARCHAR(100) DEFAULT NULL,
  `size` INT DEFAULT NULL,
  `url` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `settings`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) UNIQUE NOT NULL,
  `setting_value` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `settings`
INSERT INTO `settings` (`id`, `setting_key`, `setting_value`) VALUES
(1, 'business_name', 'NETCET'),
(2, 'business_tagline', 'NETCET COMPUTERS - CCTV IT AND COMPUTER'),
(3, 'phone', '+91 821 010 1223'),
(4, 'whatsapp', '+91 821 010 1223'),
(5, 'email', 'contact@netcet.in'),
(6, 'address', 'Near Luv Kush Gas Agency, Jamui Khaira Kawakol Rd, Jamui, Bihar - 811307'),
(7, 'opening_hours', 'Mon-Sat: 9:00 AM - 8:00 PM'),
(8, 'google_map_url', 'https://www.google.com/maps/place/NETCET+COMPUTERS+-+CCTV+IT+AND+COMPUTER,+luv+kush+gas+agency,+near,+Jamui+Khaira+Kawakol+Rd,+Jamui,+Bihar+811307/data=!4m2!3m1!1s0x899dbc934d196d2d:0x9ff4ff75a4af9869!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI2LjM3LjUYACDXggMqnwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTU2MjUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODM1NzA0LDEwMDgyNTAyMSwxMDA4MjI0OTRCAklO&skid=b32864e2-db1e-43b0-8981-ae44038f98c1&g_st=ac'),
(9, 'footer_description', 'NETCET COMPUTERS - CCTV IT AND COMPUTER is Jamui\'s premier destination for top-tier IT infrastructure, computer repairs & security solutions, providing comprehensive tech services.'),
(10, 'copyright_text', '© 2026 NETCET COMPUTERS - CCTV IT AND COMPUTER. All Rights Reserved.'),
(11, 'designed_by', 'NETCET Team');

-- --------------------------------------------------------
-- Table structure for `social_links`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `social_links`;
CREATE TABLE `social_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `platform` VARCHAR(50) NOT NULL,
  `url` VARCHAR(500) DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `social_links`
INSERT INTO `social_links` (`id`, `platform`, `url`, `icon`, `sort_order`, `status`) VALUES
(1, 'Facebook', 'https://facebook.com/netcet', 'facebook', 1, 1),
(2, 'Instagram', 'https://instagram.com/netcet', 'instagram', 2, 1),
(3, 'Twitter', 'https://twitter.com/netcet', 'twitter', 3, 1),
(4, 'WhatsApp', 'https://wa.me/918210101223', 'message-circle', 4, 1),
(5, 'Email', 'mailto:contact@netcet.in', 'mail', 5, 1);

-- --------------------------------------------------------
-- Table structure for `seo_pages`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `seo_pages`;
CREATE TABLE `seo_pages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_name` VARCHAR(100) UNIQUE NOT NULL,
  `seo_title` VARCHAR(300) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `keywords` TEXT DEFAULT NULL,
  `og_image` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `seo_pages` (`id`, `page_name`, `seo_title`, `meta_description`, `keywords`, `og_image`) VALUES
(1, 'home', 'NETCET — NETCET COMPUTERS - CCTV IT AND COMPUTER | Jamui, Bihar', 'Jamui\'s premier destination for Laptop & PC repairs, CCTV camera installation, Biometric attendance systems, and IT network maintenance.', 'NETCET, CCTV Jamui, laptop repair Jamui, computer service Bihar', '/netcet-logo.png');

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- End of Database & Tables SQL File
-- ====================================================================
