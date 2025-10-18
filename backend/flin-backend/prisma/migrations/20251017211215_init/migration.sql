-- CreateTable
CREATE TABLE "Organization" (
    "OrganizationId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Industry" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Users" (
    "UserId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "OrganizationId" INTEGER NOT NULL,
    CONSTRAINT "Users_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization" ("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Service" (
    "ServiceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Code" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "OrganizationId" INTEGER NOT NULL,
    CONSTRAINT "Service_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization" ("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "ClientId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Notes" TEXT,
    "AvatarUrl" TEXT,
    "Status" TEXT NOT NULL DEFAULT 'PENDING',
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "OrganizationId" INTEGER NOT NULL,
    "CreatedByUserId" INTEGER,
    "ServiceId" INTEGER,
    CONSTRAINT "Client_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization" ("OrganizationId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Client_CreatedByUserId_fkey" FOREIGN KEY ("CreatedByUserId") REFERENCES "Users" ("UserId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Client_ServiceId_fkey" FOREIGN KEY ("ServiceId") REFERENCES "Service" ("ServiceId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Service_OrganizationId_Code_key" ON "Service"("OrganizationId", "Code");

-- CreateIndex
CREATE INDEX "Client_OrganizationId_idx" ON "Client"("OrganizationId");

-- CreateIndex
CREATE INDEX "Client_Status_idx" ON "Client"("Status");

-- CreateIndex
CREATE INDEX "Client_CreatedAt_idx" ON "Client"("CreatedAt");
