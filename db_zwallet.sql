-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 26 Sep 2020 pada 09.13
-- Versi server: 10.4.11-MariaDB
-- Versi PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_zwallet`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `notes` text NOT NULL,
  `status` int(11) NOT NULL,
  `statusTopup` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `history`
--

INSERT INTO `history` (`id`, `userId`, `senderId`, `receiverId`, `amount`, `notes`, `status`, `statusTopup`, `image`, `date`) VALUES
(23, 1, 1, 18, 5000, 'Awok', 1, 0, NULL, '2020-09-26 06:17:06'),
(24, 18, 1, 18, 5000, 'Awok', 1, 0, NULL, '2020-09-26 06:17:06'),
(25, 1, 1, 1, 10000, 'Top Up Balance', 2, 1, 'http://localhost:4000/uploads/jf611ikgu9.png', '2020-09-26 06:43:47'),
(26, 1, 1, 1, 20000, 'Top Up Balance', 2, 2, 'http://localhost:4000/uploads/q44d4qiio0g.png', '2020-09-26 06:48:07');

-- --------------------------------------------------------

--
-- Struktur dari tabel `phoneNumber`
--

CREATE TABLE `phoneNumber` (
  `id` int(11) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'User');

-- --------------------------------------------------------

--
-- Struktur dari tabel `token`
--

CREATE TABLE `token` (
  `token` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(32) DEFAULT NULL,
  `lastName` varchar(32) DEFAULT NULL,
  `fullName` varchar(64) NOT NULL,
  `username` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `pin` char(6) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phoneNumber` varchar(30) DEFAULT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `roleId` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `fullName`, `username`, `email`, `pin`, `password`, `phoneNumber`, `balance`, `image`, `roleId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'Cep', 'Admin Cep', 'cep', 'cep@gmail.com', '123123', '$2b$12$Pdo2DP2TKm.0wyClynMDKOORMS0m7TdFpcSYnA1RAQc5WJHqe9smC', NULL, 60000, 'http://localhost:4000/uploads/joscjfooj08.jpg', 1, 1, '2020-09-24 11:44:12', '2020-09-24 11:44:12'),
(18, 'Sala', 'Zar', 'Sala Zar', 'cepxx', 'cep@gmailxx.com', NULL, '$2b$12$1H/aKL6VPSkDSaZAXWu9WOVHhvWVNRVLaJhDOybpb47jLNV0rTSp6', '10', 5000, NULL, 2, 1, '2020-09-25 09:09:53', '2020-09-25 09:09:53');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`senderId`),
  ADD KEY `receiverId` (`receiverId`);

--
-- Indeks untuk tabel `phoneNumber`
--
ALTER TABLE `phoneNumber`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indeks untuk tabel `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`token`),
  ADD KEY `userId` (`userId`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roleId` (`roleId`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT untuk tabel `phoneNumber`
--
ALTER TABLE `phoneNumber`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `history_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `phoneNumber`
--
ALTER TABLE `phoneNumber`
  ADD CONSTRAINT `phoneNumber_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `token_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
