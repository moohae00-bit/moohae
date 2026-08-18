(() => {
  'use strict';

  // ==========================================================
  // 여기에 Supabase 브라우저용 값 2개만 입력하세요.
  // 1) Project URL / API URL
  // 2) Publishable key
  //
  // Secret key / service_role key는 절대 입력하지 마세요.
  // ==========================================================

  const SUPABASE_URL = 'https://tvullgydrkvqbutuhvsu.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_gCGil2x3zSz413uCjMBkXA_qSZLMiBz';

  const isPlaceholder =
    SUPABASE_URL.includes('YOUR_SUPABASE') ||
    SUPABASE_PUBLISHABLE_KEY.includes('YOUR_SUPABASE');

  if (isPlaceholder) {
    console.warn('MOOHAE: Supabase URL/Publishable key 설정이 아직 완료되지 않았습니다.');
  }

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    throw new Error('Supabase SDK가 로드되지 않았습니다.');
  }

  window.moohaeSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'moohae-admin-auth'
      }
    }
  );

  window.moohaeSupabaseConfigReady = !isPlaceholder;
})();
