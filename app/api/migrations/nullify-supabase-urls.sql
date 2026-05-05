-- SQL Cleanup: Nullify dead Supabase image URLs in vehicles table
-- Run this against your PostgreSQL database

-- 1. Preview affected rows (DO NOT MODIFY)
SELECT id, name, image_url
FROM vehicles
WHERE image_url IS NOT NULL;

-- 2. Preview rows with Supabase URLs specifically
SELECT id, name, image_url
FROM vehicles
WHERE image_url LIKE '%supabase%';

-- 3. Nullify Supabase URLs (run after reviewing preview)
UPDATE vehicles
SET image_url = NULL, updated_at = NOW()
WHERE image_url LIKE '%supabase%';

-- 4. Nullify ALL image_url values (optional - if migrating entirely to BYTEA)
-- UPDATE vehicles SET image_url = NULL, updated_at = NOW() WHERE image_url IS NOT NULL;

-- 5. Verify the update
SELECT id, name, image_url, image IS NOT NULL AS has_bytea_image
FROM vehicles;
