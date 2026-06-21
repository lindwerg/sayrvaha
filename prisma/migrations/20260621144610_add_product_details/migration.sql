-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "telegramButtonText" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "sizes" TEXT NOT NULL DEFAULT '[]',
    "images" TEXT NOT NULL DEFAULT '[]',
    "composition" TEXT,
    "care" TEXT,
    "sizeChart" TEXT NOT NULL DEFAULT '[]',
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isOnSale" BOOLEAN NOT NULL DEFAULT false,
    "oldPrice" REAL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Product" ("category", "createdAt", "description", "id", "images", "isAvailable", "isNew", "isOnSale", "name", "oldPrice", "order", "price", "sizes", "slug") SELECT "category", "createdAt", "description", "id", "images", "isAvailable", "isNew", "isOnSale", "name", "oldPrice", "order", "price", "sizes", "slug" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_isAvailable_order_idx" ON "Product"("isAvailable", "order");
CREATE INDEX "Product_category_idx" ON "Product"("category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
