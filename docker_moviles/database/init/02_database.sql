-- Esquema completo del taller + datos iniciales exclusivamente de catálogos.
-- Los usuarios se administran en Directus; Directus debe inicializarse antes de ejecutar este archivo.
-- Las tablas maestras y de detalle se crean vacías.

CREATE DATABASE IF NOT EXISTS workshop CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

USE workshop;

CREATE TABLE
    brands (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        name VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT pk_brand PRIMARY KEY (id),
        CONSTRAINT uk_brand_name UNIQUE (name)
    );

CREATE TABLE
    models (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        brand_id INT UNSIGNED NOT NULL,
        name VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uk_model_brand_name UNIQUE (brand_id, name),
        CONSTRAINT pk_model PRIMARY KEY (id),
        CONSTRAINT fk_model_brand FOREIGN KEY (brand_id) REFERENCES brands (id)
    );

CREATE TABLE
    fuels (
        id TINYINT UNSIGNED AUTO_INCREMENT NOT NULL,
        name VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uk_fuel_name UNIQUE (name),
        CONSTRAINT pk_fuel PRIMARY KEY (id)
    );

CREATE TABLE
    services (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uk_service_name UNIQUE (name),
        CONSTRAINT chk_service_price CHECK (price >= 0),
        CONSTRAINT pk_service PRIMARY KEY (id)
    );

CREATE TABLE
    parts (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        name VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uk_part_name UNIQUE (name),
        CONSTRAINT chk_part_price CHECK (price >= 0),
        CONSTRAINT pk_part PRIMARY KEY (id)
    );

CREATE TABLE
    status (
        id TINYINT UNSIGNED AUTO_INCREMENT NOT NULL,
        name VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        scope ENUM ('appointment', 'order', 'quote') NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uk_status_name_scope UNIQUE (name, scope),
        CONSTRAINT pk_status PRIMARY KEY (id)
    );

CREATE TABLE
    methods (
        id TINYINT UNSIGNED AUTO_INCREMENT NOT NULL,
        name VARCHAR(60) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uk_method_name UNIQUE (name),
        CONSTRAINT pk_method PRIMARY KEY (id)
    );

CREATE TABLE
    colors (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        name VARCHAR(30) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uk_color_name UNIQUE (name),
        CONSTRAINT pk_color PRIMARY KEY (id)
    );

CREATE TABLE
    vehicles (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        user_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
        model_id INT UNSIGNED NOT NULL,
        fuel_id TINYINT UNSIGNED NOT NULL,
        color_id INT UNSIGNED NOT NULL,
        year YEAR NOT NULL,
        plate VARCHAR(10) NOT NULL,
        vin CHAR(17) NULL,
        mileage INT UNSIGNED NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_vehicle_mileage CHECK (mileage >= 0),
        CONSTRAINT uk_vehicle_plate UNIQUE (plate),
        CONSTRAINT uk_vehicle_vin UNIQUE (vin),
        CONSTRAINT pk_vehicle PRIMARY KEY (id),
        CONSTRAINT fk_vehicle_user FOREIGN KEY (user_id) REFERENCES directus_users (id),
        CONSTRAINT fk_vehicle_model FOREIGN KEY (model_id) REFERENCES models (id),
        CONSTRAINT fk_vehicle_fuel FOREIGN KEY (fuel_id) REFERENCES fuels (id),
        CONSTRAINT fk_vehicle_color FOREIGN KEY (color_id) REFERENCES colors (id)
    );

CREATE TABLE
    appointments (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        vehicle_id INT UNSIGNED NOT NULL,
        status_id TINYINT UNSIGNED NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        reason TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT pk_appointment PRIMARY KEY (id),
        CONSTRAINT fk_appointment_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
        CONSTRAINT fk_appointment_status FOREIGN KEY (status_id) REFERENCES status (id)
    );

CREATE TABLE
    workorders (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        vehicle_id INT UNSIGNED NOT NULL,
        mechanic_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
        status_id TINYINT UNSIGNED NOT NULL,
        mileage INT UNSIGNED NOT NULL,
        delivery DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_workorder_mileage CHECK (mileage >= 0),
        CONSTRAINT pk_workorder PRIMARY KEY (id),
        CONSTRAINT fk_workorder_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
        CONSTRAINT fk_workorder_status FOREIGN KEY (status_id) REFERENCES status (id),
        CONSTRAINT fk_workorder_mechanic FOREIGN KEY (mechanic_id) REFERENCES directus_users (id)
    );

