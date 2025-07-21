-- CreateTable
CREATE TABLE "Todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "datetime" DATETIME NOT NULL,
    "is_done" BOOLEAN NOT NULL DEFAULT false
);
