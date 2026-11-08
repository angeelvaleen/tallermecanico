/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.20-11.8.9-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: workshop
-- ------------------------------------------------------
-- Server version	11.8.9-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` int(10) unsigned NOT NULL,
  `status_id` tinyint(3) unsigned NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `reason` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_appointment_vehicle` (`vehicle_id`),
  KEY `fk_appointment_status` (`status_id`),
  CONSTRAINT `fk_appointment_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `fk_appointment_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES
(1,1,2,'2025-07-01','09:00:00','Le cae aceite y hace ruido al encender','2026-10-30 03:20:46'),
(2,2,2,'2025-07-02','10:30:00','Frenos hacen ruido al frenar','2026-10-30 03:20:46'),
(3,3,3,'2025-07-03','11:00:00','Revisión preventiva general','2026-10-30 03:20:46'),
(4,4,3,'2025-07-04','08:00:00','Cambio de aceite programado','2026-10-30 03:20:46'),
(5,5,2,'2025-07-05','09:30:00','Motor no enciende en las mañanas','2026-10-30 03:20:46'),
(6,6,2,'2025-07-07','10:00:00','Luz de check engine encendida','2026-10-30 03:20:46'),
(7,7,2,'2025-07-08','08:30:00','Vibración fuerte al acelerar','2026-10-30 03:20:46'),
(8,8,2,'2025-07-09','11:30:00','Cambio de aceite y revisión','2026-10-30 03:20:46'),
(9,9,3,'2025-07-10','09:00:00','Suspensión hace golpes en baches','2026-10-30 03:20:46'),
(10,10,2,'2025-07-11','10:00:00','Humo blanco saliendo del escape','2026-10-30 03:20:46'),
(11,3,1,'2027-02-01','14:01:00','si','2026-11-04 00:35:35');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_brand_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES
(1,'Toyotaa',1,'2026-10-30 03:20:46'),
(2,'Nissan',1,'2026-10-30 03:20:46'),
(3,'Chevrolet',1,'2026-10-30 03:20:46'),
(4,'Ford',1,'2026-10-30 03:20:46'),
(5,'Volkswagen',1,'2026-10-30 03:20:46'),
(6,'Honda',1,'2026-10-30 03:20:46'),
(7,'Mazda',1,'2026-10-30 03:20:46'),
(8,'Hyundai',1,'2026-10-30 03:20:46'),
(9,'Kia',1,'2026-10-30 03:20:46'),
(10,'Dodge',1,'2026-10-30 03:20:46'),
(11,'McQueen',1,'2026-10-31 20:48:55');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `colors`
--

DROP TABLE IF EXISTS `colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `colors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_color_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colors`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `colors` WRITE;
/*!40000 ALTER TABLE `colors` DISABLE KEYS */;
INSERT INTO `colors` VALUES
(1,'Blanco',1,'2026-10-30 03:20:46'),
(2,'Negro',1,'2026-10-30 03:20:46'),
(3,'Rojo',1,'2026-10-30 03:20:46'),
(4,'Azul',1,'2026-10-30 03:20:46'),
(5,'Gris',1,'2026-10-30 03:20:46'),
(6,'Plata',1,'2026-10-30 03:20:46'),
(7,'Verde',1,'2026-10-30 03:20:46'),
(8,'Beige',1,'2026-10-30 03:20:46'),
(9,'Naranja',1,'2026-10-30 03:20:46'),
(10,'Amarillo',1,'2026-10-30 03:20:46'),
(11,'Pistachea',1,'2026-10-31 20:57:10'),
(12,'Bronce',1,'2026-10-31 20:57:36');
/*!40000 ALTER TABLE `colors` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `diagnoses`
--

DROP TABLE IF EXISTS `diagnoses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnoses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `workorder_id` int(10) unsigned NOT NULL,
  `description` text NOT NULL,
  `result` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_diagnosis_workorder` (`workorder_id`),
  CONSTRAINT `fk_diagnosis_workorder` FOREIGN KEY (`workorder_id`) REFERENCES `workorders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnoses`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `diagnoses` WRITE;
/*!40000 ALTER TABLE `diagnoses` DISABLE KEYS */;
INSERT INTO `diagnoses` VALUES
(1,1,'Revisión por fuga de aceite y ruido al encender. Filtro de aceite saturado, nivel bajo.','Se realizó cambio de aceite 5W-30 y filtro. Fuga corregida.','2026-10-30 03:20:46'),
(2,2,'Inspección de frenos por ruido metálico al frenar.','Balatas delanteras al límite. Se reemplazaron.','2026-10-30 03:20:46'),
(3,3,'Revisión de suspensión por vibración excesiva.','Amortiguadores delanteros y traseros agotados. En espera de autorización.','2026-10-30 03:20:46'),
(4,4,'Lectura de códigos con escáner por check engine encendida.','Código P0301: falla de encendido en cilindro 1. Pendiente afinación.','2026-10-30 03:20:46'),
(5,5,'Motor no enciende en frío. Revisión eléctrica y mecánica.','Banda de distribución desgastada. Se reemplazó con kit completo.','2026-10-30 03:20:46'),
(6,6,'Revisión general preventiva de 30 puntos.',NULL,'2026-10-30 03:20:46'),
(7,7,'Vibración al acelerar. Revisión de suspensión y transmisión.','Amortiguadores delanteros agotados. Alineación desviada. Pendiente autorización.','2026-10-30 03:20:46'),
(8,8,'Afinación menor solicitada. Motor presentaba baja respuesta.','Se cambiaron bujías y filtro de aire. Motor respondiendo correctamente.','2026-10-30 03:20:46'),
(9,9,'Golpes en suspensión en baches. Revisión completa de tren delantero.','Amortiguadores delanteros reemplazados. Suspensión correcta.','2026-10-30 03:20:46'),
(10,10,'Humo blanco por escape. Posible fuga de anticongelante.','Junta de cabeza con micro-fuga. Requiere trabajo mayor. Cliente rechazó cotización.','2026-10-30 03:20:46'),
(11,2,'problemas muchos','resueltos','2026-10-31 21:01:35'),
(12,11,'assa','asjsak','2026-11-01 00:10:51');
/*!40000 ALTER TABLE `diagnoses` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_access`
--

