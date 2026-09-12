
CREATE DATABASE IF NOT EXISTS workshop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE workshop;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brands(
	id 				INT UNSIGNED 		AUTO_INCREMENT NOT NULL,
	name 			VARCHAR(50) 		NOT NULL,
    is_active 		BOOLEAN 			DEFAULT TRUE,
	created_at 		DATETIME 			DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_brand			PRIMARY KEY(id),
    CONSTRAINT uk_brand_name 	UNIQUE(name)
);


CREATE TABLE models(
	id 			INT UNSIGNED 		AUTO_INCREMENT NOT NULL,
    brand_id 	INT UNSIGNED 		NOT NULL,
    name 		VARCHAR(50) 		NOT NULL,
    is_active   BOOLEAN 			DEFAULT TRUE,
    created_at 	DATETIME 			DEFAULT CURRENT_TIMESTAMP,
	
    CONSTRAINT 	uk_model_brand_name 	UNIQUE(brand_id,name),
    CONSTRAINT 	pk_model	 			PRIMARY KEY(id),
    CONSTRAINT 	fk_model_brand 			FOREIGN KEY(brand_id) REFERENCES brands(id)
);


CREATE TABLE fuels(
	id 			TINYINT UNSIGNED 		AUTO_INCREMENT NOT NULL,
	name 		VARCHAR(50) 			NOT NULL,
    is_active 	BOOLEAN 				DEFAULT TRUE,
    created_at 	DATETIME 				DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_fuel_name 	UNIQUE(name),
    CONSTRAINT pk_fuel	 		PRIMARY KEY(id)
);


CREATE TABLE services(
	id 				INT UNSIGNED 		AUTO_INCREMENT NOT NULL,
    name 			VARCHAR(100) 		NOT NULL,
    price 			DECIMAL(10,2) 		NOT NULL,
    description 	TEXT 				NULL, 
    is_active 		BOOLEAN 			DEFAULT TRUE,
    created_at 		DATETIME 			DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_service_name 		UNIQUE(name),
    CONSTRAINT chk_service_price 	CHECK(price >= 0),
    CONSTRAINT pk_service	 		PRIMARY KEY(id)
);


CREATE TABLE parts(
	id 				INT UNSIGNED 		AUTO_INCREMENT NOT NULL,
    name 			VARCHAR(50) 		NOT NULL,
    price 			DECIMAL(10,2) 		NOT NULL,
    description 	TEXT 				NULL,
    is_active 		BOOLEAN 			DEFAULT TRUE,
    created_at 		DATETIME 			DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_part_name 	UNIQUE(name),
    CONSTRAINT chk_part_price 	CHECK(price >= 0),
    CONSTRAINT pk_part	 		PRIMARY KEY(id)
);


CREATE TABLE status(
	id 				TINYINT UNSIGNED 		AUTO_INCREMENT NOT NULL,
    name 			VARCHAR(50) 			NOT NULL,
	description 	TEXT 					NOT NULL,
    scope			ENUM('appointment','order','quote') NOT NULL,
    is_active 		BOOLEAN 				DEFAULT TRUE,
    created_at 		DATETIME 				DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_status_name_scope UNIQUE(name,scope),
    CONSTRAINT pk_status			PRIMARY KEY(id)
);


CREATE TABLE methods(
	id			TINYINT UNSIGNED 		AUTO_INCREMENT NOT NULL,
    name 		VARCHAR(60) 			NOT NULL,
    is_active 	BOOLEAN 				DEFAULT TRUE,
    created_at 	DATETIME 				DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_method_name 	UNIQUE(name),
    CONSTRAINT pk_method	 	PRIMARY KEY(id)
);


CREATE TABLE colors(
	id			INT UNSIGNED	 		AUTO_INCREMENT NOT NULL,
    name 		VARCHAR(30) 			NOT NULL,
    is_active 	BOOLEAN 				DEFAULT TRUE,
    created_at 	DATETIME 				DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_color_name 	UNIQUE(name),
    CONSTRAINT pk_color		 	PRIMARY KEY(id)
);

