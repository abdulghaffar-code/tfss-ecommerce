-- Point company settings at the new brand mark.
ALTER TABLE "CompanySettings" ALTER COLUMN "logoUrl" SET DEFAULT '/brand/logo.png';

UPDATE "CompanySettings"
SET "logoUrl" = '/brand/logo.png'
WHERE "logoUrl" LIKE '/brand/logo-%';
