# Experts Table Documentation

## Table Structure Query
To view the current table structure:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'experts'
ORDER BY ordinal_position;
```

## Detailed Structure Query
For a more detailed view including constraints:

```sql
SELECT 
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'PRIMARY KEY'
        ELSE ''
    END as key_type,
    CASE 
        WHEN fk.column_name IS NOT NULL 
        THEN 'FOREIGN KEY REFERENCES ' || fk.foreign_table_name
        ELSE ''
    END as foreign_key
FROM information_schema.columns c
LEFT JOIN (
    SELECT ku.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage ku
        ON tc.constraint_name = ku.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_name = 'experts'
) pk ON c.column_name = pk.column_name
LEFT JOIN (
    SELECT 
        kcu.column_name,
        ccu.table_name as foreign_table_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'experts'
) fk ON c.column_name = fk.column_name
WHERE c.table_name = 'experts'
ORDER BY c.ordinal_position;
```

## Domain ID Removal Steps
Steps taken to remove the domain_id dependency:

```sql
-- 1. Remove RLS policy that depends on domain_id
DROP POLICY IF EXISTS "Dynamic Healing Group select access" ON experts;

-- 2. Remove the foreign key constraint
ALTER TABLE experts 
DROP CONSTRAINT IF EXISTS experts_domain_id_fkey;

-- 3. Remove any indexes that might depend on domain_id
DROP INDEX IF EXISTS experts_domain_id_idx;

-- 4. Remove the domain_id column
ALTER TABLE experts 
DROP COLUMN IF EXISTS domain_id;

-- 5. Disable RLS if no longer needed
ALTER TABLE experts DISABLE ROW LEVEL SECURITY;
```

## Current Table Structure
As of [date], the experts table has the following fields:

- id (uuid, NOT NULL, default: gen_random_uuid())
- expert_name (text, NOT NULL)
- full_name (text, NULL)
- starting_ref_id (integer, NULL)
- is_in_core_group (boolean, NOT NULL, default: false)
- created_at (timestamp with time zone, NOT NULL, default: CURRENT_TIMESTAMP)
- updated_at (timestamp with time zone, NOT NULL, default: CURRENT_TIMESTAMP)
- created_by (uuid, NOT NULL)
- updated_by (uuid, NOT NULL)
- user_id (uuid, NULL)
- expertise_area (text, NULL)
- bio (text, NULL)
- experience_years (integer, NULL, default: 0)
- email_address (text, NULL)
- legacy_expert_id (bigint, NULL)

## Notes
- The table maintains created_at/updated_at timestamps automatically
- email_address and user_id fields are kept in the database but not displayed in the UI
- All text fields except expert_name are nullable 