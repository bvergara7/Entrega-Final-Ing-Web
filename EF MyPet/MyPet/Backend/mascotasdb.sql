-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-11-2024 a las 01:06:53
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Base de datos: `mascotasdb`

-- --------------------------------------------------------

-- Eliminar tablas si existen

DROP TABLE IF EXISTS `evento`;
DROP TABLE IF EXISTS `mascota`;
DROP TABLE IF EXISTS `region`;
DROP TABLE IF EXISTS `usuario`;

-- Estructura de tabla para la tabla `evento`

CREATE TABLE `evento` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` text DEFAULT NULL,
  `idMascota` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Estructura de tabla para la tabla `mascota`

CREATE TABLE `mascota` (
  `id` int(11) NOT NULL,
  `codigoVinculacion` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `especie` varchar(50) NOT NULL,
  `raza` varchar(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `imgMascota` varchar(255) DEFAULT NULL,
  `idCuidador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Estructura de tabla para la tabla `region`
-- Eliminamos la columna `comuna` y dejamos solo `idRegion` y `nombreRegion`

CREATE TABLE `region` (
  `idRegion` int(11) NOT NULL,
  `nombreRegion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Estructura de tabla para la tabla `usuario`
-- Eliminamos la columna `idComuna`

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `fotoPerfil` varchar(255) DEFAULT NULL,
  `idRegion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Índices para tablas volcadas

-- Índices de la tabla `evento`
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idMascota` (`idMascota`);

-- Índices de la tabla `mascota`
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigoVinculacion` (`codigoVinculacion`),
  ADD KEY `idCuidador` (`idCuidador`);

-- Índices de la tabla `region`
ALTER TABLE `region`
  ADD PRIMARY KEY (`idRegion`);

-- Índices de la tabla `usuario`
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idRegion` (`idRegion`);

-- AUTO_INCREMENT de las tablas volcadas

-- AUTO_INCREMENT de la tabla `evento`
ALTER TABLE `evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `mascota`
ALTER TABLE `mascota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `usuario`
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Restricciones para tablas volcadas

-- Filtros para la tabla `evento`
ALTER TABLE `evento`
  ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`idMascota`) REFERENCES `mascota` (`id`);

-- Filtros para la tabla `mascota`
ALTER TABLE `mascota`
  ADD CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`idCuidador`) REFERENCES `usuario` (`id`);

-- Filtros para la tabla `usuario`
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRegion`) REFERENCES `region` (`idRegion`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
