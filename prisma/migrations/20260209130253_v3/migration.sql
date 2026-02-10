/*
  Warnings:

  - You are about to drop the column `pofile` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `pofile`,
    ADD COLUMN `profile` VARCHAR(191) NULL;
