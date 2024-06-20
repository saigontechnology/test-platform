-- This is an empty migration.
-- Add new user role:  Editor    
INSERT INTO public."UserRole" (id, name, "description", "createdAt", "updatedAt")
VALUES (3, 'Editor', 'Editor role with permissions to modify content', now(), now());