DROP TABLE IF EXISTS `directus_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_access` (
  `id` char(36) NOT NULL,
  `role` char(36) DEFAULT NULL,
  `user` char(36) DEFAULT NULL,
  `policy` char(36) NOT NULL,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_access_role_foreign` (`role`),
  KEY `directus_access_user_foreign` (`user`),
  KEY `directus_access_policy_foreign` (`policy`),
  CONSTRAINT `directus_access_policy_foreign` FOREIGN KEY (`policy`) REFERENCES `directus_policies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_access_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_access_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_access`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_access` WRITE;
/*!40000 ALTER TABLE `directus_access` DISABLE KEYS */;
INSERT INTO `directus_access` VALUES
('0ad87cf9-e612-4172-b731-b43f9d510d77','3823f47a-27ae-40dc-9b0b-b446f31449b1',NULL,'eb9c9106-0ac5-431d-a7c5-aa16a8dbb91e',NULL),
('2b1c6fe5-e6e8-42de-bae4-54306e8a4e14','87547614-33d5-4d6b-b79b-5d3890687f65',NULL,'cf63ea41-96d3-4b55-bde3-cc27fc4346d6',NULL),
('530ee0c7-68b2-4bec-b364-f609b7903595',NULL,'1f754ea4-f86a-4060-94a8-9c1ceb57dad9','b90f5e38-cb4b-4664-8af7-607b96340b18',1),
('87d34524-d95f-4a67-ad7b-0d9015fa8e72','24d0bcbb-c316-45fe-98a1-beab4f06b3cd',NULL,'b90f5e38-cb4b-4664-8af7-607b96340b18',1),
('bd2104e3-7d0a-41e1-9a73-6aee7d5a3528',NULL,NULL,'abf8a154-5b1c-4a46-ac9c-7300570f4f17',1),
('bdd6d7a1-20ff-49f8-8873-15a19a836256','625eab29-7a2b-41cc-9086-0f9f235abc9b',NULL,'7ac29d7a-5c9f-4dfc-999a-1a16cad9be38',1),
('f8e355e0-9b9d-4f13-8bd3-88498118b71e','9fd2c60e-1197-4ca0-84e9-46ef57c3995d',NULL,'b809c4a1-b19d-4553-a3d4-cb98592fd8ad',1);
/*!40000 ALTER TABLE `directus_access` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_activity`
--

DROP TABLE IF EXISTS `directus_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_activity` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action` varchar(45) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip` varchar(50) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `collection` varchar(64) NOT NULL,
  `item` varchar(255) NOT NULL,
  `origin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_activity_collection_foreign` (`collection`),
  KEY `directus_activity_timestamp_index` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=448 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_activity`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_activity` WRITE;
/*!40000 ALTER TABLE `directus_activity` DISABLE KEYS */;
INSERT INTO `directus_activity` VALUES
(1,'login','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:22:40','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','e9a3fa62-4352-4b56-90d8-05c6cc59073e','http://localhost:8000'),
(2,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:22:46','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','appointments','http://localhost:8000'),
(3,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:22:49','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','brands','http://localhost:8000'),
(4,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:22:52','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','colors','http://localhost:8000'),
(5,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:22:55','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','diagnoses','http://localhost:8000'),
(6,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:22:57','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','evidence','http://localhost:8000'),
(7,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:22:59','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','fuels','http://localhost:8000'),
(8,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:01','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','history','http://localhost:8000'),
(9,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:03','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','methods','http://localhost:8000'),
(10,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:07','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','models','http://localhost:8000'),
(11,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:11','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','parts','http://localhost:8000'),
(12,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:14','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','payment','http://localhost:8000'),
(13,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:17','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','quoteitems','http://localhost:8000'),
(14,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:19','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','quoteparts','http://localhost:8000'),
(15,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:22','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','quotes','http://localhost:8000'),
(16,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:25','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','services','http://localhost:8000'),
(17,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:27','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','status','http://localhost:8000'),
(18,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:30','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','users','http://localhost:8000'),
(19,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:37','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','vehicles','http://localhost:8000'),
(20,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:23:40','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_collections','workorders','http://localhost:8000'),
(21,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','1','http://localhost:8000'),
(22,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','2','http://localhost:8000'),
(23,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','3','http://localhost:8000'),
(24,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','4','http://localhost:8000'),
(25,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','5','http://localhost:8000'),
(26,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','6','http://localhost:8000'),
(27,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','7','http://localhost:8000'),
(28,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','8','http://localhost:8000'),
(29,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','9','http://localhost:8000'),
(30,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','10','http://localhost:8000'),
(31,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','11','http://localhost:8000'),
(32,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','12','http://localhost:8000'),
(33,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','13','http://localhost:8000'),
(34,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','14','http://localhost:8000'),
(35,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','15','http://localhost:8000'),
(36,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','16','http://localhost:8000'),
(37,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','17','http://localhost:8000'),
(38,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','18','http://localhost:8000'),
(39,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','19','http://localhost:8000'),
(40,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','20','http://localhost:8000'),
(41,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','21','http://localhost:8000'),
(42,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','22','http://localhost:8000'),
(43,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','23','http://localhost:8000'),
(44,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','24','http://localhost:8000'),
(45,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','25','http://localhost:8000'),
(46,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','26','http://localhost:8000'),
(47,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','27','http://localhost:8000'),
(48,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','28','http://localhost:8000'),
(49,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','29','http://localhost:8000'),
(50,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','30','http://localhost:8000'),
(51,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','31','http://localhost:8000'),
(52,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','32','http://localhost:8000'),
(53,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','33','http://localhost:8000'),
(54,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:33','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','34','http://localhost:8000'),
(55,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','35','http://localhost:8000'),
(56,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','36','http://localhost:8000'),
(57,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','37','http://localhost:8000'),
(58,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','38','http://localhost:8000'),
(59,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','39','http://localhost:8000'),
(60,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','40','http://localhost:8000'),
(61,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','41','http://localhost:8000'),
(62,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','42','http://localhost:8000'),
(63,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','43','http://localhost:8000'),
(64,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','44','http://localhost:8000'),
(65,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','45','http://localhost:8000'),
(66,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','46','http://localhost:8000'),
(67,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','47','http://localhost:8000'),
(68,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','48','http://localhost:8000'),
(69,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','49','http://localhost:8000'),
(70,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','50','http://localhost:8000'),
(71,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','51','http://localhost:8000'),
(72,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','52','http://localhost:8000'),
(73,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','53','http://localhost:8000'),
(74,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','54','http://localhost:8000'),
(75,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','55','http://localhost:8000'),
(76,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','56','http://localhost:8000'),
(77,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','57','http://localhost:8000'),
(78,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','58','http://localhost:8000'),
(79,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','59','http://localhost:8000'),
(80,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','60','http://localhost:8000'),
(81,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','61','http://localhost:8000'),
(82,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','62','http://localhost:8000'),
(83,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','63','http://localhost:8000'),
(84,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','64','http://localhost:8000'),
(85,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','65','http://localhost:8000'),
(86,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','66','http://localhost:8000'),
(87,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','67','http://localhost:8000'),
(88,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','68','http://localhost:8000'),
(89,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','69','http://localhost:8000'),
(90,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','70','http://localhost:8000'),
(91,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','71','http://localhost:8000'),
(92,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','72','http://localhost:8000'),
(93,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','73','http://localhost:8000'),
(94,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','74','http://localhost:8000'),
(95,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','75','http://localhost:8000'),
(96,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','76','http://localhost:8000'),
(97,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','77','http://localhost:8000'),
(98,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','78','http://localhost:8000'),
(99,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','79','http://localhost:8000'),
(100,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','80','http://localhost:8000'),
(101,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','81','http://localhost:8000'),
(102,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','82','http://localhost:8000'),
(103,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','83','http://localhost:8000'),
(104,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','84','http://localhost:8000'),
(105,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','85','http://localhost:8000'),
(106,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','86','http://localhost:8000'),
(107,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','87','http://localhost:8000'),
(108,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','88','http://localhost:8000'),
(109,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','89','http://localhost:8000'),
(110,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','90','http://localhost:8000'),
(111,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','91','http://localhost:8000'),
(112,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','92','http://localhost:8000'),
(113,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','93','http://localhost:8000'),
(114,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','94','http://localhost:8000'),
(115,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','95','http://localhost:8000'),
(116,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','abf8a154-5b1c-4a46-ac9c-7300570f4f17','http://localhost:8000'),
(117,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:24:49','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_settings','1','http://localhost:8000'),
(118,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:25:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b809c4a1-b19d-4553-a3d4-cb98592fd8ad','http://localhost:8000'),
(119,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:25:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_access','f8e355e0-9b9d-4f13-8bd3-88498118b71e','http://localhost:8000'),
(120,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:25:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','9fd2c60e-1197-4ca0-84e9-46ef57c3995d','http://localhost:8000'),
(121,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-10-30 03:25:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_settings','1','http://localhost:8000'),
(122,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-10-30 03:27:16','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(123,'update',NULL,'2026-10-31 20:48:44','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','brands','1','http://localhost:8100'),
(124,'create',NULL,'2026-10-31 20:48:55','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','brands','11','http://localhost:8100'),
(125,'create',NULL,'2026-10-31 20:57:10','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','colors','11','http://localhost:8100'),
(126,'create',NULL,'2026-10-31 20:57:36','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','colors','12','http://localhost:8100'),
(127,'update',NULL,'2026-10-31 20:57:44','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','colors','11','http://localhost:8100'),
(128,'create',NULL,'2026-10-31 21:01:35','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','diagnoses','11','http://localhost:8100'),
(129,'update',NULL,'2026-10-31 21:01:48','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','diagnoses','11','http://localhost:8100'),
(130,'update',NULL,'2026-10-31 21:07:36','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','fuels','1','http://localhost:8100'),
(131,'create',NULL,'2026-10-31 21:07:47','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','fuels','6','http://localhost:8100'),
(132,'create',NULL,'2026-10-31 21:11:49','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','methods','6','http://localhost:8100'),
(133,'update',NULL,'2026-10-31 21:12:00','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','methods','5','http://localhost:8100'),
(134,'update',NULL,'2026-10-31 21:20:37','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','models','1','http://localhost:8100'),
(135,'create',NULL,'2026-10-31 21:20:52','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','models','11','http://localhost:8100'),
(136,'create',NULL,'2026-10-31 21:21:14','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','models','12','http://localhost:8100'),
(137,'update',NULL,'2026-10-31 21:35:21','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','parts','1','http://localhost:8100'),
(138,'create',NULL,'2026-10-31 21:35:52','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','parts','11','http://localhost:8100'),
(139,'update',NULL,'2026-10-31 21:53:40','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteparts','4','http://localhost:8100'),
(140,'update',NULL,'2026-10-31 21:53:40','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','3','http://localhost:8100'),
(141,'update',NULL,'2026-10-31 21:53:41','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteparts','5','http://localhost:8100'),
(142,'update',NULL,'2026-10-31 21:53:41','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','3','http://localhost:8100'),
(143,'update',NULL,'2026-10-31 21:53:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteitems','3','http://localhost:8100'),
(144,'update',NULL,'2026-10-31 21:53:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','3','http://localhost:8100'),
(145,'update',NULL,'2026-10-31 21:53:43','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteparts','4','http://localhost:8100'),
(146,'update',NULL,'2026-10-31 21:53:43','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','3','http://localhost:8100'),
(147,'update',NULL,'2026-10-31 21:53:47','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','3','http://localhost:8100'),
(148,'create',NULL,'2026-10-31 21:54:01','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','payment','11','http://localhost:8100'),
(149,'create',NULL,'2026-10-31 22:46:20','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','11','http://localhost:8100'),
(150,'create',NULL,'2026-10-31 22:46:20','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteitems','11','http://localhost:8100'),
(151,'create',NULL,'2026-10-31 22:46:20','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteparts','11','http://localhost:8100'),
(152,'update',NULL,'2026-10-31 22:46:29','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteitems','11','http://localhost:8100'),
(153,'update',NULL,'2026-10-31 22:46:29','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','11','http://localhost:8100'),
(154,'update',NULL,'2026-10-31 22:46:30','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','11','http://localhost:8100'),
(155,'create',NULL,'2026-10-31 22:46:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','payment','12','http://localhost:8100'),
(156,'create',NULL,'2026-10-31 23:00:09','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','services','11','http://localhost:8100'),
(157,'update',NULL,'2026-10-31 23:00:31','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','services','11','http://localhost:8100'),
(158,'update',NULL,'2026-10-31 23:51:46','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','vehicles','1','http://localhost:8100'),
(159,'create',NULL,'2026-10-31 23:53:02','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','vehicles','11','http://localhost:8100'),
(160,'update',NULL,'2026-10-31 23:53:17','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','vehicles','11','http://localhost:8100'),
(161,'create',NULL,'2026-11-01 00:10:35','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','workorders','11','http://localhost:8100'),
(162,'create',NULL,'2026-11-01 00:10:51','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','diagnoses','12','http://localhost:8100'),
(163,'create',NULL,'2026-11-01 00:11:19','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quotes','12','http://localhost:8100'),
(164,'create',NULL,'2026-11-01 00:11:19','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteitems','12','http://localhost:8100'),
(165,'create',NULL,'2026-11-01 00:11:19','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','quoteparts','12','http://localhost:8100'),
(166,'update',NULL,'2026-11-01 00:15:48','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','workorders','11','http://localhost:8100'),
(167,'update',NULL,'2026-11-01 00:43:51','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','appointments','3','http://localhost:8100'),
(168,'create',NULL,'2026-11-01 00:51:52','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','workorders','12','http://localhost:8100'),
(169,'update',NULL,'2026-11-01 00:51:52','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','appointments','6','http://localhost:8100'),
(170,'create',NULL,'2026-11-01 00:52:11','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','workorders','13','http://localhost:8100'),
(171,'update',NULL,'2026-11-01 00:52:11','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','appointments','8','http://localhost:8100'),
(172,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-01 00:56:28','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(173,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-03 22:34:16','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(174,'login','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:27:51','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','e9a3fa62-4352-4b56-90d8-05c6cc59073e','http://localhost:8000'),
(175,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:29:52','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','f870afcb-338f-4f2e-bdf3-d56648cd2836','http://localhost:8000'),
(176,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:30:28','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','http://localhost:8000'),
(177,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:30:44','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','http://localhost:8000'),
(178,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:31:00','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b90f5e38-cb4b-4664-8af7-607b96340b18','http://localhost:8000'),
(179,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:33:52','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','625eab29-7a2b-41cc-9086-0f9f235abc9b','http://localhost:8000'),
(180,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:34:12','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_access','bdd6d7a1-20ff-49f8-8873-15a19a836256','http://localhost:8000'),
(181,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:34:12','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','625eab29-7a2b-41cc-9086-0f9f235abc9b','http://localhost:8000'),
(182,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:34:25','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','24d0bcbb-c316-45fe-98a1-beab4f06b3cd','http://localhost:8000'),
(183,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:34:41','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_access','87d34524-d95f-4a67-ad7b-0d9015fa8e72','http://localhost:8000'),
(184,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-04 00:34:41','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','24d0bcbb-c316-45fe-98a1-beab4f06b3cd','http://localhost:8000'),
(185,'create',NULL,'2026-11-04 00:35:35','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','appointments','11','http://localhost:8100'),
(186,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-05 00:34:21','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(187,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:41','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','96','http://localhost:8000'),
(188,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','97','http://localhost:8000'),
(189,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','98','http://localhost:8000'),
(190,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','99','http://localhost:8000'),
(191,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','100','http://localhost:8000'),
(192,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','101','http://localhost:8000'),
(193,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','102','http://localhost:8000'),
(194,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','103','http://localhost:8000'),
(195,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','104','http://localhost:8000'),
(196,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','105','http://localhost:8000'),
(197,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','106','http://localhost:8000'),
(198,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','107','http://localhost:8000'),
(199,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','108','http://localhost:8000'),
(200,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','109','http://localhost:8000'),
(201,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','110','http://localhost:8000'),
(202,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','111','http://localhost:8000'),
(203,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','112','http://localhost:8000'),
(204,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','113','http://localhost:8000'),
(205,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','114','http://localhost:8000'),
(206,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','115','http://localhost:8000'),
(207,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','116','http://localhost:8000'),
(208,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','117','http://localhost:8000'),
(209,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','118','http://localhost:8000'),
(210,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','119','http://localhost:8000'),
(211,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','120','http://localhost:8000'),
(212,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','121','http://localhost:8000'),
(213,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b809c4a1-b19d-4553-a3d4-cb98592fd8ad','http://localhost:8000'),
(214,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_access','f8e355e0-9b9d-4f13-8bd3-88498118b71e','http://localhost:8000'),
(215,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:13:42','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','9fd2c60e-1197-4ca0-84e9-46ef57c3995d','http://localhost:8000'),
(216,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:15:36','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','http://localhost:8000'),
(217,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','122','http://localhost:8000'),
(218,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','123','http://localhost:8000'),
(219,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','124','http://localhost:8000'),
(220,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','125','http://localhost:8000'),
(221,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','126','http://localhost:8000'),
(222,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','127','http://localhost:8000'),
(223,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','128','http://localhost:8000'),
(224,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','129','http://localhost:8000'),
(225,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','130','http://localhost:8000'),
(226,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','131','http://localhost:8000'),
(227,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','132','http://localhost:8000'),
(228,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','133','http://localhost:8000'),
(229,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','134','http://localhost:8000'),
(230,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','135','http://localhost:8000'),
(231,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','136','http://localhost:8000'),
(232,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','137','http://localhost:8000'),
(233,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','138','http://localhost:8000'),
(234,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','139','http://localhost:8000'),
(235,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','140','http://localhost:8000'),
(236,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','141','http://localhost:8000'),
(237,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','142','http://localhost:8000'),
(238,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','143','http://localhost:8000'),
(239,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','144','http://localhost:8000'),
(240,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','145','http://localhost:8000'),
(241,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','146','http://localhost:8000'),
(242,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','147','http://localhost:8000'),
(243,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:05','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','http://localhost:8000'),
(244,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:18:13','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b90f5e38-cb4b-4664-8af7-607b96340b18','http://localhost:8000'),
(245,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','148','http://localhost:8000'),
(246,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','149','http://localhost:8000'),
(247,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','150','http://localhost:8000'),
(248,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','151','http://localhost:8000'),
(249,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','152','http://localhost:8000'),
(250,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','153','http://localhost:8000'),
(251,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','154','http://localhost:8000'),
(252,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','155','http://localhost:8000'),
(253,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','156','http://localhost:8000'),
(254,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','157','http://localhost:8000'),
(255,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','158','http://localhost:8000'),
(256,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','159','http://localhost:8000'),
(257,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','160','http://localhost:8000'),
(258,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','161','http://localhost:8000'),
(259,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','162','http://localhost:8000'),
(260,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','163','http://localhost:8000'),
(261,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','164','http://localhost:8000'),
(262,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','165','http://localhost:8000'),
(263,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','166','http://localhost:8000'),
(264,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:19:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b90f5e38-cb4b-4664-8af7-607b96340b18','http://localhost:8000'),
(265,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-05 04:29:28','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(266,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-05 04:42:17','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(267,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-05 04:43:08','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(268,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-05 04:43:39','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(269,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-05 04:44:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(270,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-05 04:47:12','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(271,'login','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:49:08','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','e9a3fa62-4352-4b56-90d8-05c6cc59073e','http://localhost:8000'),
(272,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-05 04:49:18','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b809c4a1-b19d-4553-a3d4-cb98592fd8ad','http://localhost:8000'),
(273,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-05 20:48:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(274,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 04:04:50','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(275,'update',NULL,'2026-11-06 04:22:55','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(276,'update',NULL,'2026-11-06 04:22:55','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(277,'update',NULL,'2026-11-06 04:22:56','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(278,'update',NULL,'2026-11-06 04:22:56','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(279,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 04:46:02','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(280,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 04:46:25','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(281,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 04:51:08','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(282,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:07:46','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(283,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:08:00','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(284,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:09:44','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(285,'login','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 05:11:56','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','e9a3fa62-4352-4b56-90d8-05c6cc59073e','http://localhost:8000'),
(286,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 05:12:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','167','http://localhost:8000'),
(287,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 05:12:34','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b809c4a1-b19d-4553-a3d4-cb98592fd8ad','http://localhost:8000'),
(288,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:12:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(289,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 05:13:20','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','168','http://localhost:8000'),
(290,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 05:13:20','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b809c4a1-b19d-4553-a3d4-cb98592fd8ad','http://localhost:8000'),
(291,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:13:25','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(292,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 05:14:26','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','169','http://localhost:8000'),
(293,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 05:14:26','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b809c4a1-b19d-4553-a3d4-cb98592fd8ad','http://localhost:8000'),
(294,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:14:34','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(295,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:14:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(296,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:16:30','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(297,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:34:57','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(298,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:39:16','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(299,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:42:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(300,'update',NULL,'2026-11-06 05:42:11','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','4','http://localhost:8100'),
(301,'update',NULL,'2026-11-06 05:42:11','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','4','http://localhost:8100'),
(302,'update',NULL,'2026-11-06 05:42:13','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','4','http://localhost:8100'),
(303,'create',NULL,'2026-11-06 05:42:21','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','payment','13','http://localhost:8100'),
(304,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:49:15','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(305,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:53:06','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(306,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 05:54:20','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(307,'login','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 05:56:25','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','e9a3fa62-4352-4b56-90d8-05c6cc59073e','http://localhost:8100'),
(308,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:00:37','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8000'),
(309,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:00:37','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','3823f47a-27ae-40dc-9b0b-b446f31449b1','http://localhost:8000'),
(310,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-06 06:00:42','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(311,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:05:36','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_fields','1','http://localhost:8000'),
(312,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 06:20:31','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(313,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 06:24:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(314,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 06:24:59','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(315,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 06:25:34','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(316,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:26:28','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8000'),
(317,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:26:28','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','24d0bcbb-c316-45fe-98a1-beab4f06b3cd','http://localhost:8000'),
(318,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:27:03','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8000'),
(319,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:27:03','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','625eab29-7a2b-41cc-9086-0f9f235abc9b','http://localhost:8000'),
(320,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:27:44','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8000'),
(321,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:27:44','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','24d0bcbb-c316-45fe-98a1-beab4f06b3cd','http://localhost:8000'),
(322,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:28:02','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8000'),
(323,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:28:02','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','24d0bcbb-c316-45fe-98a1-beab4f06b3cd','http://localhost:8000'),
(324,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-06 06:28:06','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(329,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-06 06:29:14','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(333,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-06 06:31:32','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(334,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 06:32:02','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(339,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 06:32:35','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(340,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-06 06:32:53','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(346,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-06 06:33:32','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(361,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:06','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','182','http://localhost:8000'),
(362,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:06','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b90f5e38-cb4b-4664-8af7-607b96340b18','http://localhost:8000'),
(363,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:06','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_access','87d34524-d95f-4a67-ad7b-0d9015fa8e72','http://localhost:8000'),
(364,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:06','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_access','530ee0c7-68b2-4bec-b364-f609b7903595','http://localhost:8000'),
(365,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:06','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8000'),
(366,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:06','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','24d0bcbb-c316-45fe-98a1-beab4f06b3cd','http://localhost:8000'),
(367,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-06 06:38:23','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(368,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:50','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','183','http://localhost:8000'),
(369,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:50','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','b90f5e38-cb4b-4664-8af7-607b96340b18','http://localhost:8000'),
(370,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:50','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_access','87d34524-d95f-4a67-ad7b-0d9015fa8e72','http://localhost:8000'),
(371,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:38:50','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_roles','24d0bcbb-c316-45fe-98a1-beab4f06b3cd','http://localhost:8000'),
(372,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-06 06:39:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(373,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:40:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','184','http://localhost:8000'),
(374,'create','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:40:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_permissions','185','http://localhost:8000'),
(375,'update','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-06 06:40:38','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_policies','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','http://localhost:8000'),
(376,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-06 06:40:55','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(377,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-06 06:42:31','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(378,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-06 20:42:50','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(379,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-06 21:23:24','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(380,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 21:34:33','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(381,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-06 21:36:38','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(382,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 21:37:48','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(383,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-06 21:38:29','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(384,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 03:18:22','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(385,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 03:19:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(386,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 03:19:55','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(387,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 03:30:07','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(388,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 03:30:32','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(389,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 03:34:14','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(390,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 03:40:30','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(391,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 03:41:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(392,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 03:49:35','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(393,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 03:55:54','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(394,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 04:01:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(395,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:07:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(396,'create',NULL,'2026-11-07 04:08:02','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','13','http://localhost:8100'),
(397,'create',NULL,'2026-11-07 04:08:02','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','13','http://localhost:8100'),
(398,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:08:34','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(399,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-07 04:08:45','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(400,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 04:09:30','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(401,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:10:21','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(402,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:11:45','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(403,'update',NULL,'2026-11-07 04:14:00','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(404,'update',NULL,'2026-11-07 04:14:00','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(405,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(406,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(407,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(408,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(409,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(410,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(411,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(412,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(413,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(414,'update',NULL,'2026-11-07 04:14:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(415,'update',NULL,'2026-11-07 04:14:02','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','6','http://localhost:8100'),
(416,'update',NULL,'2026-11-07 04:14:02','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','6','http://localhost:8100'),
(417,'login','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-07 04:18:29','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','e9a3fa62-4352-4b56-90d8-05c6cc59073e','http://localhost:8100'),
(418,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 04:18:43','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(419,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 04:20:25','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(420,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 04:32:40','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(421,'login','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-07 04:33:17','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','http://localhost:8100'),
(422,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:33:44','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(423,'login','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-07 04:35:12','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','38500c14-8f7a-43ac-b06b-3175a112ff6c','http://localhost:8100'),
(424,'update',NULL,'2026-11-07 04:35:20','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','13','http://localhost:8100'),
(425,'update',NULL,'2026-11-07 04:35:20','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','13','http://localhost:8100'),
(426,'update',NULL,'2026-11-07 04:35:21','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','13','http://localhost:8100'),
(427,'update',NULL,'2026-11-07 04:35:21','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','13','http://localhost:8100'),
(428,'update',NULL,'2026-11-07 04:35:22','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','13','http://localhost:8100'),
(429,'update',NULL,'2026-11-07 04:35:22','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','13','http://localhost:8100'),
(430,'update',NULL,'2026-11-07 04:35:23','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','13','http://localhost:8100'),
(431,'update',NULL,'2026-11-07 04:35:23','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','13','http://localhost:8100'),
(432,'update',NULL,'2026-11-07 04:35:27','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quoteitems','13','http://localhost:8100'),
(433,'update',NULL,'2026-11-07 04:35:27','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','13','http://localhost:8100'),
(434,'update',NULL,'2026-11-07 04:35:28','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','quotes','13','http://localhost:8100'),
(435,'create',NULL,'2026-11-07 04:35:38','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','payment','14','http://localhost:8100'),
(436,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:36:15','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(437,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:39:44','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(438,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:41:14','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(439,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:41:33','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(440,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:42:49','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(441,'login','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-07 04:43:00','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','http://localhost:8100'),
(442,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 04:44:55','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(443,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 04:45:19','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(444,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 05:06:56','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(445,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 05:07:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(446,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-07 05:07:19','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100'),
(447,'login','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-08 01:32:12','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','http://localhost:8100');
/*!40000 ALTER TABLE `directus_activity` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_collections`
--

DROP TABLE IF EXISTS `directus_collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_collections` (
  `collection` varchar(64) NOT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `display_template` varchar(255) DEFAULT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT 0,
  `singleton` tinyint(1) NOT NULL DEFAULT 0,
  `translations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`translations`)),
  `archive_field` varchar(64) DEFAULT NULL,
  `archive_app_filter` tinyint(1) NOT NULL DEFAULT 1,
  `archive_value` varchar(255) DEFAULT NULL,
  `unarchive_value` varchar(255) DEFAULT NULL,
  `sort_field` varchar(64) DEFAULT NULL,
  `accountability` varchar(255) DEFAULT 'all',
  `color` varchar(255) DEFAULT NULL,
  `item_duplication_fields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`item_duplication_fields`)),
  `sort` int(11) DEFAULT NULL,
  `group` varchar(64) DEFAULT NULL,
  `collapse` varchar(255) NOT NULL DEFAULT 'open',
  `preview_url` varchar(255) DEFAULT NULL,
  `versioning` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `autosave_revision_interval` float(8,2) DEFAULT NULL,
  PRIMARY KEY (`collection`),
  KEY `directus_collections_group_foreign` (`group`),
  CONSTRAINT `directus_collections_group_foreign` FOREIGN KEY (`group`) REFERENCES `directus_collections` (`collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_collections`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_collections` WRITE;
/*!40000 ALTER TABLE `directus_collections` DISABLE KEYS */;
INSERT INTO `directus_collections` VALUES
('appointments',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('brands',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('colors',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('diagnoses',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('evidence',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('fuels',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('history',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('methods',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('models',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('parts',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('payment',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('quoteitems',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('quoteparts',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('quotes',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('services',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('status',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('users',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('vehicles',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL),
('workorders',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0,'active',NULL);
/*!40000 ALTER TABLE `directus_collections` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_comments`
--

DROP TABLE IF EXISTS `directus_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_comments` (
  `id` char(36) NOT NULL,
  `collection` varchar(64) NOT NULL,
  `item` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  `user_updated` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_comments_user_created_foreign` (`user_created`),
  KEY `directus_comments_user_updated_foreign` (`user_updated`),
  CONSTRAINT `directus_comments_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_comments_user_updated_foreign` FOREIGN KEY (`user_updated`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_comments`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_comments` WRITE;
/*!40000 ALTER TABLE `directus_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_comments` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_dashboards`
--

DROP TABLE IF EXISTS `directus_dashboards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_dashboards` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(64) NOT NULL DEFAULT 'dashboard',
  `note` text DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_dashboards_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_dashboards_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_dashboards`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_dashboards` WRITE;
/*!40000 ALTER TABLE `directus_dashboards` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_dashboards` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_deployment_projects`
--

DROP TABLE IF EXISTS `directus_deployment_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_deployment_projects` (
  `id` char(36) NOT NULL,
  `deployment` char(36) NOT NULL,
  `external_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `framework` varchar(255) DEFAULT NULL,
  `deployable` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_deployment_projects_deployment_external_id_unique` (`deployment`,`external_id`),
  KEY `directus_deployment_projects_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_deployment_projects_deployment_foreign` FOREIGN KEY (`deployment`) REFERENCES `directus_deployments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_deployment_projects_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_deployment_projects`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_deployment_projects` WRITE;
/*!40000 ALTER TABLE `directus_deployment_projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_deployment_projects` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_deployment_runs`
--

DROP TABLE IF EXISTS `directus_deployment_runs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_deployment_runs` (
  `id` char(36) NOT NULL,
  `project` char(36) NOT NULL,
  `external_id` varchar(255) NOT NULL,
  `target` varchar(255) NOT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_deployment_runs_project_foreign` (`project`),
  KEY `directus_deployment_runs_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_deployment_runs_project_foreign` FOREIGN KEY (`project`) REFERENCES `directus_deployment_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_deployment_runs_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_deployment_runs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_deployment_runs` WRITE;
/*!40000 ALTER TABLE `directus_deployment_runs` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_deployment_runs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_deployments`
--

DROP TABLE IF EXISTS `directus_deployments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_deployments` (
  `id` char(36) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `credentials` text DEFAULT NULL,
  `options` text DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  `webhook_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`webhook_ids`)),
  `webhook_secret` varchar(255) DEFAULT NULL,
  `last_synced_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_deployments_provider_unique` (`provider`),
  KEY `directus_deployments_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_deployments_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_deployments`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_deployments` WRITE;
/*!40000 ALTER TABLE `directus_deployments` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_deployments` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_extensions`
--

DROP TABLE IF EXISTS `directus_extensions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_extensions` (
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `id` char(36) NOT NULL,
  `folder` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `bundle` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_extensions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_extensions` WRITE;
/*!40000 ALTER TABLE `directus_extensions` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_extensions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_fields`
--

DROP TABLE IF EXISTS `directus_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_fields` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `collection` varchar(64) NOT NULL,
  `field` varchar(64) NOT NULL,
  `special` varchar(64) DEFAULT NULL,
  `interface` varchar(64) DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `display` varchar(64) DEFAULT NULL,
  `display_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`display_options`)),
  `readonly` tinyint(1) NOT NULL DEFAULT 0,
  `hidden` tinyint(1) NOT NULL DEFAULT 0,
  `sort` int(10) unsigned DEFAULT NULL,
  `width` varchar(30) DEFAULT 'full',
  `translations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`translations`)),
  `note` text DEFAULT NULL,
  `conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`conditions`)),
  `required` tinyint(1) DEFAULT 0,
  `group` varchar(64) DEFAULT NULL,
  `validation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`validation`)),
  `validation_message` text DEFAULT NULL,
  `searchable` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `directus_fields_collection_foreign` (`collection`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_fields`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_fields` WRITE;
/*!40000 ALTER TABLE `directus_fields` DISABLE KEYS */;
INSERT INTO `directus_fields` VALUES
(1,'workorders','mechanic_id',NULL,NULL,NULL,NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `directus_fields` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_files`
--

DROP TABLE IF EXISTS `directus_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_files` (
  `id` char(36) NOT NULL,
  `storage` varchar(255) NOT NULL,
  `filename_disk` varchar(255) DEFAULT NULL,
  `filename_download` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `folder` char(36) DEFAULT NULL,
  `uploaded_by` char(36) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_by` char(36) DEFAULT NULL,
  `modified_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `charset` varchar(50) DEFAULT NULL,
  `filesize` bigint(20) DEFAULT NULL,
  `width` int(10) unsigned DEFAULT NULL,
  `height` int(10) unsigned DEFAULT NULL,
  `duration` int(10) unsigned DEFAULT NULL,
  `embed` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `focal_point_x` int(11) DEFAULT NULL,
  `focal_point_y` int(11) DEFAULT NULL,
  `tus_id` varchar(64) DEFAULT NULL,
  `tus_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tus_data`)),
  `uploaded_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_files_uploaded_by_foreign` (`uploaded_by`),
  KEY `directus_files_modified_by_foreign` (`modified_by`),
  KEY `directus_files_folder_foreign` (`folder`),
  CONSTRAINT `directus_files_folder_foreign` FOREIGN KEY (`folder`) REFERENCES `directus_folders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_files_modified_by_foreign` FOREIGN KEY (`modified_by`) REFERENCES `directus_users` (`id`),
  CONSTRAINT `directus_files_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_files`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_files` WRITE;
/*!40000 ALTER TABLE `directus_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_files` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_flows`
--

DROP TABLE IF EXISTS `directus_flows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_flows` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `trigger` varchar(255) DEFAULT NULL,
  `accountability` varchar(255) DEFAULT 'all',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `operation` char(36) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  `folder` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_flows_operation_unique` (`operation`),
  KEY `directus_flows_user_created_foreign` (`user_created`),
  KEY `directus_flows_folder_foreign` (`folder`),
  CONSTRAINT `directus_flows_folder_foreign` FOREIGN KEY (`folder`) REFERENCES `directus_folders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_flows_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_flows`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_flows` WRITE;
/*!40000 ALTER TABLE `directus_flows` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_flows` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_folders`
--

DROP TABLE IF EXISTS `directus_folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_folders` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent` char(36) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'files',
  PRIMARY KEY (`id`),
  KEY `directus_folders_parent_foreign` (`parent`),
  CONSTRAINT `directus_folders_parent_foreign` FOREIGN KEY (`parent`) REFERENCES `directus_folders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_folders`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_folders` WRITE;
/*!40000 ALTER TABLE `directus_folders` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_folders` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_migrations`
--

DROP TABLE IF EXISTS `directus_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_migrations` (
  `version` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_migrations` WRITE;
/*!40000 ALTER TABLE `directus_migrations` DISABLE KEYS */;
INSERT INTO `directus_migrations` VALUES
('20201028A','Remove Collection Foreign Keys','2026-10-30 03:21:07'),
('20201029A','Remove System Relations','2026-10-30 03:21:07'),
('20201029B','Remove System Collections','2026-10-30 03:21:07'),
('20201029C','Remove System Fields','2026-10-30 03:21:07'),
('20201105A','Add Cascade System Relations','2026-10-30 03:21:08'),
('20201105B','Change Webhook URL Type','2026-10-30 03:21:08'),
('20210225A','Add Relations Sort Field','2026-10-30 03:21:08'),
('20210304A','Remove Locked Fields','2026-10-30 03:21:08'),
('20210312A','Webhooks Collections Text','2026-10-30 03:21:08'),
('20210331A','Add Refresh Interval','2026-10-30 03:21:08'),
('20210415A','Make Filesize Nullable','2026-10-30 03:21:08'),
('20210416A','Add Collections Accountability','2026-10-30 03:21:09'),
('20210422A','Remove Files Interface','2026-10-30 03:21:09'),
('20210506A','Rename Interfaces','2026-10-30 03:21:09'),
('20210510A','Restructure Relations','2026-10-30 03:21:09'),
('20210518A','Add Foreign Key Constraints','2026-10-30 03:21:09'),
('20210519A','Add System Fk Triggers','2026-10-30 03:21:10'),
('20210521A','Add Collections Icon Color','2026-10-30 03:21:10'),
('20210525A','Add Insights','2026-10-30 03:21:10'),
('20210608A','Add Deep Clone Config','2026-10-30 03:21:10'),
('20210626A','Change Filesize Bigint','2026-10-30 03:21:10'),
('20210716A','Add Conditions to Fields','2026-10-30 03:21:10'),
('20210721A','Add Default Folder','2026-10-30 03:21:10'),
('20210802A','Replace Groups','2026-10-30 03:21:10'),
('20210803A','Add Required to Fields','2026-10-30 03:21:10'),
('20210805A','Update Groups','2026-10-30 03:21:10'),
('20210805B','Change Image Metadata Structure','2026-10-30 03:21:10'),
('20210811A','Add Geometry Config','2026-10-30 03:21:10'),
('20210831A','Remove Limit Column','2026-10-30 03:21:10'),
('20210903A','Add Auth Provider','2026-10-30 03:21:10'),
('20210907A','Webhooks Collections Not Null','2026-10-30 03:21:11'),
('20210910A','Move Module Setup','2026-10-30 03:21:11'),
('20210920A','Webhooks URL Not Null','2026-10-30 03:21:11'),
('20210924A','Add Collection Organization','2026-10-30 03:21:11'),
('20210927A','Replace Fields Group','2026-10-30 03:21:11'),
('20210927B','Replace M2M Interface','2026-10-30 03:21:11'),
('20210929A','Rename Login Action','2026-10-30 03:21:11'),
('20211007A','Update Presets','2026-10-30 03:21:11'),
('20211009A','Add Auth Data','2026-10-30 03:21:11'),
('20211016A','Add Webhook Headers','2026-10-30 03:21:11'),
('20211103A','Set Unique to User Token','2026-10-30 03:21:11'),
('20211103B','Update Special Geometry','2026-10-30 03:21:11'),
('20211104A','Remove Collections Listing','2026-10-30 03:21:11'),
('20211118A','Add Notifications','2026-10-30 03:21:11'),
('20211211A','Add Shares','2026-10-30 03:21:12'),
('20211230A','Add Project Descriptor','2026-10-30 03:21:12'),
('20220303A','Remove Default Project Color','2026-10-30 03:21:12'),
('20220308A','Add Bookmark Icon and Color','2026-10-30 03:21:12'),
('20220314A','Add Translation Strings','2026-10-30 03:21:12'),
('20220322A','Rename Field Typecast Flags','2026-10-30 03:21:12'),
('20220323A','Add Field Validation','2026-10-30 03:21:12'),
('20220325A','Fix Typecast Flags','2026-10-30 03:21:12'),
('20220325B','Add Default Language','2026-10-30 03:21:12'),
('20220402A','Remove Default Value Panel Icon','2026-10-30 03:21:12'),
('20220429A','Add Flows','2026-10-30 03:21:13'),
('20220429B','Add Color to Insights Icon','2026-10-30 03:21:13'),
('20220429C','Drop Non Null From IP of Activity','2026-10-30 03:21:13'),
('20220429D','Drop Non Null From Sender of Notifications','2026-10-30 03:21:13'),
('20220614A','Rename Hook Trigger to Event','2026-10-30 03:21:13'),
('20220801A','Update Notifications Timestamp Column','2026-10-30 03:21:13'),
('20220802A','Add Custom Aspect Ratios','2026-10-30 03:21:13'),
('20220826A','Add Origin to Accountability','2026-10-30 03:21:13'),
('20230401A','Update Material Icons','2026-10-30 03:21:13'),
('20230525A','Add Preview Settings','2026-10-30 03:21:13'),
('20230526A','Migrate Translation Strings','2026-10-30 03:21:13'),
('20230721A','Require Shares Fields','2026-10-30 03:21:13'),
('20230823A','Add Content Versioning','2026-10-30 03:21:14'),
('20230927A','Themes','2026-10-30 03:21:14'),
('20231009A','Update CSV Fields to Text','2026-10-30 03:21:14'),
('20231009B','Update Panel Options','2026-10-30 03:21:14'),
('20231010A','Add Extensions','2026-10-30 03:21:14'),
('20231215A','Add Focalpoints','2026-10-30 03:21:14'),
('20240122A','Add Report URL Fields','2026-10-30 03:21:14'),
('20240204A','Marketplace','2026-10-30 03:21:14'),
('20240305A','Change Useragent Type','2026-10-30 03:21:15'),
('20240311A','Deprecate Webhooks','2026-10-30 03:21:15'),
('20240422A','Public Registration','2026-10-30 03:21:15'),
('20240515A','Add Session Window','2026-10-30 03:21:15'),
('20240701A','Add Tus Data','2026-10-30 03:21:15'),
('20240716A','Update Files Date Fields','2026-10-30 03:21:15'),
('20240806A','Permissions Policies','2026-10-30 03:21:16'),
('20240817A','Update Icon Fields Length','2026-10-30 03:21:16'),
('20240909A','Separate Comments','2026-10-30 03:21:16'),
('20240909B','Consolidate Content Versioning','2026-10-30 03:21:16'),
('20240924A','Migrate Legacy Comments','2026-10-30 03:21:16'),
('20240924B','Populate Versioning Deltas','2026-10-30 03:21:16'),
('20250224A','Visual Editor','2026-10-30 03:21:16'),
('20250609A','License Banner','2026-10-30 03:21:16'),
('20250613A','Add Project ID','2026-10-30 03:21:16'),
('20250718A','Add Direction','2026-10-30 03:21:16'),
('20250813A','Add MCP','2026-10-30 03:21:16'),
('20251012A','Add Field Searchable','2026-10-30 03:21:16'),
('20251014A','Add Project Owner','2026-10-30 03:21:17'),
('20251028A','Add Retention Indexes','2026-10-30 03:21:17'),
('20251103A','Add AI Settings','2026-10-30 03:21:17'),
('20251224A','Remove Webhooks','2026-10-30 03:21:17'),
('20260110A','Add AI Provider Settings','2026-10-30 03:21:17'),
('20260113A','Add Revisions Index','2026-10-30 03:21:17'),
('20260128A','Add Collaborative Editing','2026-10-30 03:21:17'),
('20260204A','Add Deployment','2026-10-30 03:21:17'),
('20260211A','Add Deployment Webhooks','2026-10-30 03:21:18'),
('20260217A','Null Item Versions','2026-10-30 03:21:18'),
('20260312A','Add AI Translation Settings','2026-10-30 03:21:18'),
('20260507A','Add Licensing','2026-10-30 03:21:18'),
('20260512A','Add Autosave Revision Interval','2026-10-30 03:21:18'),
('20260512B','Add MCP Oauth','2026-10-30 03:21:19'),
('20260727A','Add Default Save Action','2026-10-30 03:21:19'),
('20260818A','Add Flow Folders','2026-10-30 03:21:19'),
('20260909A','Add Flows Module','2026-10-30 03:21:19'),
('20260924A','Add Preview Base URL','2026-10-30 03:21:19'),
('20261005A','Add Default Exports Folder','2026-10-30 03:21:19');
/*!40000 ALTER TABLE `directus_migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_notifications`
--

DROP TABLE IF EXISTS `directus_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_notifications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NULL DEFAULT current_timestamp(),
  `status` varchar(255) DEFAULT 'inbox',
  `recipient` char(36) NOT NULL,
  `sender` char(36) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `collection` varchar(64) DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_notifications_recipient_foreign` (`recipient`),
  KEY `directus_notifications_sender_foreign` (`sender`),
  CONSTRAINT `directus_notifications_recipient_foreign` FOREIGN KEY (`recipient`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_notifications_sender_foreign` FOREIGN KEY (`sender`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_notifications`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_notifications` WRITE;
/*!40000 ALTER TABLE `directus_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_notifications` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_oauth_clients`
--

DROP TABLE IF EXISTS `directus_oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_oauth_clients` (
  `client_id` varchar(255) NOT NULL,
  `client_name` varchar(200) NOT NULL,
  `redirect_uris` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`redirect_uris`)),
  `grant_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`grant_types`)),
  `token_endpoint_auth_method` varchar(255) NOT NULL DEFAULT 'none',
  `client_secret_hash` varchar(64) DEFAULT NULL,
  `registration_type` varchar(10) NOT NULL DEFAULT 'dcr',
  `client_uri` text DEFAULT NULL,
  `logo_uri` text DEFAULT NULL,
  `tos_uri` text DEFAULT NULL,
  `policy_uri` text DEFAULT NULL,
  `metadata_fetched_at` timestamp NULL DEFAULT NULL,
  `metadata_expires_at` timestamp NULL DEFAULT NULL,
  `metadata_etag` varchar(255) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`client_id`),
  KEY `directus_oauth_clients_date_created_index` (`date_created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_oauth_clients`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_oauth_clients` WRITE;
/*!40000 ALTER TABLE `directus_oauth_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_oauth_clients` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_oauth_codes`
--

DROP TABLE IF EXISTS `directus_oauth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_oauth_codes` (
  `id` char(36) NOT NULL,
  `code_hash` varchar(64) NOT NULL,
  `client` varchar(255) NOT NULL,
  `user` char(36) NOT NULL,
  `redirect_uri` varchar(255) NOT NULL,
  `resource` varchar(255) NOT NULL,
  `code_challenge` varchar(128) NOT NULL,
  `code_challenge_method` varchar(10) NOT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_oauth_codes_code_hash_unique` (`code_hash`),
  KEY `directus_oauth_codes_client_foreign` (`client`),
  KEY `directus_oauth_codes_user_foreign` (`user`),
  KEY `directus_oauth_codes_expires_at_index` (`expires_at`),
  KEY `directus_oauth_codes_used_at_index` (`used_at`),
  CONSTRAINT `directus_oauth_codes_client_foreign` FOREIGN KEY (`client`) REFERENCES `directus_oauth_clients` (`client_id`) ON DELETE CASCADE,
  CONSTRAINT `directus_oauth_codes_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_oauth_codes`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_oauth_codes` WRITE;
/*!40000 ALTER TABLE `directus_oauth_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_oauth_codes` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_oauth_consents`
--

DROP TABLE IF EXISTS `directus_oauth_consents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_oauth_consents` (
  `id` char(36) NOT NULL,
  `user` char(36) NOT NULL,
  `client` varchar(255) NOT NULL,
  `redirect_uri` varchar(255) NOT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `date_created` timestamp NOT NULL,
  `date_updated` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_oauth_consents_user_client_redirect_uri_unique` (`user`,`client`,`redirect_uri`),
  KEY `directus_oauth_consents_client_index` (`client`),
  CONSTRAINT `directus_oauth_consents_client_foreign` FOREIGN KEY (`client`) REFERENCES `directus_oauth_clients` (`client_id`) ON DELETE CASCADE,
  CONSTRAINT `directus_oauth_consents_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_oauth_consents`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_oauth_consents` WRITE;
/*!40000 ALTER TABLE `directus_oauth_consents` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_oauth_consents` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_oauth_tokens`
--

DROP TABLE IF EXISTS `directus_oauth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_oauth_tokens` (
  `id` char(36) NOT NULL,
  `client` varchar(255) NOT NULL,
  `user` char(36) NOT NULL,
  `session` varchar(64) NOT NULL,
  `previous_session` varchar(64) DEFAULT NULL,
  `resource` varchar(255) NOT NULL,
  `code_hash` varchar(64) NOT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `date_created` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_oauth_tokens_client_user_unique` (`client`,`user`),
  KEY `directus_oauth_tokens_user_foreign` (`user`),
  KEY `directus_oauth_tokens_session_index` (`session`),
  KEY `directus_oauth_tokens_previous_session_index` (`previous_session`),
  KEY `directus_oauth_tokens_code_hash_index` (`code_hash`),
  KEY `directus_oauth_tokens_expires_at_index` (`expires_at`),
  CONSTRAINT `directus_oauth_tokens_client_foreign` FOREIGN KEY (`client`) REFERENCES `directus_oauth_clients` (`client_id`) ON DELETE CASCADE,
  CONSTRAINT `directus_oauth_tokens_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_oauth_tokens`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_oauth_tokens` WRITE;
/*!40000 ALTER TABLE `directus_oauth_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_oauth_tokens` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_operations`
--

DROP TABLE IF EXISTS `directus_operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_operations` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `key` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `position_x` int(11) NOT NULL,
  `position_y` int(11) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `resolve` char(36) DEFAULT NULL,
  `reject` char(36) DEFAULT NULL,
  `flow` char(36) NOT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_operations_resolve_unique` (`resolve`),
  UNIQUE KEY `directus_operations_reject_unique` (`reject`),
  KEY `directus_operations_flow_foreign` (`flow`),
  KEY `directus_operations_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_operations_flow_foreign` FOREIGN KEY (`flow`) REFERENCES `directus_flows` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_operations_reject_foreign` FOREIGN KEY (`reject`) REFERENCES `directus_operations` (`id`),
  CONSTRAINT `directus_operations_resolve_foreign` FOREIGN KEY (`resolve`) REFERENCES `directus_operations` (`id`),
  CONSTRAINT `directus_operations_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_operations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_operations` WRITE;
/*!40000 ALTER TABLE `directus_operations` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_operations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_panels`
--

DROP TABLE IF EXISTS `directus_panels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_panels` (
  `id` char(36) NOT NULL,
  `dashboard` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `color` varchar(10) DEFAULT NULL,
  `show_header` tinyint(1) NOT NULL DEFAULT 0,
  `note` text DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `position_x` int(11) NOT NULL,
  `position_y` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_panels_dashboard_foreign` (`dashboard`),
  KEY `directus_panels_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_panels_dashboard_foreign` FOREIGN KEY (`dashboard`) REFERENCES `directus_dashboards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_panels_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_panels`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_panels` WRITE;
/*!40000 ALTER TABLE `directus_panels` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_panels` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_permissions`
--

DROP TABLE IF EXISTS `directus_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `collection` varchar(64) NOT NULL,
  `action` varchar(10) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `validation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`validation`)),
  `presets` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`presets`)),
  `fields` text DEFAULT NULL,
  `policy` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_permissions_collection_foreign` (`collection`),
  KEY `directus_permissions_policy_foreign` (`policy`),
  CONSTRAINT `directus_permissions_policy_foreign` FOREIGN KEY (`policy`) REFERENCES `directus_policies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_permissions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_permissions` WRITE;
/*!40000 ALTER TABLE `directus_permissions` DISABLE KEYS */;
INSERT INTO `directus_permissions` VALUES
(1,'appointments','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(2,'appointments','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(3,'appointments','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(4,'appointments','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(5,'appointments','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(6,'brands','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(7,'brands','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(8,'brands','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(9,'brands','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(10,'brands','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(11,'colors','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(12,'colors','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(13,'colors','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(14,'colors','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(15,'colors','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(16,'diagnoses','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(17,'diagnoses','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(18,'diagnoses','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(19,'diagnoses','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(20,'diagnoses','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(21,'evidence','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(22,'evidence','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(23,'evidence','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(24,'evidence','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(25,'evidence','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(26,'fuels','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(27,'fuels','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(28,'fuels','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(29,'fuels','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(30,'fuels','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(31,'history','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(32,'history','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(33,'history','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(34,'history','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(35,'history','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(36,'methods','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(37,'methods','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(38,'methods','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(39,'methods','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(40,'methods','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(41,'models','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(42,'models','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(43,'models','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(44,'models','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(45,'models','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(46,'parts','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(47,'parts','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(48,'parts','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(49,'parts','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(50,'parts','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(51,'payment','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(52,'payment','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(53,'payment','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(54,'payment','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(55,'payment','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(56,'quoteitems','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(57,'quoteitems','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(58,'quoteitems','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(59,'quoteitems','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(60,'quoteitems','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(61,'quoteparts','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(62,'quoteparts','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(63,'quoteparts','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(64,'quoteparts','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(65,'quoteparts','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(66,'quotes','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(67,'quotes','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(68,'quotes','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(69,'quotes','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(70,'quotes','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(71,'services','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(72,'services','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(73,'services','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(74,'services','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(75,'services','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(76,'status','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(77,'status','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(78,'status','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(79,'status','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(80,'status','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(81,'users','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(82,'users','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(83,'users','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(84,'users','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(85,'users','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(86,'vehicles','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(87,'vehicles','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(88,'vehicles','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(89,'vehicles','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(90,'vehicles','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(91,'workorders','create',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(92,'workorders','read',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(93,'workorders','update',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(94,'workorders','delete',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(95,'workorders','share',NULL,NULL,NULL,'*','abf8a154-5b1c-4a46-ac9c-7300570f4f17'),
(96,'appointments','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(97,'brands','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(98,'colors','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(99,'appointments','update',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(100,'appointments','create',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(101,'diagnoses','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(102,'evidence','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(103,'fuels','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(104,'history','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(105,'methods','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(106,'models','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(107,'payment','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(108,'parts','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(109,'quoteitems','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(110,'quoteparts','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(111,'quotes','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(112,'services','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(113,'status','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(114,'vehicles','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(115,'workorders','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(116,'payment','update',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(117,'quoteitems','update',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(118,'quoteparts','update',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(119,'quotes','update',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(120,'vehicles','update',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(121,'vehicles','create',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(122,'brands','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(123,'colors','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(124,'diagnoses','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(125,'evidence','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(126,'diagnoses','create',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(127,'diagnoses','update',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(128,'evidence','create',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(129,'evidence','update',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(130,'fuels','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(131,'history','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(132,'models','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(133,'parts','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(134,'quoteitems','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(135,'quoteparts','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(136,'quotes','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(137,'quotes','create',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(138,'quotes','update',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(139,'quoteparts','create',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(140,'quoteitems','create',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(141,'quoteitems','update',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(142,'quoteparts','update',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(143,'services','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(144,'status','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(145,'vehicles','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(146,'workorders','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(147,'workorders','update',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(148,'brands','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(149,'colors','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(150,'diagnoses','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(151,'evidence','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(152,'evidence','create',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(153,'evidence','update',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(154,'diagnoses','create',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(155,'diagnoses','update',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(156,'fuels','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(157,'history','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(158,'models','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(159,'parts','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(160,'quoteitems','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(161,'quoteparts','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(162,'quotes','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(163,'services','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(164,'status','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(165,'vehicles','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(166,'workorders','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(167,'directus_permissions','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(168,'directus_users','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(169,'directus_roles','read',NULL,NULL,NULL,'*','b809c4a1-b19d-4553-a3d4-cb98592fd8ad'),
(182,'directus_users','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(183,'directus_roles','read',NULL,NULL,NULL,'*','b90f5e38-cb4b-4664-8af7-607b96340b18'),
(184,'directus_roles','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38'),
(185,'directus_users','read',NULL,NULL,NULL,'*','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38');
/*!40000 ALTER TABLE `directus_permissions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_policies`
--

DROP TABLE IF EXISTS `directus_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_policies` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(64) NOT NULL DEFAULT 'badge',
  `description` text DEFAULT NULL,
  `ip_access` text DEFAULT NULL,
  `enforce_tfa` tinyint(1) NOT NULL DEFAULT 0,
  `admin_access` tinyint(1) NOT NULL DEFAULT 0,
  `app_access` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_policies`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_policies` WRITE;
/*!40000 ALTER TABLE `directus_policies` DISABLE KEYS */;
INSERT INTO `directus_policies` VALUES
('7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','mechanic','badge',NULL,NULL,0,0,0),
('abf8a154-5b1c-4a46-ac9c-7300570f4f17','$t:public_label','public','$t:public_description',NULL,0,0,0),
('b809c4a1-b19d-4553-a3d4-cb98592fd8ad','client','badge',NULL,NULL,0,0,1),
('b90f5e38-cb4b-4664-8af7-607b96340b18','assistant','badge',NULL,NULL,0,0,0),
('cf63ea41-96d3-4b55-bde3-cc27fc4346d6','Administrator','verified','$t:admin_description',NULL,0,1,1),
('eb9c9106-0ac5-431d-a7c5-aa16a8dbb91e','Administrator','verified','$t:admin_description',NULL,0,1,1);
/*!40000 ALTER TABLE `directus_policies` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_presets`
--

DROP TABLE IF EXISTS `directus_presets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_presets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bookmark` varchar(255) DEFAULT NULL,
  `user` char(36) DEFAULT NULL,
  `role` char(36) DEFAULT NULL,
  `collection` varchar(64) DEFAULT NULL,
  `search` varchar(100) DEFAULT NULL,
  `layout` varchar(100) DEFAULT 'tabular',
  `layout_query` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`layout_query`)),
  `layout_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`layout_options`)),
  `refresh_interval` int(11) DEFAULT NULL,
  `filter` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`filter`)),
  `icon` varchar(64) DEFAULT 'bookmark',
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_presets_collection_foreign` (`collection`),
  KEY `directus_presets_user_foreign` (`user`),
  KEY `directus_presets_role_foreign` (`role`),
  CONSTRAINT `directus_presets_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_presets_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_presets`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_presets` WRITE;
/*!40000 ALTER TABLE `directus_presets` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_presets` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_relations`
--

DROP TABLE IF EXISTS `directus_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_relations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `many_collection` varchar(64) NOT NULL,
  `many_field` varchar(64) NOT NULL,
  `one_collection` varchar(64) DEFAULT NULL,
  `one_field` varchar(64) DEFAULT NULL,
  `one_collection_field` varchar(64) DEFAULT NULL,
  `one_allowed_collections` text DEFAULT NULL,
  `junction_field` varchar(64) DEFAULT NULL,
  `sort_field` varchar(64) DEFAULT NULL,
  `one_deselect_action` varchar(255) NOT NULL DEFAULT 'nullify',
  PRIMARY KEY (`id`),
  KEY `directus_relations_many_collection_foreign` (`many_collection`),
  KEY `directus_relations_one_collection_foreign` (`one_collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_relations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_relations` WRITE;
/*!40000 ALTER TABLE `directus_relations` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_relations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_revisions`
--

DROP TABLE IF EXISTS `directus_revisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_revisions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activity` int(10) unsigned NOT NULL,
  `collection` varchar(64) NOT NULL,
  `item` varchar(255) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `delta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`delta`)),
  `parent` int(10) unsigned DEFAULT NULL,
  `version` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_revisions_collection_foreign` (`collection`),
  KEY `directus_revisions_parent_foreign` (`parent`),
  KEY `directus_revisions_activity_foreign` (`activity`),
  KEY `directus_revisions_version_foreign` (`version`),
  CONSTRAINT `directus_revisions_activity_foreign` FOREIGN KEY (`activity`) REFERENCES `directus_activity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_revisions_parent_foreign` FOREIGN KEY (`parent`) REFERENCES `directus_revisions` (`id`),
  CONSTRAINT `directus_revisions_version_foreign` FOREIGN KEY (`version`) REFERENCES `directus_versions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=334 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_revisions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_revisions` WRITE;
/*!40000 ALTER TABLE `directus_revisions` DISABLE KEYS */;
INSERT INTO `directus_revisions` VALUES
(1,2,'directus_collections','appointments','{\"collection\":\"appointments\"}','{\"collection\":\"appointments\"}',NULL,NULL),
(2,3,'directus_collections','brands','{\"collection\":\"brands\"}','{\"collection\":\"brands\"}',NULL,NULL),
(3,4,'directus_collections','colors','{\"collection\":\"colors\"}','{\"collection\":\"colors\"}',NULL,NULL),
(4,5,'directus_collections','diagnoses','{\"collection\":\"diagnoses\"}','{\"collection\":\"diagnoses\"}',NULL,NULL),
(5,6,'directus_collections','evidence','{\"collection\":\"evidence\"}','{\"collection\":\"evidence\"}',NULL,NULL),
(6,7,'directus_collections','fuels','{\"collection\":\"fuels\"}','{\"collection\":\"fuels\"}',NULL,NULL),
(7,8,'directus_collections','history','{\"collection\":\"history\"}','{\"collection\":\"history\"}',NULL,NULL),
(8,9,'directus_collections','methods','{\"collection\":\"methods\"}','{\"collection\":\"methods\"}',NULL,NULL),
(9,10,'directus_collections','models','{\"collection\":\"models\"}','{\"collection\":\"models\"}',NULL,NULL),
(10,11,'directus_collections','parts','{\"collection\":\"parts\"}','{\"collection\":\"parts\"}',NULL,NULL),
(11,12,'directus_collections','payment','{\"collection\":\"payment\"}','{\"collection\":\"payment\"}',NULL,NULL),
(12,13,'directus_collections','quoteitems','{\"collection\":\"quoteitems\"}','{\"collection\":\"quoteitems\"}',NULL,NULL),
(13,14,'directus_collections','quoteparts','{\"collection\":\"quoteparts\"}','{\"collection\":\"quoteparts\"}',NULL,NULL),
(14,15,'directus_collections','quotes','{\"collection\":\"quotes\"}','{\"collection\":\"quotes\"}',NULL,NULL),
(15,16,'directus_collections','services','{\"collection\":\"services\"}','{\"collection\":\"services\"}',NULL,NULL),
(16,17,'directus_collections','status','{\"collection\":\"status\"}','{\"collection\":\"status\"}',NULL,NULL),
(17,18,'directus_collections','users','{\"collection\":\"users\"}','{\"collection\":\"users\"}',NULL,NULL),
(18,19,'directus_collections','vehicles','{\"collection\":\"vehicles\"}','{\"collection\":\"vehicles\"}',NULL,NULL),
(19,20,'directus_collections','workorders','{\"collection\":\"workorders\"}','{\"collection\":\"workorders\"}',NULL,NULL),
(20,21,'directus_permissions','1','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"create\"}',NULL,NULL),
(21,22,'directus_permissions','2','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"read\"}',NULL,NULL),
(22,23,'directus_permissions','3','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"update\"}',NULL,NULL),
(23,24,'directus_permissions','4','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"delete\"}',NULL,NULL),
(24,25,'directus_permissions','5','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"share\"}',NULL,NULL),
(25,26,'directus_permissions','6','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"create\"}',NULL,NULL),
(26,27,'directus_permissions','7','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"read\"}',NULL,NULL),
(27,28,'directus_permissions','8','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"update\"}',NULL,NULL),
(28,29,'directus_permissions','9','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"delete\"}',NULL,NULL),
(29,30,'directus_permissions','10','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"share\"}',NULL,NULL),
(30,31,'directus_permissions','11','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"create\"}',NULL,NULL),
(31,32,'directus_permissions','12','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"read\"}',NULL,NULL),
(32,33,'directus_permissions','13','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"update\"}',NULL,NULL),
(33,34,'directus_permissions','14','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"delete\"}',NULL,NULL),
(34,35,'directus_permissions','15','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"share\"}',NULL,NULL),
(35,36,'directus_permissions','16','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"create\"}',NULL,NULL),
(36,37,'directus_permissions','17','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"read\"}',NULL,NULL),
(37,38,'directus_permissions','18','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"update\"}',NULL,NULL),
(38,39,'directus_permissions','19','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"delete\"}',NULL,NULL),
(39,40,'directus_permissions','20','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"share\"}',NULL,NULL),
(40,41,'directus_permissions','21','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"create\"}',NULL,NULL),
(41,42,'directus_permissions','22','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"read\"}',NULL,NULL),
(42,43,'directus_permissions','23','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"update\"}',NULL,NULL),
(43,44,'directus_permissions','24','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"delete\"}',NULL,NULL),
(44,45,'directus_permissions','25','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"share\"}',NULL,NULL),
(45,46,'directus_permissions','26','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"create\"}',NULL,NULL),
(46,47,'directus_permissions','27','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"read\"}',NULL,NULL),
(47,48,'directus_permissions','28','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"update\"}',NULL,NULL),
(48,49,'directus_permissions','29','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"delete\"}',NULL,NULL),
(49,50,'directus_permissions','30','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"share\"}',NULL,NULL),
(50,51,'directus_permissions','31','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"create\"}',NULL,NULL),
(51,52,'directus_permissions','32','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"read\"}',NULL,NULL),
(52,53,'directus_permissions','33','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"update\"}',NULL,NULL),
(53,54,'directus_permissions','34','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"delete\"}',NULL,NULL),
(54,55,'directus_permissions','35','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"share\"}',NULL,NULL),
(55,56,'directus_permissions','36','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"create\"}',NULL,NULL),
(56,57,'directus_permissions','37','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"read\"}',NULL,NULL),
(57,58,'directus_permissions','38','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"update\"}',NULL,NULL),
(58,59,'directus_permissions','39','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"delete\"}',NULL,NULL),
(59,60,'directus_permissions','40','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"share\"}',NULL,NULL),
(60,61,'directus_permissions','41','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"create\"}',NULL,NULL),
(61,62,'directus_permissions','42','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"read\"}',NULL,NULL),
(62,63,'directus_permissions','43','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"update\"}',NULL,NULL),
(63,64,'directus_permissions','44','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"delete\"}',NULL,NULL),
(64,65,'directus_permissions','45','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"share\"}',NULL,NULL),
(65,66,'directus_permissions','46','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"create\"}',NULL,NULL),
(66,67,'directus_permissions','47','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"read\"}',NULL,NULL),
(67,68,'directus_permissions','48','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"update\"}',NULL,NULL),
(68,69,'directus_permissions','49','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"delete\"}',NULL,NULL),
(69,70,'directus_permissions','50','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"share\"}',NULL,NULL),
(70,71,'directus_permissions','51','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"create\"}',NULL,NULL),
(71,72,'directus_permissions','52','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"read\"}',NULL,NULL),
(72,73,'directus_permissions','53','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"update\"}',NULL,NULL),
(73,74,'directus_permissions','54','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"delete\"}',NULL,NULL),
(74,75,'directus_permissions','55','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"share\"}',NULL,NULL),
(75,76,'directus_permissions','56','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"create\"}',NULL,NULL),
(76,77,'directus_permissions','57','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"read\"}',NULL,NULL),
(77,78,'directus_permissions','58','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"update\"}',NULL,NULL),
(78,79,'directus_permissions','59','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"delete\"}',NULL,NULL),
(79,80,'directus_permissions','60','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"share\"}',NULL,NULL),
(80,81,'directus_permissions','61','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"create\"}',NULL,NULL),
(81,82,'directus_permissions','62','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"read\"}',NULL,NULL),
(82,83,'directus_permissions','63','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"update\"}',NULL,NULL),
(83,84,'directus_permissions','64','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"delete\"}',NULL,NULL),
(84,85,'directus_permissions','65','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"share\"}',NULL,NULL),
(85,86,'directus_permissions','66','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"create\"}',NULL,NULL),
(86,87,'directus_permissions','67','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"read\"}',NULL,NULL),
(87,88,'directus_permissions','68','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"update\"}',NULL,NULL),
(88,89,'directus_permissions','69','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"delete\"}',NULL,NULL),
(89,90,'directus_permissions','70','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"share\"}',NULL,NULL),
(90,91,'directus_permissions','71','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"create\"}',NULL,NULL),
(91,92,'directus_permissions','72','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"read\"}',NULL,NULL),
(92,93,'directus_permissions','73','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"update\"}',NULL,NULL),
(93,94,'directus_permissions','74','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"delete\"}',NULL,NULL),
(94,95,'directus_permissions','75','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"share\"}',NULL,NULL),
(95,96,'directus_permissions','76','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"create\"}',NULL,NULL),
(96,97,'directus_permissions','77','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"read\"}',NULL,NULL),
(97,98,'directus_permissions','78','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"update\"}',NULL,NULL),
(98,99,'directus_permissions','79','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"delete\"}',NULL,NULL),
(99,100,'directus_permissions','80','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"share\"}',NULL,NULL),
(100,101,'directus_permissions','81','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"create\"}',NULL,NULL),
(101,102,'directus_permissions','82','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"read\"}',NULL,NULL),
(102,103,'directus_permissions','83','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"update\"}',NULL,NULL),
(103,104,'directus_permissions','84','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"delete\"}',NULL,NULL),
(104,105,'directus_permissions','85','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"users\",\"action\":\"share\"}',NULL,NULL),
(105,106,'directus_permissions','86','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"create\"}',NULL,NULL),
(106,107,'directus_permissions','87','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"read\"}',NULL,NULL),
(107,108,'directus_permissions','88','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"update\"}',NULL,NULL),
(108,109,'directus_permissions','89','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"delete\"}',NULL,NULL),
(109,110,'directus_permissions','90','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"share\"}',NULL,NULL),
(110,111,'directus_permissions','91','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"create\"}',NULL,NULL),
(111,112,'directus_permissions','92','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"read\"}',NULL,NULL),
(112,113,'directus_permissions','93','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"update\"}',NULL,NULL),
(113,114,'directus_permissions','94','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"delete\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"delete\"}',NULL,NULL),
(114,115,'directus_permissions','95','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"share\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"share\"}',NULL,NULL),
(115,117,'directus_settings','1','{\"id\":1,\"project_name\":\"Directus\",\"project_url\":null,\"project_color\":\"#6644FF\",\"public_note\":null,\"auth_login_attempts\":25,\"auth_password_policy\":null,\"storage_asset_transform\":\"all\",\"storage_asset_presets\":null,\"custom_css\":null,\"basemaps\":null,\"mapbox_key\":null,\"module_bar\":null,\"project_descriptor\":null,\"default_language\":\"en-US\",\"custom_aspect_ratios\":null,\"default_appearance\":\"auto\",\"default_theme_light\":null,\"theme_light_overrides\":null,\"default_theme_dark\":null,\"theme_dark_overrides\":null,\"report_error_url\":null,\"report_bug_url\":null,\"report_feature_url\":null,\"public_registration\":true,\"public_registration_verify_email\":false,\"public_registration_email_filter\":null,\"visual_editor_urls\":null,\"project_id\":\"01a18ad3-76da-7506-9972-7da563833114\",\"mcp_enabled\":false,\"mcp_allow_deletes\":false,\"mcp_prompts_collection\":null,\"mcp_system_prompt_enabled\":true,\"mcp_system_prompt\":null,\"project_owner\":\"waxho@waxho.com\",\"project_usage\":\"personal\",\"org_name\":null,\"product_updates\":false,\"project_status\":null,\"ai_openai_api_key\":null,\"ai_anthropic_api_key\":null,\"ai_system_prompt\":null,\"ai_google_api_key\":null,\"ai_openai_compatible_api_key\":null,\"ai_openai_compatible_base_url\":null,\"ai_openai_compatible_name\":null,\"ai_openai_compatible_models\":null,\"ai_openai_compatible_headers\":null,\"ai_openai_allowed_models\":null,\"ai_anthropic_allowed_models\":null,\"ai_google_allowed_models\":null,\"collaborative_editing_enabled\":false,\"ai_translation_default_model\":null,\"ai_translation_glossary\":null,\"ai_translation_style_guide\":null,\"license_key\":null,\"license_token\":null,\"mcp_oauth_enabled\":false,\"mcp_oauth_dcr_enabled\":false,\"mcp_oauth_cimd_enabled\":false,\"default_save_action\":\"save-and-quit\",\"preview_base_url\":null}','{\"public_registration\":true,\"public_registration_verify_email\":false}',NULL,NULL),
(116,118,'directus_policies','b809c4a1-b19d-4553-a3d4-cb98592fd8ad','{\"name\":\"client\"}','{\"name\":\"client\"}',117,NULL),
(117,119,'directus_access','f8e355e0-9b9d-4f13-8bd3-88498118b71e','{\"sort\":1}','{\"sort\":1}',118,NULL),
(118,120,'directus_roles','9fd2c60e-1197-4ca0-84e9-46ef57c3995d','{\"name\":\"client\"}','{\"name\":\"client\"}',119,NULL),
(119,121,'directus_settings','1','{\"id\":1,\"project_name\":\"Directus\",\"project_url\":null,\"project_color\":\"#6644FF\",\"public_note\":null,\"auth_login_attempts\":25,\"auth_password_policy\":null,\"storage_asset_transform\":\"all\",\"storage_asset_presets\":null,\"custom_css\":null,\"basemaps\":null,\"mapbox_key\":null,\"module_bar\":null,\"project_descriptor\":null,\"default_language\":\"en-US\",\"custom_aspect_ratios\":null,\"default_appearance\":\"auto\",\"default_theme_light\":null,\"theme_light_overrides\":null,\"default_theme_dark\":null,\"theme_dark_overrides\":null,\"report_error_url\":null,\"report_bug_url\":null,\"report_feature_url\":null,\"public_registration\":true,\"public_registration_verify_email\":false,\"public_registration_email_filter\":null,\"visual_editor_urls\":null,\"project_id\":\"01a18ad3-76da-7506-9972-7da563833114\",\"mcp_enabled\":false,\"mcp_allow_deletes\":false,\"mcp_prompts_collection\":null,\"mcp_system_prompt_enabled\":true,\"mcp_system_prompt\":null,\"project_owner\":\"waxho@waxho.com\",\"project_usage\":\"personal\",\"org_name\":null,\"product_updates\":false,\"project_status\":null,\"ai_openai_api_key\":null,\"ai_anthropic_api_key\":null,\"ai_system_prompt\":null,\"ai_google_api_key\":null,\"ai_openai_compatible_api_key\":null,\"ai_openai_compatible_base_url\":null,\"ai_openai_compatible_name\":null,\"ai_openai_compatible_models\":null,\"ai_openai_compatible_headers\":null,\"ai_openai_allowed_models\":null,\"ai_anthropic_allowed_models\":null,\"ai_google_allowed_models\":null,\"collaborative_editing_enabled\":false,\"ai_translation_default_model\":null,\"ai_translation_glossary\":null,\"ai_translation_style_guide\":null,\"license_key\":null,\"license_token\":null,\"mcp_oauth_enabled\":false,\"mcp_oauth_dcr_enabled\":false,\"mcp_oauth_cimd_enabled\":false,\"default_save_action\":\"save-and-quit\",\"preview_base_url\":null}','{\"public_registration_role\":\"9fd2c60e-1197-4ca0-84e9-46ef57c3995d\"}',NULL,NULL),
(120,123,'brands','1','{\"id\":1,\"name\":\"Toyotaa\",\"is_active\":1,\"created_at\":\"2026-10-30T03:20:46\"}','{\"name\":\"Toyotaa\"}',NULL,NULL),
(121,124,'brands','11','{\"name\":\"McQueen\"}','{\"name\":\"McQueen\"}',NULL,NULL),
(122,125,'colors','11','{\"name\":\"Pistache\"}','{\"name\":\"Pistache\"}',NULL,NULL),
(123,126,'colors','12','{\"name\":\"Bronce\"}','{\"name\":\"Bronce\"}',NULL,NULL),
(124,127,'colors','11','{\"id\":11,\"name\":\"Pistachea\",\"is_active\":1,\"created_at\":\"2026-10-31T20:57:10\"}','{\"name\":\"Pistachea\"}',NULL,NULL),
(125,128,'diagnoses','11','{\"description\":\"problemas\",\"result\":\"\"}','{\"description\":\"problemas\",\"result\":\"\"}',NULL,NULL),
(126,129,'diagnoses','11','{\"id\":11,\"description\":\"problemas muchos\",\"result\":\"resueltos\",\"created_at\":\"2026-10-31T21:01:35\"}','{\"workorder_id\":2,\"description\":\"problemas muchos\",\"result\":\"resueltos\"}',NULL,NULL),
(127,130,'fuels','1','{\"id\":1,\"name\":\"Gasolinaa\",\"is_active\":1,\"created_at\":\"2026-10-30T03:20:46\"}','{\"name\":\"Gasolinaa\"}',NULL,NULL),
(128,131,'fuels','6','{\"name\":\"Fusion\"}','{\"name\":\"Fusion\"}',NULL,NULL),
(129,132,'methods','6','{\"name\":\"Criptos\"}','{\"name\":\"Criptos\"}',NULL,NULL),
(130,133,'methods','5','{\"id\":5,\"name\":\"Pago móvill\",\"is_active\":1,\"created_at\":\"2026-10-30T03:20:46\"}','{\"name\":\"Pago móvill\"}',NULL,NULL),
(131,134,'models','1','{\"id\":1,\"name\":\"Corollaa\",\"is_active\":1,\"created_at\":\"2026-10-30T03:20:46\"}','{\"brand_id\":1,\"name\":\"Corollaa\"}',NULL,NULL),
(132,135,'models','11','{\"name\":\"Tsuru\"}','{\"name\":\"Tsuru\"}',NULL,NULL),
(133,136,'models','12','{\"name\":\"papo\"}','{\"name\":\"papo\"}',NULL,NULL),
(134,137,'parts','1','{\"id\":1,\"name\":\"Filtro de aceitee\",\"price\":\"810.00\",\"description\":\"Filtro de aceite de motor genéricoa\",\"is_active\":1,\"created_at\":\"2026-10-30T03:20:46\"}','{\"name\":\"Filtro de aceitee\",\"price\":810,\"description\":\"Filtro de aceite de motor genéricoa\"}',NULL,NULL),
(135,138,'parts','11','{\"name\":\"Escape\",\"price\":100,\"description\":\"escape para carro :)\"}','{\"name\":\"Escape\",\"price\":100,\"description\":\"escape para carro :)\"}',NULL,NULL),
(136,139,'quoteparts','4','{\"id\":4,\"quantity\":2,\"price\":\"850.00\",\"discount\":\"0.00\",\"amount\":\"1700.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(137,140,'quotes','3','{\"id\":3,\"subtotal\":\"1700.00\",\"tax\":\"272.00\",\"total\":\"1972.00\",\"validity\":\"2025-07-15\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-10-31T21:53:40\"}','{\"subtotal\":1700,\"tax\":272,\"total\":1972}',NULL,NULL),
(138,141,'quoteparts','5','{\"id\":5,\"quantity\":2,\"price\":\"750.00\",\"discount\":\"0.00\",\"amount\":\"1500.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(139,142,'quotes','3','{\"id\":3,\"subtotal\":\"3200.00\",\"tax\":\"512.00\",\"total\":\"3712.00\",\"validity\":\"2025-07-15\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-10-31T21:53:41\"}','{\"subtotal\":3200,\"tax\":512,\"total\":3712}',NULL,NULL),
(140,143,'quoteitems','3','{\"id\":3,\"price\":\"2200.00\",\"discount\":\"0.00\",\"amount\":\"2200.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(141,144,'quotes','3','{\"id\":3,\"subtotal\":\"5400.00\",\"tax\":\"864.00\",\"total\":\"6264.00\",\"validity\":\"2025-07-15\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-10-31T21:53:42\"}','{\"subtotal\":5400,\"tax\":864,\"total\":6264}',NULL,NULL),
(142,145,'quoteparts','4','{\"id\":4,\"quantity\":2,\"price\":\"850.00\",\"discount\":\"0.00\",\"amount\":\"1700.00\",\"is_approved\":0}','{\"is_approved\":0}',NULL,NULL),
(143,146,'quotes','3','{\"id\":3,\"subtotal\":\"3700.00\",\"tax\":\"592.00\",\"total\":\"4292.00\",\"validity\":\"2025-07-15\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-10-31T21:53:43\"}','{\"subtotal\":3700,\"tax\":592,\"total\":4292}',NULL,NULL),
(144,147,'quotes','3','{\"id\":3,\"subtotal\":\"3700.00\",\"tax\":\"592.00\",\"total\":\"4292.00\",\"validity\":\"2025-07-15\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-10-31T21:53:47\"}','{\"status_id\":10}',NULL,NULL),
(145,148,'payment','11','{\"amount\":4292,\"reference\":\"askasjksa\",\"paid_at\":\"2026-10-31T21:54:01\"}','{\"amount\":4292,\"reference\":\"askasjksa\",\"paid_at\":\"2026-10-31T21:54:01\"}',NULL,NULL),
(146,149,'quotes','11','{\"subtotal\":3470,\"tax\":555.2,\"total\":4025.2,\"validity\":\"2027-01-02\"}','{\"subtotal\":3470,\"tax\":555.2,\"total\":4025.2,\"validity\":\"2027-01-02\"}',NULL,NULL),
(147,150,'quoteitems','11','{\"price\":3500,\"discount\":10,\"amount\":3150,\"is_approved\":false}','{\"price\":3500,\"discount\":10,\"amount\":3150,\"is_approved\":false}',NULL,NULL),
(148,151,'quoteparts','11','{\"quantity\":1,\"price\":320,\"discount\":0,\"amount\":320,\"is_approved\":false}','{\"quantity\":1,\"price\":320,\"discount\":0,\"amount\":320,\"is_approved\":false}',NULL,NULL),
(149,152,'quoteitems','11','{\"id\":11,\"price\":\"3500.00\",\"discount\":\"10.00\",\"amount\":\"3150.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(150,153,'quotes','11','{\"id\":11,\"subtotal\":\"3150.00\",\"tax\":\"504.00\",\"total\":\"3654.00\",\"validity\":\"2027-01-02\",\"created_at\":\"2026-10-31T22:46:20\",\"updated_at\":\"2026-10-31T22:46:29\"}','{\"subtotal\":3150,\"tax\":504,\"total\":3654}',NULL,NULL),
(151,154,'quotes','11','{\"id\":11,\"subtotal\":\"3150.00\",\"tax\":\"504.00\",\"total\":\"3654.00\",\"validity\":\"2027-01-02\",\"created_at\":\"2026-10-31T22:46:20\",\"updated_at\":\"2026-10-31T22:46:30\"}','{\"status_id\":10}',NULL,NULL),
(152,155,'payment','12','{\"amount\":3654,\"reference\":null,\"paid_at\":\"2026-10-31T22:46:38\"}','{\"amount\":3654,\"reference\":null,\"paid_at\":\"2026-10-31T22:46:38\"}',NULL,NULL),
(153,156,'services','11','{\"name\":\"PAPO\",\"price\":67,\"description\":\"SI\"}','{\"name\":\"PAPO\",\"price\":67,\"description\":\"SI\"}',NULL,NULL),
(154,157,'services','11','{\"id\":11,\"name\":\"PAPO2\",\"price\":\"67.50\",\"description\":\"SI1\",\"is_active\":1,\"created_at\":\"2026-10-31T23:00:09\"}','{\"name\":\"PAPO2\",\"price\":67.5,\"description\":\"SI1\"}',NULL,NULL),
(155,158,'vehicles','1','{\"id\":1,\"year\":2019,\"plate\":\"ABC1234\",\"vin\":\"1HGBH41JXMN109186\",\"mileage\":45000,\"is_active\":1,\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-10-31T23:51:46\"}','{\"user_id\":1,\"model_id\":2,\"fuel_id\":1,\"color_id\":1,\"year\":2019,\"plate\":\"ABC1234\",\"vin\":\"1HGBH41JXMN109186\",\"mileage\":45000}',NULL,NULL),
(156,159,'vehicles','11','{\"plate\":\"12191922\",\"vin\":\"121101221912\",\"year\":2003,\"mileage\":10029}','{\"plate\":\"12191922\",\"vin\":\"121101221912\",\"year\":2003,\"mileage\":10029}',NULL,NULL),
(157,160,'vehicles','11','{\"id\":11,\"year\":2003,\"plate\":\"12191922\",\"vin\":\"121101221912\",\"mileage\":10029,\"is_active\":1,\"created_at\":\"2026-10-31T23:53:02\",\"updated_at\":\"2026-10-31T23:53:17\"}','{\"user_id\":1,\"model_id\":12,\"fuel_id\":6,\"color_id\":3,\"year\":2003,\"plate\":\"12191922\",\"vin\":\"121101221912\",\"mileage\":10029}',NULL,NULL),
(158,161,'workorders','11','{\"mileage\":1000}','{\"mileage\":1000}',NULL,NULL),
(159,162,'diagnoses','12','{\"description\":\"assa\",\"result\":\"asjsak\"}','{\"description\":\"assa\",\"result\":\"asjsak\"}',NULL,NULL),
(160,163,'quotes','12','{\"subtotal\":5780,\"tax\":924.8,\"total\":6704.8,\"validity\":\"2027-10-01\"}','{\"subtotal\":5780,\"tax\":924.8,\"total\":6704.8,\"validity\":\"2027-10-01\"}',NULL,NULL),
(161,164,'quoteitems','12','{\"price\":3500,\"discount\":0,\"amount\":3500,\"is_approved\":false}','{\"price\":3500,\"discount\":0,\"amount\":3500,\"is_approved\":false}',NULL,NULL),
(162,165,'quoteparts','12','{\"quantity\":19,\"price\":120,\"discount\":0,\"amount\":2280,\"is_approved\":false}','{\"quantity\":19,\"price\":120,\"discount\":0,\"amount\":2280,\"is_approved\":false}',NULL,NULL),
(163,166,'workorders','11','{\"id\":11,\"mileage\":1000,\"delivery\":null,\"created_at\":\"2026-11-01T00:10:35\",\"updated_at\":\"2026-11-01T00:15:48\"}','{\"vehicle_id\":2,\"mechanic_id\":8,\"status_id\":5,\"mileage\":1000}',NULL,NULL),
(164,167,'appointments','3','{\"id\":3,\"date\":\"2025-07-03\",\"time\":\"11:00:00\",\"reason\":\"Revisión preventiva general\",\"created_at\":\"2026-10-30T03:20:46\"}','{\"status_id\":3}',NULL,NULL),
(165,168,'workorders','12','{\"mileage\":11001021,\"delivery\":null}','{\"mileage\":11001021,\"delivery\":null}',NULL,NULL),
(166,169,'appointments','6','{\"id\":6,\"date\":\"2025-07-07\",\"time\":\"10:00:00\",\"reason\":\"Luz de check engine encendida\",\"created_at\":\"2026-10-30T03:20:46\"}','{\"status_id\":2}',NULL,NULL),
(167,170,'workorders','13','{\"mileage\":102021,\"delivery\":null}','{\"mileage\":102021,\"delivery\":null}',NULL,NULL),
(168,171,'appointments','8','{\"id\":8,\"date\":\"2025-07-09\",\"time\":\"11:30:00\",\"reason\":\"Cambio de aceite y revisión\",\"created_at\":\"2026-10-30T03:20:46\"}','{\"status_id\":2}',NULL,NULL),
(169,175,'directus_roles','f870afcb-338f-4f2e-bdf3-d56648cd2836','{\"name\":\"mechanic\"}','{\"name\":\"mechanic\"}',NULL,NULL),
(170,176,'directus_policies','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','{\"name\":\"mechanic\",\"admin_access\":false,\"app_access\":false}','{\"name\":\"mechanic\",\"admin_access\":false,\"app_access\":false}',NULL,NULL),
(171,177,'directus_policies','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','{\"id\":\"7ac29d7a-5c9f-4dfc-999a-1a16cad9be38\",\"name\":\"mechanic\",\"icon\":\"badge\",\"description\":null,\"ip_access\":null,\"enforce_tfa\":false,\"admin_access\":false,\"app_access\":true}','{\"app_access\":true}',NULL,NULL),
(172,178,'directus_policies','b90f5e38-cb4b-4664-8af7-607b96340b18','{\"name\":\"assistant\",\"admin_access\":false,\"app_access\":true}','{\"name\":\"assistant\",\"admin_access\":false,\"app_access\":true}',NULL,NULL),
(173,179,'directus_roles','625eab29-7a2b-41cc-9086-0f9f235abc9b','{\"name\":\"mechanic\"}','{\"name\":\"mechanic\"}',NULL,NULL),
(174,180,'directus_access','bdd6d7a1-20ff-49f8-8873-15a19a836256','{\"sort\":1}','{\"sort\":1}',NULL,NULL),
(175,182,'directus_roles','24d0bcbb-c316-45fe-98a1-beab4f06b3cd','{\"name\":\"assistant\"}','{\"name\":\"assistant\"}',NULL,NULL),
(176,183,'directus_access','87d34524-d95f-4a67-ad7b-0d9015fa8e72','{\"sort\":1}','{\"sort\":1}',NULL,NULL),
(177,185,'appointments','11','{\"date\":\"2027-02-01\",\"time\":\"14:01\",\"reason\":\"si\"}','{\"date\":\"2027-02-01\",\"time\":\"14:01\",\"reason\":\"si\"}',NULL,NULL),
(178,187,'directus_permissions','96','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"read\"}',NULL,NULL),
(179,188,'directus_permissions','97','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"read\"}',NULL,NULL),
(180,189,'directus_permissions','98','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"read\"}',NULL,NULL),
(181,190,'directus_permissions','99','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"update\"}',NULL,NULL),
(182,191,'directus_permissions','100','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"appointments\",\"action\":\"create\"}',NULL,NULL),
(183,192,'directus_permissions','101','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"read\"}',NULL,NULL),
(184,193,'directus_permissions','102','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"read\"}',NULL,NULL),
(185,194,'directus_permissions','103','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"read\"}',NULL,NULL),
(186,195,'directus_permissions','104','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"read\"}',NULL,NULL),
(187,196,'directus_permissions','105','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"methods\",\"action\":\"read\"}',NULL,NULL),
(188,197,'directus_permissions','106','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"read\"}',NULL,NULL),
(189,198,'directus_permissions','107','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"read\"}',NULL,NULL),
(190,199,'directus_permissions','108','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"read\"}',NULL,NULL),
(191,200,'directus_permissions','109','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"read\"}',NULL,NULL),
(192,201,'directus_permissions','110','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"read\"}',NULL,NULL),
(193,202,'directus_permissions','111','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"read\"}',NULL,NULL),
(194,203,'directus_permissions','112','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"read\"}',NULL,NULL),
(195,204,'directus_permissions','113','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"read\"}',NULL,NULL),
(196,205,'directus_permissions','114','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"read\"}',NULL,NULL),
(197,206,'directus_permissions','115','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"read\"}',NULL,NULL),
(198,207,'directus_permissions','116','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"payment\",\"action\":\"update\"}',NULL,NULL),
(199,208,'directus_permissions','117','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"update\"}',NULL,NULL),
(200,209,'directus_permissions','118','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"update\"}',NULL,NULL),
(201,210,'directus_permissions','119','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"update\"}',NULL,NULL),
(202,211,'directus_permissions','120','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"update\"}',NULL,NULL),
(203,212,'directus_permissions','121','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"create\"}',NULL,NULL),
(204,214,'directus_access','f8e355e0-9b9d-4f13-8bd3-88498118b71e','{\"id\":\"f8e355e0-9b9d-4f13-8bd3-88498118b71e\",\"sort\":1}','{\"policy\":\"b809c4a1-b19d-4553-a3d4-cb98592fd8ad\"}',NULL,NULL),
(205,216,'directus_policies','7ac29d7a-5c9f-4dfc-999a-1a16cad9be38','{\"id\":\"7ac29d7a-5c9f-4dfc-999a-1a16cad9be38\",\"name\":\"mechanic\",\"icon\":\"badge\",\"description\":null,\"ip_access\":null,\"enforce_tfa\":false,\"admin_access\":false,\"app_access\":false}','{\"app_access\":false}',NULL,NULL),
(206,217,'directus_permissions','122','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"read\"}',NULL,NULL),
(207,218,'directus_permissions','123','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"read\"}',NULL,NULL),
(208,219,'directus_permissions','124','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"read\"}',NULL,NULL),
(209,220,'directus_permissions','125','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"read\"}',NULL,NULL),
(210,221,'directus_permissions','126','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"create\"}',NULL,NULL),
(211,222,'directus_permissions','127','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"update\"}',NULL,NULL),
(212,223,'directus_permissions','128','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"create\"}',NULL,NULL),
(213,224,'directus_permissions','129','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"update\"}',NULL,NULL),
(214,225,'directus_permissions','130','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"read\"}',NULL,NULL),
(215,226,'directus_permissions','131','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"read\"}',NULL,NULL),
(216,227,'directus_permissions','132','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"read\"}',NULL,NULL),
(217,228,'directus_permissions','133','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"read\"}',NULL,NULL),
(218,229,'directus_permissions','134','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"read\"}',NULL,NULL),
(219,230,'directus_permissions','135','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"read\"}',NULL,NULL),
(220,231,'directus_permissions','136','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"read\"}',NULL,NULL),
(221,232,'directus_permissions','137','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"create\"}',NULL,NULL),
(222,233,'directus_permissions','138','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"update\"}',NULL,NULL),
(223,234,'directus_permissions','139','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"create\"}',NULL,NULL),
(224,235,'directus_permissions','140','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"create\"}',NULL,NULL),
(225,236,'directus_permissions','141','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"update\"}',NULL,NULL),
(226,237,'directus_permissions','142','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"update\"}',NULL,NULL),
(227,238,'directus_permissions','143','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"read\"}',NULL,NULL),
(228,239,'directus_permissions','144','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"read\"}',NULL,NULL),
(229,240,'directus_permissions','145','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"read\"}',NULL,NULL),
(230,241,'directus_permissions','146','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"read\"}',NULL,NULL),
(231,242,'directus_permissions','147','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"update\"}',NULL,NULL),
(232,244,'directus_policies','b90f5e38-cb4b-4664-8af7-607b96340b18','{\"id\":\"b90f5e38-cb4b-4664-8af7-607b96340b18\",\"name\":\"assistant\",\"icon\":\"badge\",\"description\":null,\"ip_access\":null,\"enforce_tfa\":false,\"admin_access\":false,\"app_access\":false}','{\"app_access\":false}',NULL,NULL),
(233,245,'directus_permissions','148','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"brands\",\"action\":\"read\"}',NULL,NULL),
(234,246,'directus_permissions','149','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"colors\",\"action\":\"read\"}',NULL,NULL),
(235,247,'directus_permissions','150','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"read\"}',NULL,NULL),
(236,248,'directus_permissions','151','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"read\"}',NULL,NULL),
(237,249,'directus_permissions','152','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"create\"}',NULL,NULL),
(238,250,'directus_permissions','153','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"evidence\",\"action\":\"update\"}',NULL,NULL),
(239,251,'directus_permissions','154','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"create\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"create\"}',NULL,NULL),
(240,252,'directus_permissions','155','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"update\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"diagnoses\",\"action\":\"update\"}',NULL,NULL),
(241,253,'directus_permissions','156','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"fuels\",\"action\":\"read\"}',NULL,NULL),
(242,254,'directus_permissions','157','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"history\",\"action\":\"read\"}',NULL,NULL),
(243,255,'directus_permissions','158','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"models\",\"action\":\"read\"}',NULL,NULL),
(244,256,'directus_permissions','159','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"parts\",\"action\":\"read\"}',NULL,NULL),
(245,257,'directus_permissions','160','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteitems\",\"action\":\"read\"}',NULL,NULL),
(246,258,'directus_permissions','161','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quoteparts\",\"action\":\"read\"}',NULL,NULL),
(247,259,'directus_permissions','162','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"quotes\",\"action\":\"read\"}',NULL,NULL),
(248,260,'directus_permissions','163','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"services\",\"action\":\"read\"}',NULL,NULL),
(249,261,'directus_permissions','164','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"status\",\"action\":\"read\"}',NULL,NULL),
(250,262,'directus_permissions','165','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"vehicles\",\"action\":\"read\"}',NULL,NULL),
(251,263,'directus_permissions','166','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"workorders\",\"action\":\"read\"}',NULL,NULL),
(252,272,'directus_policies','b809c4a1-b19d-4553-a3d4-cb98592fd8ad','{\"id\":\"b809c4a1-b19d-4553-a3d4-cb98592fd8ad\",\"name\":\"client\",\"icon\":\"badge\",\"description\":null,\"ip_access\":null,\"enforce_tfa\":false,\"admin_access\":false,\"app_access\":true}','{\"app_access\":true}',NULL,NULL),
(253,275,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(254,276,'quotes','6','{\"id\":6,\"subtotal\":\"250.00\",\"tax\":\"40.00\",\"total\":\"290.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-06T04:22:55\"}','{\"subtotal\":250,\"tax\":40,\"total\":290}',NULL,NULL),
(255,277,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":0}','{\"is_approved\":0}',NULL,NULL),
(256,278,'quotes','6','{\"id\":6,\"subtotal\":\"0.00\",\"tax\":\"0.00\",\"total\":\"0.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-06T04:22:56\"}','{\"subtotal\":0,\"tax\":0,\"total\":0}',NULL,NULL),
(257,286,'directus_permissions','167','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_permissions\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_permissions\",\"action\":\"read\"}',NULL,NULL),
(258,289,'directus_permissions','168','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_users\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_users\",\"action\":\"read\"}',NULL,NULL),
(259,292,'directus_permissions','169','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_roles\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_roles\",\"action\":\"read\"}',NULL,NULL),
(260,300,'quoteitems','4','{\"id\":4,\"price\":\"400.00\",\"discount\":\"0.00\",\"amount\":\"400.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(261,301,'quotes','4','{\"id\":4,\"subtotal\":\"400.00\",\"tax\":\"64.00\",\"total\":\"464.00\",\"validity\":\"2025-07-14\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-06T05:42:11\"}','{\"subtotal\":400,\"tax\":64,\"total\":464}',NULL,NULL),
(262,302,'quotes','4','{\"id\":4,\"subtotal\":\"400.00\",\"tax\":\"64.00\",\"total\":\"464.00\",\"validity\":\"2025-07-14\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-06T05:42:13\"}','{\"status_id\":10}',NULL,NULL),
(263,303,'payment','13','{\"amount\":464,\"reference\":\"saaa\",\"paid_at\":\"2026-11-06T05:42:21\"}','{\"amount\":464,\"reference\":\"saaa\",\"paid_at\":\"2026-11-06T05:42:21\"}',NULL,NULL),
(264,308,'directus_users','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','{\"first_name\":\"Administrador\",\"email\":\"admin@vexora.com\",\"password\":\"**********\"}','{\"first_name\":\"Administrador\",\"email\":\"admin@vexora.com\",\"password\":\"**********\"}',NULL,NULL),
(265,311,'directus_fields','1','{\"special\":null,\"field\":\"mechanic_id\"}','{\"special\":null,\"field\":\"mechanic_id\"}',NULL,NULL),
(266,316,'directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','{\"first_name\":\"Assistant\",\"email\":\"assistan@vexora.com\",\"password\":\"**********\"}','{\"first_name\":\"Assistant\",\"email\":\"assistan@vexora.com\",\"password\":\"**********\"}',NULL,NULL),
(267,318,'directus_users','c8f0319a-1cee-4a94-9130-80c0454552a0','{\"first_name\":\"Mechanic\",\"email\":\"mechanic@vexora.com\",\"password\":\"**********\"}','{\"first_name\":\"Mechanic\",\"email\":\"mechanic@vexora.com\",\"password\":\"**********\"}',NULL,NULL),
(268,320,'directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','{\"id\":\"1f754ea4-f86a-4060-94a8-9c1ceb57dad9\",\"first_name\":\"Assistant\",\"last_name\":null,\"email\":\"assistan@vexora.com\",\"password\":\"**********\",\"location\":null,\"title\":null,\"description\":null,\"tags\":null,\"language\":null,\"tfa_secret\":null,\"status\":\"active\",\"token\":null,\"last_access\":null,\"last_page\":null,\"provider\":\"default\",\"external_identifier\":null,\"auth_data\":null,\"email_notifications\":true,\"appearance\":null,\"theme_dark\":null,\"theme_light\":null,\"theme_light_overrides\":null,\"theme_dark_overrides\":null,\"text_direction\":\"auto\"}','{\"password\":\"**********\"}',NULL,NULL),
(269,322,'directus_users','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','{\"id\":\"1f754ea4-f86a-4060-94a8-9c1ceb57dad9\",\"first_name\":\"Assistant\",\"last_name\":null,\"email\":\"assistant@vexora.com\",\"password\":\"**********\",\"location\":null,\"title\":null,\"description\":null,\"tags\":null,\"language\":null,\"tfa_secret\":null,\"status\":\"active\",\"token\":null,\"last_access\":null,\"last_page\":null,\"provider\":\"default\",\"external_identifier\":null,\"auth_data\":null,\"email_notifications\":true,\"appearance\":null,\"theme_dark\":null,\"theme_light\":null,\"theme_light_overrides\":null,\"theme_dark_overrides\":null,\"text_direction\":\"auto\"}','{\"email\":\"assistant@vexora.com\"}',NULL,NULL),
(299,361,'directus_permissions','182','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_users\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_users\",\"action\":\"read\"}',NULL,NULL),
(300,363,'directus_access','87d34524-d95f-4a67-ad7b-0d9015fa8e72','{\"id\":\"87d34524-d95f-4a67-ad7b-0d9015fa8e72\",\"sort\":1}','{\"policy\":\"b90f5e38-cb4b-4664-8af7-607b96340b18\"}',NULL,NULL),
(301,364,'directus_access','530ee0c7-68b2-4bec-b364-f609b7903595','{\"sort\":1}','{\"sort\":1}',NULL,NULL),
(302,368,'directus_permissions','183','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_roles\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_roles\",\"action\":\"read\"}',NULL,NULL),
(303,370,'directus_access','87d34524-d95f-4a67-ad7b-0d9015fa8e72','{\"id\":\"87d34524-d95f-4a67-ad7b-0d9015fa8e72\",\"sort\":1}','{\"policy\":\"b90f5e38-cb4b-4664-8af7-607b96340b18\"}',NULL,NULL),
(304,373,'directus_permissions','184','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_roles\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_roles\",\"action\":\"read\"}',NULL,NULL),
(305,374,'directus_permissions','185','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_users\",\"action\":\"read\"}','{\"permissions\":null,\"validation\":null,\"fields\":[\"*\"],\"presets\":null,\"collection\":\"directus_users\",\"action\":\"read\"}',NULL,NULL),
(306,396,'quotes','13','{\"subtotal\":650,\"tax\":104,\"total\":754,\"validity\":\"2029-04-02\"}','{\"subtotal\":650,\"tax\":104,\"total\":754,\"validity\":\"2029-04-02\"}',NULL,NULL),
(307,397,'quoteitems','13','{\"price\":650,\"discount\":0,\"amount\":650,\"is_approved\":false}','{\"price\":650,\"discount\":0,\"amount\":650,\"is_approved\":false}',NULL,NULL),
(308,403,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(309,404,'quotes','6','{\"id\":6,\"subtotal\":\"250.00\",\"tax\":\"40.00\",\"total\":\"290.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-07T04:14:00\"}','{\"subtotal\":250,\"tax\":40,\"total\":290}',NULL,NULL),
(310,405,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":0}','{\"is_approved\":0}',NULL,NULL),
(311,406,'quotes','6','{\"id\":6,\"subtotal\":\"0.00\",\"tax\":\"0.00\",\"total\":\"0.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-07T04:14:01\"}','{\"subtotal\":0,\"tax\":0,\"total\":0}',NULL,NULL),
(312,407,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(313,408,'quotes','6','{\"id\":6,\"subtotal\":\"250.00\",\"tax\":\"40.00\",\"total\":\"290.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-07T04:14:01\"}','{\"subtotal\":250,\"tax\":40,\"total\":290}',NULL,NULL),
(314,409,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":0}','{\"is_approved\":0}',NULL,NULL),
(315,410,'quotes','6','{\"id\":6,\"subtotal\":\"0.00\",\"tax\":\"0.00\",\"total\":\"0.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-07T04:14:01\"}','{\"subtotal\":0,\"tax\":0,\"total\":0}',NULL,NULL),
(316,411,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(317,412,'quotes','6','{\"id\":6,\"subtotal\":\"250.00\",\"tax\":\"40.00\",\"total\":\"290.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-07T04:14:01\"}','{\"subtotal\":250,\"tax\":40,\"total\":290}',NULL,NULL),
(318,413,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":0}','{\"is_approved\":0}',NULL,NULL),
(319,414,'quotes','6','{\"id\":6,\"subtotal\":\"0.00\",\"tax\":\"0.00\",\"total\":\"0.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-07T04:14:01\"}','{\"subtotal\":0,\"tax\":0,\"total\":0}',NULL,NULL),
(320,415,'quoteitems','6','{\"id\":6,\"price\":\"250.00\",\"discount\":\"0.00\",\"amount\":\"250.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(321,416,'quotes','6','{\"id\":6,\"subtotal\":\"250.00\",\"tax\":\"40.00\",\"total\":\"290.00\",\"validity\":\"2025-07-18\",\"created_at\":\"2026-10-30T03:20:46\",\"updated_at\":\"2026-11-07T04:14:02\"}','{\"subtotal\":250,\"tax\":40,\"total\":290}',NULL,NULL),
(322,424,'quoteitems','13','{\"id\":13,\"price\":\"650.00\",\"discount\":\"0.00\",\"amount\":\"650.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(323,425,'quotes','13','{\"id\":13,\"subtotal\":\"650.00\",\"tax\":\"104.00\",\"total\":\"754.00\",\"validity\":\"2029-04-02\",\"created_at\":\"2026-11-07T04:08:02\",\"updated_at\":\"2026-11-07T04:08:02\"}','{\"subtotal\":650,\"tax\":104,\"total\":754}',NULL,NULL),
(324,426,'quoteitems','13','{\"id\":13,\"price\":\"650.00\",\"discount\":\"0.00\",\"amount\":\"650.00\",\"is_approved\":0}','{\"is_approved\":0}',NULL,NULL),
(325,427,'quotes','13','{\"id\":13,\"subtotal\":\"0.00\",\"tax\":\"0.00\",\"total\":\"0.00\",\"validity\":\"2029-04-02\",\"created_at\":\"2026-11-07T04:08:02\",\"updated_at\":\"2026-11-07T04:35:21\"}','{\"subtotal\":0,\"tax\":0,\"total\":0}',NULL,NULL),
(326,428,'quoteitems','13','{\"id\":13,\"price\":\"650.00\",\"discount\":\"0.00\",\"amount\":\"650.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(327,429,'quotes','13','{\"id\":13,\"subtotal\":\"650.00\",\"tax\":\"104.00\",\"total\":\"754.00\",\"validity\":\"2029-04-02\",\"created_at\":\"2026-11-07T04:08:02\",\"updated_at\":\"2026-11-07T04:35:22\"}','{\"subtotal\":650,\"tax\":104,\"total\":754}',NULL,NULL),
(328,430,'quoteitems','13','{\"id\":13,\"price\":\"650.00\",\"discount\":\"0.00\",\"amount\":\"650.00\",\"is_approved\":0}','{\"is_approved\":0}',NULL,NULL),
(329,431,'quotes','13','{\"id\":13,\"subtotal\":\"0.00\",\"tax\":\"0.00\",\"total\":\"0.00\",\"validity\":\"2029-04-02\",\"created_at\":\"2026-11-07T04:08:02\",\"updated_at\":\"2026-11-07T04:35:23\"}','{\"subtotal\":0,\"tax\":0,\"total\":0}',NULL,NULL),
(330,432,'quoteitems','13','{\"id\":13,\"price\":\"650.00\",\"discount\":\"0.00\",\"amount\":\"650.00\",\"is_approved\":1}','{\"is_approved\":1}',NULL,NULL),
(331,433,'quotes','13','{\"id\":13,\"subtotal\":\"650.00\",\"tax\":\"104.00\",\"total\":\"754.00\",\"validity\":\"2029-04-02\",\"created_at\":\"2026-11-07T04:08:02\",\"updated_at\":\"2026-11-07T04:35:27\"}','{\"subtotal\":650,\"tax\":104,\"total\":754}',NULL,NULL),
(332,434,'quotes','13','{\"id\":13,\"subtotal\":\"650.00\",\"tax\":\"104.00\",\"total\":\"754.00\",\"validity\":\"2029-04-02\",\"created_at\":\"2026-11-07T04:08:02\",\"updated_at\":\"2026-11-07T04:35:28\"}','{\"status_id\":10}',NULL,NULL),
(333,435,'payment','14','{\"amount\":754,\"reference\":\"askaj1\",\"paid_at\":\"2026-11-07T04:35:38\"}','{\"amount\":754,\"reference\":\"askaj1\",\"paid_at\":\"2026-11-07T04:35:38\"}',NULL,NULL);
/*!40000 ALTER TABLE `directus_revisions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_roles`
--

DROP TABLE IF EXISTS `directus_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_roles` (
  `id` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(64) NOT NULL DEFAULT 'supervised_user_circle',
  `description` text DEFAULT NULL,
  `parent` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_roles_parent_foreign` (`parent`),
  CONSTRAINT `directus_roles_parent_foreign` FOREIGN KEY (`parent`) REFERENCES `directus_roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_roles`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_roles` WRITE;
/*!40000 ALTER TABLE `directus_roles` DISABLE KEYS */;
INSERT INTO `directus_roles` VALUES
('24d0bcbb-c316-45fe-98a1-beab4f06b3cd','assistant','supervised_user_circle',NULL,NULL),
('3823f47a-27ae-40dc-9b0b-b446f31449b1','Administrator','verified','$t:admin_description',NULL),
('625eab29-7a2b-41cc-9086-0f9f235abc9b','mechanic','supervised_user_circle',NULL,NULL),
('87547614-33d5-4d6b-b79b-5d3890687f65','Administrator','verified','$t:admin_description',NULL),
('9fd2c60e-1197-4ca0-84e9-46ef57c3995d','client','supervised_user_circle',NULL,NULL),
('f870afcb-338f-4f2e-bdf3-d56648cd2836','mechanic','supervised_user_circle',NULL,NULL);
/*!40000 ALTER TABLE `directus_roles` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_sessions`
--

DROP TABLE IF EXISTS `directus_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_sessions` (
  `token` varchar(64) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `expires` timestamp NOT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `share` char(36) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `next_token` varchar(64) DEFAULT NULL,
  `oauth_client` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`token`),
  KEY `directus_sessions_user_foreign` (`user`),
  KEY `directus_sessions_share_foreign` (`share`),
  KEY `directus_sessions_oauth_client_index` (`oauth_client`),
  CONSTRAINT `directus_sessions_oauth_client_foreign` FOREIGN KEY (`oauth_client`) REFERENCES `directus_oauth_clients` (`client_id`) ON DELETE CASCADE,
  CONSTRAINT `directus_sessions_share_foreign` FOREIGN KEY (`share`) REFERENCES `directus_shares` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_sessions_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_sessions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_sessions` WRITE;
/*!40000 ALTER TABLE `directus_sessions` DISABLE KEYS */;
INSERT INTO `directus_sessions` VALUES
('06znwfFUXRi5FosIKEopArA2rZ_Y5sy2B2M3upqaMEV2Mj9P2xhWOPGJS-r-6uqv','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:54:20','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('1FGp2Nltgn3ztug6Janl7PvbOzuY5bMyHeWJxBgG6msTdOW4sMCXc_W6hC5jeCIy','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-13 06:33:32','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('1vYZqxTntzgQ1n5MFfz8nq1IeDTfLtJpOjq_cmiy3TdcThGkyPG-bCyCEV6j9km3','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 04:01:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('46SAwjacIcX2q6BYm0wWqvXVZI-csmvIc8yHAuexMHqtmMcdkA41kjkEbhiNIdDz','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:36:15','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('4LP8fXyL13k-evxEFJbm-z6nVS1dqk4KViwXec4CS3H9JPr27qmPyZdd-lnf7mE_','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 04:32:40','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('4YPMpQww7YhQkXPXR0EpZKsMbtF1UrBKh1n5n6faa3yiHdWC2SceRZyOJXokCM1x','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:43:00','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('57vOoO7zxM7Kuk0E6Bc84sABRa6jJyJEI1Hvd74jjG7gW41SCzEwVRU2K2F5A6Sl','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-13 20:42:50','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('5FxcO29m0IwqSl5utSE1sq69skYJilQQqkAO9pPLi2DDOZSLvxOT8Zg9b-XfGd1z','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 03:41:01','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('5LVArQvERsryc_wgdQKZdg7p3VvDUchRSMtqnZUhTzZuw7_UBPskmK4cuQ7ZCFhc','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-13 21:23:24','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('6Ln5KeqvQS-JdIiZd2swUlUJ1XbrPiPyJ5k6OFc5JdiDO7F9MlacNSjM2MtPuV5f','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:10:21','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('7Eg210sxGKfK_XuL2i782IhOgQi-L_fMcOXpw2Y7uF6Ei2qtoSqYNZrUwifPV8ZS','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:11:45','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('7HyDrFt7hgwKSW72pMPjzTOJXuh-6Ak33jNYJ9k8xwGeimb07h30cxpt13bsz6Zx','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 05:07:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('8k8JJbBShe914uLM49pL0SrinzLZIKIAq4lKXR8SpP-ijLGAVkt4kdGwfe0Q6YkM','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:12:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('8nDmsgu3NjEsELj55CZnpYh9DX34sExEHSyl2f3VwGXVyo4d5s61ksqzmzPtVHkJ','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-12 04:47:12','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('8yD42Q56rR_mthrfltCzwVGxrTpneliTSZjY_DLkGh5eINC1_13ACpN-l8BpqKn_','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-13 06:38:23','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('9oj8g6sizyLWVN_oxi08RV_eGS8uvZ1ybBaMLniiswVootNsAmobh2qaU7oK4HLP','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 06:24:59','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('9rK6C4H36p4VyD_24J9N4l5dRuU_XPYlhy6YY6ldM-gYQE9PrGSUD2ymnT78bGEg','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 03:30:07','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('aeSNiDc4HIBd4iq_7_0VfeVo-CviuX8fA3pztDpLEIbWOgFt8e0hZx-dhgMpPxf8','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 03:34:14','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('ajVEiiKtMGZLvq1FLZO1JSl_47y4FIYll_htoru_eHrm07GdWexi511g8Zz0_nH7','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:41:14','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('AvYKgpz2OfjVA_sggdN1HKrPQVjqza9y6JGEQ2Sx1AqIU_tx4qlQ6xhYbOkW7fZ5','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-09 01:32:25','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8000',NULL,NULL),
('b-B2D5PIc5VQb3DT80JaBubJwpqpyR2scbgacCmX_hFkHhaOfVCK0tZN0ndcBZXc','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 04:46:02','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('B3uiappjpcO74Lb0wgkD6gfVBTrnG_5NP3Sat7zs0f1iAyR3Zi5SUkfvo5hoOe0t','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:13:25','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('b8hEAlC7yUG27F8bXXX-dPwRK452987jBgC_0tb3R7qFlTIfV93uH1fyTyFXJfYI','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:39:44','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('BcwL-C_7qQcpY__gqMzQmIqHXVe3SHBvVeQ8cEBESn7RoD3EHdwHfbH05msj0o_P','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 03:55:54','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('BTKNGTwEQ3FxVJTdcD-l_rkgm9ZtRJfP2kYaa1l7AuCT8B5Q86cGskS9AgUTlULO','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 04:18:43','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('BxdbVT2h0Jqiu08a6BqUYbg5kTNg6Kks6B7BOXK8KGRBXvaUXZDJu3R94jE5M4bG','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-13 06:00:42','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('C-gd1bXtDe3o08u4oP5PcUHo5KPCM7dcb0jvnlLXpD9J81BYmr9atOxV0CR5cp_a','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 03:18:22','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('C35aplugVsc-i4JJSV4KyIdg0Wvqzs4HqJ8t2-Pd7huJiICsolbFpUfDXXJaQUKb','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 04:04:50','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('CWvCTYLe5SsPy41wt2cMBeoxt15NrHVisGlOv9GwksnZzxjvRVHrxZEICudlsSs9','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 06:20:31','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('Cy2B-MZIyiA47iS8TeIv0H3bqxLnmlVCs8OVaFgeSHqvqy_Bd0JRIlfcY6WCtIaA','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-14 04:18:29','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('DE4Tu4nA_cDjZ6hjTXZu_RyFVuhstMedRDaYrkiOyao-MuSnoS-66fQYHlU8xIDW','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-12 04:44:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('DXcqp7CoWLsSw58riAW-SMssslmDMn_0tXAOB5JoEbKJv91rwlKFomvD7OwDLboZ','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 06:25:34','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('Ecq-D2aRnOp_q3LYcaXukffWlH74tjxq-okv-HCTFt7QI_TLOpIAJ50ZShYW9naj','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 06:32:02','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('F3C13b8dQfB22vLHYQMhm31jT5-3MLKylnLHldh2irFc5zWCi3zqV4wpHKmwY69V','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-13 06:31:32','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('FFH1gXxtCJm9Fle9qioYhydGJbpUCcWC5JbBExQ1Qi0yxPWOJBfQxY5omr2Hm56V','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:33:44','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('fPHbl59X58EPxFFUpNaHnLn4Jxbm8X5D4VSHIIFosS__AfrzuC69sj1jzV5lACN1','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-12 00:34:21','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('gjxbBxAnF20mRWfDSp_2q8fP3xtj67M_V858ja5pjdCLOOZNzVxWQ1kuQy6lBZOm','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 04:09:30','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('hKxzQj19MOGygR_MwganKSo5ntw7QmSMjohP2uCiH_gBHjhsiR2pTqEH4SGruIM0','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 03:19:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('hL_5jlR-ACBi-VQg9cTuPFDjBYHaxG47Fj1I0A1gDn9MBGICzjzLbZ7Vty6FA5dQ','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 06:24:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('IezcVU8g3thvNdkDuFlxt9ggRgqrS5yA6xxNCvyIHibSkqUBt8JKoOHkghsJpI8q','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-10 22:34:16','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('ILJDWs_t698t_PT5LotPAmI6ELTNAXEbJqILI3yPI_u8FaQ2SqK86vV6VBp7xOAO','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 04:45:19','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('iMgpjxeZJxxISvW12JZcdXbxpERXtk08vBcarV1z6KIcorMjczwqIhobd_vwMffB','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 06:32:35','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('is7cvW4HDTWh2gD1xpO_lu7Gby4diLSd7dl0eMS24rAPvB53IrlhnwyvCh6f-7dI','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-08 01:32:35','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8000','AvYKgpz2OfjVA_sggdN1HKrPQVjqza9y6JGEQ2Sx1AqIU_tx4qlQ6xhYbOkW7fZ5',NULL),
('JBinRqmk1YsIgHcUSobBnmqxHV16RuFArsQPEhV9qWgfn0AB88h1tJBh_lh9p49S','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 04:46:25','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('jo8CUioAsmDoP88VV6Ef6kv-qOTVy1pQj2x4KsPMM1k_mSgUByQL3X-bXO0hH5wp','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-13 06:42:31','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('JUSWm1aRkaNTQSnqLwDGK50mX-xPS9S5MqEoUevj2yYjGpW769yY2ah0c4DTGzy3','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 05:07:19','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('klCfq-9fyBPciT5XUACCQC3BaBr2w6rW21zE_JsNi3Q4o_M7CHQcSlorl8sb9Ehx','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:41:33','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('KmluBat2BmYRkmEH-tYcGSEK22brv2NfkrmVqgoI9-NGPBURlGs0MYSMT4bTW49y','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-14 04:33:17','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('l8GhOd6j6h3OajbQcq_Vf2wZBN2gwdlzi7HbBBj17Ttmo9AnBIR3lkxbKUK95p3E','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-12 04:49:08','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8000',NULL,NULL),
('m7-_RH0xqn01QbEEEQSjDBOrHT3yjstkjkVwzz2b2YOSM5oHWyjcrS_9h7o0Yax3','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 03:49:35','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('NANdPu8qXKQ7gSwUupS_k2nTIcPbFNInuEkDK8smSXqvgaxbHJDwL5g0KdJR30Tc','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 03:40:30','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('NBNi5KHn9nM30vHV0IWOZig_ox7VVs1oFhPRVLl0Z7bkSpyjiF1E5dsVEdsYgLX5','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-12 04:29:28','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('NftuzCx_n8Ed700k_-DbBB5V7SSb0zuOjmwGaSmHA45BcNwGOlFtCBBjMKz29gu6','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:07:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('O0bEwqAYUj6vIItw_JkYyWbxGrLf37xhhzwbfj6qBXblEVKBiLnZ6Z3WRj5qaL3o','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:53:06','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('O3t6aHLa5InYnrUb5Y1ohz_MQ7pmDJnre0_sehA1jXkaW1NobTlmRIRD2KdkFKAD','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-13 06:32:53','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('O8_rPrR_2LGeb9uZPuc3sPMosaE6s3zTFpUzKqfHjdq-S9ANsgIhjPaLmUYPxEr1','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 04:51:08','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('OnvyWWmgINNtRcqX0phzPAiG2GuGcckeUveBfpyYY2e4CFRqJ2lXEv1k5g6lu7CM','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-14 04:08:45','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('oW1kl8CswDVw8tmDss890O-HSP5LnI3HHZoWLisenDfb06mVh6tBHyGiJMqEi0HC','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-12 20:48:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('pA-h7W_WQC9AmnxjN76G1zGiTV2389zSzHyujyTY7rxrtmpZ7SpNGaBJw-coEwEW','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-15 01:32:11','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('PhCgl6QjQ-aCLeiRjOUSRieuZrjlrnWO_rvgfCVpnv4XTXNTKEH1YnNXxv8ZCMQB','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-12 04:42:17','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('pHqbtb9HOuVWjI8psG0bhHbBUeEhw7Clk7HhvGSwKWHh4zg6COhmxGl2N_WtvZOj','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:07:46','172.21.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('pyGDuh62Lj2O_OdeAkOKWSBYYroSQSbjfHNXWC3gqiOXd_CpqvoA2JadG3_H_Ocu','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-12 04:43:08','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('PzIslW2V5lAzUgapZJbCkCCmNtPTrcC5C_jy4Q_1EsEiq0MKfSi40CQJ4Dnx5-mi','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-13 06:40:55','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('q1wI0UCGb3iHU8h7NIySaqXgclqguRmXACxIfDMhAbmxMwNWkHiij2QqHiW-KRSL','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:39:16','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('RfMoFJiNFHYxJkcopTqwD061lQf6cD36LuN8FEuFDEEevYJ20FkvUkibAbVMVU-1','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:42:49','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('rJY4megzpKW3J_9w7vRnBqtndha8PRpaQsmUqHyeEkTiwxOw8cpCzOXL_n5yJP8y','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-13 06:39:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('SzLwiWDeStGzBTO5KvC7g2buZoNoRDvF5QUDi12TfW8-ono5l_SnoQvFH9KnEI8i','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:42:03','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('tMw1-rkaZOJeEShfDZF8CDUwM4qeC3LZJJD2XZPKEM2IyIhwRkeWyrn0hWYPashT','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:14:34','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('u5nre8FddUwaTkHIk8WmqpclEEZ54Z5dp61AYLzP9OOjKb5hT2czn9LH0PZOtMXF','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 21:34:33','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('uFs005u7emP_wZQEnGAtKvB3HR_b4rXcMRZmMDuFVdfnlKFVDbR-iupuAdL23qSO','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 21:37:48','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('UfxOdsHmXHcDs3qFtt9umLVVRUFHeZPRJx7wKcaMwFPavz80pPL3zuGjN3nfPCLW','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:49:15','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('UUBIJEwGr08eBweolnoLxqyQLRqGcw6UEXxwgpZeF_xF0SFwBlXTlmF6TseZatMO','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:16:30','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('v1fyyy4a4WuXxmKrDPif4pEmCO2wsHDLOQ3JdLHfPOZ66kLr-9z-UtA5zEeJYMRq','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:08:00','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('v8pDFEhANepcDrkt7ZnDo0GPdmwdar3f5xdgLDXxFfVCdwwDewRW0rElYhhK30ID','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 21:38:29','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('VwalHgxBeTZx-AdmfDP-voPfZGxwVTNpoK7BWUMkuYi731HlMA_DDqvc9FZrfeTD','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 04:44:55','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('wIG32SAJqgTBgGDFbTzBXX1r1gkRFri1-FiSUPqWeyMN_L4TSQgTltAvln-pUqp4','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-13 06:28:06','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('wYhyk2k4042cWx-n7YHM8y6IVFJ9VTkYcLaOYMUBivys-FKUGRyprwLX536hHs3t','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 03:30:32','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('WYX4GpXRBWLP1_sUzNiOtuGdAGm9u5WshvCPOSuFSPEaLd4pekyMyzzlXkk6bcuN','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 03:19:55','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('x20WS4iOja2L846i6VgyoczXo1lqml43w3QOq7Y1Np-pm09eck_7ggSAJB2wCWCN','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:14:41','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('X3zOrcgQX3YaScMmpoVB2f0IYQnJBHWxWagvZekha0VvjqXoM2intPSQnzPvA45z','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 05:06:56','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('x7VY3JCQ2xiY6x9NY6bxqzzVpokFQCkWGzch8adlBs3d7E1cWaKtBLYHAQUsFcAt','e9a3fa62-4352-4b56-90d8-05c6cc59073e','2026-11-13 05:56:25','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('XEtqOouHw-ax7z36lMRO6_ytI8TEJ7mE8AEujAQ6UuDszpWUMdel7TrVw3LVT-t7','1f754ea4-f86a-4060-94a8-9c1ceb57dad9','2026-11-13 06:29:14','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('xgShNtembqIDIW-V26z7BbB5gPX7xTOT1choUoh2cKeSwGuzRap32OXR-Tojycuu','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-14 04:20:25','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('y-9Z8h1sgtytVohlLVhjThfBa_EEnhDoPOH7Ex-KohU_G0lGc3FuftyBmONWrf_I','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-14 04:35:12','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('yFtNn7oSJbC_ohtwbjR5uMHwDZ4syUn5fKG9o0cQRLZcSJT4OJDcx6PMiN1aVTe-','c8f0319a-1cee-4a94-9130-80c0454552a0','2026-11-14 04:08:34','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('yLCCBM_RJiAjpiiULFxv0XiU5XaXM8sapcokrWO3eVGCSl_5xk7Qfx6534oO-aWD','d1ebee5d-b1b3-461f-9cbe-8873dcca1179','2026-11-13 21:36:38','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('yNr7kM3YTSCr1lpcLrpdmwMpYrNEfLCbbBag3hLYYked8jCNbmG05vanKZJjFNJ9','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:34:57','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('Zo3bS8JT0lDkAkbo1v9tdCLRQCzjolNAG_rC6w_QUVw73ouEtZsWYYggsr040QO0','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-12 04:43:39','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL),
('ZsAYLSeNCORCj1T2NmSIkxshkcW4R_bea8A_XJDzKOGt7xkJ8EhXDNVj2WhzLkfo','38500c14-8f7a-43ac-b06b-3175a112ff6c','2026-11-13 05:09:44','172.21.0.1','Mozilla/5.0 (Linux; Android 16; Pixel 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Mobile Safari/537.36',NULL,'http://localhost:8100',NULL,NULL);
/*!40000 ALTER TABLE `directus_sessions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_settings`
--

DROP TABLE IF EXISTS `directus_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(100) NOT NULL DEFAULT 'Directus',
  `project_url` varchar(255) DEFAULT NULL,
  `project_color` varchar(255) NOT NULL DEFAULT '#6644FF',
  `project_logo` char(36) DEFAULT NULL,
  `public_foreground` char(36) DEFAULT NULL,
  `public_background` char(36) DEFAULT NULL,
  `public_note` text DEFAULT NULL,
  `auth_login_attempts` int(10) unsigned DEFAULT 25,
  `auth_password_policy` varchar(100) DEFAULT NULL,
  `storage_asset_transform` varchar(7) DEFAULT 'all',
  `storage_asset_presets` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`storage_asset_presets`)),
  `custom_css` text DEFAULT NULL,
  `storage_default_folder` char(36) DEFAULT NULL,
  `basemaps` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`basemaps`)),
  `mapbox_key` varchar(255) DEFAULT NULL,
  `module_bar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`module_bar`)),
  `project_descriptor` varchar(100) DEFAULT NULL,
  `default_language` varchar(255) NOT NULL DEFAULT 'en-US',
  `custom_aspect_ratios` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_aspect_ratios`)),
  `public_favicon` char(36) DEFAULT NULL,
  `default_appearance` varchar(255) NOT NULL DEFAULT 'auto',
  `default_theme_light` varchar(255) DEFAULT NULL,
  `theme_light_overrides` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`theme_light_overrides`)),
  `default_theme_dark` varchar(255) DEFAULT NULL,
  `theme_dark_overrides` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`theme_dark_overrides`)),
  `report_error_url` varchar(255) DEFAULT NULL,
  `report_bug_url` varchar(255) DEFAULT NULL,
  `report_feature_url` varchar(255) DEFAULT NULL,
  `public_registration` tinyint(1) NOT NULL DEFAULT 0,
  `public_registration_verify_email` tinyint(1) NOT NULL DEFAULT 1,
  `public_registration_role` char(36) DEFAULT NULL,
  `public_registration_email_filter` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`public_registration_email_filter`)),
  `visual_editor_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`visual_editor_urls`)),
  `project_id` char(36) DEFAULT NULL,
  `mcp_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `mcp_allow_deletes` tinyint(1) NOT NULL DEFAULT 0,
  `mcp_prompts_collection` varchar(255) DEFAULT NULL,
  `mcp_system_prompt_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `mcp_system_prompt` text DEFAULT NULL,
  `project_owner` varchar(255) DEFAULT NULL,
  `project_usage` varchar(255) DEFAULT NULL,
  `org_name` varchar(255) DEFAULT NULL,
  `product_updates` tinyint(1) DEFAULT NULL,
  `project_status` varchar(255) DEFAULT NULL,
  `ai_openai_api_key` text DEFAULT NULL,
  `ai_anthropic_api_key` text DEFAULT NULL,
  `ai_system_prompt` text DEFAULT NULL,
  `ai_google_api_key` text DEFAULT NULL,
  `ai_openai_compatible_api_key` text DEFAULT NULL,
  `ai_openai_compatible_base_url` text DEFAULT NULL,
  `ai_openai_compatible_name` text DEFAULT NULL,
  `ai_openai_compatible_models` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_openai_compatible_models`)),
  `ai_openai_compatible_headers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_openai_compatible_headers`)),
  `ai_openai_allowed_models` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_openai_allowed_models`)),
  `ai_anthropic_allowed_models` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_anthropic_allowed_models`)),
  `ai_google_allowed_models` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_google_allowed_models`)),
  `collaborative_editing_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `ai_translation_default_model` text DEFAULT NULL,
  `ai_translation_glossary` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_translation_glossary`)),
  `ai_translation_style_guide` text DEFAULT NULL,
  `license_key` varchar(255) DEFAULT NULL,
  `license_token` text DEFAULT NULL,
  `mcp_oauth_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `mcp_oauth_dcr_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `mcp_oauth_cimd_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `default_save_action` varchar(255) NOT NULL DEFAULT 'save-and-quit',
  `preview_base_url` varchar(255) DEFAULT NULL,
  `default_exports_folder` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_settings_project_logo_foreign` (`project_logo`),
  KEY `directus_settings_public_foreground_foreign` (`public_foreground`),
  KEY `directus_settings_public_background_foreign` (`public_background`),
  KEY `directus_settings_storage_default_folder_foreign` (`storage_default_folder`),
  KEY `directus_settings_public_favicon_foreign` (`public_favicon`),
  KEY `directus_settings_public_registration_role_foreign` (`public_registration_role`),
  KEY `directus_settings_default_exports_folder_foreign` (`default_exports_folder`),
  CONSTRAINT `directus_settings_default_exports_folder_foreign` FOREIGN KEY (`default_exports_folder`) REFERENCES `directus_folders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_settings_project_logo_foreign` FOREIGN KEY (`project_logo`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_background_foreign` FOREIGN KEY (`public_background`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_favicon_foreign` FOREIGN KEY (`public_favicon`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_foreground_foreign` FOREIGN KEY (`public_foreground`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_registration_role_foreign` FOREIGN KEY (`public_registration_role`) REFERENCES `directus_roles` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_settings_storage_default_folder_foreign` FOREIGN KEY (`storage_default_folder`) REFERENCES `directus_folders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_settings`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_settings` WRITE;
/*!40000 ALTER TABLE `directus_settings` DISABLE KEYS */;
INSERT INTO `directus_settings` VALUES
(1,'Directus',NULL,'#6644FF',NULL,NULL,NULL,NULL,25,NULL,'all',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'en-US',NULL,NULL,'auto',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,'9fd2c60e-1197-4ca0-84e9-46ef57c3995d',NULL,NULL,'01a18ad3-76da-7506-9972-7da563833114',0,0,NULL,1,NULL,'waxho@waxho.com','personal',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,0,0,0,'save-and-quit',NULL,NULL);
/*!40000 ALTER TABLE `directus_settings` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_shares`
--

DROP TABLE IF EXISTS `directus_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_shares` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `collection` varchar(64) NOT NULL,
  `item` varchar(255) NOT NULL,
  `role` char(36) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_created` char(36) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `date_start` timestamp NULL DEFAULT NULL,
  `date_end` timestamp NULL DEFAULT NULL,
  `times_used` int(11) DEFAULT 0,
  `max_uses` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_shares_role_foreign` (`role`),
  KEY `directus_shares_user_created_foreign` (`user_created`),
  KEY `directus_shares_collection_foreign` (`collection`),
  CONSTRAINT `directus_shares_collection_foreign` FOREIGN KEY (`collection`) REFERENCES `directus_collections` (`collection`) ON DELETE CASCADE,
  CONSTRAINT `directus_shares_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_shares_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_shares`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_shares` WRITE;
/*!40000 ALTER TABLE `directus_shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_shares` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_translations`
--

DROP TABLE IF EXISTS `directus_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_translations` (
  `id` char(36) NOT NULL,
  `language` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_translations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_translations` WRITE;
/*!40000 ALTER TABLE `directus_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_translations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_users`
--

DROP TABLE IF EXISTS `directus_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_users` (
  `id` char(36) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `avatar` char(36) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `tfa_secret` varchar(255) DEFAULT NULL,
  `status` varchar(16) NOT NULL DEFAULT 'active',
  `role` char(36) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `last_access` timestamp NULL DEFAULT NULL,
  `last_page` varchar(255) DEFAULT NULL,
  `provider` varchar(128) NOT NULL DEFAULT 'default',
  `external_identifier` varchar(255) DEFAULT NULL,
  `auth_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`auth_data`)),
  `email_notifications` tinyint(1) DEFAULT 1,
  `appearance` varchar(255) DEFAULT NULL,
  `theme_dark` varchar(255) DEFAULT NULL,
  `theme_light` varchar(255) DEFAULT NULL,
  `theme_light_overrides` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`theme_light_overrides`)),
  `theme_dark_overrides` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`theme_dark_overrides`)),
  `text_direction` varchar(255) NOT NULL DEFAULT 'auto',
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_users_external_identifier_unique` (`external_identifier`),
  UNIQUE KEY `directus_users_email_unique` (`email`),
  UNIQUE KEY `directus_users_token_unique` (`token`),
  KEY `directus_users_role_foreign` (`role`),
  CONSTRAINT `directus_users_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_users` WRITE;
/*!40000 ALTER TABLE `directus_users` DISABLE KEYS */;
INSERT INTO `directus_users` VALUES
('1f754ea4-f86a-4060-94a8-9c1ceb57dad9','Assistant',NULL,'assistant@vexora.com','$argon2id$v=19$m=65536,t=3,p=4$ZK/BY0zxH9wBEdcl91OScg$FhoStfVvBPmATS4jcPDZe7uQ2+hYDZxEo9RsXQhtzn8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','24d0bcbb-c316-45fe-98a1-beab4f06b3cd',NULL,'2026-11-07 04:33:17',NULL,'default',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'auto'),
('38500c14-8f7a-43ac-b06b-3175a112ff6c','Juan Cutirra',NULL,'cutirra@gmail.com','$argon2id$v=19$m=65536,t=3,p=4$B8scMfovAf5RzZ2bZobeXQ$2la3TXNYyd7dKMfhXjfIrLv8ctyZznUVPyDLuL+/xyo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','9fd2c60e-1197-4ca0-84e9-46ef57c3995d',NULL,'2026-11-07 04:35:12',NULL,'default',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'auto'),
('c8f0319a-1cee-4a94-9130-80c0454552a0','Mechanic',NULL,'mechanic@vexora.com','$argon2id$v=19$m=65536,t=3,p=4$QScZkH41kpQS7Cx2Lh+ASw$4H+XyR+ra8NwxCWIjndGx3m6S7OKUWunxRTwpQyD96g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','625eab29-7a2b-41cc-9086-0f9f235abc9b',NULL,'2026-11-07 04:43:00',NULL,'default',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'auto'),
('d1ebee5d-b1b3-461f-9cbe-8873dcca1179','Administrador',NULL,'admin@vexora.com','$argon2id$v=19$m=65536,t=3,p=4$cnKp/OnfNbzYCxd+DdDqXQ$07+6KDbFOn8YflkSDLfog/x+cNyd3YdHs2ehfJkbM8Y',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','3823f47a-27ae-40dc-9b0b-b446f31449b1',NULL,'2026-11-08 01:32:12',NULL,'default',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'auto'),
('e9a3fa62-4352-4b56-90d8-05c6cc59073e','waxho','waxho','waxho@waxho.com','$argon2id$v=19$m=65536,t=3,p=4$fBXjkEauSQZtpcs94aR67w$MVx1eyctLCUUFCfV6Fii8Z2f4lHyn2CEl3D65VkjsFQ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','3823f47a-27ae-40dc-9b0b-b446f31449b1',NULL,'2026-11-08 01:32:25','/settings/policies','default',NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'auto');
/*!40000 ALTER TABLE `directus_users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `directus_versions`
--

DROP TABLE IF EXISTS `directus_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `directus_versions` (
  `id` char(36) NOT NULL,
  `key` varchar(64) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `collection` varchar(64) NOT NULL,
  `item` varchar(255) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NULL DEFAULT current_timestamp(),
  `user_created` char(36) DEFAULT NULL,
  `user_updated` char(36) DEFAULT NULL,
  `delta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`delta`)),
  PRIMARY KEY (`id`),
  KEY `directus_versions_collection_foreign` (`collection`),
  KEY `directus_versions_user_created_foreign` (`user_created`),
  KEY `directus_versions_user_updated_foreign` (`user_updated`),
  CONSTRAINT `directus_versions_collection_foreign` FOREIGN KEY (`collection`) REFERENCES `directus_collections` (`collection`) ON DELETE CASCADE,
  CONSTRAINT `directus_versions_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_versions_user_updated_foreign` FOREIGN KEY (`user_updated`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directus_versions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `directus_versions` WRITE;
/*!40000 ALTER TABLE `directus_versions` DISABLE KEYS */;
/*!40000 ALTER TABLE `directus_versions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `evidence`
--

DROP TABLE IF EXISTS `evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidence` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `workorder_id` int(10) unsigned NOT NULL,
  `path` varchar(255) NOT NULL,
  `format` enum('jpeg','jpg','png','heic','heif') NOT NULL,
  `size` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_evidence_workorder` (`workorder_id`),
  CONSTRAINT `fk_evidence_workorder` FOREIGN KEY (`workorder_id`) REFERENCES `workorders` (`id`),
  CONSTRAINT `chk_evidence_size` CHECK (`size` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidence`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `evidence` WRITE;
/*!40000 ALTER TABLE `evidence` DISABLE KEYS */;
INSERT INTO `evidence` VALUES
(1,1,'orders/1/before_engine.jpg','jpg',204800,'2026-10-30 03:20:46'),
(2,1,'orders/1/after_engine.jpg','jpg',198400,'2026-10-30 03:20:46'),
(3,2,'orders/2/brake_wear.jpg','jpg',215040,'2026-10-30 03:20:46'),
(4,3,'orders/3/suspension_front.jpg','jpg',307200,'2026-10-30 03:20:46'),
(5,4,'orders/4/scanner_codes.jpg','jpg',102400,'2026-10-30 03:20:46'),
(6,5,'orders/5/timing_belt_old.jpg','jpg',256000,'2026-10-30 03:20:46'),
(7,5,'orders/5/timing_belt_new.jpg','jpg',248000,'2026-10-30 03:20:46'),
(8,7,'orders/7/shock_absorber.jpg','jpg',189440,'2026-10-30 03:20:46'),
(9,9,'orders/9/suspension_after.jpg','jpg',220160,'2026-10-30 03:20:46'),
(10,10,'orders/10/exhaust_smoke.jpg','jpg',175360,'2026-10-30 03:20:46');
/*!40000 ALTER TABLE `evidence` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `fuels`
--

DROP TABLE IF EXISTS `fuels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `fuels` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_fuel_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuels`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `fuels` WRITE;
/*!40000 ALTER TABLE `fuels` DISABLE KEYS */;
INSERT INTO `fuels` VALUES
(1,'Gasolinaa',1,'2026-10-30 03:20:46'),
(2,'Diésel',1,'2026-10-30 03:20:46'),
(3,'Eléctrico',1,'2026-10-30 03:20:46'),
(4,'Híbrido',1,'2026-10-30 03:20:46'),
(5,'Gas LP',1,'2026-10-30 03:20:46'),
(6,'Fusion',1,'2026-10-31 21:07:47');
/*!40000 ALTER TABLE `fuels` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` int(10) unsigned NOT NULL,
  `workorder_id` int(10) unsigned NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_history_vehicle` (`vehicle_id`),
  KEY `fk_history_workorder` (`workorder_id`),
  CONSTRAINT `fk_history_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `fk_history_workorder` FOREIGN KEY (`workorder_id`) REFERENCES `workorders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES
(1,1,1,'2026-10-30 03:20:46'),
(2,2,2,'2026-10-30 03:20:46'),
(3,3,3,'2026-10-30 03:20:46'),
(4,4,4,'2026-10-30 03:20:46'),
(5,5,5,'2026-10-30 03:20:46'),
(6,6,6,'2026-10-30 03:20:46'),
(7,7,7,'2026-10-30 03:20:46'),
(8,8,8,'2026-10-30 03:20:46'),
(9,9,9,'2026-10-30 03:20:46'),
(10,10,10,'2026-10-30 03:20:46');
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `methods`
--

DROP TABLE IF EXISTS `methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `methods` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_method_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methods`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `methods` WRITE;
/*!40000 ALTER TABLE `methods` DISABLE KEYS */;
INSERT INTO `methods` VALUES
(1,'Efectivo',1,'2026-10-30 03:20:46'),
(2,'Tarjeta de débito',1,'2026-10-30 03:20:46'),
(3,'Tarjeta de crédito',1,'2026-10-30 03:20:46'),
(4,'Transferencia bancaria',1,'2026-10-30 03:20:46'),
(5,'Pago móvill',1,'2026-10-30 03:20:46'),
(6,'Criptos',1,'2026-10-31 21:11:49');
/*!40000 ALTER TABLE `methods` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `brand_id` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_model_brand_name` (`brand_id`,`name`),
  CONSTRAINT `fk_model_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES
(1,1,'Corollaa',1,'2026-10-30 03:20:46'),
(2,1,'Hilux',1,'2026-10-30 03:20:46'),
(3,2,'Sentra',1,'2026-10-30 03:20:46'),
(4,2,'Frontier',1,'2026-10-30 03:20:46'),
(5,3,'Aveo',1,'2026-10-30 03:20:46'),
(6,3,'Silverado',1,'2026-10-30 03:20:46'),
(7,4,'F-150',1,'2026-10-30 03:20:46'),
(8,5,'Jetta',1,'2026-10-30 03:20:46'),
(9,6,'Civic',1,'2026-10-30 03:20:46'),
(10,7,'Mazda3',1,'2026-10-30 03:20:46'),
(11,4,'Tsuru',1,'2026-10-31 21:20:52'),
(12,2,'papo',1,'2026-10-31 21:21:14');
/*!40000 ALTER TABLE `models` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `parts`
--

DROP TABLE IF EXISTS `parts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `parts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_part_name` (`name`),
  CONSTRAINT `chk_part_price` CHECK (`price` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parts`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `parts` WRITE;
/*!40000 ALTER TABLE `parts` DISABLE KEYS */;
INSERT INTO `parts` VALUES
(1,'Filtro de aceitee',810.00,'Filtro de aceite de motor genéricoa',1,'2026-10-30 03:20:46'),
(2,'Filtro de aire',120.00,'Filtro de aire de motor',1,'2026-10-30 03:20:46'),
(3,'Bujías (juego 4)',320.00,'Juego de 4 bujías estándar',1,'2026-10-30 03:20:46'),
(4,'Balatas delanteras',380.00,'Par de balatas para frenos delanteros',1,'2026-10-30 03:20:46'),
(5,'Balatas traseras',320.00,'Par de balatas para frenos traseros',1,'2026-10-30 03:20:46'),
(6,'Banda de distribución',650.00,'Banda de distribución con kit tensores',1,'2026-10-30 03:20:46'),
(7,'Aceite motor 5W-30 (4L)',280.00,'Aceite de motor semisintético 5W-30',1,'2026-10-30 03:20:46'),
(8,'Amortiguador delantero',850.00,'Amortiguador delantero (precio por pieza)',1,'2026-10-30 03:20:46'),
(9,'Amortiguador trasero',750.00,'Amortiguador trasero (precio por pieza)',1,'2026-10-30 03:20:46'),
(10,'Filtro de combustible',180.00,'Filtro de combustible en línea',1,'2026-10-30 03:20:46'),
(11,'Escape',100.00,'escape para carro :)',1,'2026-10-31 21:35:52');
/*!40000 ALTER TABLE `parts` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quote_id` int(10) unsigned NOT NULL,
  `method_id` tinyint(3) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reference` varchar(60) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_quote` (`quote_id`),
  KEY `fk_payment_method` (`method_id`),
  KEY `fk_payment_user` (`user_id`),
  CONSTRAINT `fk_payment_method` FOREIGN KEY (`method_id`) REFERENCES `methods` (`id`),
  CONSTRAINT `fk_payment_quote` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`id`),
  CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `chk_payment_amount` CHECK (`amount` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES
(1,1,1,1,350.32,NULL,'2025-07-03 17:30:00'),
(2,2,2,2,1200.00,'TXN-0041','2025-07-07 12:00:00'),
(3,5,4,3,3500.00,'SPEI-992341','2025-07-06 18:30:00'),
(4,8,3,4,1500.00,'TXN-0089','2025-07-10 11:00:00'),
(5,9,1,1,2200.00,NULL,'2025-07-09 16:30:00'),
(6,3,2,2,2500.00,NULL,NULL),
(7,4,1,6,400.00,NULL,NULL),
(8,6,5,6,250.00,NULL,NULL),
(9,7,4,2,4500.00,NULL,NULL),
(10,10,1,9,800.00,NULL,NULL),
(11,3,2,2,4292.00,'askasjksa','2026-10-31 21:54:01'),
(12,11,6,1,3654.00,NULL,'2026-10-31 22:46:38'),
(13,4,5,4,464.00,'saaa','2026-11-06 05:42:21'),
(14,13,5,1,754.00,'askaj1','2026-11-07 04:35:38');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `quoteitems`
--

DROP TABLE IF EXISTS `quoteitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `quoteitems` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quote_id` int(10) unsigned NOT NULL,
  `service_id` int(10) unsigned NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(5,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(10,2) NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_quoteitem_quote` (`quote_id`),
  KEY `fk_quoteitem_service` (`service_id`),
  CONSTRAINT `fk_quoteitem_quote` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`id`),
  CONSTRAINT `fk_quoteitem_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `chk_quoteitem_price` CHECK (`price` >= 0),
  CONSTRAINT `chk_quoteitem_discount` CHECK (`discount` >= 0 and `discount` <= 100),
  CONSTRAINT `chk_quoteitem_amount` CHECK (`amount` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quoteitems`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `quoteitems` WRITE;
/*!40000 ALTER TABLE `quoteitems` DISABLE KEYS */;
INSERT INTO `quoteitems` VALUES
(1,1,1,350.00,0.00,350.00,1),
(2,2,4,1200.00,0.00,1200.00,1),
(3,3,9,2200.00,0.00,2200.00,1),
(4,4,7,400.00,0.00,400.00,1),
(5,5,6,3500.00,0.00,3500.00,1),
(6,6,10,250.00,0.00,250.00,1),
(7,7,9,2200.00,0.00,2200.00,0),
(8,7,8,350.00,0.00,350.00,0),
(9,8,2,800.00,0.00,800.00,1),
(10,9,9,2200.00,0.00,2200.00,1),
(11,11,6,3500.00,10.00,3150.00,1),
(12,12,6,3500.00,0.00,3500.00,0),
(13,13,6,650.00,0.00,650.00,1);
/*!40000 ALTER TABLE `quoteitems` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `quoteparts`
--

DROP TABLE IF EXISTS `quoteparts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `quoteparts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quote_id` int(10) unsigned NOT NULL,
  `part_id` int(10) unsigned NOT NULL,
  `quantity` smallint(5) unsigned NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(5,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(10,2) NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_quotepart_quote` (`quote_id`),
  KEY `fk_quotepart_part` (`part_id`),
  CONSTRAINT `fk_quotepart_part` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`),
  CONSTRAINT `fk_quotepart_quote` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`id`),
  CONSTRAINT `chk_quotepart_quantity` CHECK (`quantity` > 0),
  CONSTRAINT `chk_quotepart_price` CHECK (`price` >= 0),
  CONSTRAINT `chk_quotepart_discount` CHECK (`discount` >= 0 and `discount` <= 100),
  CONSTRAINT `chk_quotepart_amount` CHECK (`amount` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quoteparts`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `quoteparts` WRITE;
/*!40000 ALTER TABLE `quoteparts` DISABLE KEYS */;
INSERT INTO `quoteparts` VALUES
(1,1,7,1,280.00,0.00,280.00,1),
(2,1,1,1,80.00,0.00,80.00,1),
(3,2,4,1,380.00,0.00,380.00,1),
(4,3,8,2,850.00,0.00,1700.00,0),
(5,3,9,2,750.00,0.00,1500.00,1),
(6,5,6,1,650.00,0.00,650.00,1),
(7,7,8,2,850.00,0.00,1700.00,0),
(8,8,3,1,320.00,0.00,320.00,1),
(9,8,2,1,120.00,0.00,120.00,1),
(10,9,8,2,850.00,0.00,1700.00,1),
(11,11,3,1,320.00,0.00,320.00,0),
(12,12,2,19,120.00,0.00,2280.00,0);
/*!40000 ALTER TABLE `quoteparts` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `quotes`
--

DROP TABLE IF EXISTS `quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `workorder_id` int(10) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `status_id` tinyint(3) unsigned NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `validity` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_quote_workorder` (`workorder_id`),
  KEY `fk_quote_user` (`user_id`),
  KEY `fk_quote_status` (`status_id`),
  CONSTRAINT `fk_quote_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `fk_quote_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_quote_workorder` FOREIGN KEY (`workorder_id`) REFERENCES `workorders` (`id`),
  CONSTRAINT `chk_quote_subtotal` CHECK (`subtotal` >= 0),
  CONSTRAINT `chk_quote_tax` CHECK (`tax` >= 0),
  CONSTRAINT `chk_quote_total` CHECK (`total` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotes`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `quotes` WRITE;
/*!40000 ALTER TABLE `quotes` DISABLE KEYS */;
INSERT INTO `quotes` VALUES
(1,1,2,10,302.00,48.32,350.32,'2025-07-05','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(2,2,3,10,1034.48,165.52,1200.00,'2025-07-08','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(3,3,2,10,3700.00,592.00,4292.00,'2025-07-15','2026-10-30 03:20:46','2026-10-31 21:53:47'),
(4,4,4,10,400.00,64.00,464.00,'2025-07-14','2026-10-30 03:20:46','2026-11-06 05:42:13'),
(5,5,3,10,3017.24,482.76,3500.00,'2025-07-07','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(6,6,5,9,250.00,40.00,290.00,'2025-07-18','2026-10-30 03:20:46','2026-11-07 04:14:02'),
(7,7,2,9,3879.31,620.69,4500.00,'2025-07-20','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(8,8,4,10,1293.10,206.90,1500.00,'2025-07-16','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(9,9,5,10,1896.55,303.45,2200.00,'2025-07-10','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(10,10,3,11,689.66,110.34,800.00,'2025-07-12','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(11,1,1,10,3150.00,504.00,3654.00,'2027-01-02','2026-10-31 22:46:20','2026-10-31 22:46:30'),
(12,11,1,9,5780.00,924.80,6704.80,'2027-10-01','2026-11-01 00:11:19','2026-11-01 00:11:19'),
(13,1,1,10,650.00,104.00,754.00,'2029-04-02','2026-11-07 04:08:02','2026-11-07 04:35:28');
/*!40000 ALTER TABLE `quotes` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_service_name` (`name`),
  CONSTRAINT `chk_service_price` CHECK (`price` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
(1,'Cambio de aceite y filtro',350.00,'Cambio de aceite de motor con filtro incluido',1,'2026-10-30 03:20:46'),
(2,'Afinación menor',800.00,'Bujías, filtro de aire y revisión general',1,'2026-10-30 03:20:46'),
(3,'Afinación mayor',1500.00,'Bujías, filtros, cables y revisión completa',1,'2026-10-30 03:20:46'),
(4,'Frenos delanteros',1200.00,'Cambio de balatas y revisión de discos delanteros',1,'2026-10-30 03:20:46'),
(5,'Frenos traseros',1000.00,'Cambio de balatas traseras',1,'2026-10-30 03:20:46'),
(6,'Cambio de distribución',3500.00,'Reemplazo de banda o cadena de distribución',1,'2026-10-30 03:20:46'),
(7,'Diagnosis computarizada',400.00,'Lectura y análisis de códigos de falla con escáner',1,'2026-10-30 03:20:46'),
(8,'Alineación y balanceo',350.00,'Alineación computarizada y balanceo de las 4 ruedas',1,'2026-10-30 03:20:46'),
(9,'Cambio de amortiguadores',2200.00,'Reemplazo de los 4 amortiguadores',1,'2026-10-30 03:20:46'),
(10,'Revisión general preventiva',250.00,'Inspección visual de 30 puntos del vehículo',1,'2026-10-30 03:20:46'),
(11,'PAPO2',67.50,'SI1',1,'2026-10-31 23:00:09');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `scope` enum('appointment','order','quote') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_status_name_scope` (`name`,`scope`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES
(1,'Pending','Cita solicitada, pendiente de confirmar','appointment',1,'2026-10-30 03:20:46'),
(2,'Confirmed','Cita confirmada por el taller','appointment',1,'2026-10-30 03:20:46'),
(3,'Cancelled','Cita cancelada por cliente o taller','appointment',1,'2026-10-30 03:20:46'),
(4,'Received','Vehículo recibido en taller, orden abierta','order',1,'2026-10-30 03:20:46'),
(5,'Diagnosis','Mecánico realizando diagnóstico del vehículo','order',1,'2026-10-30 03:20:46'),
(6,'Repair','Vehículo en proceso de reparación','order',1,'2026-10-30 03:20:46'),
(7,'Ready','Reparación terminada, pendiente de entrega','order',1,'2026-10-30 03:20:46'),
(8,'Delivered','Vehículo entregado al cliente','order',1,'2026-10-30 03:20:46'),
(9,'Pending','Cotización enviada al cliente, sin respuesta','quote',1,'2026-10-30 03:20:46'),
(10,'Approved','Cliente aprobó la cotización','quote',1,'2026-10-30 03:20:46'),
(11,'Rejected','Cliente rechazó la cotización','quote',1,'2026-10-30 03:20:46');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Administrador','admin@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(2,'Luis Ramírez','luis@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(3,'Pedro Torres','pedro@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(4,'Ana García','ana@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(5,'Jorge Hernández','jorge@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(6,'María López','maria@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(7,'Roberto Sánchez','roberto@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(8,'Diana Flores','diana@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(9,'Miguel Ángel Ruiz','miguel@ejemplo.com','123456',1,'2026-10-30 03:20:46'),
(10,'Patricia Morales','patricia@ejemplo.com','123456',1,'2026-10-30 03:20:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `model_id` int(10) unsigned NOT NULL,
  `fuel_id` tinyint(3) unsigned NOT NULL,
  `color_id` int(10) unsigned NOT NULL,
  `year` year(4) NOT NULL,
  `plate` varchar(10) NOT NULL,
  `vin` char(17) DEFAULT NULL,
  `mileage` int(10) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vehicle_plate` (`plate`),
  UNIQUE KEY `uk_vehicle_vin` (`vin`),
  KEY `fk_vehicle_user` (`user_id`),
  KEY `fk_vehicle_model` (`model_id`),
  KEY `fk_vehicle_fuel` (`fuel_id`),
  KEY `fk_vehicle_color` (`color_id`),
  CONSTRAINT `fk_vehicle_color` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`),
  CONSTRAINT `fk_vehicle_fuel` FOREIGN KEY (`fuel_id`) REFERENCES `fuels` (`id`),
  CONSTRAINT `fk_vehicle_model` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`),
  CONSTRAINT `fk_vehicle_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `chk_vehicle_mileage` CHECK (`mileage` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES
(1,1,2,1,1,2019,'ABC1234','1HGBH41JXMN109186',45000,1,'2026-10-30 03:20:46','2026-10-31 23:51:46'),
(2,6,3,1,3,2021,'DEF5678','2T1BURHE0JC043821',20000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(3,7,5,1,2,2018,'GHI9012','3VWFE21C04M000001',80000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(4,7,8,1,4,2020,'JKL3456','1FAHP3F20CL451234',35000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(5,8,2,2,6,2017,'MNO7890','5TDDKRFH0HS012345',120000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(6,8,9,1,1,2022,'PQR1234','2HGFA1F59CH512345',8000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(7,9,7,2,2,2016,'STU5678','1FTFW1EF5EFA12345',150000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(8,9,10,1,5,2023,'VWX9012','JM1BK343X71234567',5000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(9,10,4,2,7,2015,'YZA3456','1N4AL3AP0EC123456',200000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(10,10,6,2,6,2019,'BCD7890','3GCUKREC0EG123456',95000,1,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(11,1,12,6,3,2003,'12191922','121101221912',10029,1,'2026-10-31 23:53:02','2026-10-31 23:53:17');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `workorders`
--

DROP TABLE IF EXISTS `workorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `workorders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` int(10) unsigned NOT NULL,
  `mechanic_id` bigint(20) unsigned NOT NULL,
  `status_id` tinyint(3) unsigned NOT NULL,
  `mileage` int(10) unsigned NOT NULL,
  `delivery` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_workorder_vehicle` (`vehicle_id`),
  KEY `fk_workorder_status` (`status_id`),
  KEY `fk_workorder_mechanic` (`mechanic_id`),
  CONSTRAINT `fk_workorder_mechanic` FOREIGN KEY (`mechanic_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_workorder_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `fk_workorder_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `chk_workorder_mileage` CHECK (`mileage` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workorders`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `workorders` WRITE;
/*!40000 ALTER TABLE `workorders` DISABLE KEYS */;
INSERT INTO `workorders` VALUES
(1,1,2,8,45100,'2025-07-03 17:00:00','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(2,2,3,7,20050,NULL,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(3,3,2,6,80200,NULL,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(4,4,4,5,35100,NULL,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(5,5,3,8,120500,'2025-07-06 18:00:00','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(6,6,5,4,8010,NULL,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(7,7,2,6,150200,NULL,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(8,8,4,7,5050,NULL,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(9,9,5,8,200100,'2025-07-09 16:00:00','2026-10-30 03:20:46','2026-10-30 03:20:46'),
(10,10,3,5,95200,NULL,'2026-10-30 03:20:46','2026-10-30 03:20:46'),
(11,2,8,5,1000,NULL,'2026-11-01 00:10:35','2026-11-01 00:15:48'),
(12,6,4,4,11001021,NULL,'2026-11-01 00:51:52','2026-11-01 00:51:52'),
(13,8,5,4,102021,NULL,'2026-11-01 00:52:11','2026-11-01 00:52:11');
/*!40000 ALTER TABLE `workorders` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping routines for database 'workshop'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-11-08  1:45:37
