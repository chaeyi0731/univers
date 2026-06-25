// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 연결 테스트 로그
supabase.auth.getSession().then(({ data }) => {
  console.log('Supabase 연결 상태:', data ? '성공' : '실패');
});