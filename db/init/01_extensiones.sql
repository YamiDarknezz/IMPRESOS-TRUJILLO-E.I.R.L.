-- Extensiones habilitadas desde el primer arranque del contenedor.
-- unaccent: búsquedas de clientes/materiales ignorando tildes.
-- pg_trgm: búsquedas por coincidencia parcial (ILIKE) eficientes.
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
