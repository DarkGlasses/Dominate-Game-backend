-- AlterTable
ALTER TABLE `communitypost` ADD COLUMN `picture` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `games` ADD COLUMN `picture` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `news` ADD COLUMN `picture` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `pofile` VARCHAR(191) NULL,
    ADD COLUMN `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user';
