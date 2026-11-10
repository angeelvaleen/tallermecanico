
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