CREATE TABLE vehicles(
	id 			INT UNSIGNED 		AUTO_INCREMENT NOT NULL,
	user_id 	BIGINT UNSIGNED 	NOT NULL,
    model_id 	INT UNSIGNED 		NOT NULL,
    fuel_id 	TINYINT UNSIGNED 	NOT NULL,
    color_id 	INT UNSIGNED 		NOT NULL,
    year  	YEAR 				NOT NULL,
    plate 		VARCHAR(10) 		NOT NULL,
    vin 		CHAR(17) 			NULL,  				
    mileage  	INT UNSIGNED     	NOT NULL DEFAULT 0,
    is_active   BOOLEAN          	NOT NULL DEFAULT TRUE,
    created_at  DATETIME         	DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME         	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_vehicle_mileage 	CHECK(mileage >= 0),
    CONSTRAINT uk_vehicle_plate 	UNIQUE(plate),
    CONSTRAINT uk_vehicle_vin 		UNIQUE(vin),
    CONSTRAINT pk_vehicle			PRIMARY KEY(id),
    CONSTRAINT fk_vehicle_user 		FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_vehicle_model 	FOREIGN KEY(model_id) REFERENCES models(id),
    CONSTRAINT fk_vehicle_fuel 		FOREIGN KEY(fuel_id) REFERENCES fuels(id),
    CONSTRAINT fk_vehicle_color 	FOREIGN KEY(color_id) REFERENCES colors(id)
);

CREATE TABLE appointments(
	id 				INT UNSIGNED 		AUTO_INCREMENT NOT NULL,
    vehicle_id 		INT UNSIGNED 		NOT NULL,
    status_id 		TINYINT UNSIGNED    NOT NULL,
    date			DATE 				NOT NULL, -- Dia Escogido 
    time          TIME 				NOT NULL, -- Hora Escogida
    reason 			TEXT				NULL,  -- Problema del carro descrito por el cliente
    created_at 		DATETIME 			DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pk_appointment PRIMARY KEY(id),
    CONSTRAINT fk_appointment_vehicle FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT fk_appointment_status  FOREIGN KEY(status_id) REFERENCES status(id)
);

CREATE TABLE workorders(
	id 				INT UNSIGNED 			AUTO_INCREMENT NOT NULL,
    vehicle_id 		INT UNSIGNED 			NOT NULL,
    mechanic_id 	BIGINT UNSIGNED     	NOT NULL, 
    status_id 		TINYINT UNSIGNED    	NOT NULL,
    mileage			INT UNSIGNED			NOT NULL, 
    delivery		DATETIME 				NULL,		
    created_at		DATETIME 				DEFAULT CURRENT_TIMESTAMP, 
    updated_at		DATETIME 				DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
	CONSTRAINT chk_workorder_mileage CHECK(mileage >= 0),
    CONSTRAINT pk_workorder PRIMARY KEY(id),
    CONSTRAINT fk_workorder_vehicle FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT fk_workorder_status  FOREIGN KEY(status_id) REFERENCES status(id),
    CONSTRAINT fk_workorder_mechanic FOREIGN KEY(mechanic_id) REFERENCES users(id)
);

CREATE TABLE quotes(
	id 				INT UNSIGNED 			AUTO_INCREMENT NOT NULL,
    workorder_id	INT UNSIGNED			NOT NULL,
    user_id 		BIGINT UNSIGNED 		NOT NULL,
    status_id		TINYINT UNSIGNED 		NOT NULL,
    subtotal 		DECIMAL(10,2)			NOT NULL DEFAULT 0,
    tax				DECIMAL(10,2)			NOT NULL DEFAULT 0,
    total			DECIMAL(10,2)			NOT NULL DEFAULT 0,
    validity		DATE					NULL,
    created_at		DATETIME				DEFAULT CURRENT_TIMESTAMP,
    updated_at		DATETIME 				DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_quote_subtotal 		CHECK(subtotal >= 0),
    CONSTRAINT chk_quote_tax 			CHECK(tax >= 0),
    CONSTRAINT chk_quote_total 			CHECK(total >= 0),
    CONSTRAINT pk_quote_id				PRIMARY KEY(id),
    CONSTRAINT fk_quote_workorder 		FOREIGN KEY(workorder_id) REFERENCES workorders(id),
    CONSTRAINT fk_quote_user 			FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_quote_status			FOREIGN KEY(status_id) REFERENCES status(id)
);

