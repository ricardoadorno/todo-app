/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', -- Senha padrão temporária: "password123"
ADD COLUMN     "refreshToken" TEXT;

-- Depois que a coluna for adicionada com um valor padrão, podemos remover o valor padrão
ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT;
