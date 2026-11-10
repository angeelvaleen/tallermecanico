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
