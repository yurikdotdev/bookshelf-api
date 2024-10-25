/*
  Warnings:

  - You are about to drop the column `keywords` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `keyword` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "keywords",
ADD COLUMN     "keyword" TEXT NOT NULL;
