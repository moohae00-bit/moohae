(() => {
  'use strict';

  // ============================================================
  // MOOHAE ADMIN DASHBOARD
  //
  // CHECK V3 DISPLAY READY
  //
  // - 활성 고객 / 삭제 고객 분리
  // - 삭제 고객 복구
  // - HOME / FACILITY CHECK 구분
  // - CORE / CORE+ / PRIVATE 표시
  // - 고객 검색
  // - 예약 관리
  // - 예약 확정 / 취소
  // - 슬롯 열기 / 마감
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
  // ACTIVE CUSTOMER BULK SOFT DELETE
  // ------------------------------------------------------------

  const bulkCustomerActions =
    document.getElementById(
      'bulkCustomerActions'
    );

  const selectVisibleCustomersCheckbox =
    document.getElementById(
      'selectVisibleCustomersCheckbox'
    );

  const selectedCustomerCount =
    document.getElementById(
      'selectedCustomerCount'
    );

  const openBulkDeleteButton =
    document.getElementById(
      'openBulkDeleteButton'
    );

  const bulkDeleteDialog =
    document.getElementById(
      'bulkDeleteDialog'
    );

  const bulkDeleteForm =
    document.getElementById(
      'bulkDeleteForm'
    );

  const bulkDeleteTargetSummary =
    document.getElementById(
      'bulkDeleteTargetSummary'
    );

  const bulkDeleteReason =
    document.getElementById(
      'bulkDeleteReason'
    );

  const bulkDeleteConfirmInput =
    document.getElementById(
      'bulkDeleteConfirmInput'
    );

  const bulkDeleteConfirmGuide =
    document.getElementById(
      'bulkDeleteConfirmGuide'
    );

  const bulkDeleteResult =
    document.getElementById(
      'bulkDeleteResult'
    );

  const bulkDeleteResultSummary =
    document.getElementById(
      'bulkDeleteResultSummary'
    );

  const bulkDeleteResultList =
    document.getElementById(
      'bulkDeleteResultList'
    );

  const cancelBulkDeleteButton =
    document.getElementById(
      'cancelBulkDeleteButton'
    );

  const closeBulkDeleteDialogButton =
    document.getElementById(
      'closeBulkDeleteDialogButton'
    );

  const confirmBulkDeleteButton =
    document.getElementById(
      'confirmBulkDeleteButton'
    );

  const bulkDeleteDialogMessage =
    document.getElementById(
      'bulkDeleteDialogMessage'
    );


  // ------------------------------------------------------------
  // DELETED CUSTOMER BULK PERMANENT DELETE
  // ------------------------------------------------------------

  const bulkPermanentCustomerActions =
    document.getElementById(
      'bulkPermanentCustomerActions'
    );

  const selectVisibleDeletedCustomersCheckbox =
    document.getElementById(
      'selectVisibleDeletedCustomersCheckbox'
    );

  const selectedDeletedCustomerCount =
    document.getElementById(
      'selectedDeletedCustomerCount'
    );

  const openBulkPermanentDeleteButton =
    document.getElementById(
      'openBulkPermanentDeleteButton'
    );

  const bulkPermanentDeleteDialog =
    document.getElementById(
      'bulkPermanentDeleteDialog'
    );

  const bulkPermanentDeleteForm =
    document.getElementById(
      'bulkPermanentDeleteForm'
    );

  const bulkPermanentDeleteTargetSummary =
    document.getElementById(
      'bulkPermanentDeleteTargetSummary'
    );

  const bulkPermanentDeleteReason =
    document.getElementById(
      'bulkPermanentDeleteReason'
    );

  const bulkPermanentDeleteConfirmInput =
    document.getElementById(
      'bulkPermanentDeleteConfirmInput'
    );

  const bulkPermanentDeleteConfirmGuide =
    document.getElementById(
      'bulkPermanentDeleteConfirmGuide'
    );

  const bulkPermanentDeleteResult =
    document.getElementById(
      'bulkPermanentDeleteResult'
    );

  const bulkPermanentDeleteResultSummary =
    document.getElementById(
      'bulkPermanentDeleteResultSummary'
    );

  const bulkPermanentDeleteResultList =
    document.getElementById(
      'bulkPermanentDeleteResultList'
    );

  const cancelBulkPermanentDeleteButton =
    document.getElementById(
      'cancelBulkPermanentDeleteButton'
    );

  const closeBulkPermanentDeleteDialogButton =
    document.getElementById(
      'closeBulkPermanentDeleteDialogButton'
    );

  const confirmBulkPermanentDeleteButton =
    document.getElementById(
      'confirmBulkPermanentDeleteButton'
    );

  const bulkPermanentDeleteDialogMessage =
    document.getElementById(
      'bulkPermanentDeleteDialogMessage'
    );


  // ============================================================
  // BOOKING DOM
  // ============================================================

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


  // ============================================================
  // PUBLIC CHECK LABELS
  //
  // DB 내부 호환값과 관리자 표시명을 완전히 분리한다.
  //
  // STANDARD  -> CORE
  // PLUS      -> CORE+
  // SIGNATURE -> PRIVATE
  //
  // 시설 내부 BASIC 값은 고객/관리자 화면에서 노출하지 않는다.
  // ============================================================

  const CARE_PLAN_LABELS =
    Object.freeze({

      STANDARD:
        'CORE',

      standard:
        'CORE',

      BASIC:
        'CORE',

      basic:
        'CORE',

      CORE:
        'CORE',

      core:
        'CORE',

      PLUS:
        'CORE+',

      plus:
        'CORE+',

      'CORE+':
        'CORE+',

      'core-plus':
        'CORE+',

      corePlus:
        'CORE+',

      SIGNATURE:
        'PRIVATE',

      signature:
        'PRIVATE',

      PRIVATE:
        'PRIVATE',

      private:
        'PRIVATE'
    });


  function publicPlanLabel(
    value
  ) {

    const key =
      String(
        value || ''
      ).trim();

    return (
      CARE_PLAN_LABELS[
        key
      ] ||
      ''
    );
  }


  function publicCheckLabel(
    diagnosis
  ) {

    if (
      !diagnosis
    ) {

      return '—';
    }

    if (
      String(
        diagnosis.customer_type || ''
      ).toLowerCase() ===
        'facility'
    ) {

      return 'FACILITY CHECK';
    }

    return (
      publicPlanLabel(
        diagnosis.recommended_plan
      ) ||
      publicPlanLabel(
        diagnosis.result_level
      ) ||
      'CORE'
    );
  }


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

  const selectedCustomerIds =
    new Set();

  let currentFilteredActiveCustomerIds =
    [];

  let bulkDeleteInProgress =
    false;

  let authContext =
    null;

  const selectedDeletedCustomerIds =
    new Set();

  let currentFilteredDeletedCustomerIds =
    [];

  let bulkPermanentDeleteInProgress =
    false;

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
    className = '',
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


          // ------------------------------------------------------
          // 예약 화면에서도 구 등급명을 표시하지 않는다.
          // ------------------------------------------------------

          const bookingPlanLabel =
            publicPlanLabel(
              row.recommended_plan
            );

          if (
            bookingPlanLabel
          ) {

            meta.appendChild(
              make(
                'span',
                'booking-plan',
                bookingPlanLabel
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
  // PROFILE HELPERS
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


    // ==========================================================
    // FACILITY
    // ==========================================================

    if (
      String(
        diagnosis.customer_type || ''
      ).toLowerCase() ===
        'facility'
    ) {

      const facilityChips =
        [];

      if (
        diagnosis.facility_name
      ) {

        facilityChips.push(
          diagnosis.facility_name
        );
      }

      if (
        Array.isArray(
          diagnosis.facility_focus_areas
        )
      ) {

        facilityChips.push(
          ...diagnosis.facility_focus_areas
        );
      }

      return [
        ...new Set(
          facilityChips
        )
      ].slice(
        0,
        3
      );
    }


    // ==========================================================
    // HOME
    // ==========================================================

    const isV2 =
      Number(
        diagnosis.check_version
      ) >= 2;

    if (
      isV2
    ) {

      const chips =
        [];

      const planChip =
        publicCheckLabel(
          diagnosis
        );

      if (
        planChip &&
        planChip !== '—'
      ) {

        chips.push(
          planChip
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


    // ==========================================================
    // LEGACY
    // ==========================================================

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
  // ACTIVE CUSTOMER BULK SOFT DELETE
  // ============================================================

  function currentSelectedActiveCustomers() {

    const activeById =
      new Map(
        customers.map(
          (customer) => [
            customer.id,
            customer
          ]
        )
      );

    return [
      ...selectedCustomerIds
    ]
      .map(
        (id) =>
          activeById.get(
            id
          ) ||
          null
      )
      .filter(Boolean);
  }


  function expectedBulkDeletePhrase(
    count
  ) {

    return `${count}명 삭제`;
  }


  function resetBulkDeleteDialog() {

    bulkDeleteForm?.reset();

    if (
      bulkDeleteReason
    ) {

      bulkDeleteReason.disabled =
        false;
    }

    if (
      bulkDeleteConfirmInput
    ) {

      bulkDeleteConfirmInput.disabled =
        false;
    }

    if (
      confirmBulkDeleteButton
    ) {

      confirmBulkDeleteButton.hidden =
        false;

      confirmBulkDeleteButton.disabled =
        false;

      confirmBulkDeleteButton.textContent =
        '선택 고객 삭제 처리';
    }

    if (
      cancelBulkDeleteButton
    ) {

      cancelBulkDeleteButton.disabled =
        false;

      cancelBulkDeleteButton.textContent =
        '취소';
    }

    if (
      bulkDeleteResult
    ) {

      bulkDeleteResult.hidden =
        true;
    }

    bulkDeleteResultList?.replaceChildren();

    if (
      bulkDeleteResultSummary
    ) {

      bulkDeleteResultSummary.textContent =
        '';
    }

    if (
      bulkDeleteDialogMessage
    ) {

      bulkDeleteDialogMessage.textContent =
        '';
    }
  }


  function closeBulkDeleteDialog() {

    if (
      bulkDeleteInProgress
    ) {

      return;
    }

    if (
      bulkDeleteDialog?.open
    ) {

      bulkDeleteDialog.close();
    }

    resetBulkDeleteDialog();
  }


  function updateBulkSelectionUi(
    filteredActiveIds =
      currentFilteredActiveCustomerIds
  ) {

    const activeView =
      currentCustomerView ===
        'active';

    if (
      bulkCustomerActions
    ) {

      bulkCustomerActions.hidden =
        !activeView;
    }

    if (
      !activeView
    ) {

      selectedCustomerIds.clear();
      currentFilteredActiveCustomerIds =
        [];

      if (
        selectVisibleCustomersCheckbox
      ) {

        selectVisibleCustomersCheckbox.checked =
          false;

        selectVisibleCustomersCheckbox.indeterminate =
          false;
      }

      if (
        selectedCustomerCount
      ) {

        selectedCustomerCount.textContent =
          '0명 선택';
      }

      if (
        openBulkDeleteButton
      ) {

        openBulkDeleteButton.disabled =
          true;
      }

      return;
    }

    currentFilteredActiveCustomerIds =
      Array.isArray(
        filteredActiveIds
      )
        ? [
            ...filteredActiveIds
          ]
        : [];

    const visibleIds =
      new Set(
        currentFilteredActiveCustomerIds
      );

    for (
      const id
      of [
        ...selectedCustomerIds
      ]
    ) {

      if (
        !visibleIds.has(
          id
        )
      ) {

        selectedCustomerIds.delete(
          id
        );
      }
    }

    const selectedCount =
      selectedCustomerIds.size;

    const visibleCount =
      currentFilteredActiveCustomerIds.length;

    if (
      selectedCustomerCount
    ) {

      selectedCustomerCount.textContent =
        `${selectedCount}명 선택`;
    }

    if (
      selectVisibleCustomersCheckbox
    ) {

      selectVisibleCustomersCheckbox.disabled =
        visibleCount ===
          0 ||
        bulkDeleteInProgress;

      selectVisibleCustomersCheckbox.checked =
        visibleCount >
          0 &&
        selectedCount ===
          visibleCount;

      selectVisibleCustomersCheckbox.indeterminate =
        selectedCount >
          0 &&
        selectedCount <
          visibleCount;
    }

    if (
      openBulkDeleteButton
    ) {

      openBulkDeleteButton.disabled =
        selectedCount ===
          0 ||
        bulkDeleteInProgress;
    }
  }


  function renderBulkDeleteResultRow(
    customer,
    ok
  ) {

    if (
      !bulkDeleteResultList
    ) {

      return;
    }

    const row =
      make(
        'div',
        `bulk-delete-result-row ${
          ok
            ? 'is-success'
            : 'is-failed'
        }`
      );

    row.append(
      make(
        'strong',
        '',
        customer.name ||
          '이름 없음'
      ),
      make(
        'span',
        '',
        ok
          ? '삭제 처리 완료'
          : '처리 실패 · 목록에서 다시 선택해 재시도'
      )
    );

    bulkDeleteResultList.appendChild(
      row
    );
  }


  function openBulkDeleteDialogForSelection() {

    if (
      bulkDeleteInProgress ||
      currentCustomerView !==
        'active'
    ) {

      return;
    }

    const targets =
      currentSelectedActiveCustomers();

    if (
      targets.length ===
        0
    ) {

      updateBulkSelectionUi();
      return;
    }

    resetBulkDeleteDialog();

    const previewNames =
      targets
        .slice(
          0,
          5
        )
        .map(
          (customer) =>
            customer.name ||
            '이름 없음'
        );

    const extraCount =
      targets.length -
      previewNames.length;

    if (
      bulkDeleteTargetSummary
    ) {

      bulkDeleteTargetSummary.textContent =
        `선택 고객 ${targets.length}명 · ${previewNames.join(
          ', '
        )}${
          extraCount >
            0
            ? ` 외 ${extraCount}명`
            : ''
        }`;
    }

    const phrase =
      expectedBulkDeletePhrase(
        targets.length
      );

    if (
      bulkDeleteConfirmGuide
    ) {

      bulkDeleteConfirmGuide.textContent =
        `확인란에 “${phrase}”라고 정확히 입력해야 합니다.`;
    }

    if (
      bulkDeleteConfirmInput
    ) {

      bulkDeleteConfirmInput.placeholder =
        phrase;
    }

    bulkDeleteDialog?.showModal();
  }


  async function runBulkSoftDelete(
    targets,
    reason
  ) {

    const result = {
      success:
        [],

      failed:
        []
    };

    for (
      let index =
        0;
      index <
        targets.length;
      index +=
        1
    ) {

      const customer =
        targets[index];

      if (
        bulkDeleteDialogMessage
      ) {

        bulkDeleteDialogMessage.textContent =
          `${index + 1}/${targets.length} 처리 중 · ${customer.name || '이름 없음'}`;
      }

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
                  customer.id,

                p_reason:
                  reason
              }
            );

        if (
          error
        ) {

          throw error;
        }

        result.success.push(
          customer
        );

        renderBulkDeleteResultRow(
          customer,
          true
        );

      } catch (
        error
      ) {

        console.error(
          'MOOHAE bulk soft delete customer error:',
          customer.id,
          error
        );

        result.failed.push(
          customer
        );

        renderBulkDeleteResultRow(
          customer,
          false
        );
      }
    }

    return result;
  }


  // ============================================================
  // DELETED CUSTOMER BULK PERMANENT DELETE
  // ============================================================

  function isAdminUser() {

    return (
      authContext?.profile?.role ===
        'admin'
    );
  }


  function currentSelectedDeletedCustomers() {

    const deletedById =
      new Map(
        deletedCustomers.map(
          (customer) => [
            customer.id,
            customer
          ]
        )
      );

    return [
      ...selectedDeletedCustomerIds
    ]
      .map(
        (id) =>
          deletedById.get(
            id
          ) ||
          null
      )
      .filter(
        (customer) =>
          Boolean(
            customer?.deleted_at
          )
      );
  }


  function expectedBulkPermanentDeletePhrase(
    count
  ) {

    return `${count}명 영구삭제`;
  }


  function resetBulkPermanentDeleteDialog() {

    bulkPermanentDeleteForm?.reset();

    if (
      bulkPermanentDeleteReason
    ) {

      bulkPermanentDeleteReason.disabled =
        false;
    }

    if (
      bulkPermanentDeleteConfirmInput
    ) {

      bulkPermanentDeleteConfirmInput.disabled =
        false;
    }

    if (
      confirmBulkPermanentDeleteButton
    ) {

      confirmBulkPermanentDeleteButton.hidden =
        false;

      confirmBulkPermanentDeleteButton.disabled =
        false;

      confirmBulkPermanentDeleteButton.textContent =
        '선택 고객 영구삭제';
    }

    if (
      cancelBulkPermanentDeleteButton
    ) {

      cancelBulkPermanentDeleteButton.disabled =
        false;

      cancelBulkPermanentDeleteButton.textContent =
        '취소';
    }

    if (
      closeBulkPermanentDeleteDialogButton
    ) {

      closeBulkPermanentDeleteDialogButton.disabled =
        false;
    }

    if (
      bulkPermanentDeleteResult
    ) {

      bulkPermanentDeleteResult.hidden =
        true;
    }

    bulkPermanentDeleteResultList?.replaceChildren();

    if (
      bulkPermanentDeleteResultSummary
    ) {

      bulkPermanentDeleteResultSummary.textContent =
        '';
    }

    if (
      bulkPermanentDeleteDialogMessage
    ) {

      bulkPermanentDeleteDialogMessage.textContent =
        '';
    }
  }


  function closeBulkPermanentDeleteDialog() {

    if (
      bulkPermanentDeleteInProgress
    ) {

      return;
    }

    if (
      bulkPermanentDeleteDialog?.open
    ) {

      bulkPermanentDeleteDialog.close();
    }

    resetBulkPermanentDeleteDialog();
  }


  function updateBulkPermanentSelectionUi(
    filteredDeletedIds =
      currentFilteredDeletedCustomerIds
  ) {

    const available =
      currentCustomerView ===
        'deleted' &&
      isAdminUser();

    if (
      bulkPermanentCustomerActions
    ) {

      bulkPermanentCustomerActions.hidden =
        !available;
    }

    if (
      !available
    ) {

      selectedDeletedCustomerIds.clear();
      currentFilteredDeletedCustomerIds =
        [];

      if (
        selectVisibleDeletedCustomersCheckbox
      ) {

        selectVisibleDeletedCustomersCheckbox.checked =
          false;

        selectVisibleDeletedCustomersCheckbox.indeterminate =
          false;
      }

      if (
        selectedDeletedCustomerCount
      ) {

        selectedDeletedCustomerCount.textContent =
          '0명 선택';
      }

      if (
        openBulkPermanentDeleteButton
      ) {

        openBulkPermanentDeleteButton.disabled =
          true;
      }

      return;
    }

    currentFilteredDeletedCustomerIds =
      Array.isArray(
        filteredDeletedIds
      )
        ? [
            ...filteredDeletedIds
          ]
        : [];

    const visibleIds =
      new Set(
        currentFilteredDeletedCustomerIds
      );

    for (
      const id
      of [
        ...selectedDeletedCustomerIds
      ]
    ) {

      if (
        !visibleIds.has(
          id
        )
      ) {

        selectedDeletedCustomerIds.delete(
          id
        );
      }
    }

    const selectedCount =
      selectedDeletedCustomerIds.size;

    const visibleCount =
      currentFilteredDeletedCustomerIds.length;

    if (
      selectedDeletedCustomerCount
    ) {

      selectedDeletedCustomerCount.textContent =
        `${selectedCount}명 선택`;
    }

    if (
      selectVisibleDeletedCustomersCheckbox
    ) {

      selectVisibleDeletedCustomersCheckbox.disabled =
        visibleCount ===
          0 ||
        bulkPermanentDeleteInProgress;

      selectVisibleDeletedCustomersCheckbox.checked =
        visibleCount >
          0 &&
        selectedCount ===
          visibleCount;

      selectVisibleDeletedCustomersCheckbox.indeterminate =
        selectedCount >
          0 &&
        selectedCount <
          visibleCount;
    }

    if (
      openBulkPermanentDeleteButton
    ) {

      openBulkPermanentDeleteButton.disabled =
        selectedCount ===
          0 ||
        bulkPermanentDeleteInProgress;
    }
  }


  function renderBulkPermanentDeleteResultRow(
    customer,
    ok,
    detail = ''
  ) {

    if (
      !bulkPermanentDeleteResultList
    ) {

      return;
    }

    const row =
      make(
        'div',
        `bulk-delete-result-row ${
          ok
            ? 'is-success'
            : 'is-failed'
        }`
      );

    row.append(
      make(
        'strong',
        '',
        customer.name ||
          '이름 없음'
      ),
      make(
        'span',
        '',
        ok
          ? '영구삭제 완료'
          : `실패${
              detail
                ? ` · ${detail}`
                : ' · 다시 시도'
            }`
      )
    );

    bulkPermanentDeleteResultList.appendChild(
      row
    );
  }


  function openBulkPermanentDeleteDialogForSelection() {

    if (
      bulkPermanentDeleteInProgress ||
      currentCustomerView !==
        'deleted' ||
      !isAdminUser()
    ) {

      return;
    }

    const targets =
      currentSelectedDeletedCustomers();

    if (
      targets.length ===
        0
    ) {

      updateBulkPermanentSelectionUi();
      return;
    }

    resetBulkPermanentDeleteDialog();

    const previewNames =
      targets
        .slice(
          0,
          5
        )
        .map(
          (customer) =>
            customer.name ||
            '이름 없음'
        );

    const extraCount =
      targets.length -
      previewNames.length;

    if (
      bulkPermanentDeleteTargetSummary
    ) {

      bulkPermanentDeleteTargetSummary.textContent =
        `선택 고객 ${targets.length}명 · ${previewNames.join(
          ', '
        )}${
          extraCount >
            0
            ? ` 외 ${extraCount}명`
            : ''
        }`;
    }

    const phrase =
      expectedBulkPermanentDeletePhrase(
        targets.length
      );

    if (
      bulkPermanentDeleteConfirmGuide
    ) {

      bulkPermanentDeleteConfirmGuide.textContent =
        `복구할 수 없습니다. 확인란에 “${phrase}”라고 정확히 입력해야 합니다.`;
    }

    if (
      bulkPermanentDeleteConfirmInput
    ) {

      bulkPermanentDeleteConfirmInput.placeholder =
        phrase;
    }

    bulkPermanentDeleteDialog?.showModal();
  }


  async function removeStorageFilesForPermanentDelete(
    mediaRows
  ) {

    const groups =
      new Map();

    for (
      const row
      of mediaRows || []
    ) {

      const bucket =
        String(
          row?.storage_bucket ||
          ''
        ).trim();

      const path =
        String(
          row?.storage_path ||
          ''
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
          new Set()
        );
      }

      groups
        .get(
          bucket
        )
        .add(
          path
        );
    }

    for (
      const [
        bucket,
        pathSet
      ]
      of groups.entries()
    ) {

      const paths =
        [
          ...pathSet
        ];

      for (
        let index =
          0;
        index <
          paths.length;
        index +=
          100
      ) {

        const batch =
          paths.slice(
            index,
            index +
              100
          );

        const {
          error
        } =
          await window
            .moohaeSupabase
            .storage
            .from(
              bucket
            )
            .remove(
              batch
            );

        if (
          error
        ) {

          throw error;
        }
      }
    }
  }


  async function runBulkPermanentDelete(
    targets,
    reason
  ) {

    const result = {
      success:
        [],

      failed:
        []
    };

    for (
      let index =
        0;
      index <
        targets.length;
      index +=
        1
    ) {

      const customer =
        targets[index];

      let stage =
        '삭제 준비';

      try {

        if (
          !customer?.deleted_at
        ) {

          throw new Error(
            'CUSTOMER_NOT_SOFT_DELETED'
          );
        }

        if (
          bulkPermanentDeleteDialogMessage
        ) {

          bulkPermanentDeleteDialogMessage.textContent =
            `${index + 1}/${targets.length} · ${customer.name || '이름 없음'} · CARE 사진 확인 중`;
        }

        stage =
          'CARE 사진 확인';

        const {
          data:
            mediaRows,
          error:
            prepareError
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_prepare_permanent_customer_delete',
              {
                p_customer_id:
                  customer.id
              }
            );

        if (
          prepareError
        ) {

          throw prepareError;
        }

        stage =
          'CARE 사진 삭제';

        if (
          bulkPermanentDeleteDialogMessage
        ) {

          bulkPermanentDeleteDialogMessage.textContent =
            `${index + 1}/${targets.length} · ${customer.name || '이름 없음'} · CARE 사진 삭제 중`;
        }

        await removeStorageFilesForPermanentDelete(
          Array.isArray(
            mediaRows
          )
            ? mediaRows
            : []
        );

        stage =
          'CARE 사진 metadata 삭제';

        const {
          error:
            mediaCleanupError
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_delete_customer_care_media_metadata',
              {
                p_customer_id:
                  customer.id
              }
            );

        if (
          mediaCleanupError
        ) {

          throw mediaCleanupError;
        }

        stage =
          '고객 데이터 영구삭제';

        if (
          bulkPermanentDeleteDialogMessage
        ) {

          bulkPermanentDeleteDialogMessage.textContent =
            `${index + 1}/${targets.length} · ${customer.name || '이름 없음'} · DB 영구삭제 중`;
        }

        const {
          error:
            deleteError
        } =
          await window
            .moohaeSupabase
            .rpc(
              'admin_permanently_delete_customer',
              {
                p_customer_id:
                  customer.id,

                p_reason:
                  reason
              }
            );

        if (
          deleteError
        ) {

          throw deleteError;
        }

        result.success.push(
          customer
        );

        renderBulkPermanentDeleteResultRow(
          customer,
          true
        );

      } catch (
        error
      ) {

        console.error(
          'MOOHAE bulk permanent delete customer error:',
          customer?.id,
          stage,
          error
        );

        result.failed.push({
          customer,
          stage
        });

        renderBulkPermanentDeleteResultRow(
          customer,
          false,
          stage
        );
      }

      if (
        bulkPermanentDeleteResultSummary
      ) {

        bulkPermanentDeleteResultSummary.textContent =
          `처리 ${index + 1}/${targets.length} · 완료 ${result.success.length}명 · 실패 ${result.failed.length}명`;
      }
    }

    return result;
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


        // --------------------------------------------------------
        // ACTIVE CUSTOMERS
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // DELETED CUSTOMERS
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // LATEST CHECK DATA
        // --------------------------------------------------------

        window
          .moohaeSupabase
          .from(
            'diagnoses'
          )
          .select(
            `
              id,
              customer_id,

              customer_type,
              check_version,
              recommended_plan,

              facility_name,
              facility_focus_areas,
              facility_pain_point,
              facility_management_method,
              facility_care_need_areas,
              facility_decision_factor,
              facility_service_preference,
              facility_sales_preference,

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


    if (
      activeCustomersTabCount
    ) {

      activeCustomersTabCount.textContent =
        String(
          customers.length
        );
    }

    if (
      deletedCustomersTabCount
    ) {

      deletedCustomersTabCount.textContent =
        String(
          deletedCustomers.length
        );
    }
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


    activeCustomersTab?.classList.toggle(
      'is-active',
      !deleted
    );

    deletedCustomersTab?.classList.toggle(
      'is-active',
      deleted
    );

    activeCustomersTab?.setAttribute(
      'aria-selected',
      String(
        !deleted
      )
    );

    deletedCustomersTab?.setAttribute(
      'aria-selected',
      String(
        deleted
      )
    );

    if (
      statusFilter
    ) {

      statusFilter.disabled =
        deleted;
    }

    selectedCustomerIds.clear();

    updateBulkSelectionUi(
      []
    );

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

    if (
      !customerList
    ) {

      return;
    }

    const term =
      customerSearch
        ?.value
        ?.trim()
        ?.toLowerCase() ||
      '';

    const selectedStatus =
      statusFilter?.value ||
      'all';

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

            publicCheckLabel(
              diagnosis
            ),

            diagnosis?.recommended_plan ||
              '',

            diagnosis?.result_level ||
              '',

            diagnosis?.facility_name ||
              '',

            arrayText(
              diagnosis?.facility_focus_areas
            ),

            diagnosis?.facility_pain_point ||
              '',

            diagnosis?.facility_management_method ||
              '',

            arrayText(
              diagnosis?.facility_care_need_areas
            ),

            diagnosis?.facility_decision_factor ||
              '',

            diagnosis?.facility_service_preference ||
              '',

            diagnosis?.facility_sales_preference ||
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


    if (
      currentCustomerView ===
        'active'
    ) {

      updateBulkSelectionUi(
        filtered.map(
          (customer) =>
            customer.id
        )
      );

      updateBulkPermanentSelectionUi(
        []
      );

    } else {

      updateBulkSelectionUi(
        []
      );

      updateBulkPermanentSelectionUi(
        filtered.map(
          (customer) =>
            customer.id
        )
      );
    }


    customerList.replaceChildren();

    if (
      emptyCustomers
    ) {

      emptyCustomers.hidden =
        filtered.length !==
        0;
    }


    if (
      filtered.length ===
      0
    ) {

      if (
        currentCustomerView ===
          'deleted'
      ) {

        if (
          emptyCustomersTitle
        ) {

          emptyCustomersTitle.textContent =
            '삭제된 고객이 없습니다.';
        }

        if (
          emptyCustomersText
        ) {

          emptyCustomersText.textContent =
            '삭제 처리한 고객은 복구 가능한 상태로 이곳에 표시됩니다.';
        }

      } else {

        if (
          emptyCustomersTitle
        ) {

          emptyCustomersTitle.textContent =
            '아직 등록된 고객이 없습니다.';
        }

        if (
          emptyCustomersText
        ) {

          emptyCustomersText.textContent =
            '무료 진단이 접수되면 고객이 자동으로 이곳에 표시됩니다.';
        }
      }

      return;
    }


    for (
      const customer
      of filtered
    ) {


      // ========================================================
      // DELETED CUSTOMER
      // ========================================================

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

        if (
          isAdminUser()
        ) {

          const wrapper =
            make(
              'article',
              'customer-row-wrap deleted-customer-row-wrap'
            );

          const selectionLabel =
            make(
              'label',
              'customer-select-control deleted-customer-select-control'
            );

          const selectionInput =
            document.createElement(
              'input'
            );

          selectionInput.type =
            'checkbox';

          selectionInput.checked =
            selectedDeletedCustomerIds.has(
              customer.id
            );

          selectionInput.disabled =
            bulkPermanentDeleteInProgress;

          selectionInput.setAttribute(
            'aria-label',
            `${customer.name || '이름 없음'} 삭제 고객 영구삭제 대상으로 선택`
          );

          selectionInput.addEventListener(
            'change',
            () => {

              if (
                currentCustomerView !==
                  'deleted' ||
                !isAdminUser() ||
                bulkPermanentDeleteInProgress
              ) {

                selectionInput.checked =
                  selectedDeletedCustomerIds.has(
                    customer.id
                  );

                return;
              }

              if (
                selectionInput.checked
              ) {

                selectedDeletedCustomerIds.add(
                  customer.id
                );

              } else {

                selectedDeletedCustomerIds.delete(
                  customer.id
                );
              }

              updateBulkPermanentSelectionUi();
            }
          );

          selectionLabel.appendChild(
            selectionInput
          );

          wrapper.append(
            selectionLabel,
            row
          );

          customerList.appendChild(
            wrapper
          );

        } else {

          customerList.appendChild(
            row
          );
        }

        continue;
      }


      // ========================================================
      // ACTIVE CUSTOMER
      // ========================================================

      const diagnosis =
        latestDiagnosisByCustomer.get(
          customer.id
        );

      const row =
        make(
          'article',
          'customer-row-wrap'
        );

      const selectionLabel =
        make(
          'label',
          'customer-select-control'
        );

      const selectionInput =
        document.createElement(
          'input'
        );

      selectionInput.type =
        'checkbox';

      selectionInput.checked =
        selectedCustomerIds.has(
          customer.id
        );

      selectionInput.setAttribute(
        'aria-label',
        `${customer.name || '이름 없음'} 고객 선택`
      );

      selectionInput.addEventListener(
        'change',
        () => {

          if (
            currentCustomerView !==
              'active' ||
            bulkDeleteInProgress
          ) {

            selectionInput.checked =
              selectedCustomerIds.has(
                customer.id
              );

            return;
          }

          if (
            selectionInput.checked
          ) {

            selectedCustomerIds.add(
              customer.id
            );

          } else {

            selectedCustomerIds.delete(
              customer.id
            );
          }

          updateBulkSelectionUi();
        }
      );

      selectionLabel.appendChild(
        selectionInput
      );

      const link =
        make(
          'a',
          'customer-row customer-row-link'
        );

      link.href =
        `./customer-detail.html?id=${encodeURIComponent(
          customer.id
        )}`;


      // --------------------------------------------------------
      // PROFILE
      // --------------------------------------------------------

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


      // --------------------------------------------------------
      // CHECK PROFILE
      // --------------------------------------------------------

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


      // --------------------------------------------------------
      // RESULT
      // --------------------------------------------------------

      const result =
        make(
          'div',
          'customer-result'
        );

      const resultLabel =
        publicCheckLabel(
          diagnosis
        );

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


      // --------------------------------------------------------
      // STATUS
      // --------------------------------------------------------

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

      row.append(
        selectionLabel,
        link
      );

      customerList.appendChild(
        row
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

      authContext =
        auth;

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

      if (
        dashboardMessage
      ) {

        dashboardMessage.textContent =
          '고객 데이터를 불러오는 중 오류가 발생했습니다.';
      }

      customerList?.replaceChildren();

      if (
        emptyCustomers
      ) {

        emptyCustomers.hidden =
          false;
      }
    }
  }


  // ============================================================
  // CUSTOMER EVENTS
  // ============================================================

  customerSearch?.addEventListener(
    'input',
    renderCustomers
  );

  statusFilter?.addEventListener(
    'change',
    renderCustomers
  );

  activeCustomersTab?.addEventListener(
    'click',
    () => {

      setCustomerView(
        'active'
      );
    }
  );

  deletedCustomersTab?.addEventListener(
    'click',
    () => {

      setCustomerView(
        'deleted'
      );
    }
  );


  // ============================================================
  // ACTIVE CUSTOMER BULK SOFT DELETE EVENTS
  // ============================================================

  selectVisibleCustomersCheckbox?.addEventListener(
    'change',
    () => {

      if (
        currentCustomerView !==
          'active' ||
        bulkDeleteInProgress
      ) {

        updateBulkSelectionUi();
        return;
      }

      if (
        selectVisibleCustomersCheckbox.checked
      ) {

        for (
          const id
          of currentFilteredActiveCustomerIds
        ) {

          selectedCustomerIds.add(
            id
          );
        }

      } else {

        for (
          const id
          of currentFilteredActiveCustomerIds
        ) {

          selectedCustomerIds.delete(
            id
          );
        }
      }

      renderCustomers();
    }
  );


  openBulkDeleteButton?.addEventListener(
    'click',
    openBulkDeleteDialogForSelection
  );


  closeBulkDeleteDialogButton?.addEventListener(
    'click',
    closeBulkDeleteDialog
  );


  cancelBulkDeleteButton?.addEventListener(
    'click',
    closeBulkDeleteDialog
  );


  bulkDeleteDialog?.addEventListener(
    'cancel',
    (event) => {

      event.preventDefault();
      closeBulkDeleteDialog();
    }
  );


  bulkDeleteForm?.addEventListener(
    'submit',
    async (
      event
    ) => {

      event.preventDefault();

      if (
        bulkDeleteInProgress ||
        currentCustomerView !==
          'active'
      ) {

        return;
      }

      const targets =
        currentSelectedActiveCustomers();

      if (
        targets.length ===
          0
      ) {

        if (
          bulkDeleteDialogMessage
        ) {

          bulkDeleteDialogMessage.textContent =
            '삭제 처리할 활성 고객이 없습니다. 목록에서 다시 선택해주세요.';
        }

        return;
      }

      const reason =
        bulkDeleteReason
          ?.value
          ?.trim() ||
        '';

      const confirmText =
        bulkDeleteConfirmInput
          ?.value
          ?.trim() ||
        '';

      const expectedPhrase =
        expectedBulkDeletePhrase(
          targets.length
        );

      if (
        reason.length <
          2
      ) {

        bulkDeleteDialogMessage.textContent =
          '삭제 사유를 2자 이상 입력해주세요.';

        return;
      }

      if (
        reason.length >
          500
      ) {

        bulkDeleteDialogMessage.textContent =
          '삭제 사유는 500자 이내로 입력해주세요.';

        return;
      }

      if (
        confirmText !==
          expectedPhrase
      ) {

        bulkDeleteDialogMessage.textContent =
          `확인란에 “${expectedPhrase}”라고 정확히 입력해주세요.`;

        return;
      }

      bulkDeleteInProgress =
        true;

      updateBulkSelectionUi();

      if (
        bulkDeleteResult
      ) {

        bulkDeleteResult.hidden =
          false;
      }

      bulkDeleteResultList?.replaceChildren();

      if (
        bulkDeleteResultSummary
      ) {

        bulkDeleteResultSummary.textContent =
          `0/${targets.length} 처리 완료`;
      }

      bulkDeleteReason.disabled =
        true;

      bulkDeleteConfirmInput.disabled =
        true;

      cancelBulkDeleteButton.disabled =
        true;

      closeBulkDeleteDialogButton.disabled =
        true;

      confirmBulkDeleteButton.disabled =
        true;

      confirmBulkDeleteButton.textContent =
        '삭제 처리 중...';

      const result =
        await runBulkSoftDelete(
          targets,
          reason
        );

      const processedCount =
        result.success.length +
        result.failed.length;

      if (
        bulkDeleteResultSummary
      ) {

        bulkDeleteResultSummary.textContent =
          `완료 ${result.success.length}명 · 실패 ${result.failed.length}명 · 총 ${processedCount}명`;
      }

      selectedCustomerIds.clear();

      let refreshError =
        null;

      try {

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

        refreshError =
          error;

        console.error(
          'MOOHAE bulk soft delete refresh error:',
          error
        );
      }

      bulkDeleteInProgress =
        false;

      closeBulkDeleteDialogButton.disabled =
        false;

      cancelBulkDeleteButton.disabled =
        false;

      cancelBulkDeleteButton.textContent =
        '닫기';

      confirmBulkDeleteButton.hidden =
        true;

      updateBulkSelectionUi();

      if (
        refreshError
      ) {

        bulkDeleteDialogMessage.textContent =
          '고객별 삭제 처리 결과는 아래와 같습니다. 다만 목록 새로고침에 실패했으므로 창을 닫고 페이지를 새로고침해 확인해주세요.';

        dashboardMessage.textContent =
          '일괄 삭제 후 목록 새로고침에 실패했습니다. 페이지를 새로고침해주세요.';

      } else if (
        result.failed.length >
          0
      ) {

        bulkDeleteDialogMessage.textContent =
          '실패한 고객은 활성 고객 목록에 남아 있습니다. 창을 닫은 뒤 해당 고객만 다시 선택해 재시도해주세요.';

        dashboardMessage.textContent =
          `일괄 삭제: ${result.success.length}명 완료, ${result.failed.length}명 실패. 실패 고객은 목록에 남아 있습니다.`;

      } else {

        bulkDeleteDialogMessage.textContent =
          `${result.success.length}명 모두 삭제 처리되었습니다. 기존 CHECK · CARE · REPORT 기록은 보존됩니다.`;

        dashboardMessage.textContent =
          `${result.success.length}명의 고객을 삭제 처리했습니다.`;
      }
    }
  );


  // ============================================================
  // DELETED CUSTOMER BULK PERMANENT DELETE EVENTS
  // ============================================================

  selectVisibleDeletedCustomersCheckbox?.addEventListener(
    'change',
    () => {

      if (
        currentCustomerView !==
          'deleted' ||
        !isAdminUser() ||
        bulkPermanentDeleteInProgress
      ) {

        updateBulkPermanentSelectionUi();
        return;
      }

      if (
        selectVisibleDeletedCustomersCheckbox.checked
      ) {

        for (
          const id
          of currentFilteredDeletedCustomerIds
        ) {

          selectedDeletedCustomerIds.add(
            id
          );
        }

      } else {

        for (
          const id
          of currentFilteredDeletedCustomerIds
        ) {

          selectedDeletedCustomerIds.delete(
            id
          );
        }
      }

      renderCustomers();
    }
  );


  openBulkPermanentDeleteButton?.addEventListener(
    'click',
    openBulkPermanentDeleteDialogForSelection
  );


  closeBulkPermanentDeleteDialogButton?.addEventListener(
    'click',
    closeBulkPermanentDeleteDialog
  );


  cancelBulkPermanentDeleteButton?.addEventListener(
    'click',
    closeBulkPermanentDeleteDialog
  );


  bulkPermanentDeleteDialog?.addEventListener(
    'cancel',
    (event) => {

      event.preventDefault();
      closeBulkPermanentDeleteDialog();
    }
  );


  bulkPermanentDeleteForm?.addEventListener(
    'submit',
    async (
      event
    ) => {

      event.preventDefault();

      if (
        bulkPermanentDeleteInProgress ||
        currentCustomerView !==
          'deleted' ||
        !isAdminUser()
      ) {

        return;
      }

      const targets =
        currentSelectedDeletedCustomers();

      if (
        targets.length ===
          0
      ) {

        if (
          bulkPermanentDeleteDialogMessage
        ) {

          bulkPermanentDeleteDialogMessage.textContent =
            '영구삭제할 삭제 고객이 없습니다. 목록에서 다시 선택해주세요.';
        }

        return;
      }

      const reason =
        bulkPermanentDeleteReason
          ?.value
          ?.trim() ||
        '';

      const confirmText =
        bulkPermanentDeleteConfirmInput
          ?.value
          ?.trim() ||
        '';

      const expectedPhrase =
        expectedBulkPermanentDeletePhrase(
          targets.length
        );

      if (
        reason.length <
          2
      ) {

        bulkPermanentDeleteDialogMessage.textContent =
          '영구 삭제 사유를 2자 이상 입력해주세요.';

        return;
      }

      if (
        reason.length >
          500
      ) {

        bulkPermanentDeleteDialogMessage.textContent =
          '영구 삭제 사유는 500자 이내로 입력해주세요.';

        return;
      }

      if (
        confirmText !==
          expectedPhrase
      ) {

        bulkPermanentDeleteDialogMessage.textContent =
          `확인란에 “${expectedPhrase}”라고 정확히 입력해주세요.`;

        return;
      }

      bulkPermanentDeleteInProgress =
        true;

      updateBulkPermanentSelectionUi();

      if (
        bulkPermanentDeleteResult
      ) {

        bulkPermanentDeleteResult.hidden =
          false;
      }

      bulkPermanentDeleteResultList?.replaceChildren();

      if (
        bulkPermanentDeleteResultSummary
      ) {

        bulkPermanentDeleteResultSummary.textContent =
          `0/${targets.length} 처리 완료`;
      }

      bulkPermanentDeleteReason.disabled =
        true;

      bulkPermanentDeleteConfirmInput.disabled =
        true;

      cancelBulkPermanentDeleteButton.disabled =
        true;

      closeBulkPermanentDeleteDialogButton.disabled =
        true;

      confirmBulkPermanentDeleteButton.disabled =
        true;

      confirmBulkPermanentDeleteButton.textContent =
        '영구삭제 처리 중...';

      const result =
        await runBulkPermanentDelete(
          targets,
          reason
        );

      const processedCount =
        result.success.length +
        result.failed.length;

      if (
        bulkPermanentDeleteResultSummary
      ) {

        bulkPermanentDeleteResultSummary.textContent =
          `완료 ${result.success.length}명 · 실패 ${result.failed.length}명 · 총 ${processedCount}명`;
      }

      selectedDeletedCustomerIds.clear();

      let refreshError =
        null;

      try {

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

        if (
          countErrors.some(
            Boolean
          )
        ) {

          throw new Error(
            'COUNT_REFRESH_FAILED'
          );
        }

      } catch (
        error
      ) {

        refreshError =
          error;

        console.error(
          'MOOHAE bulk permanent delete refresh error:',
          error
        );
      }

      bulkPermanentDeleteInProgress =
        false;

      closeBulkPermanentDeleteDialogButton.disabled =
        false;

      cancelBulkPermanentDeleteButton.disabled =
        false;

      cancelBulkPermanentDeleteButton.textContent =
        '닫기';

      confirmBulkPermanentDeleteButton.hidden =
        true;

      updateBulkPermanentSelectionUi();

      if (
        refreshError
      ) {

        bulkPermanentDeleteDialogMessage.textContent =
          '고객별 영구삭제 결과는 아래와 같습니다. 다만 목록 또는 집계 새로고침에 실패했으므로 창을 닫고 페이지를 새로고침해 확인해주세요.';

        dashboardMessage.textContent =
          '일괄 영구삭제 후 화면 새로고침에 실패했습니다. 페이지를 새로고침해주세요.';

      } else if (
        result.failed.length >
          0
      ) {

        bulkPermanentDeleteDialogMessage.textContent =
          '성공 고객은 복구할 수 없도록 영구삭제되었습니다. 실패 고객은 삭제된 고객 목록에 남아 있으며 다시 선택해 재시도할 수 있습니다.';

        dashboardMessage.textContent =
          `일괄 영구삭제: ${result.success.length}명 완료, ${result.failed.length}명 실패.`;

      } else {

        bulkPermanentDeleteDialogMessage.textContent =
          `${result.success.length}명 모두 영구삭제되었습니다. 고객 데이터와 연결된 CARE 사진 Storage 파일도 삭제 처리되었습니다.`;

        dashboardMessage.textContent =
          `${result.success.length}명의 고객을 영구삭제했습니다.`;
      }
    }
  );


  // ============================================================
  // BOOKING EVENTS
  // ============================================================

  bookingCalendar?.addEventListener(
    'click',
    handleBookingAction
  );

  bookingPrevButton?.addEventListener(
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

  bookingNextButton?.addEventListener(
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

  logoutButton?.addEventListener(
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