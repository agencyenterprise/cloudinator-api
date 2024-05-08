-- AlterTable
ALTER TABLE "fields" ADD COLUMN "maxSelectableValue" INTEGER;

-- Seed
UPDATE "fields" set "maxSelectableValue" = 200 WHERE "id" = 9;
UPDATE "fields" set "maxSelectableValue" = 200 WHERE "id" = 12;
UPDATE "fields" set "maxSelectableValue" = 1500000 WHERE "id" = 19;