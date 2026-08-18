(() => {
  'use strict';

  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginButton = document.getElementById('loginButton');
  const message = document.getElementById('loginMessage');

  const setMessage = (text, ok = false) => {
    message.textContent = text;
    message.classList.toggle('success', ok);
  };

  const setBusy = (busy) => {
    loginButton.disabled = busy;
    loginButton.textContent = busy ? '확인 중...' : '로그인';
  };

  async function getAuthorizedProfile(userId) {
    const { data, error } = await window.moohaeSupabase
      .from('admin_profiles')
      .select('display_name, role, is_active')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      return { profile: null, error };
    }

    const allowed =
      data &&
      data.is_active === true &&
      (data.role === 'admin' || data.role === 'manager');

    return {
      profile: allowed ? data : null,
      error: allowed ? null : new Error('관리자 권한이 없습니다.')
    };
  }

  async function redirectIfAlreadyAuthorized() {
    if (!window.moohaeSupabaseConfigReady) {
      setMessage('먼저 supabase-config.js에 Project URL과 Publishable key를 입력해주세요.');
      return;
    }

    const { data, error } = await window.moohaeSupabase.auth.getUser();

    if (error || !data?.user) {
      return;
    }

    const result = await getAuthorizedProfile(data.user.id);

    if (result.profile) {
      window.location.replace('./dashboard.html');
      return;
    }

    await window.moohaeSupabase.auth.signOut();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('');

    if (!window.moohaeSupabaseConfigReady) {
      setMessage('Supabase 설정값을 먼저 입력해주세요.');
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      setMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setBusy(true);

    try {
      const { data, error } = await window.moohaeSupabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data?.user) {
        setMessage('로그인 정보를 확인해주세요.');
        return;
      }

      const result = await getAuthorizedProfile(data.user.id);

      if (!result.profile) {
        await window.moohaeSupabase.auth.signOut();
        setMessage('이 계정에는 무해 관리자 권한이 없습니다.');
        return;
      }

      setMessage('인증되었습니다. 관리자 화면으로 이동합니다.', true);
      window.location.replace('./dashboard.html');
    } catch (error) {
      console.error('MOOHAE admin login error:', error);
      setMessage('로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setBusy(false);
    }
  });

  redirectIfAlreadyAuthorized().catch((error) => {
    console.error('MOOHAE session check error:', error);
  });
})();