CREATE TABLE quoteitems(
	id 				INT UNSIGNED 			AUTO_INCREMENT NOT NULL,
    quote_id		INT UNSIGNED			NOT NULL,
    service_id		INT UNSIGNED			NOT NULL,
    price			DECIMAL(10,2)			NOT NULL,
    discount		DECIMAL(5,2)			NOT NULL DEFAULT 0,
    amount 			DECIMAL(10,2)			NOT NULL,
    is_approved		BOOLEAN					NOT NULL DEFAULT FALSE,
    
	CONSTRAINT chk_quoteitem_price 		CHECK(price >= 0),
    CONSTRAINT chk_quoteitem_discount 	CHECK(discount >= 0 AND discount <= 100),
    CONSTRAINT chk_quoteitem_amount 	CHECK(amount >= 0),
    CONSTRAINT pk_quoteitem_id 			PRIMARY KEY(id),
    CONSTRAINT fk_quoteitem_quote 		FOREIGN KEY(quote_id) REFERENCES quotes(id),
    CONSTRAINT fk_quoteitem_service 	FOREIGN KEY(service_id) REFERENCES services(id)
);


CREATE TABLE quoteparts(
	id           INT UNSIGNED 				AUTO_INCREMENT NOT NULL,
    quote_id     INT UNSIGNED 				NOT NULL,
    part_id      INT UNSIGNED 				NOT NULL,
    quantity     SMALLINT UNSIGNED 			NOT NULL DEFAULT 1,
    price        DECIMAL(10,2) 				NOT NULL,
    discount     DECIMAL(5,2) 				NOT NULL DEFAULT 0,
    amount       DECIMAL(10,2) 				NOT NULL,
    is_approved  BOOLEAN 					NOT NULL DEFAULT FALSE,
    
    CONSTRAINT chk_quotepart_quantity 	CHECK(quantity > 0),
    CONSTRAINT chk_quotepart_price 		CHECK(price >= 0),
    CONSTRAINT chk_quotepart_discount 	CHECK(discount >= 0 AND discount <= 100),
    CONSTRAINT chk_quotepart_amount 	CHECK(amount >= 0),
    CONSTRAINT pk_quotepart_id			PRIMARY KEY(id),
    CONSTRAINT fk_quotepart_quote 		FOREIGN KEY(quote_id) REFERENCES quotes(id),
    CONSTRAINT fk_quotepart_part 		FOREIGN KEY(part_id) REFERENCES parts(id)
);

CREATE TABLE payment(
	id  		INT UNSIGNED 				AUTO_INCREMENT NOT NULL,
    quote_id 	INT UNSIGNED				NOT NULL,
    method_id 	TINYINT UNSIGNED 			NOT NULL,
    status_id   TINYINT UNSIGNED 			NOT NULL,
    amount      DECIMAL(10,2) 				NOT NULL,
    reference VARCHAR(60) 				NULL,
    paid_at     DATETIME 					NULL,
	
    CONSTRAINT chk_payment_amount 		CHECK(amount > 0),
	CONSTRAINT pk_payment_id 			PRIMARY KEY(id),
	CONSTRAINT fk_payment_quote 		FOREIGN KEY(quote_id) REFERENCES quotes(id),
	CONSTRAINT fk_payment_method 		FOREIGN KEY(method_id) REFERENCES methods(id),
    CONSTRAINT fk_payment_status 		FOREIGN KEY(status_id) REFERENCES status(id)
);

CREATE TABLE diagnoses(
    id            	INT UNSIGNED 				AUTO_INCREMENT NOT NULL,
    workorder_id  	INT UNSIGNED 				NOT NULL,
    description   TEXT 						NOT NULL,
    result        	TEXT 						NULL,
    created_at    	DATETIME 					DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_diagnosis_id 			PRIMARY KEY(id),
    CONSTRAINT fk_diagnosis_workorder 	FOREIGN KEY(workorder_id) REFERENCES workorders(id)
);

CREATE TABLE history(
    id            INT UNSIGNED 				AUTO_INCREMENT NOT NULL,
    vehicle_id    INT UNSIGNED 				NOT NULL,
    workorder_id  INT UNSIGNED 				NOT NULL,
    created_at    DATETIME 					DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_history_id 			PRIMARY KEY(id),
    CONSTRAINT fk_history_vehicle 		FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT fk_history_workorder 	FOREIGN KEY(workorder_id) REFERENCES workorders(id)
);


CREATE TABLE evidence(
    id            INT UNSIGNED 								AUTO_INCREMENT NOT NULL,
    workorder_id  INT UNSIGNED 								NOT NULL,	
    path          VARCHAR(255) 								NOT NULL,
    format        ENUM('jpeg','jpg','png','heic','heif') 	NOT NULL,
    size          INT UNSIGNED 								NOT NULL,
    created_at    DATETIME 									DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT chk_evidence_size 							CHECK(size > 0),
    CONSTRAINT pk_evidence_id 								PRIMARY KEY(id),
    CONSTRAINT fk_evidence_workorder 						FOREIGN KEY(workorder_id) REFERENCES workorders(id)
);

