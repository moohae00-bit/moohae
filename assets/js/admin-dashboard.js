(() => {
  'use strict';

  const identity = document.getElementById('adminIdentity');
  const logoutButton = document.getElementById('logoutButton');
  const dashboardMessage = document.getElementById('dashboardMessage');
  const customerList = document.getElementById('customerList');
  const emptyCustomers = document.getElementById('emptyCustomers');
  const customerSearch = document.getElementById('customerSearch');
  const statusFilter = document.getElementById('statusFilter');

  const bookingCalendar = document.getElementById('bookingCalendar');
  const bookingMessage = document.getElementById('bookingMessage');
  const emptyBookings = document.getElementById('emptyBookings');
  const bookingRangeLabel = document.getElementById('bookingRangeLabel');
  const bookingPrevButton = document.getElementById('bookingPrevButton');
  const bookingNextButton = document.getElementById('bookingNextButton');

  const countTargets = {
    customers: document.getElementById('customerCount'),
    diagnoses: document.getElementById('diagnosisCount'),
    care_visits: document.getElementById('visitCount'),
    reports: document.getElementById('reportCount')
  };

  const STATUS_LABELS = {
    new: '신규 문의',
    consulting: '상담 중',
    visit_scheduled: '방문 예정',
    care_completed: '케어 완료',
    follow_up: '재관리 대상',
    closed: '종료'
  };

  const BOOKING_DAYS = 14;
  const BOOKING_PAGE_STEP = 7;

  let customers = [];
  let latestDiagnosisByCustomer = new Map();

  let bookingStartDate = new Date();
  bookingStartDate = new Date(
    bookingStartDate.getFullYear(),
    bookingStartDate.getMonth(),
    bookingStartDate.getDate()
  );

  const make = (tag, className, text = '') => {
    const node = document.createElement(tag);

    if (className) {
      node.className = className;
    }

    if (text) {
      node.textContent = text;
    }

    return node;
  };

  const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const bookingIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const bookingAddDays = (date, days) => {
    const next = new Date(date);

    next.setDate(
      next.getDate() + days
    );

    return next;
  };

  const bookingTime = (value) => {
    if (typeof value !== 'string') {
      return '—';
    }

    return value.slice(0, 5);
  };

  const bookingDateLabel = (value) => {
    if (!value) {
      return '—';
    }

    const date = new Date(
      `${value}T00:00:00`
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return new Intl.DateTimeFormat(
      'ko-KR',
      {
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
      }
    ).format(date);
  };

  function setBookingMessage(
    text,
    error = false
  ) {
    bookingMessage.textContent = text;

    bookingMessage.classList.toggle(
      'error',
      error
    );
  }

  async function requireAuthorizedAdmin() {
    if (!window.moohaeSupabaseConfigReady) {
      window.location.replace(
        './login.html'
      );

      return null;
    }

    const {
      data,
      error
    } =
      await window.moohaeSupabase.auth.getUser();

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
      await window.moohaeSupabase
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

    if (!allowed) {
      await window.moohaeSupabase.auth.signOut();

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

  async function loadCount(
    tableName,
    target
  ) {
    const {
      count,
      error
    } =
      await window.moohaeSupabase
        .from(tableName)
        .select(
          'id',
          {
            count: 'exact',
            head: true
          }
        );

    target.textContent =
      error
        ? '—'
        : String(count ?? 0);

    return error;
  }

  async function loadCustomers() {
    const {
      data: customerRows,
      error: customerError
    } =
      await window.moohaeSupabase
        .from('customers')
        .select(
          'id, name, phone, status, privacy_consent, created_at'
        )
        .order(
          'created_at',
          {
            ascending: false
          }
        )
        .limit(200);

    if (customerError) {
      throw customerError;
    }

    customers =
      Array.isArray(customerRows)
        ? customerRows
        : [];

    const {
      data: diagnosisRows,
      error: diagnosisError
    } =
      await window.moohaeSupabase
        .from('diagnoses')
        .select(
          'id, customer_id, allergy_concerns, result_level, created_at'
        )
        .order(
          'created_at',
          {
            ascending: false
          }
        )
        .limit(500);

    if (diagnosisError) {
      throw diagnosisError;
    }

    latestDiagnosisByCustomer =
      new Map();

    for (
      const diagnosis
      of diagnosisRows || []
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
  }

  function renderCustomers() {
    const term =
      customerSearch.value
        .trim()
        .toLowerCase();

    const selectedStatus =
      statusFilter.value;

    const filtered =
      customers.filter(
        (customer) => {

          if (
            selectedStatus !== 'all' &&
            customer.status !== selectedStatus
          ) {
            return false;
          }

          if (!term) {
            return true;
          }

          const diagnosis =
            latestDiagnosisByCustomer.get(
              customer.id
            );

          const allergyText =
            Array.isArray(
              diagnosis?.allergy_concerns
            )
              ? diagnosis.allergy_concerns.join(
                  ' '
                )
              : '';

          const haystack = [
            customer.name || '',
            customer.phone || '',
            STATUS_LABELS[
              customer.status
            ] || '',
            allergyText
          ]
            .join(' ')
            .toLowerCase();

          return haystack.includes(
            term
          );
        }
      );

    customerList.replaceChildren();

    emptyCustomers.hidden =
      filtered.length !== 0;

    for (
      const customer
      of filtered
    ) {

      const diagnosis =
        latestDiagnosisByCustomer.get(
          customer.id
        );

      const link = make(
        'a',
        'customer-row'
      );

      link.href =
        `./customer-detail.html?id=${encodeURIComponent(
          customer.id
        )}`;

      const profile = make(
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

      const phone = make(
        'span',
        '',
        customer.phone ||
          '연락처 미등록'
      );

      profile.appendChild(
        phone
      );

      const concern = make(
        'div',
        'customer-concern'
      );

      if (
        Array.isArray(
          diagnosis?.allergy_concerns
        ) &&
        diagnosis.allergy_concerns.length
      ) {

        for (
          const item
          of diagnosis.allergy_concerns.slice(
            0,
            3
          )
        ) {
          concern.appendChild(
            make(
              'span',
              'mini-chip',
              item
            )
          );
        }

      } else {

        concern.appendChild(
          make(
            'span',
            'muted-copy',
            '진단 데이터 없음'
          )
        );
      }

      const result = make(
        'div',
        'customer-result'
      );

      result.appendChild(
        make(
          'strong',
          '',
          diagnosis?.result_level ||
            '—'
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

      const statusWrap = make(
        'div',
        'customer-status'
      );

      const status = make(
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
        .push(row);
    }

    emptyBookings.hidden =
      groups.size !== 0;

    for (
      const [
        date,
        slots
      ]
      of groups
    ) {

      const card = make(
        'article',
        'booking-day-card'
      );

      const head = make(
        'div',
        'booking-day-head'
      );

      const title = make(
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
            slot.manual_open === false
        );

      const dayButton = make(
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

      const list = make(
        'div',
        'booking-slot-list'
      );

      for (
        const row
        of slots
      ) {

        const slot = make(
          'div',
          `booking-slot${row.booking_id ? ' has-booking' : ''}`
        );

        const time = make(
          'strong',
          'booking-time',
          bookingTime(
            row.booking_time
          )
        );

        const content = make(
          'div',
          'booking-slot-content'
        );

        const actions = make(
          'div',
          'booking-slot-actions'
        );

        if (
          row.booking_id
        ) {

          const customerLink =
            make(
              'a',
              'booking-customer-link',
              row.customer_name ||
                '이름 없음'
            );

          customerLink.href =
            `./customer-detail.html?id=${encodeURIComponent(
              row.customer_id
            )}`;

          const meta = make(
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
            customerLink,
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
            row.manual_open === false;

          content.append(
            make(
              'strong',
              `booking-availability ${closed ? 'is-closed' : 'is-open'}`,
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
        await window.moohaeSupabase.rpc(
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

      if (error) {
        throw error;
      }

      renderBookingCalendar(
        Array.isArray(data)
          ? data
          : []
      );

      setBookingMessage(
        '예약 가능 시간과 접수된 예약을 최신 상태로 확인했습니다.'
      );

    } catch (error) {

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
        await window.moohaeSupabase.rpc(
          rpc,
          params
        );

      if (error) {
        throw error;
      }

      setBookingMessage(
        message
      );

      await loadBookingCalendar();

    } catch (error) {

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

  async function handleBookingAction(
    event
  ) {
    const button =
      event.target.closest(
        '[data-booking-action]'
      );

    if (!button) {
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

      return;
    }

    if (
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

      return;
    }

    if (
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

      return;
    }

    if (
      action ===
      'cancel'
    ) {

      const confirmed =
        window.confirm(
          '이 예약을 취소할까요?'
        );

      if (!confirmed) {
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

  async function boot() {
    try {

      const auth =
        await requireAuthorizedAdmin();

      if (!auth) {
        return;
      }

      identity.textContent =
        `${auth.profile.display_name} · ${auth.profile.role}`;

      const countErrors =
        await Promise.all([
          loadCount(
            'customers',
            countTargets.customers
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
        countErrors.some(Boolean)
          ? '로그인은 정상입니다. 일부 집계 데이터를 추가 확인해야 합니다.'
          : '관리자 인증과 고객 데이터 접근 권한이 정상적으로 확인되었습니다.';

    } catch (error) {

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

  customerSearch.addEventListener(
    'input',
    renderCustomers
  );

  statusFilter.addEventListener(
    'change',
    renderCustomers
  );

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

  logoutButton.addEventListener(
    'click',
    async () => {

      logoutButton.disabled =
        true;

      try {

        await window.moohaeSupabase.auth.signOut();

      } finally {

        window.location.replace(
          './login.html'
        );
      }
    }
  );

  boot();
})();