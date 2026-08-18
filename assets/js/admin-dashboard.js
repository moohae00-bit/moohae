(() => {
  'use strict';

  const identity = document.getElementById('adminIdentity');
  const logoutButton = document.getElementById('logoutButton');
  const dashboardMessage = document.getElementById('dashboardMessage');

  const countTargets = {
    customers: document.getElementById('customerCount'),
    diagnoses: document.getElementById('diagnosisCount'),
    care_visits: document.getElementById('visitCount'),
    reports: document.getElementById('reportCount')
  };

  async function requireAuthorizedAdmin() {
    if (!window.moohaeSupabaseConfigReady) {
      window.location.replace('./login.html');
      return null;
    }

    const { data, error } = await window.moohaeSupabase.auth.getUser();

    if (error || !data?.user) {
      window.location.replace('./login.html');
      return null;
    }

    const { data: profile, error: profileError } = await window.moohaeSupabase
      .from('admin_profiles')
      .select('display_name, role, is_active')
      .eq('user_id', data.user.id)
      .maybeSingle();

    const allowed =
      !profileError &&
      profile &&
      profile.is_active === true &&
      (profile.role === 'admin' || profile.role === 'manager');

    if (!allowed) {
      await window.moohaeSupabase.auth.signOut();
      window.location.replace('./login.html');
      return null;
    }

    return { user: data.user, profile };
  }

  async function loadCount(tableName, target) {
    const { count, error } = await window.moohaeSupabase
      .from(tableName)
      .select('id', { count: 'exact', head: true });

    target.textContent = error ? '—' : String(count ?? 0);
    return error;
  }

  async function boot() {
    try {
      const auth = await requireAuthorizedAdmin();
      if (!auth) return;

      identity.textContent = `${auth.profile.display_name} · ${auth.profile.role}`;

      const errors = await Promise.all([
        loadCount('customers', countTargets.customers),
        loadCount('diagnoses', countTargets.diagnoses),
        loadCount('care_visits', countTargets.care_visits),
        loadCount('reports', countTargets.reports)
      ]);

      const hasError = errors.some(Boolean);
      dashboardMessage.textContent = hasError
        ? '로그인은 정상입니다. 일부 운영 데이터 조회 권한을 추가 확인해야 합니다.'
        : '관리자 인증과 데이터 접근 권한이 정상적으로 확인되었습니다.';
    } catch (error) {
      console.error('MOOHAE dashboard error:', error);
      dashboardMessage.textContent = '관리자 화면을 불러오는 중 오류가 발생했습니다.';
    }
  }

  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    try {
      await window.moohaeSupabase.auth.signOut();
    } finally {
      window.location.replace('./login.html');
    }
  });

  boot();
})();
