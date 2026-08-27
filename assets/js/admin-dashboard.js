(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN DASHBOARD
  //
  // CHECK V2 READY
  //
  // - 활성 고객 / 삭제 고객 분리
  // - 삭제 고객 복구
  // - V2 Home Profile 요약
  // - 고객 검색
  // - 예약 관리
  // - 예약 확정 / 취소
  // - 슬롯 열기 / 마감
  //
  // allergy_concerns는 더 이상 신규 관리자 UI에서 사용하지 않는다.
  // ============================================================



  // ============================================================
  // DOM
  // ============================================================

  const identity =
    document.getElementById(
      'adminIdentity'
    );


  const logoutButton =
    document.getElementById(
      'logoutButton'
    );


  const dashboardMessage =
    document.getElementById(
      'dashboardMessage'
    );


  const customerList =
    document.getElementById(
      'customerList'
    );


  const emptyCustomers =
    document.getElementById(
      'emptyCustomers'
    );


  const customerSearch =
    document.getElementById(
      'customerSearch'
    );


  const statusFilter =
    document.getElementById(
      'statusFilter'
    );


  const activeCustomersTab =
    document.getElementById(
      'activeCustomersTab'
    );


  const deletedCustomersTab =
    document.getElementById(
      'deletedCustomersTab'
    );


  const activeCustomersTabCount =
    document.getElementById(
      'activeCustomersTabCount'
    );


  const deletedCustomersTabCount =
    document.getElementById(
      'deletedCustomersTabCount'
    );


  const emptyCustomersTitle =
    document.getElementById(
      'emptyCustomersTitle'
    );


  const emptyCustomersText =
    document.getElementById(
      'emptyCustomersText'
    );


  // ------------------------------------------------------------
  // BOOKING
  // ------------------------------------------------------------

  const bookingCalendar =
    document.getElementById(
      'bookingCalendar'
    );


  const bookingMessage =
    document.getElementById(
      'bookingMessage'
    );


  const emptyBookings =
    document.getElementById(
      'emptyBookings'
    );


  const bookingRangeLabel =
    document.getElementById(
      'bookingRangeLabel'
    );


  const bookingPrevButton =
    document.getElementById(
      'bookingPrevButton'
    );


  const bookingNextButton =
    document.getElementById(
      'bookingNextButton'
    );



  // ============================================================
  // COUNTS
  // ============================================================

  const countTargets = {

    customers:
      document.getElementById(
        'customerCount'
      ),

    diagnoses:
      document.getElementById(
        'diagnosisCount'
      ),

    care_visits:
      document.getElementById(
        'visitCount'
      ),

    reports:
      document.getElementById(
        'reportCount'
      )
  };



  // ============================================================
  // CONSTANTS
  // ============================================================

  const STATUS_LABELS = {

    new:
      '신규 문의',

    consulting:
      '상담 중',

    visit_scheduled:
      '방문 예정',

    care_completed:
      '케어 완료',

    follow_up:
      '재관리 대상',

    closed:
      '종료'
  };


  const BOOKING_DAYS =
    14;


  const BOOKING_PAGE_STEP =
    7;



  // ============================================================
  // STATE
  // ============================================================

  let customers =
    [];


  let deletedCustomers =
    [];


  let currentCustomerView =
    'active';


  let latestDiagnosisByCustomer =
    new Map();


  let bookingStartDate =
    new Date();


  bookingStartDate =
    new Date(

      bookingStartDate.getFullYear(),

      bookingStartDate.getMonth(),

      bookingStartDate.getDate()
    );



  // ============================================================
  // BASIC DOM HELPER
  // ============================================================

  const make = (
    tag,
    className,
    text = ''
  ) => {

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
  };



  // ============================================================
  // DATE HELPERS
  // ============================================================

  const formatDate = (
    value
  ) => {

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
          '2-digit'
      }

    ).format(
      date
    );
  };



  // ============================================================
  // BOOKING DATE HELPERS
  // ============================================================

  const bookingIsoDate = (
    date
  ) => {

    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        '0'
      );


    return (
      `${year}-${month}-${day}`
    );
  };


  const bookingAddDays = (
    date,
    days
  ) => {

    const next =
      new Date(
        date
      );


    next.setDate(
      next.getDate() +
      days
    );


    return next;
  };


  const bookingTime = (
    value
  ) => {

    return typeof value ===
      'string'

      ? value.slice(
          0,
          5
        )

      : '—';
  };


  const bookingDateLabel = (
    value
  ) => {

    const date =
      new Date(
        `${value}T00:00:00`
      );


    return new Intl.DateTimeFormat(

      'ko-KR',

      {

        month:
          '2-digit',

        day:
          '2-digit',

        weekday:
          'short'
      }

    ).format(
      date
    );
  };



  // ============================================================
  // BOOKING MESSAGE
  // ============================================================

  function setBookingMessage(
    text,
    error = false
  ) {

    if (
      !bookingMessage
    ) {

      return;
    }


    bookingMessage.textContent =
      text;


    bookingMessage.classList.toggle(
      'error',
      error
    );
  }



  // ============================================================
  // BOOKING CALENDAR RENDER
  // ============================================================

  function renderBookingCalendar(
    rows
  ) {

    bookingCalendar.replaceChildren();


    const groups =
      new Map();


    for (
      const row
      of rows || []
    ) {

      if (
        !groups.has(
          row.booking_date
        )
      ) {

        groups.set(
          row.booking_date,
          []
        );
      }


      groups
        .get(
          row.booking_date
        )
        .push(
          row
        );
    }


    emptyBookings.hidden =
      groups.size !==
      0;



    for (
      const [
        date,
        slots
      ]
      of groups
    ) {

      const card =
        make(
          'article',
          'booking-day-card'
        );


      const head =
        make(
          'div',
          'booking-day-head'
        );


      const title =
        make(
          'div'
        );


      title.append(

        make(
          'span',
          'booking-day-eyebrow',
          'DATE'
        ),

        make(
          'h3',
          '',
          bookingDateLabel(
            date
          )
        )
      );


      const allClosed =
        slots.every(
          (slot) =>
            slot.booking_id ||
            slot.manual_open ===
              false
        );


      const dayButton =
        make(
          'button',
          'secondary-button booking-day-action',
          allClosed
            ? '빈 시간 전체 열기'
            : '빈 시간 전체 마감'
        );


      dayButton.type =
        'button';


      dayButton.dataset.bookingAction =
        'toggle-day';


      dayButton.dataset.bookingDate =
        date;


      dayButton.dataset.open =
        allClosed
          ? 'true'
          : 'false';


      head.append(
        title,
        dayButton
      );


      card.appendChild(
        head
      );


      const list =
        make(
          'div',
          'booking-slot-list'
        );


      for (
        const row
        of slots
      ) {

        const slot =
          make(
            'div',
            `booking-slot${row.booking_id ? ' has-booking' : ''}`
          );


        const time =
          make(
            'strong',
            'booking-time',
            bookingTime(
              row.booking_time
            )
          );


        const content =
          make(
            'div',
            'booking-slot-content'
          );


        const actions =
          make(
            'div',
            'booking-slot-actions'
          );


        if (
          row.booking_id
        ) {

          const link =
            make(
              'a',
              'booking-customer-link',
              row.customer_name ||
                '이름 없음'
            );


          link.href =
            `./customer-detail.html?id=${encodeURIComponent(
              row.customer_id
            )}`;


          const meta =
            make(
              'div',
              'booking-customer-meta'
            );


          meta.appendChild(

            make(
              'span',
              '',
              row.customer_phone ||
                '연락처 미등록'
            )
          );


          if (
            row.recommended_plan
          ) {

            meta.appendChild(

              make(
                'span',
                'booking-plan',
                row.recommended_plan
              )
            );
          }


          const label =

            row.booking_status ===
              'confirmed'

              ? '예약 확정'

              : '예약 요청';


          content.append(
            link,
            meta,
            make(
              'span',
              `booking-status booking-status-${row.booking_status}`,
              label
            )
          );


          if (
            row.booking_status ===
              'requested'
          ) {

            const confirm =
              make(
                'button',
                'primary-button booking-action-button',
                '예약 확정'
              );


            confirm.type =
              'button';


            confirm.dataset.bookingAction =
              'confirm';


            confirm.dataset.bookingId =
              row.booking_id;


            actions.appendChild(
              confirm
            );
          }


          const cancel =
            make(
              'button',
              'secondary-button booking-action-button danger-action',
              '예약 취소'
            );


          cancel.type =
            'button';


          cancel.dataset.bookingAction =
            'cancel';


          cancel.dataset.bookingId =
            row.booking_id;


          actions.appendChild(
            cancel
          );

        } else {

          const closed =
            row.manual_open ===
              false;


          content.append(

            make(
              'strong',
              `booking-availability ${
                closed
                  ? 'is-closed'
                  : 'is-open'
              }`,
              closed
                ? '관리자 마감'
                : '예약 가능'
            ),

            make(
              'span',
              'booking-slot-note',
              closed
                ? (
                    row.admin_note ||
                    '현재 고객에게 노출되지 않는 시간입니다.'
                  )
                : '고객이 선택할 수 있는 시간입니다.'
            )
          );


          const toggle =
            make(
              'button',
              'secondary-button booking-action-button',
              closed
                ? '열기'
                : '마감'
            );


          toggle.type =
            'button';


          toggle.dataset.bookingAction =
            closed
              ? 'open-slot'
              : 'close-slot';


          toggle.dataset.bookingDate =
            row.booking_date;


          toggle.dataset.bookingTime =
            bookingTime(
              row.booking_time
            );


          actions.appendChild(
            toggle
          );
        }


        slot.append(
          time,
          content,
          actions
        );


        list.appendChild(
          slot
        );
      }


      card.appendChild(
        list
      );


      bookingCalendar.appendChild(
        card
      );
    }
  }



  // ============================================================
  // LOAD BOOKING CALENDAR
  // ============================================================

  async function loadBookingCalendar() {

    const end =
      bookingAddDays(
        bookingStartDate,
        BOOKING_DAYS - 1
      );


    bookingRangeLabel.textContent =
      `${bookingIsoDate(
        bookingStartDate
      )} — ${bookingIsoDate(
        end
      )}`;


    setBookingMessage(
      '예약 데이터를 확인하고 있습니다.'
    );


    try {

      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            'admin_get_booking_calendar',
            {
              p_start_date:
                bookingIsoDate(
                  bookingStartDate
                ),

              p_days:
                BOOKING_DAYS
            }
          );


      if (
        error
      ) {

        throw error;
      }


      renderBookingCalendar(
        Array.isArray(
          data
        )
          ? data
          : []
      );


      setBookingMessage(
        '예약 가능 시간과 접수된 예약을 최신 상태로 확인했습니다.'
      );

    } catch (
      error
    ) {

      console.error(
        'MOOHAE booking calendar error:',
        error
      );


      bookingCalendar.replaceChildren();


      emptyBookings.hidden =
        false;


      setBookingMessage(
        '예약 데이터를 불러오지 못했습니다. 관리자 권한과 RPC 상태를 확인해주세요.',
        true
      );
    }
  }



  // ============================================================
  // BOOKING MUTATION
  // ============================================================

  async function bookingMutation(
    button,
    rpc,
    params,
    message
  ) {

    button.disabled =
      true;


    try {

      const {
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            rpc,
            params
          );


      if (
        error
      ) {

        throw error;
      }


      setBookingMessage(
        message
      );


      await loadBookingCalendar();

    } catch (
      error
    ) {

      console.error(
        `MOOHAE ${rpc} error:`,
        error
      );


      setBookingMessage(
        error?.message ===
          'slot_has_active_booking'
          ? '활성 예약이 있는 시간은 마감할 수 없습니다.'
          : '처리 중 오류가 발생했습니다.',
        true
      );

    } finally {

      button.disabled =
        false;
    }
  }



  // ============================================================
  // BOOKING ACTION
  // ============================================================

  async function handleBookingAction(
    event
  ) {

    const button =
      event.target.closest(
        '[data-booking-action]'
      );


    if (
      !button
    ) {

      return;
    }


    const action =
      button.dataset.bookingAction;


    if (
      action ===
        'open-slot' ||
      action ===
        'close-slot'
    ) {

      await bookingMutation(
        button,
        'admin_set_booking_slot',
        {
          p_booking_date:
            button.dataset.bookingDate,

          p_booking_time:
            button.dataset.bookingTime,

          p_is_open:
            action ===
            'open-slot',

          p_admin_note:
            action ===
              'close-slot'
              ? '관리자 예약 마감'
              : null
        },
        action ===
          'open-slot'
          ? '해당 시간을 다시 열었습니다.'
          : '해당 시간을 마감했습니다.'
      );

    } else if (
      action ===
        'toggle-day'
    ) {

      const open =
        button.dataset.open ===
          'true';


      await bookingMutation(
        button,
        'admin_set_booking_day',
        {
          p_booking_date:
            button.dataset.bookingDate,

          p_is_open:
            open,

          p_admin_note:
            open
              ? null
              : '관리자 하루 마감'
        },
        open
          ? '해당 날짜의 빈 시간을 다시 열었습니다.'
          : '해당 날짜의 빈 시간을 모두 마감했습니다.'
      );

    } else if (
      action ===
        'confirm'
    ) {

      await bookingMutation(
        button,
        'admin_update_booking_status',
        {
          p_booking_id:
            button.dataset.bookingId,

          p_status:
            'confirmed',

          p_admin_note:
            null
        },
        '예약을 확정했습니다.'
      );

    } else if (
      action ===
        'cancel'
    ) {

      if (
        !window.confirm(
          '이 예약을 취소할까요?'
        )
      ) {

        return;
      }


      await bookingMutation(
        button,
        'admin_update_booking_status',
        {
          p_booking_id:
            button.dataset.bookingId,

          p_status:
            'cancelled',

          p_admin_note:
            '관리자 예약 취소'
        },
        '예약을 취소했습니다.'
      );
    }
  }



  // ============================================================
  // ADMIN AUTH
  // ============================================================

  async function requireAuthorizedAdmin() {

    if (
      !window
        .moohaeSupabaseConfigReady
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
  // LOAD COUNT
  // ============================================================

  async function loadCount(
    tableName,
    target,
    configureQuery = null
  ) {

    if (
      !target
    ) {

      return null;
    }


    let query =
      window
        .moohaeSupabase
        .from(
          tableName
        )
        .select(
          'id',
          {
            count:
              'exact',

            head:
              true
          }
        );


    if (
      typeof configureQuery ===
      'function'
    ) {

      query =
        configureQuery(
          query
        );
    }


    const {
      count,
      error
    } =
      await query;


    target.textContent =

      error

        ? '—'

        : String(
            count ??
            0
          );


    return error;
  }



  // ============================================================
  // HOME PROFILE HELPERS
  // ============================================================

  function arrayText(
    value
  ) {

    return Array.isArray(
      value
    )
      ? value
          .map(
            (item) =>
              String(
                item
              )
          )
          .join(
            ' '
          )
      : '';
  }


  function getCustomerProfileChips(
    diagnosis
  ) {

    if (
      !diagnosis
    ) {

      return [];
    }


    const isV2 =
      Number(
        diagnosis.check_version
      ) >= 2;


    if (
      isV2
    ) {

      const chips =
        [];


      if (
        diagnosis.recommended_plan
      ) {

        chips.push(
          diagnosis.recommended_plan
        );
      }


      const livingSpaces =
        Array.isArray(
          diagnosis.living_spaces
        )
          ? diagnosis.living_spaces
          : [];


      const contactSurfaces =
        Array.isArray(
          diagnosis.contact_surfaces
        )
          ? diagnosis.contact_surfaces
          : [];


      for (
        const item
        of livingSpaces
      ) {

        if (
          chips.length >=
          3
        ) {

          break;
        }


        chips.push(
          item
        );
      }


      for (
        const item
        of contactSurfaces
      ) {

        if (
          chips.length >=
          3
        ) {

          break;
        }


        chips.push(
          item
        );
      }


      return [
        ...new Set(
          chips
        )
      ].slice(
        0,
        3
      );
    }


    const legacy =
      [];


    if (
      Array.isArray(
        diagnosis.spaces
      )
    ) {

      legacy.push(
        ...diagnosis.spaces
      );
    }


    if (
      Array.isArray(
        diagnosis.concerns
      )
    ) {

      legacy.push(
        ...diagnosis.concerns
      );
    }


    return [
      ...new Set(
        legacy
      )
    ].slice(
      0,
      3
    );
  }



  // ============================================================
  // LOAD CUSTOMERS
  // ============================================================

  async function loadCustomers() {

    const [
      activeCustomerResult,
      deletedCustomerResult,
      diagnosisResult
    ] =
      await Promise.all([

        window
          .moohaeSupabase
          .from(
            'customers'
          )
          .select(
            `
              id,
              name,
              phone,
              status,
              privacy_consent,
              created_at,
              deleted_at,
              deleted_by,
              delete_reason,
              row_version
            `
          )
          .is(
            'deleted_at',
            null
          )
          .order(
            'created_at',
            {
              ascending:
                false
            }
          )
          .limit(
            200
          ),


        window
          .moohaeSupabase
          .from(
            'customers'
          )
          .select(
            `
              id,
              name,
              phone,
              status,
              privacy_consent,
              created_at,
              deleted_at,
              deleted_by,
              delete_reason,
              row_version
            `
          )
          .not(
            'deleted_at',
            'is',
            null
          )
          .order(
            'deleted_at',
            {
              ascending:
                false
            }
          )
          .limit(
            200
          ),


        window
          .moohaeSupabase
          .from(
            'diagnoses'
          )
          .select(
            `
              id,
              customer_id,

              check_version,
              recommended_plan,

              household,
              living_spaces,
              contact_surfaces,
              management_worries,
              management_preference,

              spaces,
              concerns,

              result_level,
              created_at
            `
          )
          .order(
            'created_at',
            {
              ascending:
                false
            }
          )
          .limit(
            500
          )
      ]);


    if (
      activeCustomerResult.error
    ) {

      throw activeCustomerResult.error;
    }


    if (
      deletedCustomerResult.error
    ) {

      throw deletedCustomerResult.error;
    }


    if (
      diagnosisResult.error
    ) {

      throw diagnosisResult.error;
    }


    customers =
      Array.isArray(
        activeCustomerResult.data
      )
        ? activeCustomerResult.data
        : [];


    deletedCustomers =
      Array.isArray(
        deletedCustomerResult.data
      )
        ? deletedCustomerResult.data
        : [];


    latestDiagnosisByCustomer =
      new Map();


    for (
      const diagnosis
      of diagnosisResult.data ||
      []
    ) {

      if (
        !latestDiagnosisByCustomer.has(
          diagnosis.customer_id
        )
      ) {

        latestDiagnosisByCustomer.set(
          diagnosis.customer_id,
          diagnosis
        );
      }
    }


    activeCustomersTabCount.textContent =
      String(
        customers.length
      );


    deletedCustomersTabCount.textContent =
      String(
        deletedCustomers.length
      );
  }



  // ============================================================
  // CUSTOMER VIEW
  // ============================================================

  function setCustomerView(
    view
  ) {

    currentCustomerView =
      view ===
        'deleted'
        ? 'deleted'
        : 'active';


    const deleted =
      currentCustomerView ===
      'deleted';


    activeCustomersTab.classList.toggle(
      'is-active',
      !deleted
    );


    deletedCustomersTab.classList.toggle(
      'is-active',
      deleted
    );


    activeCustomersTab.setAttribute(
      'aria-selected',
      String(
        !deleted
      )
    );


    deletedCustomersTab.setAttribute(
      'aria-selected',
      String(
        deleted
      )
    );


    statusFilter.disabled =
      deleted;


    renderCustomers();
  }



  // ============================================================
  // RESTORE CUSTOMER
  // ============================================================

  async function restoreCustomer(
    customer,
    button
  ) {

    if (
      !customer?.id
    ) {

      return;
    }


    const confirmed =
      window.confirm(
        `${customer.name || '이름 없음'} 고객을 복구할까요?\n\n기존 MOOHAE CHECK · 방문 CARE · Care Report 기록은 그대로 유지됩니다.`
      );


    if (
      !confirmed
    ) {

      return;
    }


    const originalLabel =
      button.textContent;


    button.disabled =
      true;


    button.textContent =
      '복구 중...';


    try {

      const {
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            'admin_restore_customer',
            {
              p_customer_id:
                customer.id
            }
          );


      if (
        error
      ) {

        throw error;
      }


      dashboardMessage.textContent =
        `${customer.name || '고객'} 고객을 복구했습니다.`;


      await loadCustomers();


      await loadCount(
        'customers',
        countTargets.customers,
        (query) =>
          query.is(
            'deleted_at',
            null
          )
      );


      renderCustomers();

    } catch (
      error
    ) {

      console.error(
        'MOOHAE customer restore error:',
        error
      );


      dashboardMessage.textContent =
        '고객을 복구하지 못했습니다. 관리자 권한과 복구 RPC를 확인해주세요.';


      button.disabled =
        false;


      button.textContent =
        originalLabel;
    }
  }



  // ============================================================
  // RENDER CUSTOMERS
  // ============================================================

  function renderCustomers() {

    const term =
      customerSearch
        .value
        .trim()
        .toLowerCase();


    const selectedStatus =
      statusFilter.value;


    const source =
      currentCustomerView ===
        'deleted'
        ? deletedCustomers
        : customers;


    const filtered =
      source.filter(

        (customer) => {

          if (
            currentCustomerView ===
              'active' &&

            selectedStatus !==
              'all' &&

            customer.status !==
              selectedStatus
          ) {

            return false;
          }


          if (
            !term
          ) {

            return true;
          }


          const diagnosis =
            latestDiagnosisByCustomer.get(
              customer.id
            );


          const searchData = [

            customer.name ||
              '',

            customer.phone ||
              '',

            STATUS_LABELS[
              customer.status
            ] ||
              '',

            customer.delete_reason ||
              '',

            diagnosis?.recommended_plan ||
              '',

            diagnosis?.result_level ||
              '',

            arrayText(
              diagnosis?.household
            ),

            arrayText(
              diagnosis?.living_spaces
            ),

            arrayText(
              diagnosis?.contact_surfaces
            ),

            arrayText(
              diagnosis?.management_worries
            ),

            arrayText(
              diagnosis?.management_preference
            ),

            arrayText(
              diagnosis?.spaces
            ),

            arrayText(
              diagnosis?.concerns
            )

          ]
            .join(
              ' '
            )
            .toLowerCase();


          return searchData.includes(
            term
          );
        }
      );


    customerList.replaceChildren();


    emptyCustomers.hidden =
      filtered.length !==
      0;


    if (
      filtered.length ===
      0
    ) {

      if (
        currentCustomerView ===
          'deleted'
      ) {

        emptyCustomersTitle.textContent =
          '삭제된 고객이 없습니다.';


        emptyCustomersText.textContent =
          '삭제 처리한 고객은 복구 가능한 상태로 이곳에 표시됩니다.';

      } else {

        emptyCustomersTitle.textContent =
          '아직 등록된 고객이 없습니다.';


        emptyCustomersText.textContent =
          '무료 진단이 접수되면 고객이 자동으로 이곳에 표시됩니다.';
      }


      return;
    }


    for (
      const customer
      of filtered
    ) {

      if (
        currentCustomerView ===
        'deleted'
      ) {

        const row =
          make(
            'article',
            'customer-row is-deleted'
          );


        const profile =
          make(
            'div',
            'customer-primary'
          );


        profile.append(
          make(
            'strong',
            '',
            customer.name ||
              '이름 없음'
          ),

          make(
            'span',
            '',
            customer.phone ||
              '연락처 미등록'
          )
        );


        const deletedMeta =
          make(
            'div',
            'deleted-customer-meta'
          );


        deletedMeta.append(
          make(
            'strong',
            '',
            `삭제 ${formatDate(
              customer.deleted_at
            )}`
          ),

          make(
            'span',
            '',
            `등록 ${formatDate(
              customer.created_at
            )}`
          )
        );


        const reason =
          make(
            'div',
            'deleted-customer-reason',
            customer.delete_reason ||
              '삭제 사유 미기록'
          );


        const actions =
          make(
            'div',
            'deleted-customer-actions'
          );


        const detailLink =
          make(
            'a',
            'secondary-button customer-row-action',
            '기록 보기'
          );


        detailLink.href =
          `./customer-detail.html?id=${encodeURIComponent(
            customer.id
          )}`;


        const restoreButton =
          make(
            'button',
            'secondary-button customer-row-action restore-customer-button',
            '복구'
          );


        restoreButton.type =
          'button';


        restoreButton.addEventListener(

          'click',

          () => {

            restoreCustomer(
              customer,
              restoreButton
            );
          }
        );


        actions.append(
          detailLink,
          restoreButton
        );


        row.append(
          profile,
          deletedMeta,
          reason,
          actions
        );


        customerList.appendChild(
          row
        );


        continue;
      }


      const diagnosis =
        latestDiagnosisByCustomer.get(
          customer.id
        );


      const link =
        make(
          'a',
          'customer-row'
        );


      link.href =
        `./customer-detail.html?id=${encodeURIComponent(
          customer.id
        )}`;


      const profile =
        make(
          'div',
          'customer-primary'
        );


      profile.appendChild(
        make(
          'strong',
          '',
          customer.name ||
            '이름 없음'
        )
      );


      profile.appendChild(
        make(
          'span',
          '',
          customer.phone ||
            '연락처 미등록'
        )
      );


      const concern =
        make(
          'div',
          'customer-concern'
        );


      const profileChips =
        getCustomerProfileChips(
          diagnosis
        );


      if (
        profileChips.length
      ) {

        for (
          const item
          of profileChips
        ) {

          concern.appendChild(
            make(
              'span',
              'mini-chip',
              String(
                item
              )
            )
          );
        }

      } else {

        concern.appendChild(
          make(
            'span',
            'muted-copy',
            'CHECK 데이터 없음'
          )
        );
      }


      const result =
        make(
          'div',
          'customer-result'
        );


      const resultLabel =

        diagnosis?.recommended_plan ||

        diagnosis?.result_level ||

        '—';


      result.appendChild(
        make(
          'strong',
          '',
          resultLabel
        )
      );


      result.appendChild(
        make(
          'span',
          '',
          formatDate(
            diagnosis?.created_at ||
            customer.created_at
          )
        )
      );


      const statusWrap =
        make(
          'div',
          'customer-status'
        );


      const status =
        make(
          'span',
          `status-badge status-${customer.status || 'neutral'}`,
          STATUS_LABELS[
            customer.status
          ] ||
            '상태 미정'
        );


      statusWrap.appendChild(
        status
      );


      link.append(
        profile,
        concern,
        result,
        statusWrap
      );


      customerList.appendChild(
        link
      );
    }
  }



  // ============================================================
  // BOOT
  // ============================================================

  async function boot() {

    try {

      const auth =
        await requireAuthorizedAdmin();


      if (
        !auth
      ) {

        return;
      }


      identity.textContent =
        `${auth.profile.display_name} · ${auth.profile.role}`;


      const countErrors =
        await Promise.all([

          loadCount(
            'customers',
            countTargets.customers,
            (query) =>
              query.is(
                'deleted_at',
                null
              )
          ),

          loadCount(
            'diagnoses',
            countTargets.diagnoses
          ),

          loadCount(
            'care_visits',
            countTargets.care_visits
          ),

          loadCount(
            'reports',
            countTargets.reports
          )
        ]);


      await Promise.all([
        loadCustomers(),
        loadBookingCalendar()
      ]);


      renderCustomers();


      dashboardMessage.textContent =

        countErrors.some(
          Boolean
        )

          ? '로그인은 정상입니다. 일부 집계 데이터를 추가 확인해야 합니다.'

          : '관리자 인증과 고객 데이터 접근 권한이 정상적으로 확인되었습니다.';

    } catch (
      error
    ) {

      console.error(
        'MOOHAE dashboard error:',
        error
      );


      dashboardMessage.textContent =
        '고객 데이터를 불러오는 중 오류가 발생했습니다.';


      customerList.replaceChildren();


      emptyCustomers.hidden =
        false;
    }
  }



  // ============================================================
  // CUSTOMER EVENTS
  // ============================================================

  customerSearch.addEventListener(
    'input',
    renderCustomers
  );


  statusFilter.addEventListener(
    'change',
    renderCustomers
  );


  activeCustomersTab.addEventListener(

    'click',

    () => {

      setCustomerView(
        'active'
      );
    }
  );


  deletedCustomersTab.addEventListener(

    'click',

    () => {

      setCustomerView(
        'deleted'
      );
    }
  );



  // ============================================================
  // BOOKING EVENTS
  // ============================================================

  bookingCalendar.addEventListener(
    'click',
    handleBookingAction
  );


  bookingPrevButton.addEventListener(

    'click',

    async () => {

      bookingStartDate =
        bookingAddDays(
          bookingStartDate,
          -BOOKING_PAGE_STEP
        );


      await loadBookingCalendar();
    }
  );


  bookingNextButton.addEventListener(

    'click',

    async () => {

      bookingStartDate =
        bookingAddDays(
          bookingStartDate,
          BOOKING_PAGE_STEP
        );


      await loadBookingCalendar();
    }
  );



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