INSERT INTO users (name,email,password) VALUES 
('Administrador','admin@ejemplo.com','123456'),
('Luis Ramírez','luis@ejemplo.com','123456'),        
('Pedro Torres','pedro@ejemplo.com','123456'),        
('Ana García','ana@ejemplo.com','123456'),          
('Jorge Hernández','jorge@ejemplo.com','123456'),    
('María López','maria@ejemplo.com','123456'),          
('Roberto Sánchez','roberto@ejemplo.com','123456'),      
('Diana Flores','diana@ejemplo.com','123456'),         
('Miguel Ángel Ruiz','miguel@ejemplo.com','123456'),    
('Patricia Morales','patricia@ejemplo.com','123456');     

INSERT INTO brands (name) VALUES
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

INSERT INTO models (brand_id, name) VALUES
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


INSERT INTO fuels (name) VALUES
('Gasolina'),
('Diésel'),
('Eléctrico'),
('Híbrido'),
('Gas LP');
 
INSERT INTO colors (name) VALUES
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
 
INSERT INTO services (name, price, description) VALUES
('Cambio de aceite y filtro',       350.00, 'Cambio de aceite de motor con filtro incluido'),
('Afinación menor',                 800.00, 'Bujías, filtro de aire y revisión general'),
('Afinación mayor',                1500.00, 'Bujías, filtros, cables y revisión completa'),
('Frenos delanteros',              1200.00, 'Cambio de balatas y revisión de discos delanteros'),
('Frenos traseros',                1000.00, 'Cambio de balatas traseras'),
('Cambio de distribución',         3500.00, 'Reemplazo de banda o cadena de distribución'),
('Diagnosis computarizada',         400.00, 'Lectura y análisis de códigos de falla con escáner'),
('Alineación y balanceo',           350.00, 'Alineación computarizada y balanceo de las 4 ruedas'),
('Cambio de amortiguadores',       2200.00, 'Reemplazo de los 4 amortiguadores'),
('Revisión general preventiva',     250.00, 'Inspección visual de 30 puntos del vehículo');
 
INSERT INTO parts (name, price, description) VALUES
('Filtro de aceite',                 80.00, 'Filtro de aceite de motor genérico'),
('Filtro de aire',                  120.00, 'Filtro de aire de motor'),
('Bujías (juego 4)',                320.00, 'Juego de 4 bujías estándar'),
('Balatas delanteras',              380.00, 'Par de balatas para frenos delanteros'),
('Balatas traseras',                320.00, 'Par de balatas para frenos traseros'),
('Banda de distribución',           650.00, 'Banda de distribución con kit tensores'),
('Aceite motor 5W-30 (4L)',         280.00, 'Aceite de motor semisintético 5W-30'),
('Amortiguador delantero',          850.00, 'Amortiguador delantero (precio por pieza)'),
('Amortiguador trasero',            750.00, 'Amortiguador trasero (precio por pieza)'),
('Filtro de combustible',           180.00, 'Filtro de combustible en línea');
 
INSERT INTO `status` (scope, name, `description`) VALUES
-- appointment
('appointment', 'Pending',   'Cita solicitada, pendiente de confirmar'),
('appointment', 'Confirmed', 'Cita confirmada por el taller'),
('appointment', 'Cancelled', 'Cita cancelada por cliente o taller'),
-- order
('order', 'Received',   'Vehículo recibido en taller, orden abierta'),
('order', 'Diagnosis',  'Mecánico realizando diagnóstico del vehículo'),
('order', 'Repair',     'Vehículo en proceso de reparación'),
('order', 'Ready',      'Reparación terminada, pendiente de entrega'),
('order', 'Delivered',  'Vehículo entregado al cliente'),
-- quote
('quote', 'Pending',   'Cotización enviada al cliente, sin respuesta'),
('quote', 'Approved',  'Cliente aprobó la cotización'),
('quote', 'Rejected',  'Cliente rechazó la cotización');
 
INSERT INTO methods (name) VALUES
('Efectivo'),
('Tarjeta de débito'),
('Tarjeta de crédito'),
('Transferencia bancaria'),
('Pago móvil');
 
 

