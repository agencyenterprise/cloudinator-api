-- AlterTable
ALTER TABLE "services" ADD COLUMN "link" TEXT NULL;

-- Seed
UPDATE "services" set "link" = 'https://openai.com/api/pricing' WHERE "id" = 1;
UPDATE "services" set "link" = 'https://posthog.com/pricing' WHERE "id" = 2;
UPDATE "services" set "link" = 'https://sendgrid.com/en-us/pricing' WHERE "id" = 3;
UPDATE "services" set "link" = 'https://vercel.com/pricing' WHERE "id" = 4;
UPDATE "services" set "link" = 'https://railway.app/pricing' WHERE "id" = 5;
UPDATE "services" set "link" = 'https://workspace.google.com/pricing.html' WHERE "id" = 6;
UPDATE "services" set "link" = 'https://loops.so/pricing' WHERE "id" = 7;
UPDATE "services" set "link" = 'https://amplitude.com/pricing' WHERE "id" = 8;
UPDATE "services" set "link" = 'https://www.simpleanalytics.com/pricing' WHERE "id" = 9;
UPDATE "services" set "link" = 'https://clerk.com/pricing' WHERE "id" = 10;

-- Make link column not nullable
ALTER TABLE "services" ALTER COLUMN "link" SET NOT NULL;