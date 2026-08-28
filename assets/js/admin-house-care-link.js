(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN
  // CUSTOMER DETAIL → PARTNER HOUSE CARE
  //
  // 진입 조건
  //
  // 1. 유효한 CUSTOMER UUID
  // 2. 삭제되지 않은 고객
  // 3. PRIMARY HOUSE 존재
  // 4. scheduled / in_progress 방문 존재
  //
  // DATA ≠ SCREEN
  //
  // 이 파일은 데이터 생성/수정 역할을 하지 않는다.
  // 현장 CARE 진입 가능 여부만 판단한다.
  // ============================================================


  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  const ACTIVE_VISIT_STATUSES = [
    'in_progress',
    'scheduled'
  ];


  // ============================================================
  // DOM
  // ============================================================

  const openHouseCareButton =
    document.getElementById(
      'openHouseCareButton'
    );


  const deletedCustomerNotice =
    document.getElementById(
      'deletedCustomerNotice'
    );


  const visitScheduleMessage =
    document.getElementById(
      'visitScheduleMessage'
    );


  if (
    !openHouseCareButton
  ) {

    return;
  }


  // ============================================================
  // DEFAULT STATE
  // ============================================================

  openHouseCareButton.hidden =
    true;


  openHouseCareButton.removeAttribute(
    'href'
  );


  // ============================================================
  // CUSTOMER UUID
  // ============================================================

  const params =
    new URLSearchParams(
      window.location.search
    );


  const customerId =
    String(
      params.get('id') ||
      ''
    ).trim();


  if (
    !UUID_PATTERN.test(
      customerId
    )
  ) {

    console.warn(
      'MOOHAE HOUSE CARE: invalid customer id.'
    );


    return;
  }


  // ============================================================
  // HELPERS
  // ============================================================

  function isDeletedCustomer() {

    return Boolean(
      deletedCustomerNotice &&
      deletedCustomerNotice.hidden === false
    );
  }


  function hideButton() {

    openHouseCareButton.hidden =
      true;


    openHouseCareButton.removeAttribute(
      'href'
    );
  }


  function activateButton() {

    const url =
      new URL(
        './house-care.html',
        window.location.href
      );


    url.searchParams.set(
      'id',
      customerId
    );


    openHouseCareButton.href =
      url.toString();


    openHouseCareButton.hidden =
      false;
  }


  function setScheduleHint(
    message
  ) {

    if (
      !visitScheduleMessage
    ) {

      return;
    }


    /*
     * 기존 admin-customer-detail.js가
     * 성공/오류 메시지를 사용하고 있을 수 있으므로
     * 이미 내용이 있다면 덮어쓰지 않는다.
     */

    if (
      visitScheduleMessage.textContent.trim()
    ) {

      return;
    }


    visitScheduleMessage.textContent =
      message;
  }


  // ============================================================
  // AUTH / CLIENT READY
  // ============================================================

  async function waitForSupabaseClient() {

    const timeoutMs =
      5000;


    const startedAt =
      Date.now();


    while (
      !window.moohaeSupabase
    ) {

      if (
        Date.now() -
          startedAt >
        timeoutMs
      ) {

        throw new Error(
          'SUPABASE_CLIENT_NOT_READY'
        );
      }


      await new Promise(
        (resolve) => {

          window.setTimeout(
            resolve,
            50
          );
        }
      );
    }


    return window.moohaeSupabase;
  }


  // ============================================================
  // PRIMARY HOUSE CHECK
  // ============================================================

  async function getPrimaryHouse(
    supabase
  ) {

    const {
      data,
      error
    } =
      await supabase
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
      error
    ) {

      throw error;
    }


    return data ||
      null;
  }


  // ============================================================
  // ACTIVE VISIT CHECK
  // ============================================================

  async function getActiveVisit(
    supabase
  ) {

    const {
      data,
      error
    } =
      await supabase
        .from(
          'care_visits'
        )
        .select(
          'id, customer_id, visit_status, scheduled_at'
        )
        .eq(
          'customer_id',
          customerId
        )
        .in(
          'visit_status',
          ACTIVE_VISIT_STATUSES
        )
        .order(
          'scheduled_at',
          {
            ascending:
              true
          }
        )
        .limit(
          1
        );


    if (
      error
    ) {

      throw error;
    }


    return Array.isArray(
      data
    ) &&
    data.length
      ? data[0]
      : null;
  }


  // ============================================================
  // RESOLVE CARE ENTRY
  // ============================================================

  async function resolveCareEntry() {

    hideButton();


    if (
      isDeletedCustomer()
    ) {

      return;
    }


    try {

      const supabase =
        await waitForSupabaseClient();


      /*
       * HOUSE와 VISIT은 서로 독립적인 조회이므로
       * 병렬 실행.
       */

      const [
        house,
        visit
      ] =
        await Promise.all([
          getPrimaryHouse(
            supabase
          ),

          getActiveVisit(
            supabase
          )
        ]);


      // --------------------------------------------------------
      // CUSTOMER가 중간에 삭제 상태로 렌더링됐을 가능성
      // --------------------------------------------------------

      if (
        isDeletedCustomer()
      ) {

        hideButton();


        return;
      }


      // --------------------------------------------------------
      // HOUSE 없음
      //
      // 현재 DB trigger가 정상이라면 신규 활성 고객에서는
      // 발생하지 않아야 하는 데이터 무결성 예외.
      // --------------------------------------------------------

      if (
        !house
      ) {

        hideButton();


        console.error(
          'MOOHAE HOUSE CARE: primary house missing.',
          {
            customerId
          }
        );


        setScheduleHint(
          'HOUSE 정보를 확인해야 현장 CARE를 시작할 수 있습니다.'
        );


        return;
      }


      // --------------------------------------------------------
      // ACTIVE VISIT 없음
      // --------------------------------------------------------

      if (
        !visit
      ) {

        hideButton();


        setScheduleHint(
          '현장 CARE를 시작하려면 방문 일정을 먼저 등록해주세요.'
        );


        return;
      }


      // --------------------------------------------------------
      // READY
      // --------------------------------------------------------

      activateButton();

    } catch (
      error
    ) {

      hideButton();


      console.error(
        'MOOHAE HOUSE CARE entry check failed:',
        error
      );


      setScheduleHint(
        '현장 CARE 준비 상태를 확인하지 못했습니다. 페이지를 새로고침해주세요.'
      );
    }
  }


  // ============================================================
  // DELETED CUSTOMER STATE WATCH
  // ============================================================

  let deletedObserver =
    null;


  if (
    deletedCustomerNotice
  ) {

    deletedObserver =
      new MutationObserver(
        () => {

          if (
            isDeletedCustomer()
          ) {

            hideButton();


            return;
          }


          resolveCareEntry();
        }
      );


    deletedObserver.observe(
      deletedCustomerNotice,
      {
        attributes:
          true,

        attributeFilter: [
          'hidden'
        ]
      }
    );
  }


  // ============================================================
  // VISIT CREATED EVENT SUPPORT
  //
  // 현재 admin-customer-detail.js가 별도 custom event를
  // 보내지 않아도 페이지 새로고침으로 정상 동작한다.
  //
  // 향후 아래 이벤트를 dispatch하면
  // 페이지 reload 없이 즉시 버튼을 갱신할 수 있다.
  // ============================================================

  window.addEventListener(
    'moohae:visit-changed',
    () => {

      resolveCareEntry();
    }
  );


  // ============================================================
  // CLICK SAFETY
  // ============================================================

  openHouseCareButton.addEventListener(
    'click',
    (event) => {

      if (
        isDeletedCustomer() ||
        !openHouseCareButton.href
      ) {

        event.preventDefault();


        return;
      }


      const destination =
        new URL(
          openHouseCareButton.href
        );


      const destinationCustomerId =
        destination.searchParams.get(
          'id'
        );


      if (
        destination.origin !==
          window.location.origin ||

        destinationCustomerId !==
          customerId ||

        !UUID_PATTERN.test(
          destinationCustomerId
        )
      ) {

        event.preventDefault();


        console.error(
          'MOOHAE HOUSE CARE: unsafe destination blocked.'
        );
      }
    }
  );


  // ============================================================
  // BOOT
  // ============================================================

  resolveCareEntry();


  // ============================================================
  // CLEANUP
  // ============================================================

  window.addEventListener(
    'pagehide',
    () => {

      if (
        deletedObserver
      ) {

        deletedObserver.disconnect();
      }
    },
    {
      once:
        true
    }
  );

})();