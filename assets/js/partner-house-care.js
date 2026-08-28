(() => {
  'use strict';


  // ============================================================
  // MOOHAE PARTNER / FIELD CARE
  //
  // FLOW
  // HOUSE
  // → CHECK
  // → CARE
  // → PROOF
  // → COMPLETE
  // → CUSTOMER DETAIL / REPORT EDITOR
  //
  // SECURITY
  // - HOUSE DATA 직접 WRITE 금지
  // - 저장은 partner_* RPC 사용
  // - 로그인 + staff profile 검증
  // - 완료 성공 전에는 리포트 화면으로 이동하지 않음
  // ============================================================


  // ============================================================
  // CONSTANTS
  // ============================================================

  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  const ACTIONS =
    new Set([
      'CARE',
      'CHECK',
      'NONE'
    ]);


  const CONDITIONS =
    new Set([
      'MAINTAIN',
      'WATCH',
      'CARE_RECOMMENDED'
    ]);


  const NEXT_ACTIONS =
    new Set([
      'NEXT_CHECK',
      'NEXT_CARE',
      'NONE'
    ]);


  // ============================================================
  // DOM
  // ============================================================

  const partnerIdentity =
    document.getElementById(
      'partnerIdentity'
    );


  const logoutButton =
    document.getElementById(
      'logoutButton'
    );


  const pageLoading =
    document.getElementById(
      'pageLoading'
    );


  const pageError =
    document.getElementById(
      'pageError'
    );


  const pageErrorMessage =
    document.getElementById(
      'pageErrorMessage'
    );


  const partnerContent =
    document.getElementById(
      'partnerContent'
    );


  const houseNumber =
    document.getElementById(
      'houseNumber'
    );


  const planBadge =
    document.getElementById(
      'planBadge'
    );


  const houseAddress =
    document.getElementById(
      'houseAddress'
    );


  const careCycle =
    document.getElementById(
      'careCycle'
    );


  const nextCareDate =
    document.getElementById(
      'nextCareDate'
    );


  const visitSchedule =
    document.getElementById(
      'visitSchedule'
    );


  const visitArea =
    document.getElementById(
      'visitArea'
    );


  const lastRecordCount =
    document.getElementById(
      'lastRecordCount'
    );


  const lastRecordList =
    document.getElementById(
      'lastRecordList'
    );


  const priorityList =
    document.getElementById(
      'priorityList'
    );


  const startCheckButton =
    document.getElementById(
      'startCheckButton'
    );


  const checkObjectList =
    document.getElementById(
      'checkObjectList'
    );


  const goCareButton =
    document.getElementById(
      'goCareButton'
    );


  const checkMessage =
    document.getElementById(
      'checkMessage'
    );


  const careObjectList =
    document.getElementById(
      'careObjectList'
    );


  const emptyCareState =
    document.getElementById(
      'emptyCareState'
    );


  const goProofButton =
    document.getElementById(
      'goProofButton'
    );


  const careMessage =
    document.getElementById(
      'careMessage'
    );


  const careVisitSelect =
    document.getElementById(
      'careVisitSelect'
    );


  const nextPriorityList =
    document.getElementById(
      'nextPriorityList'
    );


  const partnerFinalNote =
    document.getElementById(
      'partnerFinalNote'
    );


  const completeVisitButton =
    document.getElementById(
      'completeVisitButton'
    );


  const proofMessage =
    document.getElementById(
      'proofMessage'
    );


  // ============================================================
  // STATE
  // ============================================================

  let authContext =
    null;


  let customerId =
    null;


  let houseId =
    null;


  let houseCustomerId =
    null;


  let snapshot =
    null;


  let currentVisit =
    null;


  let currentRecords =
    new Map();


  let latestRecords =
    new Map();


  // ============================================================
  // DOM SAFETY
  // ============================================================

  function assertRequiredDom() {

    const required = [
      pageLoading,
      pageError,
      pageErrorMessage,
      partnerContent,
      houseNumber,
      planBadge,
      houseAddress,
      careCycle,
      nextCareDate,
      visitSchedule,
      visitArea,
      lastRecordCount,
      lastRecordList,
      priorityList,
      startCheckButton,
      checkObjectList,
      goCareButton,
      checkMessage,
      careObjectList,
      emptyCareState,
      goProofButton,
      careMessage,
      careVisitSelect,
      nextPriorityList,
      partnerFinalNote,
      completeVisitButton,
      proofMessage
    ];


    if (
      required.some(
        (node) =>
          !node
      )
    ) {

      throw new Error(
        'PARTNER_VIEW_DOM_MISMATCH'
      );
    }
  }


  // ============================================================
  // HELPERS
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


    node.classList.toggle(
      'error',
      Boolean(text) &&
      !ok
    );
  }


  function formatDate(
    value
  ) {

    if (
      !value
    ) {

      return '미정';
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

      return '미정';
    }


    return new Intl.DateTimeFormat(
      'ko-KR',
      {
        year:
          'numeric',

        month:
          '2-digit',

        day:
          '2-digit'
      }
    ).format(
      date
    );
  }


  function formatDateTime(
    value
  ) {

    if (
      !value
    ) {

      return '일정 미정';
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

      return '일정 미정';
    }


    return new Intl.DateTimeFormat(
      'ko-KR',
      {
        month:
          '2-digit',

        day:
          '2-digit',

        weekday:
          'short',

        hour:
          '2-digit',

        minute:
          '2-digit'
      }
    ).format(
      date
    );
  }


  function formatHouseNumber(
    value
  ) {

    const number =
      Number(
        value
      );


    if (
      !Number.isFinite(
        number
      ) ||
      number < 1
    ) {

      return 'HOUSE #—';
    }


    return (
      `HOUSE #${String(
        number
      ).padStart(
        5,
        '0'
      )}`
    );
  }


  function normalizeArray(
    value
  ) {

    return Array.isArray(
      value
    )
      ? value.map(
          String
        )
      : [];
  }


  function getObject(
    objectId
  ) {

    return (
      snapshot?.objects ||
      []
    ).find(
      (object) =>
        object.id ===
        objectId
    ) || null;
  }


  // ============================================================
  // STATE PRESENTATION
  // ============================================================

  function getStatePresentation(
    record
  ) {

    if (
      !record
    ) {

      return {
        className:
          'state-gray',

        label:
          '기록 없음'
      };
    }


    if (
      record.result ===
      'CARE_COMPLETED'
    ) {

      return {
        className:
          'state-green',

        label:
          'CARE 완료'
      };
    }


    if (
      record.condition_status ===
      'CARE_RECOMMENDED'
    ) {

      return {
        className:
          'state-orange',

        label:
          'CARE 권장'
      };
    }


    if (
      record.condition_status ===
      'WATCH'
    ) {

      return {
        className:
          'state-amber',

        label:
          '관찰'
      };
    }


    if (
      record.result ===
        'CHECK_COMPLETED' ||

      record.condition_status ===
        'MAINTAIN'
    ) {

      return {
        className:
          'state-blue',

        label:
          record.condition_status ===
            'MAINTAIN'
            ? '유지'
            : 'CHECK 완료'
      };
    }


    if (
      record.action ===
        'NONE' ||

      record.result ===
        'NONE'
    ) {

      return {
        className:
          'state-gray',

        label:
          '미진행'
      };
    }


    return {
      className:
        'state-gray',

      label:
        '기록 중'
    };
  }


  // ============================================================
  // AUTH
  // ============================================================

  async function requireAuthorizedStaff() {

    if (
      !window
        .moohaeSupabaseConfigReady ||

      !window
        .moohaeSupabase
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
  // ROUTE / HOUSE RESOLUTION
  //
  // 지원
  //
  // house-care.html?id=CUSTOMER_UUID
  // house-care.html?customer=CUSTOMER_UUID
  // house-care.html?house=HOUSE_UUID
  // ============================================================

  async function resolveHouse() {

    const params =
      new URLSearchParams(
        window.location.search
      );


    const houseParam =
      params.get(
        'house'
      );


    const customerParam =
      params.get(
        'id'
      ) ||
      params.get(
        'customer'
      );


    // ----------------------------------------------------------
    // HOUSE UUID로 직접 접근
    // ----------------------------------------------------------

    if (
      houseParam &&
      UUID_PATTERN.test(
        houseParam
      )
    ) {

      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .from(
            'houses'
          )
          .select(
            'id, customer_id, is_primary, status'
          )
          .eq(
            'id',
            houseParam
          )
          .maybeSingle();


      if (
        error ||
        !data
      ) {

        throw (
          error ||
          new Error(
            'HOUSE_NOT_FOUND'
          )
        );
      }


      houseId =
        data.id;


      houseCustomerId =
        data.customer_id;


      customerId =
        data.customer_id;


      return;
    }


    // ----------------------------------------------------------
    // CUSTOMER UUID로 접근
    // ----------------------------------------------------------

    if (
      !customerParam ||
      !UUID_PATTERN.test(
        customerParam
      )
    ) {

      throw new Error(
        'INVALID_ROUTE'
      );
    }


    customerId =
      customerParam;


    const {
      data,
      error
    } =
      await window
        .moohaeSupabase
        .from(
          'houses'
        )
        .select(
          'id, customer_id, is_primary, status'
        )
        .eq(
          'customer_id',
          customerId
        )
        .eq(
          'is_primary',
          true
        )
        .maybeSingle();


    if (
      error ||
      !data
    ) {

      throw (
        error ||
        new Error(
          'HOUSE_NOT_FOUND'
        )
      );
    }


    houseId =
      data.id;


    houseCustomerId =
      data.customer_id;
  }


  // ============================================================
  // HOUSE SNAPSHOT
  // ============================================================

  async function loadSnapshot() {

    const {
      data,
      error
    } =
      await window
        .moohaeSupabase
        .rpc(
          'partner_get_house_snapshot',
          {
            p_house_id:
              houseId
          }
        );


    if (
      error
    ) {

      throw error;
    }


    if (
      !data?.house ||
      !Array.isArray(
        data.objects
      )
    ) {

      throw new Error(
        'INVALID_HOUSE_SNAPSHOT'
      );
    }


    snapshot =
      data;


    latestRecords =
      new Map();


    for (
      const record
      of data.latest_records ||
      []
    ) {

      if (
        record?.object_id
      ) {

        latestRecords.set(
          record.object_id,
          record
        );
      }
    }
  }


  // ============================================================
  // CURRENT VISIT
  // ============================================================

  async function loadCurrentVisit() {

    const {
      data,
      error
    } =
      await window
        .moohaeSupabase
        .from(
          'care_visits'
        )
        .select(
          `
            id,
            customer_id,
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
          houseCustomerId
        )
        .in(
          'visit_status',
          [
            'in_progress',
            'scheduled'
          ]
        )
        .order(
          'scheduled_at',
          {
            ascending:
              true,

            nullsFirst:
              false
          }
        )
        .limit(
          20
        );


    if (
      error
    ) {

      throw error;
    }


    const visits =
      Array.isArray(
        data
      )
        ? data
        : [];


    currentVisit =
      visits.find(
        (visit) =>
          visit.visit_status ===
          'in_progress'
      ) ||
      visits[0] ||
      null;


    if (
      !currentVisit
    ) {

      throw new Error(
        'NO_ACTIVE_VISIT'
      );
    }


    careVisitSelect.replaceChildren();


    const option =
      document.createElement(
        'option'
      );


    option.value =
      currentVisit.id;


    option.textContent =
      formatDateTime(
        currentVisit.scheduled_at
      );


    careVisitSelect.appendChild(
      option
    );


    careVisitSelect.value =
      currentVisit.id;


    careVisitSelect.dispatchEvent(
      new Event(
        'change',
        {
          bubbles:
            true
        }
      )
    );
  }


  // ============================================================
  // CURRENT CARE RECORDS
  // ============================================================

  async function loadCurrentRecords() {

    const {
      data,
      error
    } =
      await window
        .moohaeSupabase
        .from(
          'care_records'
        )
        .select(
          `
            id,
            visit_id,
            house_id,
            object_id,
            action,
            condition_status,
            result,
            next_action,
            dod_completed,
            partner_note,
            completed_at,
            updated_at
          `
        )
        .eq(
          'visit_id',
          currentVisit.id
        );


    if (
      error
    ) {

      throw error;
    }


    currentRecords =
      new Map();


    for (
      const record
      of data ||
      []
    ) {

      currentRecords.set(
        record.object_id,
        record
      );
    }
  }


  // ============================================================
  // HOUSE SUMMARY
  // ============================================================

  function renderHouseSummary() {

    const house =
      snapshot.house;


    houseNumber.textContent =
      formatHouseNumber(
        house.house_number
      );


    planBadge.textContent =
      house.plan_code
        ? house.plan_code.replace(
            '_PLUS',
            '+'
          )
        : '플랜 미설정';


    houseAddress.textContent =
      house.address ||
      '주소 미등록';


    const current =
      Number(
        house.cycle_current
      ) || 0;


    const total =
      Number(
        house.cycle_total
      );


    careCycle.textContent =
      Number.isFinite(
        total
      ) &&
      total > 0

        ? (
            `CARE ${String(
              current
            ).padStart(
              2,
              '0'
            )} / ${String(
              total
            ).padStart(
              2,
              '0'
            )}`
          )

        : (
            `CARE ${String(
              current
            ).padStart(
              2,
              '0'
            )}`
          );


    nextCareDate.textContent =
      formatDate(
        house.next_care_date
      );


    visitSchedule.textContent =
      formatDateTime(
        currentVisit.scheduled_at
      );


    visitArea.textContent =
      currentVisit.care_area ||
      '케어 공간 미입력';
  }


  // ============================================================
  // LAST RECORD
  // ============================================================

  function renderLastRecords() {

    lastRecordList.replaceChildren();


    const records =
      [
        ...latestRecords.values()
      ].sort(
        (a, b) =>
          (
            a.object_display_order ||
            0
          ) -
          (
            b.object_display_order ||
            0
          )
      );


    lastRecordCount.textContent =
      String(
        records.length
      );


    if (
      records.length ===
      0
    ) {

      lastRecordList.appendChild(
        make(
          'p',
          'record-state',
          '아직 HOUSE CARE 기록이 없습니다.'
        )
      );


      return;
    }


    for (
      const record
      of records
    ) {

      const row =
        make(
          'div',
          'status-row'
        );


      const main =
        make(
          'div',
          'status-row-main'
        );


      main.append(
        make(
          'strong',
          '',
          record.object_name ||
          '관리 대상'
        ),

        make(
          'span',
          '',
          record.space_name ||
          ''
        )
      );


      const state =
        getStatePresentation(
          record
        );


      row.append(
        main,

        make(
          'span',
          `state-pill ${state.className}`,
          state.label
        )
      );


      lastRecordList.appendChild(
        row
      );
    }
  }


  // ============================================================
  // PRIORITY
  // ============================================================

  function getPriorityObjects() {

    const objects =
      snapshot.objects ||
      [];


    const getWeight =
      (record) => {

        if (
          record?.next_action ===
          'NEXT_CARE'
        ) {

          return 0;
        }


        if (
          record?.next_action ===
          'NEXT_CHECK'
        ) {

          return 1;
        }


        if (
          !record
        ) {

          return 2;
        }


        return 3;
      };


    return [
      ...objects
    ]
      .sort(
        (a, b) => {

          const aRecord =
            latestRecords.get(
              a.id
            );


          const bRecord =
            latestRecords.get(
              b.id
            );


          const diff =
            getWeight(
              aRecord
            ) -
            getWeight(
              bRecord
            );


          if (
            diff !==
            0
          ) {

            return diff;
          }


          return (
            (
              a.display_order ||
              0
            ) -
            (
              b.display_order ||
              0
            )
          );
        }
      )
      .slice(
        0,
        3
      );
  }


  function renderPriority() {

    priorityList.replaceChildren();


    const priorities =
      getPriorityObjects();


    for (
      const object
      of priorities
    ) {

      const record =
        latestRecords.get(
          object.id
        );


      const item =
        document.createElement(
          'li'
        );


      item.append(
        make(
          'strong',
          '',
          object.object_name
        ),

        make(
          'span',
          '',
          record?.next_action ===
            'NEXT_CARE'

            ? '다음 CARE'

            : record?.next_action ===
                'NEXT_CHECK'

                ? '다음 CHECK'

                : '첫 기록'
        )
      );


      priorityList.appendChild(
        item
      );
    }
  }


  // ============================================================
  // STEP CONTROL
  // ============================================================

  function goToStep(
    step
  ) {

    document
      .querySelectorAll(
        '.partner-step'
      )
      .forEach(
        (section) => {

          const active =
            section.dataset.step ===
            step;


          section.hidden =
            !active;


          section.classList.toggle(
            'is-active',
            active
          );
        }
      );


    document
      .querySelectorAll(
        '.step-button'
      )
      .forEach(
        (button) => {

          button.classList.toggle(
            'is-active',
            button.dataset.stepTarget ===
              step
          );
        }
      );


    if (
      step ===
      'care'
    ) {

      renderCareObjects();
    }


    if (
      step ===
      'proof'
    ) {

      renderNextPriority();
    }


    window.scrollTo({
      top:
        0,

      behavior:
        'smooth'
    });
  }


  // ============================================================
  // CHOICE BUTTON
  // ============================================================

  function createChoiceButton(
    label,
    value,
    group,
    selectedValue
  ) {

    const button =
      make(
        'button',
        'choice-button',
        label
      );


    button.type =
      'button';


    button.dataset.value =
      value;


    button.dataset.choiceGroup =
      group;


    if (
      selectedValue ===
      value
    ) {

      button.classList.add(
        'is-selected'
      );
    }


    button.addEventListener(
      'click',
      () => {

        const container =
          button.closest(
            '.choice-grid'
          );


        if (
          !container
        ) {

          return;
        }


        container
          .querySelectorAll(
            '.choice-button'
          )
          .forEach(
            (item) => {

              item.classList.remove(
                'is-selected'
              );
            }
          );


        button.classList.add(
          'is-selected'
        );
      }
    );


    return button;
  }


  function getSelectedChoice(
    card,
    group
  ) {

    return (
      card.querySelector(
        `.choice-button[data-choice-group="${group}"].is-selected`
      )?.dataset.value ||
      ''
    );
  }


  // ============================================================
  // CHECK OBJECTS
  // ============================================================

  function renderCheckObjects() {

    checkObjectList.replaceChildren();


    const objects =
      [
        ...(snapshot.objects || [])
      ].sort(
        (a, b) =>
          (
            a.display_order ||
            0
          ) -
          (
            b.display_order ||
            0
          )
      );


    for (
      const object
      of objects
    ) {

      const record =
        currentRecords.get(
          object.id
        );


      const card =
        make(
          'article',
          'object-card'
        );


      card.dataset.objectId =
        object.id;


      const head =
        make(
          'div',
          'object-card-head'
        );


      const title =
        make(
          'div'
        );


      title.append(
        make(
          'strong',
          '',
          object.object_name
        ),

        make(
          'span',
          'object-space',
          object.space_name
        )
      );


      if (
        record
      ) {

        const state =
          getStatePresentation(
            record
          );


        head.append(
          title,

          make(
            'span',
            `state-pill ${state.className}`,
            state.label
          )
        );

      } else {

        head.append(
          title,

          make(
            'span',
            'state-pill state-gray',
            '미기록'
          )
        );
      }


      card.appendChild(
        head
      );


      // --------------------------------------------------------
      // ACTION
      // --------------------------------------------------------

      const actionBlock =
        make(
          'div',
          'choice-block'
        );


      actionBlock.appendChild(
        make(
          'div',
          'choice-label',
          'ACTION'
        )
      );


      const actionGrid =
        make(
          'div',
          'choice-grid'
        );


      actionGrid.append(
        createChoiceButton(
          'CARE',
          'CARE',
          'action',
          record?.action
        ),

        createChoiceButton(
          'CHECK',
          'CHECK',
          'action',
          record?.action
        ),

        createChoiceButton(
          'NONE',
          'NONE',
          'action',
          record?.action
        )
      );


      actionBlock.appendChild(
        actionGrid
      );


      // --------------------------------------------------------
      // STATUS
      // --------------------------------------------------------

      const conditionBlock =
        make(
          'div',
          'choice-block'
        );


      conditionBlock.appendChild(
        make(
          'div',
          'choice-label',
          'STATUS'
        )
      );


      const conditionGrid =
        make(
          'div',
          'choice-grid'
        );


      conditionGrid.append(
        createChoiceButton(
          '유지',
          'MAINTAIN',
          'condition',
          record?.condition_status
        ),

        createChoiceButton(
          '관찰',
          'WATCH',
          'condition',
          record?.condition_status
        ),

        createChoiceButton(
          'CARE 권장',
          'CARE_RECOMMENDED',
          'condition',
          record?.condition_status
        )
      );


      conditionBlock.appendChild(
        conditionGrid
      );


      // --------------------------------------------------------
      // NEXT
      // --------------------------------------------------------

      const nextBlock =
        make(
          'div',
          'choice-block'
        );


      nextBlock.appendChild(
        make(
          'div',
          'choice-label',
          'NEXT'
        )
      );


      const nextGrid =
        make(
          'div',
          'choice-grid'
        );


      nextGrid.append(
        createChoiceButton(
          'NEXT CHECK',
          'NEXT_CHECK',
          'next',
          record?.next_action
        ),

        createChoiceButton(
          'NEXT CARE',
          'NEXT_CARE',
          'next',
          record?.next_action
        ),

        createChoiceButton(
          '없음',
          'NONE_NEXT',
          'next',
          record?.next_action ===
            'NONE'

            ? 'NONE_NEXT'
            : ''
        )
      );


      nextBlock.appendChild(
        nextGrid
      );


      const save =
        make(
          'button',
          'object-save-button',
          record
            ? '기록 업데이트'
            : '기록 저장'
        );


      save.type =
        'button';


      const message =
        make(
          'p',
          'record-state'
        );


      save.addEventListener(
        'click',
        async () => {

          await saveCheckRecord(
            object,
            card,
            save,
            message
          );
        }
      );


      card.append(
        actionBlock,
        conditionBlock,
        nextBlock,
        save,
        message
      );


      checkObjectList.appendChild(
        card
      );
    }
  }


  // ============================================================
  // SAVE CHECK RECORD
  // ============================================================

  async function saveCheckRecord(
    object,
    card,
    button,
    message
  ) {

    setMessage(
      checkMessage,
      ''
    );


    const action =
      getSelectedChoice(
        card,
        'action'
      );


    let condition =
      getSelectedChoice(
        card,
        'condition'
      );


    let next =
      getSelectedChoice(
        card,
        'next'
      );


    if (
      !ACTIONS.has(
        action
      )
    ) {

      message.textContent =
        'ACTION을 선택해주세요.';


      message.className =
        'record-state error';


      return;
    }


    if (
      action !==
        'NONE' &&

      !CONDITIONS.has(
        condition
      )
    ) {

      message.textContent =
        'STATUS를 선택해주세요.';


      message.className =
        'record-state error';


      return;
    }


    if (
      action ===
      'NONE'
    ) {

      condition =
        null;


      next =
        'NONE';

    } else {

      next =
        next ===
          'NONE_NEXT'
          ? 'NONE'
          : next;


      if (
        !NEXT_ACTIONS.has(
          next
        )
      ) {

        message.textContent =
          'NEXT를 선택해주세요.';


        message.className =
          'record-state error';


        return;
      }
    }


    const existing =
      currentRecords.get(
        object.id
      );


    const result =
      action ===
        'CHECK'

        ? 'CHECK_COMPLETED'

        : action ===
            'NONE'

            ? 'NONE'
            : null;


    button.disabled =
      true;


    message.textContent =
      '저장 중...';


    message.className =
      'record-state';


    try {

      const {
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            'partner_save_care_record',
            {
              p_visit_id:
                currentVisit.id,

              p_house_id:
                houseId,

              p_object_id:
                object.id,

              p_action:
                action,

              p_condition_status:
                condition,

              p_result:
                result,

              p_next_action:
                next,

              p_dod_completed:
                normalizeArray(
                  existing?.dod_completed
                ),

              p_partner_note:
                existing?.partner_note ||
                null
            }
          );


      if (
        error
      ) {

        throw error;
      }


      await loadCurrentRecords();


      setMessage(
        checkMessage,

        action ===
          'CARE'

          ? `${object.object_name} · CHECK 저장 완료. CARE 단계에서 완료해주세요.`

          : `${object.object_name} · 기록이 저장되었습니다.`,

        true
      );


      renderCheckObjects();

    } catch (
      error
    ) {

      console.error(
        'MOOHAE partner CHECK save error:',
        error
      );


      setMessage(
        checkMessage,
        `${object.object_name} · 기록을 저장하지 못했습니다.`
      );


      message.textContent =
        '';

    } finally {

      button.disabled =
        false;
    }
  }


  // ============================================================
  // CARE OBJECTS
  // ============================================================

  function renderCareObjects() {

    careObjectList.replaceChildren();


    const careRecords =
      [
        ...currentRecords.values()
      ].filter(
        (record) =>
          record.action ===
          'CARE'
      );


    emptyCareState.hidden =
      careRecords.length !==
      0;


    if (
      careRecords.length ===
      0
    ) {

      return;
    }


    for (
      const record
      of careRecords
    ) {

      const object =
        getObject(
          record.object_id
        );


      if (
        !object
      ) {

        continue;
      }


      const card =
        make(
          'article',
          'object-card'
        );


      const head =
        make(
          'div',
          'object-card-head'
        );


      const title =
        make(
          'div'
        );


      title.append(
        make(
          'strong',
          '',
          object.object_name
        ),

        make(
          'span',
          'object-space',
          object.space_name
        )
      );


      const state =
        getStatePresentation(
          record
        );


      head.append(
        title,

        make(
          'span',
          `state-pill ${state.className}`,
          state.label
        )
      );


      card.appendChild(
        head
      );


      const required =
        normalizeArray(
          object.definition_of_done
        );


      const completed =
        new Set(
          normalizeArray(
            record.dod_completed
          )
        );


      const list =
        make(
          'div',
          'dod-list'
        );


      if (
        required.length ===
        0
      ) {

        list.appendChild(
          make(
            'div',
            'empty-block',
            '현재 완료 기준이 별도로 설정되지 않은 항목입니다.'
          )
        );

      } else {

        for (
          const item
          of required
        ) {

          const label =
            make(
              'label',
              'dod-item'
            );


          const input =
            document.createElement(
              'input'
            );


          input.type =
            'checkbox';


          input.value =
            item;


          input.checked =
            completed.has(
              item
            );


          label.append(
            input,

            make(
              'span',
              '',
              item
            )
          );


          list.appendChild(
            label
          );
        }
      }


      const complete =
        make(
          'button',
          'care-complete-button',
          record.result ===
            'CARE_COMPLETED'

            ? 'CARE COMPLETE · 저장됨'

            : 'CARE COMPLETE'
        );


      complete.type =
        'button';


      const updateButtonState =
        () => {

          const checked =
            [
              ...list.querySelectorAll(
                'input[type="checkbox"]:checked'
              )
            ].map(
              (input) =>
                input.value
            );


          complete.disabled =
            required.length >
              0 &&
            checked.length !==
              required.length;
        };


      list.addEventListener(
        'change',
        updateButtonState
      );


      updateButtonState();


      const message =
        make(
          'p',
          'record-state'
        );


      complete.addEventListener(
        'click',
        async () => {

          const checked =
            [
              ...list.querySelectorAll(
                'input[type="checkbox"]:checked'
              )
            ].map(
              (input) =>
                input.value
            );


          await completeCareRecord(
            object,
            record,
            checked,
            complete,
            message
          );
        }
      );


      card.append(
        list,
        complete,
        message
      );


      careObjectList.appendChild(
        card
      );
    }
  }


  // ============================================================
  // COMPLETE CARE RECORD
  // ============================================================

  async function completeCareRecord(
    object,
    record,
    dodCompleted,
    button,
    message
  ) {

    setMessage(
      careMessage,
      ''
    );


    button.disabled =
      true;


    message.textContent =
      '완료 기록 중...';


    message.className =
      'record-state';


    try {

      const {
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            'partner_save_care_record',
            {
              p_visit_id:
                currentVisit.id,

              p_house_id:
                houseId,

              p_object_id:
                object.id,

              p_action:
                'CARE',

              p_condition_status:
                record.condition_status,

              p_result:
                'CARE_COMPLETED',

              p_next_action:
                record.next_action,

              p_dod_completed:
                dodCompleted,

              p_partner_note:
                record.partner_note ||
                null
            }
          );


      if (
        error
      ) {

        throw error;
      }


      await loadCurrentRecords();


      setMessage(
        careMessage,
        `${object.object_name} · CARE 완료가 기록되었습니다.`,
        true
      );


      renderCareObjects();

    } catch (
      error
    ) {

      console.error(
        'MOOHAE partner CARE complete error:',
        error
      );


      setMessage(
        careMessage,

        String(
          error?.message ||
          ''
        ).includes(
          'Definition of Done'
        )

          ? `${object.object_name} · 완료 기준을 모두 체크해주세요.`

          : `${object.object_name} · CARE 완료를 저장하지 못했습니다.`
      );


      message.textContent =
        '';

    } finally {

      button.disabled =
        false;
    }
  }


  // ============================================================
  // NEXT PRIORITY
  // ============================================================

  function renderNextPriority() {

    nextPriorityList.replaceChildren();


    const nextRecords =
      [
        ...currentRecords.values()
      ].filter(
        (record) =>
          record.next_action ===
            'NEXT_CHECK' ||

          record.next_action ===
            'NEXT_CARE'
      );


    if (
      nextRecords.length ===
      0
    ) {

      nextPriorityList.appendChild(
        make(
          'span',
          'next-chip',
          '다음 우선 항목 없음'
        )
      );


      return;
    }


    for (
      const record
      of nextRecords
    ) {

      const object =
        getObject(
          record.object_id
        );


      if (
        !object
      ) {

        continue;
      }


      nextPriorityList.appendChild(
        make(
          'span',
          `next-chip ${
            record.next_action ===
              'NEXT_CARE'
              ? 'is-care'
              : ''
          }`,
          `${object.object_name} · ${
            record.next_action ===
              'NEXT_CARE'
              ? 'NEXT CARE'
              : 'NEXT CHECK'
          }`
        )
      );
    }
  }


  // ============================================================
  // COMPLETION VALIDATION
  // ============================================================

  function validateRecordsForCompletion() {

    const records =
      [
        ...currentRecords.values()
      ];


    if (
      records.length ===
      0
    ) {

      return 'CHECK 기록이 없습니다.';
    }


    const careRecords =
      records.filter(
        (record) =>
          record.action ===
          'CARE'
      );


    if (
      careRecords.length ===
      0
    ) {

      return '오늘 CARE 완료 항목이 최소 1개 필요합니다.';
    }


    for (
      const record
      of records
    ) {

      if (
        record.action ===
          'CARE' &&

        record.result !==
          'CARE_COMPLETED'
      ) {

        return 'CARE 항목 중 완료되지 않은 기록이 있습니다.';
      }


      if (
        record.action ===
          'CHECK' &&

        record.result !==
          'CHECK_COMPLETED'
      ) {

        return 'CHECK 항목 중 완료되지 않은 기록이 있습니다.';
      }


      if (
        record.action ===
          'NONE' &&

        record.result !==
          'NONE'
      ) {

        return '미진행 항목 기록을 다시 확인해주세요.';
      }
    }


    return '';
  }


  // ============================================================
  // PROOF VALIDATION
  // ============================================================

  async function validateProofMedia() {

    const {
      data,
      error
    } =
      await window
        .moohaeSupabase
        .rpc(
          'admin_get_care_visit_media',
          {
            p_visit_id:
              currentVisit.id
          }
        );


    if (
      error
    ) {

      throw error;
    }


    const rows =
      Array.isArray(
        data
      )
        ? data
        : [];


    const beforeCount =
      rows.filter(
        (row) =>
          row.media_type ===
          'before'
      ).length;


    const afterCount =
      rows.filter(
        (row) =>
          row.media_type ===
          'after'
      ).length;


    return {
      beforeCount,
      afterCount
    };
  }


  // ============================================================
  // COMPLETE HOUSE VISIT
  //
  // 중요:
  //
  // 1. 기록 검증
  // 2. PROOF 검증
  // 3. RPC 완료
  // 4. 성공 후에만 화면 이동
  //
  // RPC 성공 후 redirect 문제로 실패하더라도
  // CARE COMPLETE 버튼을 다시 활성화하지 않는다.
  // ============================================================

  async function completeVisit() {

    setMessage(
      proofMessage,
      ''
    );


    const recordError =
      validateRecordsForCompletion();


    if (
      recordError
    ) {

      setMessage(
        proofMessage,
        recordError
      );


      return;
    }


    completeVisitButton.disabled =
      true;


    completeVisitButton.textContent =
      '완료 처리 중...';


    let serverCompleted =
      false;


    try {

      const proof =
        await validateProofMedia();


      if (
        proof.beforeCount <
          1 ||

        proof.afterCount <
          1
      ) {

        throw new Error(
          'PROOF_REQUIRED'
        );
      }


      const note =
        partnerFinalNote
          .value
          .trim();


      // --------------------------------------------------------
      // SERVER COMPLETE
      // --------------------------------------------------------

      const {
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            'partner_complete_house_visit',
            {
              p_house_id:
                houseId,

              p_visit_id:
                currentVisit.id,

              p_partner_note:
                note ||
                null
            }
          );


      if (
        error
      ) {

        throw error;
      }


      serverCompleted =
        true;


      // --------------------------------------------------------
      // COMPLETE SUCCESS
      // --------------------------------------------------------

      setMessage(
        proofMessage,
        'CARE 완료 · 리포트 작성 화면으로 이동합니다.',
        true
      );


      completeVisitButton.textContent =
        'CARE COMPLETED';


      completeVisitButton.disabled =
        true;


      // --------------------------------------------------------
      // CUSTOMER UUID
      // --------------------------------------------------------

      if (
        !customerId ||
        !UUID_PATTERN.test(
          customerId
        )
      ) {

        throw new Error(
          'INVALID_CUSTOMER_ID_AFTER_COMPLETE'
        );
      }


      // --------------------------------------------------------
      // CUSTOMER DETAIL → REPORT EDITOR
      //
      // focus=report
      // admin-report-focus.js가 이 신호를 받아
      // 리포트 작성 영역으로 이동한다.
      // --------------------------------------------------------

      const nextUrl =
        new URL(
          './customer-detail.html',
          window.location.href
        );


      nextUrl.searchParams.set(
        'id',
        customerId
      );


      nextUrl.searchParams.set(
        'focus',
        'report'
      );


      window.setTimeout(
        () => {

          window.location.replace(
            nextUrl.toString()
          );

        },
        650
      );


    } catch (
      error
    ) {

      console.error(
        'MOOHAE partner visit completion error:',
        error
      );


      // --------------------------------------------------------
      // 서버 완료 후 발생한 UI / ROUTE 오류
      //
      // 절대로 완료 버튼을 다시 활성화하지 않는다.
      // --------------------------------------------------------

      if (
        serverCompleted
      ) {

        setMessage(
          proofMessage,
          'CARE는 정상 완료되었습니다. 리포트 화면 자동 이동만 처리하지 못했습니다. 고객 상세에서 해당 고객을 다시 열어주세요.',
          true
        );


        completeVisitButton.textContent =
          'CARE COMPLETED';


        completeVisitButton.disabled =
          true;


        return;
      }


      // --------------------------------------------------------
      // PROOF 누락
      // --------------------------------------------------------

      if (
        error?.message ===
        'PROOF_REQUIRED'
      ) {

        setMessage(
          proofMessage,
          'BEFORE와 AFTER 대표 사진을 각각 1장 이상 남겨주세요.'
        );

      } else {

        setMessage(
          proofMessage,
          'CARE 완료 처리에 실패했습니다. 기록을 다시 확인해주세요.'
        );
      }


      completeVisitButton.disabled =
        false;


      completeVisitButton.textContent =
        'CARE 완료';
    }
  }


  // ============================================================
  // BOOT
  // ============================================================

  async function boot() {

    try {

      assertRequiredDom();


      authContext =
        await requireAuthorizedStaff();


      if (
        !authContext
      ) {

        return;
      }


      if (
        partnerIdentity
      ) {

        partnerIdentity.textContent =
          `${authContext.profile.display_name} · ${authContext.profile.role}`;
      }


      // --------------------------------------------------------
      // CUSTOMER → HOUSE
      // --------------------------------------------------------

      await resolveHouse();


      // --------------------------------------------------------
      // HOUSE SNAPSHOT
      //
      // currentVisit은 houseCustomerId가 필요하므로
      // resolveHouse 이후 실행해야 한다.
      // --------------------------------------------------------

      await Promise.all([
        loadSnapshot(),
        loadCurrentVisit()
      ]);


      // --------------------------------------------------------
      // CURRENT CARE RECORD
      // --------------------------------------------------------

      await loadCurrentRecords();


      // --------------------------------------------------------
      // RENDER
      // --------------------------------------------------------

      renderHouseSummary();

      renderLastRecords();

      renderPriority();

      renderCheckObjects();

      renderCareObjects();

      renderNextPriority();


      pageLoading.hidden =
        true;


      pageError.hidden =
        true;


      partnerContent.hidden =
        false;


    } catch (
      error
    ) {

      console.error(
        'MOOHAE partner HOUSE boot error:',
        error
      );


      if (
        pageLoading
      ) {

        pageLoading.hidden =
          true;
      }


      if (
        partnerContent
      ) {

        partnerContent.hidden =
          true;
      }


      if (
        pageError
      ) {

        pageError.hidden =
          false;
      }


      if (
        !pageErrorMessage
      ) {

        return;
      }


      if (
        error?.message ===
        'NO_ACTIVE_VISIT'
      ) {

        pageErrorMessage.textContent =
          '진행할 방문 일정이 없습니다. 고객 상세에서 방문 일정을 먼저 등록해주세요.';


      } else if (
        error?.message ===
          'INVALID_ROUTE' ||

        error?.message ===
          'HOUSE_NOT_FOUND'
      ) {

        pageErrorMessage.textContent =
          '고객 또는 HOUSE 주소가 올바르지 않습니다.';


      } else if (
        error?.message ===
        'PARTNER_VIEW_DOM_MISMATCH'
      ) {

        pageErrorMessage.textContent =
          'Partner 화면 구성과 프로그램 버전이 맞지 않습니다. 페이지 파일을 확인해주세요.';


      } else {

        pageErrorMessage.textContent =
          'HOUSE 데이터를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.';
      }
    }
  }


  // ============================================================
  // EVENTS
  // ============================================================

  document
    .querySelectorAll(
      '.step-button'
    )
    .forEach(
      (button) => {

        button.addEventListener(
          'click',
          () => {

            goToStep(
              button.dataset.stepTarget
            );
          }
        );
      }
    );


  if (
    startCheckButton
  ) {

    startCheckButton.addEventListener(
      'click',
      () => {

        goToStep(
          'check'
        );
      }
    );
  }


  if (
    goCareButton
  ) {

    goCareButton.addEventListener(
      'click',
      () => {

        const records =
          [
            ...currentRecords.values()
          ];


        if (
          records.length ===
          0
        ) {

          setMessage(
            checkMessage,
            '최소 1개 이상의 CHECK 기록을 저장해주세요.'
          );


          return;
        }


        goToStep(
          'care'
        );
      }
    );
  }


  if (
    goProofButton
  ) {

    goProofButton.addEventListener(
      'click',
      () => {

        const error =
          validateRecordsForCompletion();


        if (
          error
        ) {

          setMessage(
            careMessage,
            error
          );


          return;
        }


        goToStep(
          'proof'
        );
      }
    );
  }


  if (
    completeVisitButton
  ) {

    completeVisitButton.addEventListener(
      'click',
      completeVisit
    );
  }


  // ============================================================
  // LOGOUT
  // ============================================================

  if (
    logoutButton
  ) {

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
  }


  // ============================================================
  // START
  // ============================================================

  boot();

})();