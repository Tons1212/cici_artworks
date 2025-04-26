import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xmobeyxirqmimvjfzisj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtb2JleXhpcnFtaW12amZ6aXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDEyMDQsImV4cCI6MjA2MTA3NzIwNH0.DFqhysAKRY9m4EnUpIF4VcVSwx4G2GMcd2UmbPVcsBc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);