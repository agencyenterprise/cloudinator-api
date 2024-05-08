-- AlterTable
ALTER TABLE "fields" ADD COLUMN "minSelectableValue" INTEGER;

-- Seed
UPDATE "fields" set "minSelectableValue" = 1 WHERE "id" = 9;
UPDATE "fields" set "minSelectableValue" = 1 WHERE "id" = 12;
UPDATE "fields" set "minSelectableValue" = 1000 WHERE "id" = 19;