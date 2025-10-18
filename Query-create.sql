create database flinCRM;
use flinCRM;

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'crm')
BEGIN
    EXEC('CREATE SCHEMA crm AUTHORIZATION dbo;');
END
GO

/* ========================
   2) Tabla: Users
   ======================== */
IF OBJECT_ID(N'crm.Users', N'U') IS NOT NULL
    DROP TABLE crm.Users;
GO

CREATE TABLE crm.Users
(
    UserId        UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Users PRIMARY KEY DEFAULT NEWID(),
    Email         NVARCHAR(255)    NOT NULL,
    PasswordHash  NVARCHAR(200)    NOT NULL,  -- guarda aquí el hash bcrypt/argon (no plaintext)
    CreatedAt     DATETIME2(3)     NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),

    CONSTRAINT UQ_Users_Email UNIQUE (Email)
);
GO


IF OBJECT_ID(N'crm.Clients', N'U') IS NOT NULL
    DROP TABLE crm.Clients;
GO

CREATE TABLE crm.Clients
(
    ClientId       UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Clients PRIMARY KEY DEFAULT NEWID(),
    Name           NVARCHAR(150)    NOT NULL,
    Phone          NVARCHAR(30)     NOT NULL,
    ServiceType    VARCHAR(16)      NOT NULL,  -- HAIR | REPAIR | DESIGN | OTHER
    Notes          NVARCHAR(1000)       NULL,
    AvatarUrl      NVARCHAR(500)        NULL,
    Status         VARCHAR(16)      NOT NULL CONSTRAINT DF_Clients_Status DEFAULT ('PENDING'), -- PENDING | IN_PROGRESS | DONE
    CreatedAt      DATETIME2(3)     NOT NULL CONSTRAINT DF_Clients_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2(3)     NOT NULL CONSTRAINT DF_Clients_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CreatedByUserId UNIQUEIDENTIFIER    NULL,  -- quién creó el registro (opcional)

    CONSTRAINT CK_Clients_ServiceType CHECK (ServiceType IN ('SALE', 'MAINTENANCE', 'FINANCE', 'ACCESSORIES', 'HAIR', 'NAILS', 'MAKEUP', 'SPA', 'SKINCARE','OTHER')),
    CONSTRAINT CK_Clients_Status CHECK (Status IN ('PENDING','IN_PROGRESS','DONE')),
    CONSTRAINT FK_Clients_CreatedByUser FOREIGN KEY (CreatedByUserId) REFERENCES crm.Users(UserId)
);
GO 

INSERT INTO crm.Clients (Name, Phone, ServiceType, Notes, Status)
VALUES
('Pedro Martínez', '809-555-2001', 'SALE', 'Toyota Corolla 2022, entrega pendiente', 'PENDING'),
('María López', '809-555-2002', 'MAINTENANCE', 'Cambio de aceite y filtro', 'DONE'),
('Luis Gómez', '809-555-2003', 'FINANCE', 'Solicitud de financiamiento aprobada', 'IN_PROGRESS'),
('Taller AutoPartes', '809-555-2004', 'ACCESSORIES', 'Compra de batería y alfombrillas', 'DONE');
INSERT INTO crm.Clients (Name, Phone, ServiceType, Notes, Status)
VALUES
('Ana Pérez', '809-555-3001', 'HAIR', 'Coloración y corte de puntas', 'DONE'),
('Laura Jiménez', '809-555-3002', 'NAILS', 'Manicura con diseño floral', 'IN_PROGRESS'),
('Carmen Rosario', '809-555-3003', 'MAKEUP', 'Maquillaje para boda', 'PENDING'),
('Valeria Santos', '809-555-3004', 'SPA', 'Masaje relajante con aromaterapia', 'DONE'),
('Jennifer Mota', '809-555-3005', 'SKINCARE', 'Tratamiento facial antiacné', 'PENDING');
  


  IF OBJECT_ID(N'crm.trg_Clients_SetUpdatedAt', N'TR') IS NOT NULL
    DROP TRIGGER crm.trg_Clients_SetUpdatedAt;
GO

CREATE TRIGGER crm.trg_Clients_SetUpdatedAt
ON crm.Clients
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE c
      SET UpdatedAt = SYSUTCDATETIME()
    FROM crm.Clients c
    INNER JOIN inserted i
        ON c.ClientId = i.ClientId;
END;
GO


/* ========================
   5) Índices útiles
   ======================== */
-- Búsqueda por nombre (LIKE)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Clients_Name' AND object_id = OBJECT_ID(N'crm.Clients'))
    CREATE INDEX IX_Clients_Name ON crm.Clients (Name);
GO

-- Filtros por tipo y estado
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Clients_ServiceType_Status' AND object_id = OBJECT_ID(N'crm.Clients'))
    CREATE INDEX IX_Clients_ServiceType_Status ON crm.Clients (ServiceType, Status);
GO

-- Orden por fecha de creación
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Clients_CreatedAt' AND object_id = OBJECT_ID(N'crm.Clients'))
    CREATE INDEX IX_Clients_CreatedAt ON crm.Clients (CreatedAt DESC);
GO



/* ========================
   6) Seed mínimo (demo)
   ======================== */

-- Usuario admin (usa aquí tu hash real; este es un placeholder)
DECLARE @adminId UNIQUEIDENTIFIER = NEWID();

INSERT INTO crm.Users (UserId, Email, PasswordHash)
VALUES
(@adminId, N'admin@flin.app', N'123456');

-- Clientes de ejemplo
INSERT INTO crm.Clients (Name, Phone, ServiceType, Notes, AvatarUrl, Status, CreatedByUserId)
VALUES
(N'Ana Pérez',   N'809-555-1001', 'HAIR',   N'Corte y tinte',              N'https://picsum.photos/seed/ana/200',   'PENDING',      @adminId),
(N'Luis Gómez',  N'809-555-1002', 'REPAIR', N'Laptop sin encender',        N'https://picsum.photos/seed/luis/200',  'IN_PROGRESS',  @adminId),
(N'Studio Z',    N'809-555-1003', 'DESIGN', N'Logotipo minimalista',       N'https://picsum.photos/seed/z/200',     'DONE',         @adminId),
(N'FixIt SRL',   N'809-555-1004', 'REPAIR', N'Reparación aire acondicionado', N'https://picsum.photos/seed/fix/200', 'PENDING',      @adminId);
GO

/* ==========================================
   7) Vista opcional: resumen para dashboard
   ========================================== */
IF OBJECT_ID(N'crm.vw_ClientsSummary', N'V') IS NOT NULL
    DROP VIEW crm.vw_ClientsSummary;
GO

CREATE VIEW crm.vw_ClientsSummary
AS
SELECT
    COUNT(1)                                   AS Total,
    SUM(CASE WHEN Status = 'PENDING'     THEN 1 ELSE 0 END) AS Pending,
    SUM(CASE WHEN Status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS InProgress,
    SUM(CASE WHEN Status = 'DONE'        THEN 1 ELSE 0 END) AS Done
FROM crm.Clients;
GO

/* ========================
   8) Pruebas rápidas
   ======================== */
-- SELECT * FROM crm.Users;
-- SELECT * FROM crm.Clients ORDER BY CreatedAt DESC;
-- SELECT * FROM crm.vw_ClientsSummary;
