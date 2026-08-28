(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN · CUSTOMER DETAIL V3
  //
  // FLOW
  //
  // 01 상담 상태 · 운영 메모
  // 02 방문 일정
  // 03 현장 CARE
  // 04 Care Report 작성
  // 05 Report 발행
  //
  // 현장 CHECK / CARE / PROOF는 Partner View에서만 처리한다.
  // ============================================================


  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  const STATUS_LABELS = {
    new: '신규 문의',
    consulting: '상담 중',
    visit_scheduled: '방문 예정',
    care_completed: 'CARE 완료',
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


  const BOOKING_LABELS = {
    requested: '고객 요청',
    confirmed: '확정'
  };


  const ALLOWED_STATUSES =
    new Set(
      Object.keys(
        STATUS_LABELS
      )
    );


  const ALLOWED_CARE_ITEMS =
    new Set([
      '매트리스 케어',
      '패브릭 케어',
      '실내 공간 케어',
      '바닥 케어'
    ]);


  // ============================================================
  // DOM
  // ============================================================

  const identity =
    document.getElementById('adminIdentity');

  const logoutButton =
    document.getElementById('logoutButton');

  const detailMessage =
    document.getElementById('detailMessage');


  const managementForm =
    document.getElementById('customerManagementForm');

  const statusSelect =
    document.getElementById('customerStatusSelect');

  const notesInput =
    document.getElementById('customerNotes');

  const customerRowVersion =
    document.getElementById('customerRowVersion');

  const saveCustomerButton =
    document.getElementById('saveCustomerButton');

  const managementMessage =
    document.getElementById('customerManagementMessage');


  const visitForm =
    document.getElementById('visitScheduleForm');

  const visitScheduledAt =
    document.getElementById('visitScheduledAt');

  const visitCareArea =
    document.getElementById('visitCareArea');

  const scheduleVisitButton =
    document.getElementById('scheduleVisitButton');

  const visitMessage =
    document.getElementById('visitScheduleMessage');


  const bookingRequestDateTime =
    document.getElementById('bookingRequestDateTime');

  const bookingRequestStatus =
    document.getElementById('bookingRequestStatus');

  const bookingRequestNote =
    document.getElementById('bookingRequestNote');


  const reportEditorForm =
    document.getElementById('reportEditorForm');

  const reportEditorId =
    document.getElementById('reportEditorId');

  const reportManagerComment =
    document.getElementById('reportManagerComment');

  const reportNextCare =
    document.getElementById('reportNextCare');

  const reportEditStatus =
    document.getElementById('reportEditStatus');

  const saveReportButton =
    document.getElementById('saveReportButton');

  const publishReportButton =
    document.getElementById('publishReportButton');

  const reportEditorMessage =
    document.getElementById('reportEditorMessage');

  const reportPublishMessage =
    document.getElementById('reportPublishMessage');


  const step1State =
    document.getElementById('step1State');

  const step2State =
    document.getElementById('step2State');

  const step3State =
    document.getElementById('step3State');

  const step5State =
    document.getElementById('step5State');


  const deletedCustomerNotice =
    document.getElementById('deletedCustomerNotice');

  const deletedCustomerMeta =
    document.getElementById('deletedCustomerMeta');

  const openDeleteCustomerButton =
    document.getElementById('openDeleteCustomerButton');

  const deleteCustomerMessage =
    document.getElementById('deleteCustomerMessage');

  const deleteCustomerDialog =
    document.getElementById('deleteCustomerDialog');

  const deleteCustomerForm =
    document.getElementById('deleteCustomerForm');

  const deleteCustomerTarget =
    document.getElementById('deleteCustomerTarget');

  const deleteCustomerReason =
    document.getElementById('deleteCustomerReason');

  const deleteCustomerConfirmInput =
    document.getElementById('deleteCustomerConfirmInput');

  const closeDeleteCustomerDialogButton =
    document.getElementById('closeDeleteCustomerDialogButton');

  const cancelDeleteCustomerButton =
    document.getElementById('cancelDeleteCustomerButton');

  const confirmDeleteCustomerButton =
    document.getElementById('confirmDeleteCustomerButton');

  const deleteDialogMessage =
    document.getElementById('deleteDialogMessage');


  // ============================================================
  // STATE
  // ============================================================

  let authContext =
    null;

  let customerId =
    null;

  let latestDiagnosisId =
    null;

  let currentCustomer =
    null;

  let currentCustomerDeleted =
    false;


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


  function setMessage(
    node,
    text,
    ok = false
  ) {

    if (
      !node
    ) {

      return;
    }


    node.textContent =
      text;


    node.classList.toggle(
      'success',
      ok
    );
  }


  function setBusy(
    button,
    busy,
    busyLabel,
    normalLabel
  ) {

    if (
      !button
    ) {

      return;
    }


    button.disabled =
      busy;


    button.textContent =
      busy
        ? busyLabel
        : normalLabel;
  }


  function setFormDisabled(
    form,
    disabled
  ) {

    if (
      !form
    ) {

      return;
    }


    form
      .querySelectorAll(
        'input, select, textarea, button'
      )
      .forEach(
        (control) => {

          control.disabled =
            disabled;
        }
      );
  }


  function setWorkflowState(
    node,
    label,
    state = ''
  ) {

    if (
      !node
    ) {

      return;
    }


    node.textContent =
      label;


    node.className =
      'workflow-state';


    if (
      state
    ) {

      node.classList.add(
        `state-${state}`
      );
    }
  }


  // ============================================================
  // DATE
  // ============================================================

  function formatDateTime(
    value
  ) {

    if (
      !value
    ) {

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


  function formatDate(
    value
  ) {

    if (
      !value
    ) {

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
    ).format(date);
  }


  function bookingToInputValue(
    booking
  ) {

    if (
      !booking?.booking_date ||
      !booking?.booking_time
    ) {

      return '';
    }


    const time =
      String(
        booking.booking_time
      ).slice(0, 5);


    if (
      !/^\d{2}:\d{2}$/.test(time)
    ) {

      return '';
    }


    return (
      `${booking.booking_date}T${time}`
    );
  }


  function formatBookingDateTime(
    booking
  ) {

    const input =
      bookingToInputValue(booking);


    if (
      !input
    ) {

      return '요청 일정 없음';
    }


    const date =
      new Date(input);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return (
        `${booking.booking_date} ${String(
          booking.booking_time
        ).slice(0, 5)}`
      );
    }


    return new Intl.DateTimeFormat(
      'ko-KR',
      {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(date);
  }


  // ============================================================
  // AUTH
  // ============================================================

  async function requireAuthorizedAdmin() {

    if (
      !window.moohaeSupabaseConfigReady ||
      !window.moohaeSupabase
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
      data: profile,
      error: profileError
    } =
      await window
        .moohaeSupabase
        .from('admin_profiles')
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
      profile.is_active === true &&
      (
        profile.role === 'admin' ||
        profile.role === 'manager'
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
      user: data.user,
      profile
    };
  }


  // ============================================================
  // DELETE STATE
  // ============================================================

  function applyDeletedCustomerState(
    customer
  ) {

    currentCustomerDeleted =
      Boolean(
        customer?.deleted_at
      );


    if (
      deletedCustomerNotice
    ) {

      deletedCustomerNotice.hidden =
        !currentCustomerDeleted;
    }


    if (
      openDeleteCustomerButton
    ) {

      openDeleteCustomerButton.hidden =
        currentCustomerDeleted;


      openDeleteCustomerButton.disabled =
        currentCustomerDeleted;
    }


    if (
      currentCustomerDeleted
    ) {

      if (
        deletedCustomerMeta
      ) {

        deletedCustomerMeta.textContent =
          `삭제 처리 ${formatDateTime(
            customer.deleted_at
          )} · 사유: ${
            customer.delete_reason ||
            '사유 미기록'
          }`;
      }


      setFormDisabled(
        managementForm,
        true
      );


      setFormDisabled(
        visitForm,
        true
      );


      setFormDisabled(
        reportEditorForm,
        true
      );


      if (
        publishReportButton
      ) {

        publishReportButton.disabled =
          true;
      }


      setMessage(
        deleteCustomerMessage,
        '삭제된 고객입니다. 복구 후 다시 수정할 수 있습니다.'
      );


    } else {

      setFormDisabled(
        managementForm,
        false
      );


      setFormDisabled(
        visitForm,
        false
      );


      setMessage(
        deleteCustomerMessage,
        ''
      );
    }
  }


  // ============================================================
  // CHECK
  // ============================================================

  function renderChips(
    parent,
    values
  ) {

    parent.replaceChildren();


    if (
      !Array.isArray(values) ||
      values.length === 0
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


    values.forEach(
      (value) => {

        parent.appendChild(
          make(
            'span',
            'mini-chip',
            String(value)
          )
        );
      }
    );
  }


  function diagnosisCard(
    diagnosis
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
      make('div');


    const isV2 =
      Number(
        diagnosis.check_version
      ) >= 2;


    left.appendChild(
      make(
        'strong',
        '',
        diagnosis.recommended_plan ||
        diagnosis.result_level ||
        'MOOHAE CHECK'
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


    head.appendChild(left);


    head.appendChild(
      make(
        'span',
        'count-pill',
        'LATEST'
      )
    );


    article.appendChild(head);


    const groups =
      isV2

        ? [
            [
              '함께 생활',
              diagnosis.household
            ],
            [
              '주요 생활 공간',
              diagnosis.living_spaces
            ],
            [
              '주요 접촉면',
              diagnosis.contact_surfaces
            ],
            [
              '관리 고민',
              diagnosis.management_worries
            ],
            [
              '원하는 관리 방식',
              diagnosis.management_preference
            ]
          ]

        : [
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
              '희망 방식',
              diagnosis.preferred_contact
            ]
          ];


    groups.forEach(
      ([label, values]) => {

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


        block.appendChild(chips);

        article.appendChild(block);
      }
    );


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


  // ============================================================
  // VISIT / REPORT HISTORY
  // ============================================================

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
      make('div');


    left.appendChild(
      make(
        'strong',
        '',
        visit.care_area ||
        '방문 CARE'
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


    head.appendChild(left);


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


    article.appendChild(head);


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


      article.appendChild(chips);
    }


    return article;
  }


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


    if (
      !url
    ) {

      return;
    }


    const original =
      button.textContent;


    try {

      await navigator
        .clipboard
        .writeText(url);


      button.textContent =
        '복사 완료';


    } catch (
      error
    ) {

      console.error(
        'MOOHAE report copy error:',
        error
      );

    } finally {

      window.setTimeout(
        () => {

          button.textContent =
            original;

        },
        1500
      );
    }
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
      make('div');


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


    head.appendChild(left);


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


    article.appendChild(head);


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
      report.report_status ===
        'published' &&

      UUID_PATTERN.test(
        report.public_token || ''
      )
    ) {

      const actions =
        make(
          'div',
          'report-history-actions'
        );


      const openButton =
        make(
          'button',
          'secondary-button',
          '리포트 보기'
        );


      openButton.type =
        'button';


      openButton.addEventListener(
        'click',
        () => {

          const url =
            buildPublicReportUrl(
              report.public_token
            );


          if (
            url
          ) {

            window.open(
              url,
              '_blank',
              'noopener,noreferrer'
            );
          }
        }
      );


      const copyButton =
        make(
          'button',
          'secondary-button',
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


      article.appendChild(actions);
    }


    return article;
  }


  // ============================================================
  // BOOKING REQUEST
  // ============================================================

  function renderBookingRequest(
    booking,
    visits
  ) {

    const activeVisit =
      visits.find(
        (visit) =>
          visit.visit_status ===
            'scheduled' ||

          visit.visit_status ===
            'in_progress'
      ) ||
      null;


    if (
      activeVisit
    ) {

      setWorkflowState(
        step2State,
        '일정 등록됨',
        'done'
      );


      setWorkflowState(
        step3State,
        '진행 가능',
        'ready'
      );

    } else {

      setWorkflowState(
        step3State,
        '일정 필요',
        'wait'
      );
    }


    if (
      !booking
    ) {

      bookingRequestDateTime.textContent =
        '고객 요청 일정 없음';


      bookingRequestStatus.textContent =
        '요청 없음';


      bookingRequestStatus.className =
        'booking-request-status';


      bookingRequestNote.textContent =
        activeVisit

          ? '이미 등록된 방문 일정이 있습니다.'

          : '고객 요청 일정이 없습니다. 관리자가 직접 방문 일시를 입력할 수 있습니다.';


      if (
        !activeVisit
      ) {

        setWorkflowState(
          step2State,
          '일정 필요',
          'wait'
        );
      }


      return;
    }


    bookingRequestDateTime.textContent =
      formatBookingDateTime(
        booking
      );


    bookingRequestStatus.textContent =
      BOOKING_LABELS[
        booking.booking_status
      ] ||
      booking.booking_status ||
      '요청';


    bookingRequestStatus.className =
      `booking-request-status status-${booking.booking_status || 'requested'}`;


    const inputValue =
      bookingToInputValue(
        booking
      );


    if (
      !activeVisit &&
      inputValue
    ) {

      visitScheduledAt.value =
        inputValue;


      bookingRequestNote.textContent =
        '고객 요청 일정이 방문 일시에 자동 반영되었습니다. 변경이 필요하면 수정 후 등록하세요.';


      setWorkflowState(
        step2State,
        '고객 요청 있음',
        'ready'
      );


    } else if (
      activeVisit
    ) {

      bookingRequestNote.textContent =
        '고객 요청 일정이 확인되었습니다. 이미 등록된 방문 일정이 있으므로 중복 등록하지 않습니다.';
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


      setWorkflowState(
        step5State,
        'CARE 후 생성',
        'wait'
      );


      setMessage(
        reportEditorMessage,
        '현장 CARE 완료 후 Care Report 초안이 자동 생성됩니다.'
      );


      return;
    }


    reportEditorId.value =
      editable.id;


    reportManagerComment.value =
      editable.manager_comment || '';


    reportNextCare.value =
      editable.next_care_recommendation || '';


    reportEditStatus.textContent =
      REPORT_LABELS[
        editable.report_status
      ] ||
      '상태 미정';


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


    if (
      editable.report_status ===
      'published'
    ) {

      publishReportButton.textContent =
        '발행 내용 저장';


      setWorkflowState(
        step5State,
        '발행 완료',
        'done'
      );


    } else {

      publishReportButton.textContent =
        '리포트 발행';


      setWorkflowState(
        step5State,
        '발행 대기',
        'ready'
      );
    }


    setMessage(
      reportEditorMessage,
      ''
    );
  }


  // ============================================================
  // LOAD
  // ============================================================

  async function loadCustomerData() {

    const [
      customerResult,
      diagnosisResult,
      visitResult,
      reportResult,
      bookingResult
    ] =
      await Promise.all([


        window
          .moohaeSupabase
          .from('customers')
          .select(
            `
              id,
              name,
              phone,
              address,
              status,
              privacy_consent,
              privacy_consented_at,
              notes,
              created_at,
              updated_at,
              deleted_at,
              deleted_by,
              delete_reason,
              row_version
            `
          )
          .eq(
            'id',
            customerId
          )
          .maybeSingle(),


        window
          .moohaeSupabase
          .from('diagnoses')
          .select(
            `
              id,
              check_version,
              recommended_plan,
              household,
              living_spaces,
              contact_surfaces,
              management_worries,
              management_preference,
              spaces,
              concerns,
              difficulties,
              preferred_contact,
              result_level,
              result_message,
              created_at
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
          ),


        window
          .moohaeSupabase
          .from('care_visits')
          .select(
            `
              id,
              scheduled_at,
              completed_at,
              care_area,
              care_items,
              visit_status,
              created_at
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
          ),


        window
          .moohaeSupabase
          .from('reports')
          .select(
            `
              id,
              public_token,
              manager_comment,
              next_care_recommendation,
              report_status,
              published_at,
              created_at
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
          ),


        window
          .moohaeSupabase
          .rpc(
            'admin_get_customer_visit_request',
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
          'CUSTOMER_NOT_FOUND'
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
      bookingResult.error
    ) {

      throw bookingResult.error;
    }


    const customer =
      customerResult.data;


    const diagnoses =
      diagnosisResult.data || [];


    const visits =
      visitResult.data || [];


    const reports =
      reportResult.data || [];


    const booking =
      Array.isArray(
        bookingResult.data
      )
        ? bookingResult.data[0] || null
        : bookingResult.data || null;


    currentCustomer =
      customer;


    latestDiagnosisId =
      diagnoses[0]?.id || null;


    // ----------------------------------------------------------
    // HERO
    // ----------------------------------------------------------

    document
      .getElementById('customerName')
      .textContent =
        customer.name ||
        '이름 없음';


    document
      .getElementById('customerMeta')
      .textContent =
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
      customer.deleted_at
        ? '삭제됨'
        : statusText;


    statusBadge.className =
      customer.deleted_at
        ? 'status-badge status-deleted'
        : `status-badge status-${customer.status || 'neutral'}`;


    // ----------------------------------------------------------
    // BASIC
    // ----------------------------------------------------------

    document
      .getElementById('detailName')
      .textContent =
        customer.name || '—';


    document
      .getElementById('detailPhone')
      .textContent =
        customer.phone || '—';


    document
      .getElementById('detailAddress')
      .textContent =
        customer.address || '—';


    document
      .getElementById('detailStatus')
      .textContent =
        statusText;


    document
      .getElementById('detailConsent')
      .textContent =
        customer.privacy_consent

          ? `동의 · ${formatDate(
              customer.privacy_consented_at
            )}`

          : '미동의';


    document
      .getElementById('detailCreatedAt')
      .textContent =
        formatDateTime(
          customer.created_at
        );


    // ----------------------------------------------------------
    // STEP 01
    // ----------------------------------------------------------

    customerRowVersion.value =
      String(
        customer.row_version || 1
      );


    statusSelect.value =
      ALLOWED_STATUSES.has(
        customer.status
      )
        ? customer.status
        : 'new';


    notesInput.value =
      customer.notes || '';


    setWorkflowState(
      step1State,
      statusText,
      customer.notes
        ? 'done'
        : 'ready'
    );


    // ----------------------------------------------------------
    // CHECK
    // ----------------------------------------------------------

    const latestDiagnosis =
      document.getElementById(
        'latestDiagnosis'
      );


    latestDiagnosis.replaceChildren();


    document
      .getElementById(
        'diagnosisCount'
      )
      .textContent =
        String(
          diagnoses.length
        );


    if (
      diagnoses.length
    ) {

      latestDiagnosis.appendChild(
        diagnosisCard(
          diagnoses[0]
        )
      );


    } else {

      latestDiagnosis.appendChild(
        make(
          'p',
          'muted-copy',
          '아직 MOOHAE CHECK 기록이 없습니다.'
        )
      );
    }


    // ----------------------------------------------------------
    // BOOKING
    // ----------------------------------------------------------

    renderBookingRequest(
      booking,
      visits
    );


    // ----------------------------------------------------------
    // REPORT
    // ----------------------------------------------------------

    populateReportEditor(
      reports
    );


    // ----------------------------------------------------------
    // HISTORY VISIT
    // ----------------------------------------------------------

    const visitHistory =
      document.getElementById(
        'visitHistory'
      );


    visitHistory.replaceChildren();


    document
      .getElementById(
        'visitHistoryCount'
      )
      .textContent =
        String(
          visits.length
        );


    if (
      visits.length
    ) {

      visits.forEach(
        (visit) => {

          visitHistory.appendChild(
            visitCard(visit)
          );
        }
      );


    } else {

      visitHistory.appendChild(
        make(
          'p',
          'muted-copy',
          '방문 CARE 기록이 없습니다.'
        )
      );
    }


    // ----------------------------------------------------------
    // HISTORY REPORT
    // ----------------------------------------------------------

    const reportHistory =
      document.getElementById(
        'reportHistory'
      );


    reportHistory.replaceChildren();


    document
      .getElementById(
        'reportHistoryCount'
      )
      .textContent =
        String(
          reports.length
        );


    if (
      reports.length
    ) {

      reports.forEach(
        (report) => {

          reportHistory.appendChild(
            reportCard(report)
          );
        }
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


    applyDeletedCustomerState(
      customer
    );


    detailMessage.textContent =
      '';
  }


  // ============================================================
  // STEP 01 SAVE
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


      if (
        currentCustomerDeleted ||
        !currentCustomer
      ) {

        return;
      }


      const status =
        statusSelect.value;


      const notes =
        notesInput.value.trim();


      const expectedVersion =
        Number(
          customerRowVersion.value
        );


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
        notes.length > 5000
      ) {

        setMessage(
          managementMessage,
          '운영 메모는 5,000자 이내로 작성해주세요.'
        );


        return;
      }


      if (
        !Number.isSafeInteger(
          expectedVersion
        ) ||
        expectedVersion < 1
      ) {

        setMessage(
          managementMessage,
          '고객 버전 정보를 확인할 수 없습니다. 새로고침해주세요.'
        );


        return;
      }


      setBusy(
        saveCustomerButton,
        true,
        '저장 중...',
        '상담 정보 저장'
      );


      try {

        const {
          error
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_update_customer_v2',
              {
                p_customer_id:
                  customerId,

                p_name:
                  currentCustomer.name,

                p_phone:
                  currentCustomer.phone ||
                  null,

                p_address:
                  currentCustomer.address ||
                  null,

                p_status:
                  status,

                p_notes:
                  notes || null,

                p_expected_version:
                  expectedVersion
              }
            );


        if (
          error
        ) {

          if (
            error.code ===
              '40001' ||

            String(
              error.message || ''
            ).includes(
              'Customer data has changed'
            )
          ) {

            throw new Error(
              'STALE_CUSTOMER_VERSION'
            );
          }


          throw error;
        }


        setMessage(
          managementMessage,
          '상담 정보가 저장되었습니다.',
          true
        );


        await loadCustomerData();


      } catch (
        error
      ) {

        console.error(
          'MOOHAE customer management error:',
          error
        );


        if (
          error?.message ===
          'STALE_CUSTOMER_VERSION'
        ) {

          setMessage(
            managementMessage,
            '다른 화면에서 고객 정보가 먼저 수정되었습니다. 최신 정보를 다시 불러옵니다.'
          );


          await loadCustomerData();


        } else {

          setMessage(
            managementMessage,
            '상담 정보를 저장하지 못했습니다.'
          );
        }


      } finally {

        setBusy(
          saveCustomerButton,
          false,
          '저장 중...',
          '상담 정보 저장'
        );
      }
    }
  );


  // ============================================================
  // STEP 02 VISIT
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


      if (
        currentCustomerDeleted
      ) {

        return;
      }


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
                  careArea || null,

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


        window.dispatchEvent(
          new CustomEvent(
            'moohae:visit-changed'
          )
        );


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
  // REPORT SAVE / PUBLISH
  // ============================================================

  async function saveReport(
    status
  ) {

    const messageNode =
      status === 'published'
        ? reportPublishMessage
        : reportEditorMessage;


    setMessage(
      messageNode,
      ''
    );


    if (
      currentCustomerDeleted
    ) {

      return;
    }


    const reportId =
      reportEditorId.value;


    const managerComment =
      reportManagerComment
        .value
        .trim();


    const nextCare =
      reportNextCare
        .value
        .trim();


    if (
      !UUID_PATTERN.test(
        reportId || ''
      )
    ) {

      setMessage(
        messageNode,
        '저장할 Care Report가 없습니다.'
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
        messageNode,
        '발행 전 담당자 코멘트와 다음 CARE 권장사항을 모두 작성해주세요.'
      );


      return;
    }


    const button =
      status ===
        'published'
        ? publishReportButton
        : saveReportButton;


    setBusy(
      button,
      true,
      status ===
        'published'
        ? '발행 중...'
        : '저장 중...',
      status ===
        'published'
        ? '리포트 발행'
        : '임시 저장'
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
                managerComment || null,

              p_next_care_recommendation:
                nextCare || null,

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
        messageNode,
        status ===
          'published'

          ? 'Care Report가 발행되었습니다.'

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
        messageNode,
        'Care Report를 저장하지 못했습니다.'
      );


    } finally {

      setBusy(
        button,
        false,
        '',
        status ===
          'published'
          ? '리포트 발행'
          : '임시 저장'
      );
    }
  }


  saveReportButton.addEventListener(
    'click',
    () => {

      saveReport('draft');
    }
  );


  publishReportButton.addEventListener(
    'click',
    () => {

      saveReport('published');
    }
  );


  // ============================================================
  // DELETE
  // ============================================================

  function closeDeleteDialog() {

    if (
      deleteCustomerDialog?.open
    ) {

      deleteCustomerDialog.close();
    }


    deleteCustomerForm?.reset();


    setMessage(
      deleteDialogMessage,
      ''
    );
  }


  openDeleteCustomerButton.addEventListener(
    'click',
    () => {

      if (
        !currentCustomer ||
        currentCustomerDeleted
      ) {

        return;
      }


      deleteCustomerTarget.textContent =
        `${currentCustomer.name || '이름 없음'} 고객을 삭제 처리합니다.`;


      deleteCustomerForm.reset();


      setMessage(
        deleteDialogMessage,
        ''
      );


      deleteCustomerDialog.showModal();
    }
  );


  closeDeleteCustomerDialogButton.addEventListener(
    'click',
    closeDeleteDialog
  );


  cancelDeleteCustomerButton.addEventListener(
    'click',
    closeDeleteDialog
  );


  deleteCustomerDialog.addEventListener(
    'cancel',
    (event) => {

      event.preventDefault();

      closeDeleteDialog();
    }
  );


  deleteCustomerForm.addEventListener(
    'submit',
    async (
      event
    ) => {

      event.preventDefault();


      const reason =
        deleteCustomerReason
          .value
          .trim();


      const confirmText =
        deleteCustomerConfirmInput
          .value
          .trim();


      if (
        reason.length < 2
      ) {

        setMessage(
          deleteDialogMessage,
          '삭제 사유를 2자 이상 입력해주세요.'
        );


        return;
      }


      if (
        confirmText !==
        '삭제'
      ) {

        setMessage(
          deleteDialogMessage,
          '확인란에 “삭제”라고 정확히 입력해주세요.'
        );


        return;
      }


      setBusy(
        confirmDeleteCustomerButton,
        true,
        '처리 중...',
        '삭제 처리'
      );


      try {

        const {
          error
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_soft_delete_customer',
              {
                p_customer_id:
                  customerId,

                p_reason:
                  reason
              }
            );


        if (
          error
        ) {

          throw error;
        }


        closeDeleteDialog();


        await loadCustomerData();


      } catch (
        error
      ) {

        console.error(
          'MOOHAE customer delete error:',
          error
        );


        setMessage(
          deleteDialogMessage,
          '고객을 삭제 처리하지 못했습니다.'
        );


      } finally {

        setBusy(
          confirmDeleteCustomerButton,
          false,
          '처리 중...',
          '삭제 처리'
        );
      }
    }
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
        ).get('id');


      if (
        !customerId ||
        !UUID_PATTERN.test(
          customerId
        )
      ) {

        detailMessage.textContent =
          '올바르지 않은 고객 주소입니다.';


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


  // ============================================================
  // LOGOUT
  // ============================================================

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


  // ============================================================
  // START
  // ============================================================

  boot();

})();