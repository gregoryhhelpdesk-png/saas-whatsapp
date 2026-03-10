import { createClient } from '@supabase/supabase-js';

// Essas variáveis devem ser configuradas no seu arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
Configuração futura:
1. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ao seu .env
2. Utilize este client nos seus services em src/services/
*/
