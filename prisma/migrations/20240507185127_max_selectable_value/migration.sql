-- AlterTable
ALTER TABLE "fields" ADD COLUMN "maxSelectableValue" INTEGER;

-- Seed
UPDATE "fields" set "maxSelectableValue" = 1000 WHERE "id" = 9;
UPDATE "fields" set "maxSelectableValue" = 1000 WHERE "id" = 12;
UPDATE "fields" set "maxSelectableValue" = 10000000 WHERE "id" = 19;