CREATE TABLE
    quotes (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        workorder_id INT UNSIGNED NOT NULL,
        user_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
        status_id TINYINT UNSIGNED NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
        tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL DEFAULT 0,
        validity DATE NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_quote_subtotal CHECK (subtotal >= 0),
        CONSTRAINT chk_quote_tax CHECK (tax >= 0),
        CONSTRAINT chk_quote_total CHECK (total >= 0),
        CONSTRAINT pk_quote_id PRIMARY KEY (id),
        CONSTRAINT fk_quote_workorder FOREIGN KEY (workorder_id) REFERENCES workorders (id),
        CONSTRAINT fk_quote_user FOREIGN KEY (user_id) REFERENCES directus_users (id),
        CONSTRAINT fk_quote_status FOREIGN KEY (status_id) REFERENCES status (id)
    );

CREATE TABLE
    quoteitems (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        quote_id INT UNSIGNED NOT NULL,
        service_id INT UNSIGNED NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(5, 2) NOT NULL DEFAULT 0,
        amount DECIMAL(10, 2) NOT NULL,
        is_approved BOOLEAN NOT NULL DEFAULT FALSE,
        CONSTRAINT chk_quoteitem_price CHECK (price >= 0),
        CONSTRAINT chk_quoteitem_discount CHECK (
            discount >= 0
            AND discount <= 100
        ),
        CONSTRAINT chk_quoteitem_amount CHECK (amount >= 0),
        CONSTRAINT pk_quoteitem_id PRIMARY KEY (id),
        CONSTRAINT fk_quoteitem_quote FOREIGN KEY (quote_id) REFERENCES quotes (id),
        CONSTRAINT fk_quoteitem_service FOREIGN KEY (service_id) REFERENCES services (id)
    );

CREATE TABLE
    quoteparts (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        quote_id INT UNSIGNED NOT NULL,
        part_id INT UNSIGNED NOT NULL,
        quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(5, 2) NOT NULL DEFAULT 0,
        amount DECIMAL(10, 2) NOT NULL,
        is_approved BOOLEAN NOT NULL DEFAULT FALSE,
        CONSTRAINT chk_quotepart_quantity CHECK (quantity > 0),
        CONSTRAINT chk_quotepart_price CHECK (price >= 0),
        CONSTRAINT chk_quotepart_discount CHECK (
            discount >= 0
            AND discount <= 100
        ),
        CONSTRAINT chk_quotepart_amount CHECK (amount >= 0),
        CONSTRAINT pk_quotepart_id PRIMARY KEY (id),
        CONSTRAINT fk_quotepart_quote FOREIGN KEY (quote_id) REFERENCES quotes (id),
        CONSTRAINT fk_quotepart_part FOREIGN KEY (part_id) REFERENCES parts (id)
    );

CREATE TABLE
    payment (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        quote_id INT UNSIGNED NOT NULL,
        method_id TINYINT UNSIGNED NOT NULL,
        user_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        reference VARCHAR(60) NULL,
        paid_at DATETIME NULL,
        CONSTRAINT chk_payment_amount CHECK (amount > 0),
        CONSTRAINT pk_payment_id PRIMARY KEY (id),
        CONSTRAINT fk_payment_quote FOREIGN KEY (quote_id) REFERENCES quotes (id),
        CONSTRAINT fk_payment_method FOREIGN KEY (method_id) REFERENCES methods (id),
        CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES directus_users (id)
    );

CREATE TABLE
    diagnoses (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        workorder_id INT UNSIGNED NOT NULL,
        description TEXT NOT NULL,
        result TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT pk_diagnosis_id PRIMARY KEY (id),
        CONSTRAINT fk_diagnosis_workorder FOREIGN KEY (workorder_id) REFERENCES workorders (id)
    );

CREATE TABLE
    history (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        vehicle_id INT UNSIGNED NOT NULL,
        workorder_id INT UNSIGNED NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT pk_history_id PRIMARY KEY (id),
        CONSTRAINT fk_history_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
        CONSTRAINT fk_history_workorder FOREIGN KEY (workorder_id) REFERENCES workorders (id)
    );

CREATE TABLE
    evidence (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        workorder_id INT UNSIGNED NOT NULL,
        path VARCHAR(255) NOT NULL,
        format ENUM ('jpeg', 'jpg', 'png', 'heic', 'heif') NOT NULL,
        size INT UNSIGNED NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_evidence_size CHECK (size > 0),
        CONSTRAINT pk_evidence_id PRIMARY KEY (id),
        CONSTRAINT fk_evidence_workorder FOREIGN KEY (workorder_id) REFERENCES workorders (id)
    );

INSERT INTO
    brands (name)
VALUES
    ('Toyota'),
    ('Nissan'),
    ('Chevrolet'),
    ('Ford'),
    ('Volkswagen'),
    ('Honda'),
    ('Mazda'),
    ('Hyundai'),
    ('Kia'),
    ('Dodge');

