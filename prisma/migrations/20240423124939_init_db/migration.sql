-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "defaultValue" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "priceDetails" JSONB,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options" (
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "fieldId" INTEGER NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("value","fieldId")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Seed
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(1, 'Open AI', 'openAi', 'AI', 'https://img.logoipsum.com/332.svg', 'OpenAI is an artificial intelligence research laboratory consisting of the for-profit OpenAI LP and the non-profit OpenAI Inc. The company, considered a competitor to DeepMind, conducts research in the field of artificial intelligence (AI) with the stated aim to promote and develop friendly AI in a way that benefits humanity as a whole. The company is primarily known for its GPT series of language models.'),
(2, 'PostHog', 'postHog', 'analytics', 'https://img.logoipsum.com/334.svg', 'PostHog is an open-source product analytics platform'),
(3, 'SendGrid', 'sendgrid', 'email', 'https://img.logoipsum.com/335.svg', 'SendGrid is a customer communication platform for transactional and marketing email.'),
(4, 'Vercel', 'vercel', 'hosting', 'https://img.logoipsum.com/336.svg', 'Vercel is a cloud platform for static sites and Serverless Functions that fits perfectly with your workflow. It enables developers to host Jamstack websites and web services that deploy instantly, scale automatically, and requires no supervision, all with no configuration.');

-- Open AI
INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId") VALUES
(1, 'Model', 'model', 'enum', 'gpt-3.5-turbo-0125', true, 1),
(2, 'Tokens', 'tokens', 'number', '1000000', true, 1);

INSERT INTO "options" ("value", "label", "price", "fieldId") VALUES
('gpt-4-turbo-2024-04-09', 'GPT-4 Turbo (2024-04-09)', 30, 1),
('gpt-4', 'GPT-4', 60, 1),
('gpt-4-32k', 'GPT-4 32k', 120, 1),
('gpt-3.5-turbo-0125', 'GPT-3.5 Turbo 0125', 1.5, 1),
('gpt-3.5-turbo-instruct', 'GPT-3.5 Turbo Instruct', 2, 1);

-- PostHog
INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId", "priceDetails") VALUES
(3, 'Product Analytics', 'productAnalytics', 'number', '1000000', false, 2, '{"freeTearUpTo": 1000000, "price": 0.000248}'),
(4, 'Session Replay', 'sessionReplay', 'number', '5000', false, 2, '{ "freeTearUpTo": 5000, "price": 0.04 }'),
(5, 'Feature Flags', 'featureFlags', 'number', '1000000', false, 2, '{ "freeTearUpTo": 1000000, "price": 0.0001 }'),
(6, 'Surveys', 'surveys', 'number', '250', false, 2, '{ "freeTearUpTo": 250, "price": 0.2 }');

-- SendGrid
INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId") VALUES
(7, 'Number of emails per month', 'numberOfEmails', 'enum', '3000', true, 3);


INSERT INTO "options" ("value", "label", "price", "fieldId") VALUES
(3000, '0 - 3000', 0, 7),
(50000, '3001 - 50,000', 19.95, 7),
(100000, '50,001 - 100,000', 34.95, 7),
(300000, '100,001 - 300,000', 89.95, 7),
(700000, '300,001 - 700,000', 249, 7),
(1000000, '700,001 - 1,000,000', 499, 7),
(2000000, '1,000,001 - 2,000,000', 799, 7),
(2500000, '2,000,001 - 2,500,000', 1099, 7);

-- Vercel
INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId") VALUES
(8, 'Type', 'type', 'enum', 'hobby', true, 4),
(9, 'Number of developers', 'numberOfDevelopers', 'number', null, false, 4);

INSERT INTO "options" ("value", "label", "price", "fieldId") VALUES
('hobby', 'Hobby', 0, 8),
('pro', 'Pro', 20, 8);