INSERT INTO vehicles (user_id, model_id, fuel_id, color_id, year, plate, vin, mileage) VALUES
(6,  1,  1, 1, 2019, 'ABC1234', '1HGBH41JXMN109186', 45000),  
(6,  3,  1, 3, 2021, 'DEF5678', '2T1BURHE0JC043821', 20000),  
(7,  5,  1, 2, 2018, 'GHI9012', '3VWFE21C04M000001', 80000),  
(7,  8,  1, 4, 2020, 'JKL3456', '1FAHP3F20CL451234', 35000),   
(8,  2,  2, 6, 2017, 'MNO7890', '5TDDKRFH0HS012345', 120000), 
(8,  9,  1, 1, 2022, 'PQR1234', '2HGFA1F59CH512345', 8000), 
(9,  7,  2, 2, 2016, 'STU5678', '1FTFW1EF5EFA12345', 150000), 
(9,  10, 1, 5, 2023, 'VWX9012', 'JM1BK343X71234567', 5000),  
(10, 4,  2, 7, 2015, 'YZA3456', '1N4AL3AP0EC123456', 200000),
(10, 6,  2, 6, 2019, 'BCD7890', '3GCUKREC0EG123456', 95000); 
 

INSERT INTO appointments (vehicle_id, status_id, `date`, `time`, reason) VALUES
(1,  2, '2025-07-01', '09:00:00', 'Le cae aceite y hace ruido al encender'),
(2,  2, '2025-07-02', '10:30:00', 'Frenos hacen ruido al frenar'),
(3,  1, '2025-07-03', '11:00:00', 'Revisión preventiva general'),
(4,  3, '2025-07-04', '08:00:00', 'Cambio de aceite programado'),
(5,  2, '2025-07-05', '09:30:00', 'Motor no enciende en las mañanas'),
(6,  1, '2025-07-07', '10:00:00', 'Luz de check engine encendida'),
(7,  2, '2025-07-08', '08:30:00', 'Vibración fuerte al acelerar'),
(8,  1, '2025-07-09', '11:30:00', 'Cambio de aceite y revisión'),
(9,  3, '2025-07-10', '09:00:00', 'Suspensión hace golpes en baches'),
(10, 2, '2025-07-11', '10:00:00', 'Humo blanco saliendo del escape');
 

INSERT INTO workorders (vehicle_id, mechanic_id, status_id, mileage, delivery) VALUES
(1,  2, 8, 45100,  '2025-07-03 17:00:00'),  
(2,  3, 7, 20050,  NULL),                   
(3,  2, 6, 80200,  NULL),                   
(4,  4, 5, 35100,  NULL),                   
(5,  3, 8, 120500, '2025-07-06 18:00:00'),  
(6,  5, 4, 8010,   NULL),                
(7,  2, 6, 150200, NULL),              
(8,  4, 7, 5050,   NULL),                  
(9,  5, 8, 200100, '2025-07-09 16:00:00'), 
(10, 3, 5, 95200,  NULL);               
 
INSERT INTO quotes (workorder_id, user_id, status_id, subtotal, tax, total, validity) VALUES
(1,  2, 10,  302.00,  48.32,  350.32,  '2025-07-05'),  
(2,  3, 10, 1034.48, 165.52, 1200.00,  '2025-07-08'),  
(3,  2,  9, 2155.17, 344.83, 2500.00,  '2025-07-15'),  
(4,  4,  9,  344.83,  55.17,  400.00,  '2025-07-14'),  
(5,  3, 10, 3017.24, 482.76, 3500.00,  '2025-07-07'),  
(6,  5,  9,  215.52,  34.48,  250.00,  '2025-07-18'),  
(7,  2,  9, 3879.31, 620.69, 4500.00,  '2025-07-20'),  
(8,  4, 10, 1293.10, 206.90, 1500.00,  '2025-07-16'), 
(9,  5, 10, 1896.55, 303.45, 2200.00,  '2025-07-10'),  
(10, 3, 11,  689.66, 110.34,  800.00,  '2025-07-12');  
 

INSERT INTO quoteitems (quote_id, service_id, price, discount, amount, is_approved) VALUES
(1,  1,  350.00, 0,  350.00, TRUE),   
(2,  4, 1200.00, 0, 1200.00, TRUE),   
(3,  9, 2200.00, 0, 2200.00, FALSE),  
(4,  7,  400.00, 0,  400.00, FALSE), 
(5,  6, 3500.00, 0, 3500.00, TRUE),   
(6,  10, 250.00, 0,  250.00, FALSE), 
(7,  9, 2200.00, 0, 2200.00, FALSE), 
(7,  8,  350.00, 0,  350.00, FALSE), 
(8,  2,  800.00, 0,  800.00, TRUE),   
(9,  9, 2200.00, 0, 2200.00, TRUE); 
 