INSERT INTO
    models (brand_id, name)
VALUES
    (1, 'Corolla'),
    (1, 'Hilux'),
    (2, 'Sentra'),
    (2, 'Frontier'),
    (3, 'Aveo'),
    (3, 'Silverado'),
    (4, 'F-150'),
    (5, 'Jetta'),
    (6, 'Civic'),
    (7, 'Mazda3');

INSERT INTO
    fuels (name)
VALUES
    ('Gasolina'),
    ('Diésel'),
    ('Eléctrico'),
    ('Híbrido'),
    ('Gas LP');

INSERT INTO
    colors (name)
VALUES
    ('Blanco'),
    ('Negro'),
    ('Rojo'),
    ('Azul'),
    ('Gris'),
    ('Plata'),
    ('Verde'),
    ('Beige'),
    ('Naranja'),
    ('Amarillo');

INSERT INTO
    services (name, price, description)
VALUES
    (
        'Cambio de aceite y filtro',
        350.00,
        'Cambio de aceite de motor con filtro incluido'
    ),
    (
        'Afinación menor',
        800.00,
        'Bujías, filtro de aire y revisión general'
    ),
    (
        'Afinación mayor',
        1500.00,
        'Bujías, filtros, cables y revisión completa'
    ),
    (
        'Frenos delanteros',
        1200.00,
        'Cambio de balatas y revisión de discos delanteros'
    ),
    (
        'Frenos traseros',
        1000.00,
        'Cambio de balatas traseras'
    ),
    (
        'Cambio de distribución',
        3500.00,
        'Reemplazo de banda o cadena de distribución'
    ),
    (
        'Diagnosis computarizada',
        400.00,
        'Lectura y análisis de códigos de falla con escáner'
    ),
    (
        'Alineación y balanceo',
        350.00,
        'Alineación computarizada y balanceo de las 4 ruedas'
    ),
    (
        'Cambio de amortiguadores',
        2200.00,
        'Reemplazo de los 4 amortiguadores'
    ),
    (
        'Revisión general preventiva',
        250.00,
        'Inspección visual de 30 puntos del vehículo'
    );

INSERT INTO
    parts (name, price, description)
VALUES
    (
        'Filtro de aceite',
        80.00,
        'Filtro de aceite de motor genérico'
    ),
    (
        'Filtro de aire',
        120.00,
        'Filtro de aire de motor'
    ),
    (
        'Bujías (juego 4)',
        320.00,
        'Juego de 4 bujías estándar'
    ),
    (
        'Balatas delanteras',
        380.00,
        'Par de balatas para frenos delanteros'
    ),
    (
        'Balatas traseras',
        320.00,
        'Par de balatas para frenos traseros'
    ),
    (
        'Banda de distribución',
        650.00,
        'Banda de distribución con kit tensores'
    ),
    (
        'Aceite motor 5W-30 (4L)',
        280.00,
        'Aceite de motor semisintético 5W-30'
    ),
    (
        'Amortiguador delantero',
        850.00,
        'Amortiguador delantero (precio por pieza)'
    ),
    (
        'Amortiguador trasero',
        750.00,
        'Amortiguador trasero (precio por pieza)'
    ),
    (
        'Filtro de combustible',
        180.00,
        'Filtro de combustible en línea'
    );

INSERT INTO
    `status` (scope, name, `description`)
VALUES
    (
        'appointment',
        'Pending',
        'Cita solicitada, pendiente de confirmar'
    ),
    (
        'appointment',
        'Confirmed',
        'Cita confirmada por el taller'
    ),
    (
        'appointment',
        'Cancelled',
        'Cita cancelada por cliente o taller'
    ),
    (
        'order',
        'Received',
        'Vehículo recibido en taller, orden abierta'
    ),
    (
        'order',
        'Diagnosis',
        'Mecánico realizando diagnóstico del vehículo'
    ),
    (
        'order',
        'Repair',
        'Vehículo en proceso de reparación'
    ),
    (
        'order',
        'Ready',
        'Reparación terminada, pendiente de entrega'
    ),
    (
        'order',
        'Delivered',
        'Vehículo entregado al cliente'
    ),
    (
        'quote',
        'Pending',
        'Cotización enviada al cliente, sin respuesta'
    ),
    (
        'quote',
        'Approved',
        'Cliente aprobó la cotización'
    ),
    (
        'quote',
        'Rejected',
        'Cliente rechazó la cotización'
    );

INSERT INTO
    methods (name)
VALUES
    ('Efectivo'),
    ('Tarjeta de débito'),
    ('Tarjeta de crédito'),
    ('Transferencia bancaria'),
    ('Pago móvil');
