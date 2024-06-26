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

-- Open AI
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(1, 'Open AI', 'openAi', 'AI', 'https://static-00.iconduck.com/assets.00/openai-icon-2021x2048-4rpe5x7n.png', 'OpenAI is an artificial intelligence research laboratory consisting of the for-profit OpenAI LP and the non-profit OpenAI Inc. The company, considered a competitor to DeepMind, conducts research in the field of artificial intelligence (AI) with the stated aim to promote and develop friendly AI in a way that benefits humanity as a whole. The company is primarily known for its GPT series of language models.');

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
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(2, 'PostHog', 'postHog', 'analytics', 'https://posthog.com/static/c3a3dad72aff6ab04b06b8cee62e62cf/f21c0/Sticker-PosthogVertical.png', 'PostHog is an open-source product analytics platform');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId", "priceDetails") VALUES
(3, 'Product Analytics', 'productAnalytics', 'number', '1000000', false, 2, '{"freeTearUpTo": 1000000, "price": 0.000248}'),
(4, 'Session Replay', 'sessionReplay', 'number', '5000', false, 2, '{ "freeTearUpTo": 5000, "price": 0.04 }'),
(5, 'Feature Flags', 'featureFlags', 'number', '1000000', false, 2, '{ "freeTearUpTo": 1000000, "price": 0.0001 }'),
(6, 'Surveys', 'surveys', 'number', '250', false, 2, '{ "freeTearUpTo": 250, "price": 0.2 }');

-- SendGrid
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(3, 'SendGrid', 'sendgrid', 'email', 'https://simpauldesign.com/wp-content/uploads/2020/02/SendGrid-new-logo.png', 'SendGrid is a customer communication platform for transactional and marketing email.');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId") VALUES
(7, 'Emails per month', 'numberOfEmails', 'slider', '3000', true, 3);


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
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(4, 'Vercel', 'vercel', 'hosting', 'https://logowik.com/content/uploads/images/vercel1868.jpg', 'Vercel is a cloud platform for static sites and Serverless Functions that fits perfectly with your workflow. It enables developers to host Jamstack websites and web services that deploy instantly, scale automatically, and requires no supervision, all with no configuration.');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId", "priceDetails") VALUES
(9, 'Developers', 'numberOfDevelopers', 'number', 1, false, 4, '{ "pricePerDev": 20 }');

-- Railway
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(5, 'Railway', 'railway', 'hosting', 'https://railway.app/_next/static/images/logo-512x512-0f1b6b1b1', 'Railway is a platform for deploying and running web apps and APIs with ease.');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId", "priceDetails") VALUES
(12, 'Developers', 'numberOfDevelopers', 'number', 1, false, 5, '{ "priceOneDev": 5, "pricePerDev": 20 }');

-- Loops
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(7, 'Loops', 'loops', 'email', 'https://mintlify.s3-us-west-1.amazonaws.com/loops/logo/light.png', 'Loops is a customer communication platform for transactional and marketing email.');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId") VALUES
(13, 'Emails per month', 'numberOfContacts', 'slider', '3000', true, 7);

INSERT INTO "options" ("value", "label", "price", "fieldId") VALUES
(1000, '0 - 1000', 0, 13),
(5000, '1001 - 5,000', 49, 13),
(10000, '5,001 - 10,000', 99, 13),
(15000, '10,001 - 15,000', 149, 13),
(25000, '15,001 - 25,000', 199, 13),
(50000, '25,001 - 50,000', 249, 13),
(100000, '50,001 - 100,000', 399, 13);

-- Amplitude
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(8, 'Amplitude', 'amplitude', 'analytics', '', 'Amplitude is a product analytics platform that provides digital product intelligence to help companies understand user behavior, build better products, and grow businesses.');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId") VALUES
(14, 'Monthly Tracked Users', 'mtu', 'slider', '1000', true, 8);

INSERT INTO "options" ("value", "label", "price", "fieldId") VALUES
(1000, '0 - 1000', 0, 14),
(5000, '1001 - 5,000', 99, 14),
(10000, '5,001 - 10,000', 149, 14),
(25000, '10,001 - 25,000', 249, 14),
(50000, '25,001 - 50,000', 449, 14),
(100000, '50,001 - 100,000', 849, 14),
(200000, '100,001 - 200,000', 1680, 14),
(300000, '200,001 - 300,000', 2520, 14);

-- Simple Analytics
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(9, 'Simple Analytics', 'simpleAnalytics', 'analytics', 'https://assets.simpleanalytics.com/press/logo-ratio-3-2/white-on-red.svg', 'Simple Analytics gives you the analytics you need without invading the privacy of your users, with a user-friendly interface and great performance.');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId", "priceDetails") VALUES
(15, 'Data Points', 'dataPoints', 'number', '100000', true, 9, '{"starterUpTo": 100000, "startPrice": 9, "businessUpTo": 1000000, "businessPrice": 49 }'),
(16, 'Developers', 'developers', 'number', '1', true, 9, '{ "starterUpTo": 1, "startPrice": 9, "businessUpTo": 10, "businessPrice": 49 }'),
(17, 'Websites', 'websites', 'number', '10', true, 9, '{ "starterUpTo": 10, "startPrice": 9, "businessUpTo": 100, "businessPrice": 49 }');

-- Clerk
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(10, 'Clerk', 'clerk', 'user-management', 'https://workable-application-form.s3.amazonaws.com/advanced/production/5faba140a2e294c4d44b07eb/5a2307b9-37fe-9bd0-b5f4-2666152d200d', 'Clerk is a modern authentication and user management solution for web and mobile applications.');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId", "priceDetails") VALUES
(18, 'Montly active users', 'mau', 'number', '10000', false, 10, '{ "freeTearUpTo": 10000, "proPlanPrice": 25, "pricePerMAU": 0.02 }');

-- Mux
INSERT INTO "services" ("id", "title", "name", "type", "logo", "description") VALUES
(11, 'Mux', 'mux', 'streaming', 'stream', 'Mux is a video API that makes it easy to build beautiful video. Powered by data and designed by video experts, Mux makes beautiful video possible for every development team.');

INSERT INTO "fields" ("id", "title", "name", "type", "defaultValue", "required", "serviceId", "priceDetails") VALUES
(19, 'Monthly views', 'monthViews', 'number', '100000', false, 11, '{ "freeTearUpTo": 100000, "priceExtraViewsFreeTear": 0.6, "proPlanPrice": 199, "proTearUpTo": 1000000, "priceExtraViewsProTear": 0.5 }');


