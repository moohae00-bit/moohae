(() => {
  'use strict';

  // ============================================================
  // MOOHAE ADMIN · FACILITY CHECK V3 VIEW
  //
  // 역할
  // 1. 기존 admin-customer-detail.js를 수정하지 않는다.
  // 2. 현재 고객의 최신 diagnosis 1건만 다시 확인한다.
  // 3. 최신 CHECK가 facility인 경우에만 관리자 최신 CHECK 카드를
  //    FACILITY V3 구조로 안전하게 교체한다.
  // 4. HOME CHECK 고객에게는 아무 변화도 주지 않는다.
  //
  // SECURITY
  // - 관리자 인증/RLS는 기존 Supabase 세션을 그대로 사용한다.
  // - service_role / secret key를 브라우저에 두지 않는다.
  // - 동적 출력은 innerHTML 없이 textContent만 사용한다.
  // ============================================================

  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  let loading = false;
  let renderedDiagnosisId = '';

  // ============================================================
  // HELPERS
  // ============================================================

  function make(
    tag,
    className = '',
    text = ''
  ) {
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
  }


  function formatDateTime(
    value
  ) {
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
    ).format(date);
  }


  function normalizeArray(
    value
  ) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        (item) =>
          typeof item === 'string'
      )
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);
  }


  function appendChips(
    parent,
    values
  ) {
    const normalized =
      normalizeArray(values);

    if (!normalized.length) {
      parent.appendChild(
        make(
          'span',
          'facility-check-empty',
          '선택 내용 없음'
        )
      );

      return;
    }

    normalized.forEach(
      (value) => {
        parent.appendChild(
          make(
            'span',
            'facility-check-chip',
            value
          )
        );
      }
    );
  }


  function appendTextValue(
    parent,
    value
  ) {
    parent.appendChild(
      make(
        'strong',
        'facility-check-value',
        String(value || '').trim() || '—'
      )
    );
  }


  function appendGroup(
    article,
    label,
    value,
    type = 'text'
  ) {
    const group =
      make(
        'div',
        'facility-check-group'
      );

    group.appendChild(
      make(
        'span',
        'facility-check-label',
        label
      )
    );

    if (type === 'chips') {
      const chips =
        make(
          'div',
          'facility-check-chip-line'
        );

      appendChips(
        chips,
        value
      );

      group.appendChild(chips);

    } else {
      appendTextValue(
        group,
        value
      );
    }

    article.appendChild(group);
  }


  // ============================================================
  // RENDER
  // ============================================================

  function renderFacilityDiagnosis(
    diagnosis
  ) {
    const target =
      document.getElementById(
        'latestDiagnosis'
      );

    if (!target) {
      return;
    }

    const diagnosisId =
      String(
        diagnosis?.id || ''
      );

    if (
      diagnosisId &&
      diagnosisId ===
        renderedDiagnosisId
    ) {
      return;
    }

    const article =
      make(
        'article',
        'facility-check-card'
      );

    const head =
      make(
        'div',
        'facility-check-head'
      );

    const headText =
      make(
        'div',
        'facility-check-head-copy'
      );

    headText.appendChild(
      make(
        'strong',
        '',
        diagnosis.facility_name ||
          '시설 CHECK'
      )
    );

    headText.appendChild(
      make(
        'span',
        '',
        formatDateTime(
          diagnosis.created_at
        )
      )
    );

    head.appendChild(
      headText
    );

    head.appendChild(
      make(
        'span',
        'facility-check-type-badge',
        'FACILITY CHECK'
      )
    );

    article.appendChild(head);

    appendGroup(
      article,
      '가장 신경 쓰이는 곳',
      diagnosis.facility_focus_areas,
      'chips'
    );

    appendGroup(
      article,
      '현재 관리에서 어려운 점',
      diagnosis.facility_pain_point
    );

    appendGroup(
      article,
      '현재 관리 방식',
      diagnosis.facility_management_method
    );

    appendGroup(
      article,
      'CARE가 필요하다고 느끼는 곳',
      diagnosis.facility_care_need_areas,
      'chips'
    );

    appendGroup(
      article,
      'CARE 결정 기준',
      diagnosis.facility_decision_factor
    );

    appendGroup(
      article,
      '선호 CARE 방식',
      diagnosis.facility_service_preference
    );

    appendGroup(
      article,
      '첫 검토 방식',
      diagnosis.facility_sales_preference
    );

    if (
      typeof diagnosis.result_message ===
        'string' &&
      diagnosis.result_message.trim()
    ) {
      article.appendChild(
        make(
          'p',
          'facility-check-result-message',
          diagnosis.result_message.trim()
        )
      );
    }

    target.replaceChildren(
      article
    );

    renderedDiagnosisId =
      diagnosisId;
  }


  // ============================================================
  // LOAD LATEST CHECK
  // ============================================================

  async function renderLatestFacilityCheck() {
    if (loading) {
      return;
    }

    const customerId =
      new URLSearchParams(
        window.location.search
      ).get('id');

    if (
      !customerId ||
      !UUID_PATTERN.test(
        customerId
      )
    ) {
      return;
    }

    if (
      !window.moohaeSupabaseConfigReady ||
      !window.moohaeSupabase
    ) {
      return;
    }

    loading =
      true;

    try {
      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .from('diagnoses')
          .select(
            `
              id,
              customer_type,
              check_version,
              result_message,
              created_at,
              facility_name,
              facility_focus_areas,
              facility_pain_point,
              facility_management_method,
              facility_care_need_areas,
              facility_decision_factor,
              facility_service_preference,
              facility_sales_preference
            `
          )
          .eq(
            'customer_id',
            customerId
          )
          .order(
            'created_at',
            {
              ascending: false
            }
          )
          .limit(1)
          .maybeSingle();

      if (error) {
        throw error;
      }

      if (
        !data ||
        data.customer_type !==
          'facility'
      ) {
        // HOME CHECK 또는 기록 없음:
        // 기존 관리자 화면을 그대로 유지한다.
        return;
      }

      if (
        Number(
          data.check_version
        ) < 3
      ) {
        return;
      }

      renderFacilityDiagnosis(
        data
      );

    } catch (error) {
      console.error(
        '[MOOHAE] Facility admin view load failed',
        {
          code:
            error?.code || '',
          message:
            error?.message || 'unknown_error'
        }
      );

    } finally {
      loading =
        false;
    }
  }


  // ============================================================
  // EVENTS
  // ============================================================

  window.addEventListener(
    'moohae:customer-detail-loaded',
    () => {
      renderLatestFacilityCheck();
    }
  );


  if (
    document.readyState ===
      'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        window.setTimeout(
          renderLatestFacilityCheck,
          0
        );
      },
      {
        once: true
      }
    );

  } else {
    window.setTimeout(
      renderLatestFacilityCheck,
      0
    );
  }

})();