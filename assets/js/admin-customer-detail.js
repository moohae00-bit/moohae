(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN · CUSTOMER DETAIL V4.1
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


  const VISIT_TIME_SLOTS = new Map([
    ['10:00', '10:00–12:30'],
    ['13:00', '13:00–15:30'],
    ['16:00', '16:00–18:30']
  ]);


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

  const customerNameInput =
    document.getElementById('customerNameInput');

  const customerPhoneInput =
    document.getElementById('customerPhoneInput');

  const customerAddressInput =
    document.getElementById('customerAddressInput');

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


  const homeProfileForm =
    document.getElementById('homeProfileForm');

  const homeIdInput =
    document.getElementById('homeIdInput');

  const homeRowVersion =
    document.getElementById('homeRowVersion');

  const homeAddressInput =
    document.getElementById('homeAddressInput');

  const homeTypeSelect =
    document.getElementById('homeTypeSelect');

  const homeAreaInput =
    document.getElementById('homeAreaInput');

  const saveHomeProfileButton =
    document.getElementById('saveHomeProfileButton');

  const homeProfileMessage =
    document.getElementById('homeProfileMessage');

  const homeProfileState =
    document.getElementById('homeProfileState');

  const homeNumber =
    document.getElementById('homeNumber');

  const homePlan =
    document.getElementById('homePlan');

  const homeCycle =
    document.getElementById('homeCycle');

  const homeNextCare =
    document.getElementById('homeNextCare');

  const returningBookingLinkState =
    document.getElementById('returningBookingLinkState');

  const openReturningBookingButton =
    document.getElementById('openReturningBookingButton');

  const copyReturningBookingButton =
    document.getElementById('copyReturningBookingButton');

  const returningBookingMessage =
    document.getElementById('returningBookingMessage');


  const visitForm =
    document.getElementById('visitScheduleForm');

  const visitScheduledAt =
    document.getElementById('visitScheduledAt');


  const visitDate =
    document.getElementById('visitDate');

  const visitTimeSlot =
    document.getElementById('visitTimeSlot');

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


  const permanentDeleteZone =
    document.getElementById('permanentDeleteZone');

  const openPermanentDeleteButton =
    document.getElementById('openPermanentDeleteButton');

  const permanentDeleteMessage =
    document.getElementById('permanentDeleteMessage');

  const permanentDeleteDialog =
    document.getElementById('permanentDeleteDialog');

  const permanentDeleteForm =
    document.getElementById('permanentDeleteForm');

  const permanentDeleteTarget =
    document.getElementById('permanentDeleteTarget');

  const permanentDeleteReason =
    document.getElementById('permanentDeleteReason');

  const permanentDeleteNameConfirm =
    document.getElementById('permanentDeleteNameConfirm');

  const closePermanentDeleteDialogButton =
    document.getElementById('closePermanentDeleteDialogButton');

  const cancelPermanentDeleteButton =
    document.getElementById('cancelPermanentDeleteButton');

  const confirmPermanentDeleteButton =
    document.getElementById('confirmPermanentDeleteButton');

  const permanentDeleteDialogMessage =
    document.getElementById('permanentDeleteDialogMessage');


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

  let currentHouse =
    null;

  let currentReturningReportToken =
    '';


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


  // ============================================================
  // BOOKING TIME NORMALIZER
  //
  // 기존 예약시간도 새 CARE 슬롯으로 자동 매핑
  //
  // 10:00 → 10:00
  // 13:00 → 13:00
  // 13:30 → 13:00
  // 16:00 → 16:00
  // 17:00 → 16:00
  // ============================================================

  function normalizeBookingTime(
    value
  ) {

    const time =
      String(
        value || ''
      ).slice(0, 5);


    const legacySlotMap = {
      '10:00': '10:00',
      '13:00': '13:00',
      '13:30': '13:00',
      '16:00': '16:00',
      '17:00': '16:00'
    };


    return legacySlotMap[time] || '';
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
      normalizeBookingTime(
        booking.booking_time
      );


    if (
      !time
    ) {

      return '';
    }


    return `${booking.booking_date}T${time}`;
  }


  function syncVisitScheduledAt() {

    if (
      !visitScheduledAt ||
      !visitDate ||
      !visitTimeSlot
    ) {

      return '';
    }


    const date =
      visitDate.value;


    const time =
      visitTimeSlot.value;


    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        date
      ) ||
      !VISIT_TIME_SLOTS.has(
        time
      )
    ) {

      visitScheduledAt.value =
        '';


      return '';
    }


    const value =
      `${date}T${time}`;


    visitScheduledAt.value =
      value;


    return value;
  }


  function applyVisitSlot(
    date,
    time
  ) {

    const normalizedTime =
      normalizeBookingTime(
        time
      );


    if (
      visitDate
    ) {

      visitDate.value =
        /^\d{4}-\d{2}-\d{2}$/.test(
          String(
            date || ''
          )
        )
          ? String(date)
          : '';
    }


    if (
      visitTimeSlot
    ) {

      visitTimeSlot.value =
        normalizedTime;
    }


    return syncVisitScheduledAt();
  }


  function formatBookingDateTime(
    booking
  ) {

    if (
      !booking?.booking_date ||
      !booking?.booking_time
    ) {

      return '요청 일정 없음';
    }


    const originalTime =
      String(
        booking.booking_time
      ).slice(0, 5);


    const input =
      `${booking.booking_date}T${originalTime}`;


    const date =
      new Date(input);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return (
        `${booking.booking_date} ${originalTime}`
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


    const canPermanentlyDelete =
      currentCustomerDeleted &&
      authContext?.profile?.role === 'admin';


    if (
      openDeleteCustomerButton
    ) {

      openDeleteCustomerButton.hidden =
        currentCustomerDeleted;


      openDeleteCustomerButton.disabled =
        currentCustomerDeleted;
    }


    if (
      permanentDeleteZone
    ) {

      permanentDeleteZone.hidden =
        !canPermanentlyDelete;
    }


    if (
      openPermanentDeleteButton
    ) {

      openPermanentDeleteButton.hidden =
        !canPermanentlyDelete;


      openPermanentDeleteButton.disabled =
        !canPermanentlyDelete;
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
        homeProfileForm,
        true
      );


      if (openReturningBookingButton) {
        openReturningBookingButton.disabled = true;
      }


      if (copyReturningBookingButton) {
        copyReturningBookingButton.disabled = true;
      }


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
        homeProfileForm,
        !currentHouse
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


  function isFinalHomeCheck6Q(
    diagnosis
  ) {

    const preference =
      Array.isArray(
        diagnosis?.management_preference
      )
        ? diagnosis.management_preference
        : [];


    const reviewValues =
      new Set([
        '네, 함께 확인해요',
        '가능하면 함께 볼게요',
        '저 혼자 확인해요',
        '1인 가구예요'
      ]);


    const managerValues =
      new Set([
        '제가 주로 해요',
        '가족과 함께 해요',
        '다른 가족이 주로 해요'
      ]);


    return (
      preference.length >= 2 &&
      reviewValues.has(
        String(
          preference[0] ||
          ''
        )
      ) &&
      managerValues.has(
        String(
          preference[1] ||
          ''
        )
      )
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


    const isFinal6Q =
      isFinalHomeCheck6Q(
        diagnosis
      );


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
      isFinal6Q

        ? [
            [
              '관심 공간',
              diagnosis.household
            ],
            [
              '신경 쓰이는 점',
              diagnosis.living_spaces
            ],
            [
              '현재 관리',
              diagnosis.contact_surfaces
            ],
            [
              '방문에서 확인',
              diagnosis.management_worries
            ],
            [
              '결과 확인',
              [
                diagnosis.management_preference?.[0]
              ].filter(Boolean)
            ],
            [
              '평소 집 관리',
              [
                diagnosis.management_preference?.[1]
              ].filter(Boolean)
            ]
          ]

        : isV2

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


  function buildReturningBookingUrl(
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
        '/booking.html',
        window.location.origin
      );

    url.searchParams.set(
      'report',
      publicToken
    );

    return url.toString();
  }


  async function copyReturningBookingLink() {
    const url =
      buildReturningBookingUrl(
        currentReturningReportToken
      );

    if (!url) {
      setMessage(
        returningBookingMessage,
        '발행된 Care Report가 없어 재예약 링크를 만들 수 없습니다.'
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setMessage(
        returningBookingMessage,
        '재예약 링크를 복사했습니다.',
        true
      );
    } catch (error) {
      console.error('MOOHAE returning booking copy error:', error);
      setMessage(
        returningBookingMessage,
        '링크를 복사하지 못했습니다.'
      );
    }
  }


  function renderHomeProfile(
    house,
    reports
  ) {

    currentHouse =
      house || null;

    if (!house) {
      homeIdInput.value = '';
      homeRowVersion.value = '';
      homeAddressInput.value = '';
      homeTypeSelect.value = '';
      homeAreaInput.value = '';
      homeNumber.textContent = '—';
      homePlan.textContent = '—';
      homeCycle.textContent = '—';
      homeNextCare.textContent = '—';
      setWorkflowState(homeProfileState, 'HOME 없음', 'wait');
      setFormDisabled(homeProfileForm, true);
    } else {
      homeIdInput.value = house.id || '';
      homeRowVersion.value = String(house.row_version || 1);
      homeAddressInput.value = house.address || '';
      homeTypeSelect.value = house.home_type || '';
      homeAreaInput.value = house.area_sqm ?? '';
      homeNumber.textContent = house.house_number ? `#${house.house_number}` : '—';
      homePlan.textContent = house.plan_code ? String(house.plan_code).replace('_PLUS', '+') : '미설정';
      homeCycle.textContent = house.cycle_total ? `${house.cycle_current || 0} / ${house.cycle_total}` : String(house.cycle_current || 0);
      homeNextCare.textContent = formatDate(house.next_care_date);
      setWorkflowState(homeProfileState, house.status === 'active' ? 'ACTIVE' : (house.status || '상태 미정'), house.status === 'active' ? 'done' : 'ready');
      setFormDisabled(homeProfileForm, currentCustomerDeleted);
    }

    const published =
      (reports || []).find(
        (report) =>
          report.report_status === 'published' &&
          UUID_PATTERN.test(report.public_token || '')
      ) || null;

    currentReturningReportToken =
      published?.public_token || '';

    const available =
      Boolean(currentReturningReportToken) &&
      !currentCustomerDeleted;

    returningBookingLinkState.textContent =
      published
        ? `발행 Report · ${formatDate(published.published_at || published.created_at)}`
        : '발행된 Care Report 없음';

    openReturningBookingButton.disabled = !available;
    copyReturningBookingButton.disabled = !available;

    setMessage(
      returningBookingMessage,
      published
        ? '이 링크로 기존 고객은 HOME CHECK 없이 바로 다음 CARE 일정을 선택할 수 있습니다.'
        : 'Care Report 발행 후 재예약 링크가 활성화됩니다.'
    );
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
          visit.visit_status === 'scheduled' ||
          visit.visit_status === 'in_progress'
      ) ||
      null;


    // ==========================================================
    // CURRENT VISIT STATE
    // ==========================================================

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


    // ==========================================================
    // NO CUSTOMER BOOKING REQUEST
    // ==========================================================

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
          : '고객 요청 일정이 없습니다. 관리자가 직접 방문 일시를 선택할 수 있습니다.';


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


    // ==========================================================
    // SHOW ORIGINAL CUSTOMER REQUEST
    // ==========================================================

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


    // ==========================================================
    // CUSTOMER REQUEST -> ADMIN FIXED SLOT
    //
    // 10:00 -> 10:00
    // 13:00 -> 13:00
    // 13:30 -> 13:00
    // 16:00 -> 16:00
    // 17:00 -> 16:00
    // ==========================================================

    const mappedTime =
      normalizeBookingTime(
        booking.booking_time
      );


    const bookingDate =
      String(
        booking.booking_date ||
        ''
      ).trim();


    const hasValidBooking =
      /^\d{4}-\d{2}-\d{2}$/.test(
        bookingDate
      ) &&
      VISIT_TIME_SLOTS.has(
        mappedTime
      );


    // ==========================================================
    // ALWAYS APPLY CUSTOMER REQUEST TO SELECTS
    //
    // 기존 방문 일정이 이미 있어도 고객이 요청한 날짜/시간은
    // STEP 02 선택창에 자동 반영한다.
    // ==========================================================

    if (
      hasValidBooking
    ) {

      applyVisitSlot(
        bookingDate,
        mappedTime
      );


      if (
        activeVisit
      ) {

        bookingRequestNote.textContent =
          '고객이 요청한 날짜와 시간이 아래 일정 선택창에 자동 반영되었습니다. 기존 방문 일정이 있으므로 변경 등록 전 일정을 확인해주세요.';

      } else {

        bookingRequestNote.textContent =
          '고객이 요청한 날짜와 시간이 아래 일정 선택창에 자동 반영되었습니다. 필요하면 변경 후 방문 일정을 등록하세요.';


        setWorkflowState(
          step2State,
          '고객 요청 있음',
          'ready'
        );
      }


      return;
    }


    bookingRequestNote.textContent =
      '고객의 요청 일정은 확인되었지만 시간 자동 선택에 실패했습니다. 방문 시간을 직접 선택해주세요.';
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
      bookingResult,
      houseResult
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
          ),


        window
          .moohaeSupabase
          .from('houses')
          .select(
            `
              id,
              house_number,
              customer_id,
              is_primary,
              plan_code,
              cycle_current,
              cycle_total,
              next_care_date,
              status,
              address,
              home_type,
              area_sqm,
              row_version
            `
          )
          .eq('customer_id', customerId)
          .eq('is_primary', true)
          .maybeSingle()
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


    if (
      houseResult.error
    ) {
      throw houseResult.error;
    }


    const customer =
      customerResult.data;


    const diagnoses =
      diagnosisResult.data || [];


    const visits =
      visitResult.data || [];


    const reports =
      reportResult.data || [];


    const house =
      houseResult.data || null;


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


    customerNameInput.value =
      customer.name || '';


    customerPhoneInput.value =
      customer.phone || '';


    customerAddressInput.value =
      customer.address || '';


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
    // MOOHAE HOME
    // ----------------------------------------------------------

    renderHomeProfile(
      house,
      reports
    );


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


    // ----------------------------------------------------------
    // PAGE DATA SNAPSHOT
    //
    // 같은 페이지의 보조 UI가 customers / care_visits를
    // 다시 조회하지 않도록, 이미 검증된 최신 조회 결과를
    // 읽기 전용 스냅샷 형태로 공유한다.
    // ----------------------------------------------------------

    window.moohaeCustomerDetailSnapshot =
      Object.freeze({
        customerId:
          customer.id,

        customer:
          Object.freeze({
            phone:
              customer.phone || '',

            address:
              customer.address || '',

            deletedAt:
              customer.deleted_at || null
          }),

        visits:
          Object.freeze(
            visits.map(
              (visit) =>
                Object.freeze({
                  id:
                    visit.id,

                  scheduled_at:
                    visit.scheduled_at,

                  visit_status:
                    visit.visit_status
                })
            )
          )
      });


    window.dispatchEvent(
      new CustomEvent(
        'moohae:customer-detail-loaded'
      )
    );


    detailMessage.textContent =
      '';
  }


  // ============================================================
  // MOOHAE HOME PROFILE SAVE
  // ============================================================

  homeProfileForm?.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();
      setMessage(homeProfileMessage, '');

      if (currentCustomerDeleted || !currentCustomer || !currentHouse) {
        setMessage(homeProfileMessage, '활성 고객의 HOME 정보만 수정할 수 있습니다.');
        return;
      }

      const houseId = homeIdInput.value.trim();
      const address = homeAddressInput.value.trim();
      const homeType = homeTypeSelect.value;
      const areaRaw = homeAreaInput.value.trim();
      const area = areaRaw ? Number(areaRaw) : null;
      const expectedVersion = Number(homeRowVersion.value);

      if (!UUID_PATTERN.test(houseId)) {
        setMessage(homeProfileMessage, 'HOME 식별 정보를 확인할 수 없습니다. 새로고침해주세요.');
        return;
      }

      if (address.length > 500) {
        setMessage(homeProfileMessage, 'HOME 주소는 500자 이내로 입력해주세요.');
        return;
      }

      if (homeType && !['apartment','villa','detached','officetel','other'].includes(homeType)) {
        setMessage(homeProfileMessage, '주거 형태를 확인해주세요.');
        return;
      }

      if (area !== null && (!Number.isFinite(area) || area <= 0 || area > 10000)) {
        setMessage(homeProfileMessage, '면적은 0보다 크고 10,000㎡ 이하로 입력해주세요.');
        return;
      }

      if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1) {
        setMessage(homeProfileMessage, 'HOME 버전 정보를 확인할 수 없습니다. 새로고침해주세요.');
        return;
      }

      setBusy(saveHomeProfileButton, true, '저장 중...', 'HOME 정보 저장');

      try {
        const { data, error } = await window.moohaeSupabase.rpc(
          'admin_update_customer_house_v1',
          {
            p_customer_id: customerId,
            p_house_id: houseId,
            p_address: address || null,
            p_home_type: homeType || null,
            p_area_sqm: area,
            p_expected_version: expectedVersion
          }
        );

        if (error) {
          if (error.code === '40001' || String(error.message || '').includes('house_data_changed')) {
            throw new Error('STALE_HOUSE_VERSION');
          }
          throw error;
        }

        const row = Array.isArray(data) ? data[0] : data;
        if (row?.row_version) homeRowVersion.value = String(row.row_version);
        setMessage(homeProfileMessage, 'HOME 정보가 저장되었습니다.', true);
        await loadCustomerData();
      } catch (error) {
        console.error('MOOHAE HOME update error:', error);
        setMessage(
          homeProfileMessage,
          error?.message === 'STALE_HOUSE_VERSION'
            ? '다른 화면에서 HOME 정보가 먼저 변경되었습니다. 최신 정보를 다시 불러온 뒤 저장해주세요.'
            : 'HOME 정보를 저장하지 못했습니다.'
        );
      } finally {
        setBusy(saveHomeProfileButton, false, '저장 중...', 'HOME 정보 저장');
      }
    }
  );


  openReturningBookingButton?.addEventListener(
    'click',
    () => {
      const url = buildReturningBookingUrl(currentReturningReportToken);
      if (!url || currentCustomerDeleted) return;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  );


  copyReturningBookingButton?.addEventListener(
    'click',
    copyReturningBookingLink
  );


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

        setMessage(
          managementMessage,
          '삭제된 고객은 수정할 수 없습니다. 먼저 복구해주세요.'
        );

        return;
      }


      const name =
        customerNameInput
          .value
          .trim();


      const phone =
        customerPhoneInput
          .value
          .trim();


      const address =
        customerAddressInput
          .value
          .trim();


      const status =
        statusSelect.value;


      const notes =
        notesInput.value.trim();


      const expectedVersion =
        Number(
          customerRowVersion.value
        );


      if (
        !name
      ) {

        setMessage(
          managementMessage,
          '고객 이름을 입력해주세요.'
        );

        customerNameInput.focus();

        return;
      }


      if (
        name.length > 100
      ) {

        setMessage(
          managementMessage,
          '고객 이름은 100자 이내로 입력해주세요.'
        );

        return;
      }


      if (
        phone.length > 50
      ) {

        setMessage(
          managementMessage,
          '연락처는 50자 이내로 입력해주세요.'
        );

        return;
      }


      if (
        phone &&
        !/^[0-9+\-\s()]{9,20}$/.test(
          phone
        )
      ) {

        setMessage(
          managementMessage,
          '연락처 형식을 확인해주세요.'
        );

        return;
      }


      if (
        address.length > 500
      ) {

        setMessage(
          managementMessage,
          '주소는 500자 이내로 입력해주세요.'
        );

        return;
      }


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
        '고객 정보 저장'
      );


      try {

        const {
          data,
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
                  name,

                p_phone:
                  phone ||
                  null,

                p_address:
                  address ||
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
            error.code === '40001' ||
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


          if (
            error.code === '23505'
          ) {

            throw new Error(
              'DUPLICATE_CUSTOMER_PHONE'
            );
          }


          throw error;
        }


        if (
          data?.row_version
        ) {

          customerRowVersion.value =
            String(
              data.row_version
            );
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


        if (
          error?.message ===
          'STALE_CUSTOMER_VERSION'
        ) {

          setMessage(
            managementMessage,
            '다른 화면에서 고객 정보가 먼저 수정되었습니다. 최신 정보를 다시 불러옵니다.'
          );

          await loadCustomerData();


        } else if (
          error?.message ===
          'DUPLICATE_CUSTOMER_PHONE'
        ) {

          setMessage(
            managementMessage,
            '이미 등록된 연락처입니다. 다른 고객의 연락처와 중복되지 않는지 확인해주세요.'
          );

        } else {

          setMessage(
            managementMessage,
            '고객 정보를 저장하지 못했습니다.'
          );
        }


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
        syncVisitScheduledAt();


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
          '방문 날짜와 CARE 시간을 선택해주세요.'
        );


        return;
      }


      if (
        !VISIT_TIME_SLOTS.has(
          visitTimeSlot?.value || ''
        )
      ) {

        setMessage(
          visitMessage,
          '방문 시간은 10:00–12:30, 13:00–15:30, 16:00–18:30 중에서 선택해주세요.'
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


        syncVisitScheduledAt();


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


  if (
    visitDate
  ) {

    visitDate.addEventListener(
      'change',
      syncVisitScheduledAt
    );
  }


  if (
    visitTimeSlot
  ) {

    visitTimeSlot.addEventListener(
      'change',
      syncVisitScheduledAt
    );
  }


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
  // SOFT DELETE
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
  // PERMANENT DELETE
  // ============================================================

  function closePermanentDeleteDialog() {

    if (
      permanentDeleteDialog?.open
    ) {

      permanentDeleteDialog.close();
    }


    permanentDeleteForm?.reset();


    setMessage(
      permanentDeleteDialogMessage,
      ''
    );
  }


  async function removeStorageFiles(
    mediaRows
  ) {

    const groups =
      new Map();


    (
      mediaRows || []
    ).forEach(
      (row) => {

        const bucket =
          String(
            row?.storage_bucket || ''
          ).trim();


        const path =
          String(
            row?.storage_path || ''
          ).trim();


        if (
          !bucket ||
          !path
        ) {

          throw new Error(
            'INVALID_MEDIA_PATH'
          );
        }


        if (
          !groups.has(
            bucket
          )
        ) {

          groups.set(
            bucket,
            []
          );
        }


        groups
          .get(bucket)
          .push(path);
      }
    );


    for (
      const [bucket, paths]
      of groups.entries()
    ) {

      for (
        let index = 0;
        index < paths.length;
        index += 100
      ) {

        const batch =
          paths.slice(
            index,
            index + 100
          );


        const {
          error
        } =
          await window
            .moohaeSupabase
            .storage
            .from(bucket)
            .remove(batch);


        if (
          error
        ) {

          throw error;
        }
      }
    }
  }


  openPermanentDeleteButton?.addEventListener(
    'click',
    () => {

      if (
        !currentCustomer ||
        !currentCustomerDeleted ||
        authContext?.profile?.role !== 'admin'
      ) {

        return;
      }


      permanentDeleteTarget.textContent =
        `${currentCustomer.name || '이름 없음'} 고객과 연결된 모든 데이터를 영구 삭제합니다.`;


      permanentDeleteForm.reset();


      setMessage(
        permanentDeleteDialogMessage,
        ''
      );


      permanentDeleteDialog.showModal();
    }
  );


  closePermanentDeleteDialogButton?.addEventListener(
    'click',
    closePermanentDeleteDialog
  );


  cancelPermanentDeleteButton?.addEventListener(
    'click',
    closePermanentDeleteDialog
  );


  permanentDeleteDialog?.addEventListener(
    'cancel',
    (event) => {

      event.preventDefault();


      closePermanentDeleteDialog();
    }
  );


  permanentDeleteForm?.addEventListener(
    'submit',
    async (
      event
    ) => {

      event.preventDefault();


      if (
        !currentCustomer ||
        !currentCustomerDeleted ||
        authContext?.profile?.role !== 'admin'
      ) {

        setMessage(
          permanentDeleteDialogMessage,
          '삭제 처리된 고객만 관리자 권한으로 영구 삭제할 수 있습니다.'
        );


        return;
      }


      const reason =
        permanentDeleteReason
          .value
          .trim();


      const confirmName =
        permanentDeleteNameConfirm
          .value
          .trim();


      const expectedName =
        String(
          currentCustomer.name || ''
        ).trim();


      if (
        reason.length < 2
      ) {

        setMessage(
          permanentDeleteDialogMessage,
          '영구 삭제 사유를 2자 이상 입력해주세요.'
        );


        return;
      }


      if (
        !expectedName ||
        confirmName !== expectedName
      ) {

        setMessage(
          permanentDeleteDialogMessage,
          `고객명 “${expectedName || '이름 없음'}”을 정확히 입력해주세요.`
        );


        return;
      }


      setBusy(
        confirmPermanentDeleteButton,
        true,
        '영구 삭제 중...',
        '영구 삭제'
      );


      if (
        openPermanentDeleteButton
      ) {

        openPermanentDeleteButton.disabled =
          true;
      }


      try {

        setMessage(
          permanentDeleteDialogMessage,
          'CARE 사진 파일을 확인하고 있습니다.'
        );


        const {
          data: mediaRows,
          error: prepareError
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_prepare_permanent_customer_delete',
              {
                p_customer_id:
                  customerId
              }
            );


        if (
          prepareError
        ) {

          throw prepareError;
        }


        await removeStorageFiles(
          Array.isArray(
            mediaRows
          )
            ? mediaRows
            : []
        );


        const {
          error: mediaCleanupError
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_delete_customer_care_media_metadata',
              {
                p_customer_id:
                  customerId
              }
            );


        if (
          mediaCleanupError
        ) {

          throw mediaCleanupError;
        }


        const {
          error: deleteError
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_permanently_delete_customer',
              {
                p_customer_id:
                  customerId,

                p_reason:
                  reason
              }
            );


        if (
          deleteError
        ) {

          throw deleteError;
        }


        setMessage(
          permanentDeleteDialogMessage,
          '고객 데이터가 영구 삭제되었습니다.',
          true
        );


        window.setTimeout(
          () => {

            window.location.replace(
              './dashboard.html'
            );
          },
          650
        );


      } catch (
        error
      ) {

        console.error(
          'MOOHAE permanent customer delete error:',
          error
        );


        const message =
          String(
            error?.message || ''
          );


        if (
          message.includes(
            'CARE_MEDIA_STILL_EXISTS'
          )
        ) {

          setMessage(
            permanentDeleteDialogMessage,
            'CARE 사진 정리가 완료되지 않아 영구 삭제를 중단했습니다. 다시 시도해주세요.'
          );


        } else {

          setMessage(
            permanentDeleteDialogMessage,
            '영구 삭제를 완료하지 못했습니다. 데이터 보호를 위해 작업을 중단했습니다.'
          );
        }


      } finally {

        setBusy(
          confirmPermanentDeleteButton,
          false,
          '영구 삭제 중...',
          '영구 삭제'
        );


        if (
          openPermanentDeleteButton
        ) {

          openPermanentDeleteButton.disabled =
            !currentCustomerDeleted ||
            authContext?.profile?.role !== 'admin';
        }
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