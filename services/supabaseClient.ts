import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://auyneewcybqaagebplkn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eW5lZXdjeWJxYWFnZWJwbGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzIxODQsImV4cCI6MjA4MzU0ODE4NH0.-kNWIdSGwFv38jczwD9rO5VsAv4jjHIsHFHhCn0s2Wo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
