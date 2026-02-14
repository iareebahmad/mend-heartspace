
ALTER TABLE public.circles ADD COLUMN support_prompts jsonb;

UPDATE public.circles SET support_prompts = '["I just need to let this out", "I am trying to make sense of what happened", "I want to know how others moved forward"]'::jsonb WHERE name = 'Breakups and Moving On';

UPDATE public.circles SET support_prompts = '["I feel overwhelmed and need to say it somewhere", "I am struggling to stay focused", "How do others handle this pressure"]'::jsonb WHERE name = 'Academic Pressure';

UPDATE public.circles SET support_prompts = '["I feel stretched thin", "I am not sure how to set boundaries", "Has anyone figured out a healthier balance"]'::jsonb WHERE name = 'Work Pressure';

UPDATE public.circles SET support_prompts = '["I feel disconnected lately", "I miss feeling understood", "How do you build deeper connections"]'::jsonb WHERE name = 'Loneliness and Connection';

UPDATE public.circles SET support_prompts = '["My mind will not slow down", "I keep replaying things in my head", "How do you ground yourself when it feels like this"]'::jsonb WHERE name = 'Anxious Thoughts';

UPDATE public.circles SET support_prompts = '["Something feels tense at home", "I am struggling with expectations", "How do you navigate difficult family conversations"]'::jsonb WHERE name = 'Family Dynamics';
