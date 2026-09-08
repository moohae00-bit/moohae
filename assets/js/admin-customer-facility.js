(() => {
  'use strict';

  // ============================================================
  // MOOHAE ADMIN · CHECK DISPLAY V3
  //
  // 기존 admin-customer-detail.js를 수정하지 않는다.
  //
  // HOME
  // STANDARD  -> CORE
  // PLUS      -> CORE+
  // SIGNATURE -> PRIVATE
  //
  // FACILITY
  // BASIC을 플랜으로 노출하지 않는다.
  // FACILITY CHECK 구조로 표시한다.
  // ============================================================


  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  const PLAN_LABELS =
    Object.freeze({

      STANDARD:
        'CORE',

      PLUS:
        'CORE+',

      SIGNATURE:
        'PRIVATE',

      CORE:
        'CORE',

      'CORE+':
        'CORE+',

      PRIVATE:
        'PRIVATE'

    });


  let loading =
    false;


  let renderedDiagnosisId =
    '';


  // ============================================================
  // DOM HELPERS
  // ============================================================


  function make(
    tag,
    className = '',
    text = ''
  ) {

    const node =
      document.createElement(
        tag
      );


    if (
      className
    ) {

      node.className =
        className;

    }


    if (
      text
    ) {

      node.textContent =
        text;

    }


    return node;
  }


  function formatDateTime(
    value
  ) {

    if (
      !value
    ) {

      return '—';

    }


    const date =
      new Date(
        value
      );


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

        year:
          'numeric',

        month:
          '2-digit',

        day:
          '2-digit',

        hour:
          '2-digit',

        minute:
          '2-digit'

      }
    ).format(
      date
    );
  }


  function normalizeArray(
    value
  ) {

    if (
      !Array.isArray(
        value
      )
    ) {

      return [];

    }


    return value

      .filter(
        (item) =>
          typeof item ===
            'string'
      )

      .map(
        (item) =>
          item.trim()
      )

      .filter(
        Boolean
      );
  }


  // ============================================================
  // PUBLIC HOME PLAN NAME
  // ============================================================


  function publicPlanName(
    diagnosis
  ) {

    const raw =
      String(
        diagnosis?.recommended_plan ||
        diagnosis?.result_level ||
        ''
      ).trim();


    return (
      PLAN_LABELS[
        raw
      ] ||
      'CORE'
    );
  }


  // ============================================================
  // OLD RESULT MESSAGE NORMALIZER
  // ============================================================


  function normalizeLegacyMessage(
    value
  ) {

    return String(
      value ||
      ''
    )

      .replace(
        /추천 관리 유형:\s*STANDARD\.?/g,
        '추천 CARE PLAN: CORE.'
      )

      .replace(
        /추천 관리 유형:\s*PLUS\.?/g,
        '추천 CARE PLAN: CORE+.'
      )

      .replace(
        /추천 관리 유형:\s*SIGNATURE\.?/g,
        '추천 CARE PLAN: PRIVATE.'
      )

      .replace(
        /추천 CARE PLAN:\s*STANDARD\.?/g,
        '추천 CARE PLAN: CORE.'
      )

      .replace(
        /추천 CARE PLAN:\s*PLUS\.?/g,
        '추천 CARE PLAN: CORE+.'
      )

      .replace(
        /추천 CARE PLAN:\s*SIGNATURE\.?/g,
        '추천 CARE PLAN: PRIVATE.'
      );
  }


  // ============================================================
  // HOME CHECK DISPLAY
  // ============================================================


  function renderHomeDiagnosis(
    diagnosis
  ) {

    const target =
      document.getElementById(
        'latestDiagnosis'
      );


    if (
      !target
    ) {

      return;

    }


    const publicPlan =
      publicPlanName(
        diagnosis
      );


    const planNode =
      target.querySelector(
        '.history-item-head strong'
      );


    if (
      planNode
    ) {

      planNode.textContent =
        publicPlan;

    }


    const copyNode =
      target.querySelector(
        '.history-copy'
      );


    if (
      copyNode
    ) {

      copyNode.textContent =
        normalizeLegacyMessage(

          diagnosis.result_message ||
          copyNode.textContent

        );

    }


    renderedDiagnosisId =
      String(
        diagnosis.id ||
        ''
      );
  }


  // ============================================================
  // FACILITY HELPERS
  // ============================================================


  function appendChips(
    parent,
    values
  ) {

    const normalized =
      normalizeArray(
        values
      );


    if (
      !normalized.length
    ) {

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
      (
        value
      ) => {

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


    if (
      type ===
        'chips'
    ) {

      const chips =
        make(
          'div',
          'facility-check-chip-line'
        );


      appendChips(
        chips,
        value
      );


      group.appendChild(
        chips
      );


    } else {

      group.appendChild(
        make(
          'strong',
          'facility-check-value',
          String(
            value ||
            ''
          ).trim() ||
          '—'
        )
      );

    }


    article.appendChild(
      group
    );
  }


  // ============================================================
  // FACILITY CHECK DISPLAY
  // ============================================================


  function renderFacilityDiagnosis(
    diagnosis
  ) {

    const target =
      document.getElementById(
        'latestDiagnosis'
      );


    if (
      !target
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


    article.appendChild(
      head
    );


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
      String(
        diagnosis.id ||
        ''
      );
  }


  // ============================================================
  // LOAD LATEST CHECK
  // ============================================================


  async function renderLatestCheck() {

    if (
      loading
    ) {

      return;

    }


    const customerId =
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
          .from(
            'diagnoses'
          )
          .select(
            `
              id,
              customer_type,
              check_version,
              recommended_plan,
              result_level,
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
              ascending:
                false
            }
          )
          .limit(
            1
          )
          .maybeSingle();


      if (
        error
      ) {

        throw error;

      }


      if (
        !data
      ) {

        return;

      }


      // ========================================================
      // FACILITY
      // ========================================================


      if (
        data.customer_type ===
          'facility'
      ) {

        renderFacilityDiagnosis(
          data
        );


        return;

      }


      // ========================================================
      // HOME
      // ========================================================


      renderHomeDiagnosis(
        data
      );


    } catch (
      error
    ) {


      console.error(
        '[MOOHAE] Admin CHECK display load failed',
        {

          code:
            error?.code ||
            '',

          message:
            error?.message ||
            'unknown_error'

        }
      );


    } finally {


      loading =
        false;

    }
  }


  // ============================================================
  // CUSTOMER DETAIL RELOAD EVENT
  // ============================================================


  window.addEventListener(
    'moohae:customer-detail-loaded',
    () => {

      renderedDiagnosisId =
        '';


      renderLatestCheck();

    }
  );


  // ============================================================
  // INITIAL LOAD
  // ============================================================


  if (
    document.readyState ===
      'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      () => {

        window.setTimeout(
          renderLatestCheck,
          0
        );

      },
      {
        once:
          true
      }
    );


  } else {


    window.setTimeout(
      renderLatestCheck,
      0
    );

  }

})();