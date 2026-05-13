/*
  Warnings:

  - You are about to drop the `todo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "todo";

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR NOT NULL,
    "completedAt" TIMESTAMP,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