INSERT INTO quoteparts (quote_id, part_id, quantity, price, discount, amount, is_approved) VALUES
(1,  7, 1,  280.00, 0,  280.00, TRUE),   
(1,  1, 1,   80.00, 0,   80.00, TRUE),   
(2,  4, 1,  380.00, 0,  380.00, TRUE),   
(3,  8, 2,  850.00, 0, 1700.00, FALSE), 
(3,  9, 2,  750.00, 0, 1500.00, FALSE),  
(5,  6, 1,  650.00, 0,  650.00, TRUE),   
(7,  8, 2,  850.00, 0, 1700.00, FALSE),  
(8,  3, 1,  320.00, 0,  320.00, TRUE), 
(8,  2, 1,  120.00, 0,  120.00, TRUE),  
(9,  8, 2,  850.00, 0, 1700.00, TRUE);  
 
INSERT INTO payment (quote_id, method_id, status_id, amount, reference, paid_at) VALUES
(1, 1, 10,  350.32, NULL,          '2025-07-03 17:30:00'),  
(2, 2, 10, 1200.00, 'TXN-0041',    '2025-07-07 12:00:00'),  
(5, 4, 10, 3500.00, 'SPEI-992341', '2025-07-06 18:30:00'),  
(8, 3, 10, 1500.00, 'TXN-0089',    '2025-07-10 11:00:00'),  
(9, 1, 10, 2200.00, NULL,          '2025-07-09 16:30:00'),  
(3, 2,  9, 2500.00, NULL, NULL),
(4, 1,  9,  400.00, NULL, NULL),
(6, 5,  9,  250.00, NULL, NULL),
(7, 4,  9, 4500.00, NULL, NULL),
(10,1,  9,  800.00, NULL, NULL);
 

INSERT INTO diagnoses (workorder_id, `description`, result) VALUES
(1,  'Revisión por fuga de aceite y ruido al encender. Filtro de aceite saturado, nivel bajo.','Se realizó cambio de aceite 5W-30 y filtro. Fuga corregida.'),
(2,  'Inspección de frenos por ruido metálico al frenar.','Balatas delanteras al límite. Se reemplazaron.'),
(3,  'Revisión de suspensión por vibración excesiva.','Amortiguadores delanteros y traseros agotados. En espera de autorización.'),
(4,  'Lectura de códigos con escáner por check engine encendida.','Código P0301: falla de encendido en cilindro 1. Pendiente afinación.'),
(5,  'Motor no enciende en frío. Revisión eléctrica y mecánica.','Banda de distribución desgastada. Se reemplazó con kit completo.'),
(6,  'Revisión general preventiva de 30 puntos.',NULL),
(7,  'Vibración al acelerar. Revisión de suspensión y transmisión.','Amortiguadores delanteros agotados. Alineación desviada. Pendiente autorización.'),
(8,  'Afinación menor solicitada. Motor presentaba baja respuesta.','Se cambiaron bujías y filtro de aire. Motor respondiendo correctamente.'),
(9,  'Golpes en suspensión en baches. Revisión completa de tren delantero.','Amortiguadores delanteros reemplazados. Suspensión correcta.'),
(10, 'Humo blanco por escape. Posible fuga de anticongelante.','Junta de cabeza con micro-fuga. Requiere trabajo mayor. Cliente rechazó cotización.');
 
INSERT INTO `history` (vehicle_id, workorder_id) VALUES
(1,  1),
(2,  2),
(3,  3),
(4,  4),
(5,  5),
(6,  6),
(7,  7),
(8,  8),
(9,  9),
(10, 10);
 

INSERT INTO evidence (workorder_id, path, format, size) VALUES
(1,  'orders/1/before_engine.jpg',     'jpg',  204800),
(1,  'orders/1/after_engine.jpg',      'jpg',  198400),
(2,  'orders/2/brake_wear.jpg',        'jpg',  215040),
(3,  'orders/3/suspension_front.jpg',  'jpg',  307200),
(4,  'orders/4/scanner_codes.jpg',     'jpg',  102400),
(5,  'orders/5/timing_belt_old.jpg',   'jpg',  256000),
(5,  'orders/5/timing_belt_new.jpg',   'jpg',  248000),
(7,  'orders/7/shock_absorber.jpg',    'jpg',  189440),
(9,  'orders/9/suspension_after.jpg',  'jpg',  220160),
(10, 'orders/10/exhaust_smoke.jpg',    'jpg',  175360);