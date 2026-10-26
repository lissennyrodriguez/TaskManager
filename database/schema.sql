@'
IF DB_ID('TaskManagerDB') IS NULL
    CREATE DATABASE TaskManagerDB;
GO

USE TaskManagerDB;
GO

IF OBJECT_ID('dbo.Departments', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Departments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL UNIQUE
    );
END;
GO

IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(254) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        DepartmentId INT NOT NULL,
        Role VARCHAR(20) NOT NULL DEFAULT 'employee',

        CONSTRAINT FK_Users_Departments
            FOREIGN KEY (DepartmentId)
            REFERENCES dbo.Departments(Id),

        CONSTRAINT CK_Users_Role
            CHECK (Role IN ('admin', 'manager', 'employee'))
    );
END;
GO

IF OBJECT_ID('dbo.Tasks', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Tasks (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(150) NOT NULL,
        Description NVARCHAR(2000) NOT NULL DEFAULT '',
        DepartmentId INT NOT NULL,
        AssignedTo INT NOT NULL,
        CreatedBy INT NOT NULL,
        Priority VARCHAR(20) NOT NULL DEFAULT 'media',
        Status VARCHAR(20) NOT NULL DEFAULT 'pendiente',
        DueDate DATE NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT FK_Tasks_Departments
            FOREIGN KEY (DepartmentId)
            REFERENCES dbo.Departments(Id),

        CONSTRAINT FK_Tasks_AssignedTo
            FOREIGN KEY (AssignedTo)
            REFERENCES dbo.Users(Id),

        CONSTRAINT FK_Tasks_CreatedBy
            FOREIGN KEY (CreatedBy)
            REFERENCES dbo.Users(Id),

        CONSTRAINT CK_Tasks_Priority
            CHECK (Priority IN ('baja', 'media', 'alta', 'urgente')),

        CONSTRAINT CK_Tasks_Status
            CHECK (Status IN (
                'pendiente',
                'en_progreso',
                'completada',
                'cancelada'
            ))
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Departments)
BEGIN
    INSERT INTO dbo.Departments (Name)
    VALUES
        (N'Recursos Humanos'),
        (N'Tecnología'),
        (N'Finanzas'),
        (N'Operaciones');
END;
GO
'@ | Set-Content -Path .\database\schema.sql -Encoding utf8