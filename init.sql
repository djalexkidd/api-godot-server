DROP DATABASE IF EXISTS godot;

CREATE DATABASE godot;

USE godot;

-- godot.template definition

CREATE TABLE `template` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NOT NULL,
  `score` bigint(20) DEFAULT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- godot.users definition

CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NOT NULL,
  `password_digest` varchar(100) DEFAULT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- godot.games definition

CREATE TABLE `games` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NOT NULL,
  `author` varchar(100) DEFAULT NOT NULL,
  `apikey` varchar(64) DEFAULT NOT NULL,
  `display_name` varchar(100) DEFAULT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;