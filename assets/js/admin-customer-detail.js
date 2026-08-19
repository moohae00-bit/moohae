(() => {
  'use strict';

  const identity = document.getElementById('adminIdentity');
  const logoutButton = document.getElementById('logoutButton');
  const detailMessage = document.getElementById('detailMessage');

  const managementForm = document.getElementById('customerManagementForm');
  const statusSelect = document.getElementById('customerStatusSelect');
  const notesInput = document.getElementById('customerNotes');
  const saveCustomerButton = document.getElementById('saveCustomerButton');
  const managementMessage = document.getElementById('customerManagementMessage');

  const visitForm = document.getElementById('visitScheduleForm');
  const visitScheduledAt = document.getElementById('visitScheduledAt');
  const visitCareArea = document.getElementById('visitCareArea');
  const scheduleVisitButton = document.getElementById('scheduleVisitButton');
  const visitMessage = document.getElementById('visitScheduleMessage');

  const STATUS_LABELS = {
    new: '신규 문의',
    consulting: '상담 중',
    visit_scheduled: '방문 예정',
    care_completed: '케어 완료',
    follow_up: '재관리 대상',
    closed: '종료'
  };

  const VISIT_LABELS = {
    scheduled: '방문 예정',
    in_progress: '진행 중',
    completed: '완료',
    cancelled: '취소'
  };

  const REPORT_LABELS = {
    draft: '작성 중',
    published: '발행',
    archived: '보관'
  };

  const ALLOWED_STATUSES = new Set(Object.keys(STATUS_LABELS));
  const ALLOWED_CARE_ITEMS = new Set([
    '매트리스 케어',
    '패브릭 케어',
    '실내 공간 케어',
    '바닥 케어'
  ]);

  const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  let authContext = null;
  let customerId = null;
  let latestDiagnosisId = null;

  const make = (tag, className, text = '') => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const setMessage = (node, text, ok = false) => {
    node.textContent = text;
    node.classList.toggle('success', ok);
  };

  const setBusy = (button, busy, busyLabel, normalLabel) => {
    button.disabled = busy;
    button.textContent = busy ? busyLabel : normalLabel;
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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

  function renderChips(parent, values) {
    parent.replaceChildren();

    if (!Array.isArray(values) || values.length === 0) {
      parent.appendChild(make('span', 'muted-copy', '선택 내용 없음'));
      return;
    }

    for (const value of values) {
      parent.appendChild(make('span', 'mini-chip', String(value)));
    }
  }

  function diagnosisCard(diagnosis, isLatest = false) {
    const article = make('article', 'history-item');
    const header = make('div', 'history-item-head');
    const left = make('div');

    left.appendChild(make('strong', '', diagnosis.result_level || '진단'));
    left.appendChild(make('span', '', formatDateTime(diagnosis.created_at)));
    header.appendChild(left);

    if (isLatest) header.appendChild(make('span', 'count-pill', 'LATEST'));
    article.appendChild(header);

    const groups = [
      ['생활 공간', diagnosis.spaces],
      ['신경 쓰이는 부분', diagnosis.concerns],
      ['관리 어려움', diagnosis.difficulties],
      ['알레르기 관련 고민', diagnosis.allergy_concerns],
      ['희망 방식', diagnosis.preferred_contact]
    ];

    for (const [label, values] of groups) {
      const block = make('div', 'history-group');
      block.appendChild(make('span', 'history-label', label));
      const chips = make('div', 'chip-line');
      renderChips(chips, values);
      block.appendChild(chips);
      article.appendChild(block);
    }

    if (diagnosis.result_message) {
      article.appendChild(make('p', 'history-copy', diagnosis.result_message));
    }

    return article;
  }

  function visitCard(visit) {
    const article = make('article', 'history-item');
    const head = make('div', 'history-item-head');
    const left = make('div');

    left.appendChild(make('strong', '', visit.care_area || '방문 케어'));
    left.appendChild(make('span', '', formatDateTime(visit.scheduled_at || visit.created_at)));

    head.appendChild(left);
    head.appendChild(
      make(
        'span',
        `status-badge status-${visit.visit_status || 'neutral'}`,
        VISIT_LABELS[visit.visit_status] || '상태 미정'
      )
    );
    article.appendChild(head);

    if (Array.isArray(visit.care_items) && visit.care_items.length) {
      const chips = make('div', 'chip-line');
      renderChips(chips, visit.care_items);
      article.appendChild(chips);
    }

    if (visit.before_diagnosis) {
      article.appendChild(make('p', 'history-copy', `케어 전 · ${visit.before_diagnosis}`));
    }

    if (visit.after_diagnosis) {
      article.appendChild(make('p', 'history-copy', `케어 후 · ${visit.after_diagnosis}`));
    }

    return article;
  }

  function reportCard(report) {
    const article = make('article', 'history-item');
    const head = make('div', 'history-item-head');
    const left = make('div');

    left.appendChild(make('strong', '', 'Care Report'));
    left.appendChild(make('span', '', formatDateTime(report.published_at || report.created_at)));

    head.appendChild(left);
    head.appendChild(
      make(
        'span',
        `status-badge status-${report.report_status || 'neutral'}`,
        REPORT_LABELS[report.report_status] || '상태 미정'
      )
    );
    article.appendChild(head);

    if (report.manager_comment) {
      article.appendChild(make('p', 'history-copy', report.manager_comment));
    }

    if (report.next_care_recommendation) {
      article.appendChild(
        make('p', 'history-copy', `다음 권장 케어 · ${report.next_care_recommendation}`)
      );
    }

    return article;
  }

  async function loadCustomerData() {
    const [
      customerResult,
      diagnosisResult,
      visitResult,
      reportResult
    ] = await Promise.all([
      window.moohaeSupabase
        .from('customers')
        .select('id, name, phone, status, privacy_consent, privacy_consented_at, notes, created_at')
        .eq('id', customerId)
        .maybeSingle(),

      window.moohaeSupabase
        .from('diagnoses')
        .select('id, spaces, concerns, difficulties, allergy_concerns, preferred_contact, result_level, result_message, created_at')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false }),

      window.moohaeSupabase
        .from('care_visits')
        .select('id, scheduled_at, completed_at, care_area, before_diagnosis, after_diagnosis, care_items, visit_status, created_at')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false }),

      window.moohaeSupabase
        .from('reports')
        .select('id, manager_comment, next_care_recommendation, report_status, published_at, created_at')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
    ]);

    if (customerResult.error || !customerResult.data) {
      throw customerResult.error || new Error('고객 정보를 찾을 수 없습니다.');
    }
    if (diagnosisResult.error) throw diagnosisResult.error;
    if (visitResult.error) throw visitResult.error;
    if (reportResult.error) throw reportResult.error;

    const customer = customerResult.data;
    const diagnoses = diagnosisResult.data || [];
    const visits = visitResult.data || [];
    const reports = reportResult.data || [];

    latestDiagnosisId = diagnoses[0]?.id || null;

    document.getElementById('customerName').textContent = customer.name || '이름 없음';
    document.getElementById('customerMeta').textContent =
      `${customer.phone || '연락처 미등록'} · 등록 ${formatDate(customer.created_at)}`;

    const statusText = STATUS_LABELS[customer.status] || '상태 미정';
    const statusBadge = document.getElementById('customerStatus');
    statusBadge.textContent = statusText;
    statusBadge.className = `status-badge status-${customer.status || 'neutral'}`;

    document.getElementById('detailName').textContent = customer.name || '—';
    document.getElementById('detailPhone').textContent = customer.phone || '—';
    document.getElementById('detailStatus').textContent = statusText;
    document.getElementById('detailConsent').textContent =
      customer.privacy_consent
        ? `동의 · ${formatDate(customer.privacy_consented_at)}`
        : '미동의';
    document.getElementById('detailCreatedAt').textContent =
      formatDateTime(customer.created_at);

    statusSelect.value = ALLOWED_STATUSES.has(customer.status) ? customer.status : 'new';
    notesInput.value = customer.notes || '';

    const latestDiagnosis = document.getElementById('latestDiagnosis');
    latestDiagnosis.replaceChildren();

    if (diagnoses.length) {
      latestDiagnosis.appendChild(diagnosisCard(diagnoses[0], true));
    } else {
      latestDiagnosis.appendChild(
        make('p', 'muted-copy', '아직 온라인 진단 기록이 없습니다.')
      );
    }

    const diagnosisHistory = document.getElementById('diagnosisHistory');
    diagnosisHistory.replaceChildren();
    document.getElementById('diagnosisHistoryCount').textContent =
      String(diagnoses.length);

    if (diagnoses.length) {
      diagnoses.forEach((item, index) =>
        diagnosisHistory.appendChild(diagnosisCard(item, index === 0))
      );
    } else {
      diagnosisHistory.appendChild(make('p', 'muted-copy', '진단 기록이 없습니다.'));
    }

    const visitHistory = document.getElementById('visitHistory');
    visitHistory.replaceChildren();
    document.getElementById('visitHistoryCount').textContent =
      String(visits.length);

    if (visits.length) {
      visits.forEach((item) => visitHistory.appendChild(visitCard(item)));
    } else {
      visitHistory.appendChild(
        make('p', 'muted-copy', '방문 케어 기록이 없습니다.')
      );
    }

    const reportHistory = document.getElementById('reportHistory');
    reportHistory.replaceChildren();
    document.getElementById('reportHistoryCount').textContent =
      String(reports.length);

    if (reports.length) {
      reports.forEach((item) => reportHistory.appendChild(reportCard(item)));
    } else {
      reportHistory.appendChild(
        make('p', 'muted-copy', 'Care Report가 아직 없습니다.')
      );
    }

    detailMessage.textContent = '고객 데이터가 정상적으로 연결되었습니다.';
  }

  managementForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage(managementMessage, '');

    const status = statusSelect.value;
    const notes = notesInput.value.trim();

    if (!ALLOWED_STATUSES.has(status)) {
      setMessage(managementMessage, '고객 상태를 확인해주세요.');
      return;
    }

    if (notes.length > 5000) {
      setMessage(managementMessage, '운영 메모는 5,000자 이내로 작성해주세요.');
      return;
    }

    setBusy(saveCustomerButton, true, '저장 중...', '고객 정보 저장');

    try {
      const { error } = await window.moohaeSupabase.rpc('admin_update_customer', {
        p_customer_id: customerId,
        p_status: status,
        p_notes: notes || null
      });

      if (error) throw error;

      setMessage(managementMessage, '고객 정보가 저장되었습니다.', true);
      await loadCustomerData();
    } catch (error) {
      console.error('MOOHAE customer update error:', error);
      setMessage(managementMessage, '고객 정보를 저장하지 못했습니다.');
    } finally {
      setBusy(saveCustomerButton, false, '저장 중...', '고객 정보 저장');
    }
  });

  visitForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage(visitMessage, '');

    const localDateTime = visitScheduledAt.value;
    const careArea = visitCareArea.value.trim();
    const careItems = [...visitForm.querySelectorAll('input[name="careItem"]:checked')]
      .map((input) => input.value)
      .filter((value) => ALLOWED_CARE_ITEMS.has(value));

    if (!localDateTime) {
      setMessage(visitMessage, '방문 일시를 선택해주세요.');
      return;
    }

    const date = new Date(localDateTime);

    if (Number.isNaN(date.getTime())) {
      setMessage(visitMessage, '방문 일시를 다시 확인해주세요.');
      return;
    }

    if (careArea.length > 300) {
      setMessage(visitMessage, '케어 공간은 300자 이내로 입력해주세요.');
      return;
    }

    setBusy(scheduleVisitButton, true, '등록 중...', '방문 일정 등록');

    try {
      const { error } = await window.moohaeSupabase.rpc('admin_schedule_visit', {
        p_customer_id: customerId,
        p_diagnosis_id: latestDiagnosisId,
        p_scheduled_at: date.toISOString(),
        p_care_area: careArea || null,
        p_care_items: careItems
      });

      if (error) throw error;

      setMessage(visitMessage, '방문 일정이 등록되었습니다.', true);
      visitForm.reset();
      await loadCustomerData();
    } catch (error) {
      console.error('MOOHAE visit schedule error:', error);
      setMessage(visitMessage, '방문 일정을 등록하지 못했습니다.');
    } finally {
      setBusy(scheduleVisitButton, false, '등록 중...', '방문 일정 등록');
    }
  });

  async function boot() {
    try {
      authContext = await requireAuthorizedAdmin();
      if (!authContext) return;

      identity.textContent =
        `${authContext.profile.display_name} · ${authContext.profile.role}`;

      customerId = new URLSearchParams(window.location.search).get('id');

      if (!customerId || !UUID_PATTERN.test(customerId)) {
        detailMessage.textContent = '올바르지 않은 고객 주소입니다.';
        managementForm.hidden = true;
        visitForm.hidden = true;
        return;
      }

      await loadCustomerData();
    } catch (error) {
      console.error('MOOHAE customer detail error:', error);
      detailMessage.textContent = '고객 정보를 불러오는 중 오류가 발생했습니다.';
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
