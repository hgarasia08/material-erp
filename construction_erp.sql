-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for construction_erp
CREATE DATABASE IF NOT EXISTS `construction_erp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `construction_erp`;

-- Dumping structure for table construction_erp.goods_receipts
CREATE TABLE IF NOT EXISTS `goods_receipts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `po_id` int(11) DEFAULT NULL,
  `received_by` int(11) DEFAULT NULL,
  `received_date` datetime DEFAULT current_timestamp(),
  `remarks` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.goods_receipts: ~0 rows (approximately)
DELETE FROM `goods_receipts`;

-- Dumping structure for table construction_erp.goods_receipt_items
CREATE TABLE IF NOT EXISTS `goods_receipt_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grn_id` int(11) DEFAULT NULL,
  `material_id` int(11) DEFAULT NULL,
  `received_qty` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `grn_id` (`grn_id`),
  CONSTRAINT `goods_receipt_items_ibfk_1` FOREIGN KEY (`grn_id`) REFERENCES `goods_receipts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.goods_receipt_items: ~0 rows (approximately)
DELETE FROM `goods_receipt_items`;

-- Dumping structure for table construction_erp.inventory
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `total_received` decimal(10,2) DEFAULT 0.00,
  `total_issued` decimal(10,2) DEFAULT 0.00,
  `balance_qty` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_material_project` (`material_id`,`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.inventory: ~0 rows (approximately)
DELETE FROM `inventory`;

-- Dumping structure for table construction_erp.materials
CREATE TABLE IF NOT EXISTS `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.materials: ~2 rows (approximately)
DELETE FROM `materials`;
INSERT INTO `materials` (`id`, `name`, `unit`, `created_at`) VALUES
	(1, 'Cement', 'Bag', '2026-03-26 12:12:06'),
	(2, 'Steel', 'Ton', '2026-03-26 12:12:06');

-- Dumping structure for table construction_erp.material_photos
CREATE TABLE IF NOT EXISTS `material_photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grn_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.material_photos: ~0 rows (approximately)
DELETE FROM `material_photos`;

-- Dumping structure for table construction_erp.material_requests
CREATE TABLE IF NOT EXISTS `material_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `requested_by` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.material_requests: ~0 rows (approximately)
DELETE FROM `material_requests`;

-- Dumping structure for table construction_erp.material_request_items
CREATE TABLE IF NOT EXISTS `material_request_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` int(11) DEFAULT NULL,
  `material_id` int(11) DEFAULT NULL,
  `required_qty` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `request_id` (`request_id`),
  CONSTRAINT `material_request_items_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `material_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.material_request_items: ~0 rows (approximately)
DELETE FROM `material_request_items`;

-- Dumping structure for table construction_erp.material_requirements
CREATE TABLE IF NOT EXISTS `material_requirements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `raised_by` varchar(255) DEFAULT NULL,
  `material_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `urgency` enum('High','Medium','Low') DEFAULT NULL,
  `purpose` text DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `main_status` enum('Y','N') DEFAULT 'Y',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.material_requirements: ~4 rows (approximately)
DELETE FROM `material_requirements`;
INSERT INTO `material_requirements` (`id`, `raised_by`, `material_name`, `quantity`, `urgency`, `purpose`, `status`, `main_status`, `created_at`) VALUES
	(3, 'hiren', 'cement', 3, 'High', 'For wall plaster', 'Rejected', 'N', '2026-04-11 07:44:26'),
	(4, 'nilesh', 'cement', 3, 'Medium', 'tets\n', 'Approved', 'Y', '2026-04-11 08:33:37'),
	(7, 'fdf', 'fdffd', 6, 'High', 'fdf', 'Approved', 'N', '2026-04-11 08:35:17'),
	(8, 'dsfsfsdf', 'fd', 4, 'Medium', 'fdfsdf', 'Approved', 'Y', '2026-04-11 08:37:13'),
	(19, 'ytyyy', 'tytryyy', 10, 'High', 'GFGDGFD', 'Pending', 'N', '2026-04-13 10:27:25'),
	(20, 'd', 'gfdg', 4, 'High', 'fgdg', 'Pending', 'N', '2026-04-13 10:41:33'),
	(21, 'tee', 'ttret', 5, 'High', 'fdfd', 'Rejected', 'N', '2026-04-13 10:44:41');

-- Dumping structure for table construction_erp.material_transfers
CREATE TABLE IF NOT EXISTS `material_transfers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_project_id` int(11) DEFAULT NULL,
  `to_project_id` int(11) DEFAULT NULL,
  `gate_pass_no` varchar(100) DEFAULT NULL,
  `transfer_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.material_transfers: ~0 rows (approximately)
DELETE FROM `material_transfers`;

-- Dumping structure for table construction_erp.material_transfer_items
CREATE TABLE IF NOT EXISTS `material_transfer_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transfer_id` int(11) DEFAULT NULL,
  `material_id` int(11) DEFAULT NULL,
  `qty` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transfer_id` (`transfer_id`),
  CONSTRAINT `material_transfer_items_ibfk_1` FOREIGN KEY (`transfer_id`) REFERENCES `material_transfers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.material_transfer_items: ~0 rows (approximately)
DELETE FROM `material_transfer_items`;

-- Dumping structure for table construction_erp.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.projects: ~2 rows (approximately)
DELETE FROM `projects`;
INSERT INTO `projects` (`id`, `name`, `location`, `created_at`) VALUES
	(1, 'Site A', NULL, '2026-03-26 12:12:06'),
	(2, 'Site B', NULL, '2026-03-26 12:12:06');

-- Dumping structure for table construction_erp.purchase_orders
CREATE TABLE IF NOT EXISTS `purchase_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `payment_terms` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `status_flag` varchar(1) DEFAULT 'Y',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `material_requirements` (`id`),
  CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.purchase_orders: ~3 rows (approximately)
DELETE FROM `purchase_orders`;
INSERT INTO `purchase_orders` (`id`, `material_id`, `vendor_id`, `quantity`, `rate`, `total`, `delivery_date`, `payment_terms`, `status`, `status_flag`, `created_at`) VALUES
	(1, 4, 5, 150, 150.00, 22500.00, '2026-04-17', 'Bank Transfer', 'Pending', 'N', '2026-04-16 09:54:08'),
	(2, 4, 5, 201, 300.00, 60300.00, '2026-04-16', 'Bank Transfer', 'Pending', 'N', '2026-04-16 09:56:57'),
	(3, 4, 5, 20, 115.00, 2300.00, '2026-04-16', 'Bank Transfer', 'Pending', 'Y', '2026-04-16 12:24:33');

-- Dumping structure for table construction_erp.purchase_orders1
CREATE TABLE IF NOT EXISTS `purchase_orders1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendor_id` int(11) DEFAULT NULL,
  `request_id` int(11) DEFAULT NULL,
  `po_number` varchar(100) DEFAULT NULL,
  `status` enum('pending','ordered','completed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.purchase_orders1: ~3 rows (approximately)
DELETE FROM `purchase_orders1`;
INSERT INTO `purchase_orders1` (`id`, `vendor_id`, `request_id`, `po_number`, `status`, `created_at`) VALUES
	(1, 0, 0, NULL, 'pending', '2026-04-10 11:51:15'),
	(2, 0, 0, NULL, 'pending', '2026-04-10 11:51:21'),
	(3, 0, 0, NULL, 'pending', '2026-04-10 11:52:23');

-- Dumping structure for table construction_erp.purchase_order_items
CREATE TABLE IF NOT EXISTS `purchase_order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `po_id` int(11) DEFAULT NULL,
  `material_id` int(11) DEFAULT NULL,
  `ordered_qty` decimal(10,2) DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `po_id` (`po_id`),
  CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders1` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.purchase_order_items: ~11 rows (approximately)
DELETE FROM `purchase_order_items`;
INSERT INTO `purchase_order_items` (`id`, `po_id`, `material_id`, `ordered_qty`, `rate`) VALUES
	(1, 1, 0, 0.00, 0.00),
	(2, 1, 0, 0.00, 0.00),
	(3, 1, 0, 0.00, 0.00),
	(4, 1, 0, 0.00, 0.00),
	(5, 2, 0, 0.00, 0.00),
	(6, 2, 0, 0.00, 0.00),
	(7, 2, 0, 0.00, 0.00),
	(8, 3, 0, 0.00, 0.00),
	(9, 3, 0, 0.00, 0.00),
	(10, 3, 0, 0.00, 0.00),
	(11, 3, 0, 0.00, 0.00);

-- Dumping structure for table construction_erp.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','purchase','store','site') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.users: ~0 rows (approximately)
DELETE FROM `users`;

-- Dumping structure for table construction_erp.vendors
CREATE TABLE IF NOT EXISTS `vendors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` varchar(10) DEFAULT 'Y',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table construction_erp.vendors: ~1 rows (approximately)
DELETE FROM `vendors`;
INSERT INTO `vendors` (`id`, `name`, `phone`, `email`, `address`, `status`, `created_at`) VALUES
	(5, 'ghfh', '8369431948', 'abc@gmail.com', 'fdfsdf', 'Y', '2026-04-14 08:35:47');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
