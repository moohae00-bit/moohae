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

  const careCompleteForm = document.getElementById('careCompleteForm');
  const careVisitSelect = document.getElementById('careVisitSelect');
  const beforeDiagnosisInput = document.getElementById('beforeDiagnosis');
  const afterDiagnosisInput = document.getElementById('afterDiagnosis');
  const visitAdminMemoInput = document.getElementById('visitAdminMemo');
  const completeCareButton = document.getElementById('completeCareButton');
  const careCompleteMessage = document.getElementById('careCompleteMessage');

  const reportEditorForm = document.getElementById('reportEditorForm');
  const reportEditorId = document.getElementById('reportEditorId');
  const reportManagerComment = document.getElementById('reportManagerComment');
  const reportNextCare = document.getElementById('reportNextCare');
  const reportEditStatus = document.getElementById('reportEditStatus');
  const saveReportButton = document.getElementById('saveReportButton');
  const publishReportButton = document.getElementById('publishReportButton');
  const reportEditorMessage = document.getElementById('reportEditorMessage');

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

  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  let authContext = null;
  let customerId = null;
  let latestDiagnosisId = null;

  const make = (
    tag,
    className,
    text = ''
  ) => {
    const node =
      document.createElement(tag);

    if (className) {
      node.className =
        className;
    }

    if (text) {
      node.textContent =
        text;
    }

    return node;
  };

  const setMessage = (
    node,
    text,
    ok = false
  ) => {
    if (!node) {
      return;
    }

    node.textContent =
      text;

    node.classList.toggle(
      'success',
      ok
    );
  };

  const setBusy = (
    button,
    busy,
    busyLabel,
    normalLabel
  ) => {
    if (!button) {
      return;
    }

    button.disabled =
      busy;

    button.textContent =
      busy
        ? busyLabel
        : normalLabel;
  };

  const formatDateTime = (
    value
  ) => {
    if (!value) {
      return '—';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '—';
    }

    return new Intl.DateTimeFormat(
      'ko-KR',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      date
    );
  };

  const formatDate = (
    value
  ) => {
    if (!value) {
      return '—';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '—';
    }

    return new Intl.DateTimeFormat(
      'ko-KR',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    ).format(
      date
    );
  };


  // ============================================================
  // CONFIRMED BOOKING → VISIT FORM
  // ============================================================

  const bookingToLocalInputValue = (
    booking
  ) => {
    if (
      !booking?.booking_date ||
      !booking?.booking_time
    ) {
      return '';
    }

    const time =
      String(
        booking.booking_time
      ).slice(
        0,
        5
      );

    if (
      !/^\d{2}:\d{2}$/.test(
        time
      )
    ) {
      return '';
    }

    return `${booking.booking_date}T${time}`;
  };


  const visitMatchesConfirmedBooking = (
    visit,
    booking
  ) => {
    if (
      !visit?.scheduled_at ||
      !booking?.booking_date ||
      !booking?.booking_time
    ) {
      return false;
    }

    const date =
      new Date(
        visit.scheduled_at
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return false;
    }

    const parts =
      new Intl.DateTimeFormat(
        'en-CA',
        {
          timeZone:
            'Asia/Seoul',

          year:
            'numeric',

          month:
            '2-digit',

          day:
            '2-digit',

          hour:
            '2-digit',

          minute:
            '2-digit',

          hourCycle:
            'h23'
        }
      ).formatToParts(
        date
      );

    const values =
      Object.fromEntries(
        parts.map(
          (part) => [
            part.type,
            part.value
          ]
        )
      );

    const visitDate =
      `${values.year}-${values.month}-${values.day}`;

    const visitTime =
      `${values.hour}:${values.minute}`;

    const bookingTime =
      String(
        booking.booking_time
      ).slice(
        0,
        5
      );

    return (
      visitDate ===
        booking.booking_date &&
      visitTime ===
        bookingTime
    );
  };


  const applyConfirmedBookingToVisitForm = (
    booking,
    visits
  ) => {
    if (
      !visitScheduledAt ||
      !visitMessage
    ) {
      return;
    }

    if (!booking) {
      return;
    }

    const inputValue =
      bookingToLocalInputValue(
        booking
      );

    if (!inputValue) {
      return;
    }

    const alreadyRegistered =
      (visits || []).some(
        (visit) =>
          visitMatchesConfirmedBooking(
            visit,
            booking
          )
      );

    if (
      alreadyRegistered
    ) {
      if (
        visitScheduledAt.value ===
        inputValue
      ) {
        visitScheduledAt.value =
          '';
      }

      setMessage(
        visitMessage,
        `예약관리에서 확정된 ${formatDateTime(
          `${booking.booking_date}T${String(
            booking.booking_time
          ).slice(
            0,
            5
          )}:00+09:00`
        )} 일정은 이미 방문 일정으로 등록되어 있습니다.`,
        true
      );

      return;
    }

    if (
      !visitScheduledAt.value
    ) {
      visitScheduledAt.value =
        inputValue;

      setMessage(
        visitMessage,
        `예약관리에서 확정된 방문 일정이 자동으로 반영되었습니다. · ${formatDateTime(
          `${booking.booking_date}T${String(
            booking.booking_time
          ).slice(
            0,
            5
          )}:00+09:00`
        )}`,
        true
      );
    }
  };


  // ============================================================
  // PUBLIC REPORT
  // ============================================================

  function buildPublicReportUrl(
    publicToken
  ) {
    if (
      !UUID_PATTERN.test(
        publicToken || ''
      )
    ) {
      return null;
    }

    const url =
      new URL(
        '/report.html',
        window.location.origin
      );

    url.searchParams.set(
      'token',
      publicToken
    );

    return url.toString();
  }


  async function copyPublicReportLink(
    publicToken,
    button
  ) {
    const url =
      buildPublicReportUrl(
        publicToken
      );

    if (!url) {
      setMessage(
        detailMessage,
        '고객용 리포트 링크를 만들 수 없습니다.'
      );

      return;
    }

    const originalLabel =
      button.textContent;

    try {
      await navigator.clipboard.writeText(
        url
      );

      button.textContent =
        '복사 완료';

      setMessage(
        detailMessage,
        '고객용 Care Report 링크가 복사되었습니다.',
        true
      );

    } catch (
      error
    ) {
      console.error(
        'MOOHAE report link copy error:',
        error
      );

      setMessage(
        detailMessage,
        '링크를 복사하지 못했습니다. 리포트 보기 버튼으로 열어주세요.'
      );

    } finally {
      window.setTimeout(
        () => {
          button.textContent =
            originalLabel;
        },
        1800
      );
    }
  }


  function openPublicReport(
    publicToken
  ) {
    const url =
      buildPublicReportUrl(
        publicToken
      );

    if (!url) {
      setMessage(
        detailMessage,
        '고객용 리포트 링크를 만들 수 없습니다.'
      );

      return;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  }


  // ============================================================
  // ADMIN AUTH
  // ============================================================

  async function requireAuthorizedAdmin() {
    if (
      !window.moohaeSupabaseConfigReady
    ) {
      window.location.replace(
        './login.html'
      );

      return null;
    }

    const {
      data,
      error
    } =
      await window
        .moohaeSupabase
        .auth
        .getUser();

    if (
      error ||
      !data?.user
    ) {
      window.location.replace(
        './login.html'
      );

      return null;
    }

    const {
      data:
        profile,

      error:
        profileError
    } =
      await window
        .moohaeSupabase
        .from(
          'admin_profiles'
        )
        .select(
          'display_name, role, is_active'
        )
        .eq(
          'user_id',
          data.user.id
        )
        .maybeSingle();

    const allowed =
      !profileError &&
      profile &&
      profile.is_active ===
        true &&
      (
        profile.role ===
          'admin' ||
        profile.role ===
          'manager'
      );

    if (
      !allowed
    ) {
      await window
        .moohaeSupabase
        .auth
        .signOut();

      window.location.replace(
        './login.html'
      );

      return null;
    }

    return {
      user:
        data.user,

      profile
    };
  }


  // ============================================================
  // UI HELPERS
  // ============================================================

  function renderChips(
    parent,
    values
  ) {
    parent.replaceChildren();

    if (
      !Array.isArray(
        values
      ) ||
      values.length ===
        0
    ) {
      parent.appendChild(
        make(
          'span',
          'muted-copy',
          '선택 내용 없음'
        )
      );

      return;
    }

    for (
      const value
      of values
    ) {
      parent.appendChild(
        make(
          'span',
          'mini-chip',
          String(
            value
          )
        )
      );
    }
  }


  function diagnosisCard(
    diagnosis,
    isLatest = false
  ) {
    const article =
      make(
        'article',
        'history-item'
      );

    const header =
      make(
        'div',
        'history-item-head'
      );

    const left =
      make(
        'div'
      );

    left.appendChild(
      make(
        'strong',
        '',
        diagnosis.result_level ||
          '진단'
      )
    );

    left.appendChild(
      make(
        'span',
        '',
        formatDateTime(
          diagnosis.created_at
        )
      )
    );

    header.appendChild(
      left
    );

    if (
      isLatest
    ) {
      header.appendChild(
        make(
          'span',
          'count-pill',
          'LATEST'
        )
      );
    }

    article.appendChild(
      header
    );

    const groups = [
      [
        '생활 공간',
        diagnosis.spaces
      ],
      [
        '신경 쓰이는 부분',
        diagnosis.concerns
      ],
      [
        '관리 어려움',
        diagnosis.difficulties
      ],
      [
        '알레르기 관련 고민',
        diagnosis.allergy_concerns
      ],
      [
        '희망 방식',
        diagnosis.preferred_contact
      ]
    ];

    for (
      const [
        label,
        values
      ]
      of groups
    ) {
      const block =
        make(
          'div',
          'history-group'
        );

      block.appendChild(
        make(
          'span',
          'history-label',
          label
        )
      );

      const chips =
        make(
          'div',
          'chip-line'
        );

      renderChips(
        chips,
        values
      );

      block.appendChild(
        chips
      );

      article.appendChild(
        block
      );
    }

    if (
      diagnosis.result_message
    ) {
      article.appendChild(
        make(
          'p',
          'history-copy',
          diagnosis.result_message
        )
      );
    }

    return article;
  }


  function visitCard(
    visit
  ) {
    const article =
      make(
        'article',
        'history-item'
      );

    const head =
      make(
        'div',
        'history-item-head'
      );

    const left =
      make(
        'div'
      );

    left.appendChild(
      make(
        'strong',
        '',
        visit.care_area ||
          '방문 케어'
      )
    );

    left.appendChild(
      make(
        'span',
        '',
        formatDateTime(
          visit.scheduled_at ||
          visit.created_at
        )
      )
    );

    head.appendChild(
      left
    );

    head.appendChild(
      make(
        'span',
        `status-badge status-${visit.visit_status || 'neutral'}`,
        VISIT_LABELS[
          visit.visit_status
        ] ||
          '상태 미정'
      )
    );

    article.appendChild(
      head
    );

    if (
      Array.isArray(
        visit.care_items
      ) &&
      visit.care_items.length
    ) {
      const chips =
        make(
          'div',
          'chip-line'
        );

      renderChips(
        chips,
        visit.care_items
      );

      article.appendChild(
        chips
      );
    }

    if (
      visit.before_diagnosis
    ) {
      article.appendChild(
        make(
          'p',
          'history-copy',
          `케어 전 · ${visit.before_diagnosis}`
        )
      );
    }

    if (
      visit.after_diagnosis
    ) {
      article.appendChild(
        make(
          'p',
          'history-copy',
          `케어 후 · ${visit.after_diagnosis}`
        )
      );
    }

    return article;
  }


  function reportCard(
    report
  ) {
    const article =
      make(
        'article',
        'history-item'
      );

    const head =
      make(
        'div',
        'history-item-head'
      );

    const left =
      make(
        'div'
      );

    left.appendChild(
      make(
        'strong',
        '',
        'Care Report'
      )
    );

    left.appendChild(
      make(
        'span',
        '',
        formatDateTime(
          report.published_at ||
          report.created_at
        )
      )
    );

    head.appendChild(
      left
    );

    head.appendChild(
      make(
        'span',
        `status-badge status-${report.report_status || 'neutral'}`,
        REPORT_LABELS[
          report.report_status
        ] ||
          '상태 미정'
      )
    );

    article.appendChild(
      head
    );

    if (
      report.manager_comment
    ) {
      article.appendChild(
        make(
          'p',
          'history-copy',
          report.manager_comment
        )
      );
    }

    if (
      report.next_care_recommendation
    ) {
      article.appendChild(
        make(
          'p',
          'history-copy',
          `다음 권장 케어 · ${report.next_care_recommendation}`
        )
      );
    }

    if (
      report.report_status ===
        'published' &&
      UUID_PATTERN.test(
        report.public_token ||
        ''
      )
    ) {
      const actions =
        make(
          'div',
          'report-action-row'
        );

      const openButton =
        make(
          'button',
          'secondary-button report-action-button',
          '리포트 보기'
        );

      openButton.type =
        'button';

      openButton.addEventListener(
        'click',
        () => {
          openPublicReport(
            report.public_token
          );
        }
      );

      const copyButton =
        make(
          'button',
          'primary-button report-action-button',
          '링크 복사'
        );

      copyButton.type =
        'button';

      copyButton.addEventListener(
        'click',
        () => {
          copyPublicReportLink(
            report.public_token,
            copyButton
          );
        }
      );

      actions.append(
        openButton,
        copyButton
      );

      article.appendChild(
        actions
      );
    }

    return article;
  }


  // ============================================================
  // CARE COMPLETION SELECT
  // ============================================================

  function populateCareCompletion(
    visits
  ) {
    careVisitSelect.replaceChildren();

    const placeholder =
      document.createElement(
        'option'
      );

    placeholder.value =
      '';

    placeholder.textContent =
      '방문 일정을 선택해주세요';

    careVisitSelect.appendChild(
      placeholder
    );

    const candidates =
      visits.filter(
        (visit) =>
          visit.visit_status ===
            'scheduled' ||
          visit.visit_status ===
            'in_progress'
      );

    for (
      const visit
      of candidates
    ) {
      const option =
        document.createElement(
          'option'
        );

      option.value =
        visit.id;

      option.textContent =
        `${formatDateTime(
          visit.scheduled_at
        )} · ${visit.care_area || '케어 공간 미입력'}`;

      careVisitSelect.appendChild(
        option
      );
    }

    if (
      candidates.length ===
        0
    ) {
      careCompleteForm.hidden =
        true;

      setMessage(
        careCompleteMessage,
        '완료 처리할 방문 일정이 없습니다.',
        true
      );

    } else {
      careCompleteForm.hidden =
        false;

      setMessage(
        careCompleteMessage,
        ''
      );
    }
  }


  // ============================================================
  // REPORT EDITOR
  // ============================================================

  function populateReportEditor(
    reports
  ) {
    const editable =
      reports.find(
        (report) =>
          report.report_status ===
          'draft'
      ) ||
      reports.find(
        (report) =>
          report.report_status ===
          'published'
      ) ||
      null;

    if (
      !editable
    ) {
      reportEditorId.value =
        '';

      reportManagerComment.value =
        '';

      reportNextCare.value =
        '';

      reportEditStatus.textContent =
        '리포트 없음';

      reportEditStatus.className =
        'status-badge neutral';

      reportEditorForm.setAttribute(
        'aria-disabled',
        'true'
      );

      saveReportButton.disabled =
        true;

      publishReportButton.disabled =
        true;

      setMessage(
        reportEditorMessage,
        '케어 완료 처리 후 Care Report 초안이 자동 생성됩니다.'
      );

      return;
    }

    reportEditorId.value =
      editable.id;

    reportManagerComment.value =
      editable.manager_comment ||
      '';

    reportNextCare.value =
      editable.next_care_recommendation ||
      '';

    const label =
      REPORT_LABELS[
        editable.report_status
      ] ||
      '상태 미정';

    reportEditStatus.textContent =
      label;

    reportEditStatus.className =
      `status-badge status-${editable.report_status || 'neutral'}`;

    reportEditorForm.setAttribute(
      'aria-disabled',
      'false'
    );

    saveReportButton.disabled =
      false;

    publishReportButton.disabled =
      false;

    publishReportButton.textContent =
      editable.report_status ===
        'published'
        ? '발행 내용 저장'
        : '리포트 발행';

    setMessage(
      reportEditorMessage,
      ''
    );
  }


  // ============================================================
  // LOAD CUSTOMER DATA
  // ============================================================

  async function loadCustomerData() {
    const [
      customerResult,
      diagnosisResult,
      visitResult,
      reportResult,
      confirmedBookingResult
    ] =
      await Promise.all([
        window
          .moohaeSupabase
          .from(
            'customers'
          )
          .select(
            'id, name, phone, status, privacy_consent, privacy_consented_at, notes, created_at'
          )
          .eq(
            'id',
            customerId
          )
          .maybeSingle(),

        window
          .moohaeSupabase
          .from(
            'diagnoses'
          )
          .select(
            'id, spaces, concerns, difficulties, allergy_concerns, preferred_contact, result_level, result_message, created_at'
          )
          .eq(
            'customer_id',
            customerId
          )
          .order(
            'created_at',
            {
              ascending:
                false
            }
          ),

        window
          .moohaeSupabase
          .from(
            'care_visits'
          )
          .select(
            'id, scheduled_at, completed_at, care_area, before_diagnosis, after_diagnosis, care_items, visit_status, created_at'
          )
          .eq(
            'customer_id',
            customerId
          )
          .order(
            'created_at',
            {
              ascending:
                false
            }
          ),

        window
          .moohaeSupabase
          .from(
            'reports'
          )
          .select(
            'id, public_token, manager_comment, next_care_recommendation, report_status, published_at, created_at'
          )
          .eq(
            'customer_id',
            customerId
          )
          .order(
            'created_at',
            {
              ascending:
                false
            }
          ),

        window
          .moohaeSupabase
          .rpc(
            'admin_get_customer_confirmed_booking',
            {
              p_customer_id:
                customerId
            }
          )
      ]);

    if (
      customerResult.error ||
      !customerResult.data
    ) {
      throw (
        customerResult.error ||
        new Error(
          '고객 정보를 찾을 수 없습니다.'
        )
      );
    }

    if (
      diagnosisResult.error
    ) {
      throw diagnosisResult.error;
    }

    if (
      visitResult.error
    ) {
      throw visitResult.error;
    }

    if (
      reportResult.error
    ) {
      throw reportResult.error;
    }

    if (
      confirmedBookingResult.error
    ) {
      throw confirmedBookingResult.error;
    }

    const customer =
      customerResult.data;

    const diagnoses =
      diagnosisResult.data ||
      [];

    const visits =
      visitResult.data ||
      [];

    const reports =
      reportResult.data ||
      [];

    const confirmedBooking =
      Array.isArray(
        confirmedBookingResult.data
      )
        ? confirmedBookingResult.data[0] ||
          null
        : confirmedBookingResult.data ||
          null;

    latestDiagnosisId =
      diagnoses[0]?.id ||
      null;

    populateCareCompletion(
      visits
    );

    populateReportEditor(
      reports
    );

    applyConfirmedBookingToVisitForm(
      confirmedBooking,
      visits
    );

    document.getElementById(
      'customerName'
    ).textContent =
      customer.name ||
      '이름 없음';

    document.getElementById(
      'customerMeta'
    ).textContent =
      `${customer.phone || '연락처 미등록'} · 등록 ${formatDate(
        customer.created_at
      )}`;

    const statusText =
      STATUS_LABELS[
        customer.status
      ] ||
      '상태 미정';

    const statusBadge =
      document.getElementById(
        'customerStatus'
      );

    statusBadge.textContent =
      statusText;

    statusBadge.className =
      `status-badge status-${customer.status || 'neutral'}`;

    document.getElementById(
      'detailName'
    ).textContent =
      customer.name ||
      '—';

    document.getElementById(
      'detailPhone'
    ).textContent =
      customer.phone ||
      '—';

    document.getElementById(
      'detailStatus'
    ).textContent =
      statusText;

    document.getElementById(
      'detailConsent'
    ).textContent =
      customer.privacy_consent
        ? `동의 · ${formatDate(
            customer.privacy_consented_at
          )}`
        : '미동의';

    document.getElementById(
      'detailCreatedAt'
    ).textContent =
      formatDateTime(
        customer.created_at
      );

    statusSelect.value =
      ALLOWED_STATUSES.has(
        customer.status
      )
        ? customer.status
        : 'new';

    notesInput.value =
      customer.notes ||
      '';

    const latestDiagnosis =
      document.getElementById(
        'latestDiagnosis'
      );

    latestDiagnosis.replaceChildren();

    if (
      diagnoses.length
    ) {
      latestDiagnosis.appendChild(
        diagnosisCard(
          diagnoses[0],
          true
        )
      );

    } else {
      latestDiagnosis.appendChild(
        make(
          'p',
          'muted-copy',
          '아직 온라인 진단 기록이 없습니다.'
        )
      );
    }

    const diagnosisHistory =
      document.getElementById(
        'diagnosisHistory'
      );

    diagnosisHistory.replaceChildren();

    document.getElementById(
      'diagnosisHistoryCount'
    ).textContent =
      String(
        diagnoses.length
      );

    if (
      diagnoses.length
    ) {
      diagnoses.forEach(
        (
          item,
          index
        ) =>
          diagnosisHistory.appendChild(
            diagnosisCard(
              item,
              index ===
                0
            )
          )
      );

    } else {
      diagnosisHistory.appendChild(
        make(
          'p',
          'muted-copy',
          '진단 기록이 없습니다.'
        )
      );
    }

    const visitHistory =
      document.getElementById(
        'visitHistory'
      );

    visitHistory.replaceChildren();

    document.getElementById(
      'visitHistoryCount'
    ).textContent =
      String(
        visits.length
      );

    if (
      visits.length
    ) {
      visits.forEach(
        (item) =>
          visitHistory.appendChild(
            visitCard(
              item
            )
          )
      );

    } else {
      visitHistory.appendChild(
        make(
          'p',
          'muted-copy',
          '방문 케어 기록이 없습니다.'
        )
      );
    }

    const reportHistory =
      document.getElementById(
        'reportHistory'
      );

    reportHistory.replaceChildren();

    document.getElementById(
      'reportHistoryCount'
    ).textContent =
      String(
        reports.length
      );

    if (
      reports.length
    ) {
      reports.forEach(
        (item) =>
          reportHistory.appendChild(
            reportCard(
              item
            )
          )
      );

    } else {
      reportHistory.appendChild(
        make(
          'p',
          'muted-copy',
          'Care Report가 아직 없습니다.'
        )
      );
    }

    detailMessage.textContent =
      '고객 데이터가 정상적으로 연결되었습니다.';
  }


  // ============================================================
  // CUSTOMER MANAGEMENT
  // ============================================================

  managementForm.addEventListener(
    'submit',
    async (
      event
    ) => {
      event.preventDefault();

      setMessage(
        managementMessage,
        ''
      );

      const status =
        statusSelect.value;

      const notes =
        notesInput.value.trim();

      if (
        !ALLOWED_STATUSES.has(
          status
        )
      ) {
        setMessage(
          managementMessage,
          '고객 상태를 확인해주세요.'
        );

        return;
      }

      if (
        notes.length >
        5000
      ) {
        setMessage(
          managementMessage,
          '운영 메모는 5,000자 이내로 작성해주세요.'
        );

        return;
      }

      setBusy(
        saveCustomerButton,
        true,
        '저장 중...',
        '고객 정보 저장'
      );

      try {
        const {
          error
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_update_customer',
              {
                p_customer_id:
                  customerId,

                p_status:
                  status,

                p_notes:
                  notes ||
                  null
              }
            );

        if (
          error
        ) {
          throw error;
        }

        setMessage(
          managementMessage,
          '고객 정보가 저장되었습니다.',
          true
        );

        await loadCustomerData();

      } catch (
        error
      ) {
        console.error(
          'MOOHAE customer update error:',
          error
        );

        setMessage(
          managementMessage,
          '고객 정보를 저장하지 못했습니다.'
        );

      } finally {
        setBusy(
          saveCustomerButton,
          false,
          '저장 중...',
          '고객 정보 저장'
        );
      }
    }
  );


  // ============================================================
  // VISIT SCHEDULE
  // ============================================================

  visitForm.addEventListener(
    'submit',
    async (
      event
    ) => {
      event.preventDefault();

      setMessage(
        visitMessage,
        ''
      );

      const localDateTime =
        visitScheduledAt.value;

      const careArea =
        visitCareArea.value.trim();

      const careItems = [
        ...visitForm.querySelectorAll(
          'input[name="careItem"]:checked'
        )
      ]
        .map(
          (input) =>
            input.value
        )
        .filter(
          (value) =>
            ALLOWED_CARE_ITEMS.has(
              value
            )
        );

      if (
        !localDateTime
      ) {
        setMessage(
          visitMessage,
          '방문 일시를 선택해주세요.'
        );

        return;
      }

      const date =
        new Date(
          localDateTime
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        setMessage(
          visitMessage,
          '방문 일시를 다시 확인해주세요.'
        );

        return;
      }

      if (
        careArea.length >
        300
      ) {
        setMessage(
          visitMessage,
          '케어 공간은 300자 이내로 입력해주세요.'
        );

        return;
      }

      setBusy(
        scheduleVisitButton,
        true,
        '등록 중...',
        '방문 일정 등록'
      );

      try {
        const {
          error
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_schedule_visit',
              {
                p_customer_id:
                  customerId,

                p_diagnosis_id:
                  latestDiagnosisId,

                p_scheduled_at:
                  date.toISOString(),

                p_care_area:
                  careArea ||
                  null,

                p_care_items:
                  careItems
              }
            );

        if (
          error
        ) {
          throw error;
        }

        setMessage(
          visitMessage,
          '방문 일정이 등록되었습니다.',
          true
        );

        visitForm.reset();

        await loadCustomerData();

      } catch (
        error
      ) {
        console.error(
          'MOOHAE visit schedule error:',
          error
        );

        setMessage(
          visitMessage,
          '방문 일정을 등록하지 못했습니다.'
        );

      } finally {
        setBusy(
          scheduleVisitButton,
          false,
          '등록 중...',
          '방문 일정 등록'
        );
      }
    }
  );


  // ============================================================
  // CARE COMPLETE
  // ============================================================

  careCompleteForm.addEventListener(
    'submit',
    async (
      event
    ) => {
      event.preventDefault();

      setMessage(
        careCompleteMessage,
        ''
      );

      const visitId =
        careVisitSelect.value;

      const beforeText =
        beforeDiagnosisInput.value.trim();

      const afterText =
        afterDiagnosisInput.value.trim();

      const adminMemo =
        visitAdminMemoInput.value.trim();

      const careItems = [
        ...careCompleteForm.querySelectorAll(
          'input[name="completedCareItem"]:checked'
        )
      ]
        .map(
          (input) =>
            input.value
        )
        .filter(
          (value) =>
            ALLOWED_CARE_ITEMS.has(
              value
            )
        );

      if (
        !visitId ||
        !UUID_PATTERN.test(
          visitId
        )
      ) {
        setMessage(
          careCompleteMessage,
          '완료할 방문 일정을 선택해주세요.'
        );

        return;
      }

      if (
        !beforeText ||
        !afterText
      ) {
        setMessage(
          careCompleteMessage,
          '케어 전·후 상태를 모두 입력해주세요.'
        );

        return;
      }

      if (
        beforeText.length >
          3000 ||
        afterText.length >
          3000
      ) {
        setMessage(
          careCompleteMessage,
          '케어 전·후 상태는 각각 3,000자 이내로 작성해주세요.'
        );

        return;
      }

      if (
        adminMemo.length >
        5000
      ) {
        setMessage(
          careCompleteMessage,
          '관리자 메모는 5,000자 이내로 작성해주세요.'
        );

        return;
      }

      if (
        careItems.length ===
        0
      ) {
        setMessage(
          careCompleteMessage,
          '실제 진행한 케어를 한 개 이상 선택해주세요.'
        );

        return;
      }

      setBusy(
        completeCareButton,
        true,
        '완료 처리 중...',
        '케어 완료 처리'
      );

      try {
        const {
          error
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_complete_visit',
              {
                p_visit_id:
                  visitId,

                p_before_diagnosis:
                  beforeText,

                p_after_diagnosis:
                  afterText,

                p_care_items:
                  careItems,

                p_admin_memo:
                  adminMemo ||
                  null
              }
            );

        if (
          error
        ) {
          throw error;
        }

        careCompleteForm.reset();

        setMessage(
          careCompleteMessage,
          '케어 완료 처리와 Care Report 초안 생성이 완료되었습니다.',
          true
        );

        await loadCustomerData();

      } catch (
        error
      ) {
        console.error(
          'MOOHAE care complete error:',
          error
        );

        setMessage(
          careCompleteMessage,
          '케어 완료 처리 중 오류가 발생했습니다.'
        );

      } finally {
        setBusy(
          completeCareButton,
          false,
          '완료 처리 중...',
          '케어 완료 처리'
        );
      }
    }
  );


  // ============================================================
  // REPORT SAVE
  // ============================================================

  async function saveReport(
    status
  ) {
    setMessage(
      reportEditorMessage,
      ''
    );

    const reportId =
      reportEditorId.value;

    const managerComment =
      reportManagerComment.value.trim();

    const nextCare =
      reportNextCare.value.trim();

    if (
      !reportId ||
      !UUID_PATTERN.test(
        reportId
      )
    ) {
      setMessage(
        reportEditorMessage,
        '저장할 Care Report가 없습니다.'
      );

      return;
    }

    if (
      managerComment.length >
      5000
    ) {
      setMessage(
        reportEditorMessage,
        '담당자 코멘트는 5,000자 이내로 작성해주세요.'
      );

      return;
    }

    if (
      nextCare.length >
      3000
    ) {
      setMessage(
        reportEditorMessage,
        '다음 케어 권장사항은 3,000자 이내로 작성해주세요.'
      );

      return;
    }

    if (
      status ===
        'published' &&
      (
        !managerComment ||
        !nextCare
      )
    ) {
      setMessage(
        reportEditorMessage,
        '리포트 발행 전 코멘트와 다음 케어 권장사항을 모두 작성해주세요.'
      );

      return;
    }

    const targetButton =
      status ===
        'published'
        ? publishReportButton
        : saveReportButton;

    const normalLabel =
      status ===
        'published'
        ? '리포트 발행'
        : '임시 저장';

    const busyLabel =
      status ===
        'published'
        ? '발행 중...'
        : '저장 중...';

    setBusy(
      targetButton,
      true,
      busyLabel,
      normalLabel
    );

    try {
      const {
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            'admin_save_report',
            {
              p_report_id:
                reportId,

              p_manager_comment:
                managerComment ||
                null,

              p_next_care_recommendation:
                nextCare ||
                null,

              p_report_status:
                status
            }
          );

      if (
        error
      ) {
        throw error;
      }

      setMessage(
        reportEditorMessage,
        status ===
          'published'
          ? 'Care Report가 발행 상태로 저장되었습니다.'
          : 'Care Report 초안이 저장되었습니다.',
        true
      );

      await loadCustomerData();

    } catch (
      error
    ) {
      console.error(
        'MOOHAE report save error:',
        error
      );

      setMessage(
        reportEditorMessage,
        'Care Report를 저장하지 못했습니다.'
      );

    } finally {
      setBusy(
        targetButton,
        false,
        busyLabel,
        normalLabel
      );
    }
  }


  saveReportButton.addEventListener(
    'click',
    () =>
      saveReport(
        'draft'
      )
  );

  publishReportButton.addEventListener(
    'click',
    () =>
      saveReport(
        'published'
      )
  );


  // ============================================================
  // BOOT
  // ============================================================

  async function boot() {
    try {
      authContext =
        await requireAuthorizedAdmin();

      if (
        !authContext
      ) {
        return;
      }

      identity.textContent =
        `${authContext.profile.display_name} · ${authContext.profile.role}`;

      customerId =
        new URLSearchParams(
          window.location.search
        ).get(
          'id'
        );

      if (
        !customerId ||
        !UUID_PATTERN.test(
          customerId
        )
      ) {
        detailMessage.textContent =
          '올바르지 않은 고객 주소입니다.';

        managementForm.hidden =
          true;

        visitForm.hidden =
          true;

        return;
      }

      await loadCustomerData();

    } catch (
      error
    ) {
      console.error(
        'MOOHAE customer detail error:',
        error
      );

      detailMessage.textContent =
        '고객 정보를 불러오는 중 오류가 발생했습니다.';
    }
  }


  logoutButton.addEventListener(
    'click',
    async () => {
      logoutButton.disabled =
        true;

      try {
        await window
          .moohaeSupabase
          .auth
          .signOut();

      } finally {
        window.location.replace(
          './login.html'
        );
      }
    }
  );


  boot();
})();