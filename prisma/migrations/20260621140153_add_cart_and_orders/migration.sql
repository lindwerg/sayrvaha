-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "comment" TEXT,
    "items" TEXT NOT NULL DEFAULT '[]',
    "total" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'new'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "logo" TEXT,
    "heroImage" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroQuote" TEXT,
    "telegramBotUrl" TEXT,
    "instagramUrl" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "cartEnabled" BOOLEAN NOT NULL DEFAULT false,
    "telegramOrderEnabled" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_SiteSettings" ("address", "email", "heroImage", "heroQuote", "heroSubtitle", "heroTitle", "id", "instagramUrl", "logo", "phone", "telegramBotUrl") SELECT "address", "email", "heroImage", "heroQuote", "heroSubtitle", "heroTitle", "id", "instagramUrl", "logo", "phone", "telegramBotUrl" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
