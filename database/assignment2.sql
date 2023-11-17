-- Create 
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

-- Make Account Admin
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Delete Accout
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Replace text in Hummer Description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description,'small interiors','a huge interior')
WHERE inv_make = 'GM'AND inv_model = 'Hummer';

-- Get Sports Cars
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport'

-- Add /vehicles to filepath
UPDATE public.inventory
SET inv_image = REPLACE(inv_image,'/images','/images/vehicles'), inv_thumbnail = REPLACE(inv_thumbnail,'/images','/images/vehicles');

