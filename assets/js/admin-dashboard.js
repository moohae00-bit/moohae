(() => {
  'use strict';

  const identity = document.getElementById('adminIdentity');
  const logoutButton = document.getElementById('logoutButton');
  const dashboardMessage = document.getElementById('dashboardMessage');
  const customerList = document.getElementById('customerList');
  const emptyCustomers = document.getElementById('emptyCustomers');
  const customerSearch = document.getElementById('customerSearch');
  const statusFilter = document.getElementById('statusFilter');

  const countTargets = {
    customers: document.getElementById('customerCount'),
    diagnoses: document.getElementById('diagnosisCount'),
    care_visits: document.getElementById('visitCount'),
    reports: document.getElementById('reportCount')
  };

  const STATUS_LABELS = {
    new: '신규 문의',
    consulting: '상담 중',
    visit_scheduled: '방문 예정',
    care_completed: '케어 완료',
    follow_up: '재관리 대상',
    closed: '종료'
  };

  let customers = [];
  let latestDiagnosisByCustomer = new Map();

  const make = (tag, className, text = '') => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
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

  async function loadCustomers() {
    const { data: customerRows, error: customerError } = await window.moohaeSupabase
      .from('customers')
      .select('id, name, phone, status, privacy_consent, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (customerError) throw customerError;

    customers = Array.isArray(customerRows) ? customerRows : [];

    const { data: diagnosisRows, error: diagnosisError } = await window.moohaeSupabase
      .from('diagnoses')
      .select('id, customer_id, allergy_concerns, result_level, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (diagnosisError) throw diagnosisError;

    latestDiagnosisByCustomer = new Map();

    for (const diagnosis of diagnosisRows || []) {
      if (!latestDiagnosisByCustomer.has(diagnosis.customer_id)) {
        latestDiagnosisByCustomer.set(diagnosis.customer_id, diagnosis);
      }
    }
  }

  function renderCustomers() {
    const term = customerSearch.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    const filtered = customers.filter((customer) => {
      if (selectedStatus !== 'all' && customer.status !== selectedStatus) return false;

      if (!term) return true;

      const diagnosis = latestDiagnosisByCustomer.get(customer.id);
      const allergyText = Array.isArray(diagnosis?.allergy_concerns)
        ? diagnosis.allergy_concerns.join(' ')
        : '';

      const haystack = [
        customer.name || '',
        customer.phone || '',
        STATUS_LABELS[customer.status] || '',
        allergyText
      ].join(' ').toLowerCase();

      return haystack.includes(term);
    });

    customerList.replaceChildren();
    emptyCustomers.hidden = filtered.length !== 0;

    for (const customer of filtered) {
      const diagnosis = latestDiagnosisByCustomer.get(customer.id);
      const link = make('a', 'customer-row');
      link.href = `./customer-detail.html?id=${encodeURIComponent(customer.id)}`;

      const profile = make('div', 'customer-primary');
      profile.appendChild(make('strong', '', customer.name || '이름 없음'));

      const phone = make('span', '', customer.phone || '연락처 미등록');
      profile.appendChild(phone);

      const concern = make('div', 'customer-concern');

      if (Array.isArray(diagnosis?.allergy_concerns) && diagnosis.allergy_concerns.length) {
        for (const item of diagnosis.allergy_concerns.slice(0, 3)) {
          concern.appendChild(make('span', 'mini-chip', item));
        }
      } else {
        concern.appendChild(make('span', 'muted-copy', '진단 데이터 없음'));
      }

      const result = make('div', 'customer-result');
      result.appendChild(make('strong', '', diagnosis?.result_level || '—'));
      result.appendChild(make('span', '', formatDate(diagnosis?.created_at || customer.created_at)));

      const statusWrap = make('div', 'customer-status');
      const status = make(
        'span',
        `status-badge status-${customer.status || 'neutral'}`,
        STATUS_LABELS[customer.status] || '상태 미정'
      );
      statusWrap.appendChild(status);

      link.append(profile, concern, result, statusWrap);
      customerList.appendChild(link);
    }
  }

  async function boot() {
    try {
      const auth = await requireAuthorizedAdmin();
      if (!auth) return;

      identity.textContent = `${auth.profile.display_name} · ${auth.profile.role}`;

      const countErrors = await Promise.all([
        loadCount('customers', countTargets.customers),
        loadCount('diagnoses', countTargets.diagnoses),
        loadCount('care_visits', countTargets.care_visits),
        loadCount('reports', countTargets.reports)
      ]);

      await loadCustomers();
      renderCustomers();

      dashboardMessage.textContent = countErrors.some(Boolean)
        ? '로그인은 정상입니다. 일부 집계 데이터를 추가 확인해야 합니다.'
        : '관리자 인증과 고객 데이터 접근 권한이 정상적으로 확인되었습니다.';
    } catch (error) {
      console.error('MOOHAE dashboard error:', error);
      dashboardMessage.textContent = '고객 데이터를 불러오는 중 오류가 발생했습니다.';
      customerList.replaceChildren();
      emptyCustomers.hidden = false;
    }
  }

  customerSearch.addEventListener('input', renderCustomers);
  statusFilter.addEventListener('change', renderCustomers);

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
