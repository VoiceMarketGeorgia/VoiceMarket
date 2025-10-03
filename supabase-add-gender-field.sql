-- Add gender field to voice_actors table
ALTER TABLE voice_actors 
ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'Male';

-- Update existing rows to have a default gender
UPDATE voice_actors 
SET gender = 'Male' 
WHERE gender IS NULL;

-- Add comment to the column
COMMENT ON COLUMN voice_actors.gender IS 'Gender of the voice actor: Male, Female, or Child';

