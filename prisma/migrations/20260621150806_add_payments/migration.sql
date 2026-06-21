-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "comment" TEXT,
    "items" TEXT NOT NULL DEFAULT '[]',
    "total" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'new',
    "paymentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'none',
    "paidAt" DATETIME
);
INSERT INTO "new_Order" ("address", "comment", "createdAt", "id", "items", "name", "phone", "status", "total") SELECT "address", "comment", "createdAt", "id", "items", "name", "phone", "status", "total" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
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
    "telegramOrderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "telegramButtonText" TEXT,
    "onlinePaymentEnabled" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_SiteSettings" ("address", "cartEnabled", "email", "heroImage", "heroQuote", "heroSubtitle", "heroTitle", "id", "instagramUrl", "logo", "phone", "telegramBotUrl", "telegramButtonText", "telegramOrderEnabled") SELECT "address", "cartEnabled", "email", "heroImage", "heroQuote", "heroSubtitle", "heroTitle", "id", "instagramUrl", "logo", "phone", "telegramBotUrl", "telegramButtonText", "telegramOrderEnabled" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
