(() => {
  'use strict';

  const TOKEN_PATTERN = /^[0-9a-f]{64}$/;

  const TIME_LABELS = Object.freeze({
    '10:00': '오전 10:00 ~ 12:30',
    '13:00': '오후 13:00 ~ 15:30',
    '16:00': '오후 16:00 ~ 18:30'
  });

  const loading = document.getElementById('bookingLoading');
  const errorBox = document.getElementById('bookingError');
  const errorMessage = document.getElementById('bookingErrorMessage');
  const content = document.getElementById('bookingContent');
  const customerName = document.getElementById('bookingCustomerName');
  const calendar = document.getElementById('returningBookingCalendar');
  const selection = document.getElementById('returningBookingSelection');
  const selectionSummary = document.getElementById('returningBookingSelectedSummary');
  const savedAddressNode = document.getElementById('savedBookingAddress');
  const changeAddressButton = document.getElementById('changeBookingAddressButton');
  const addressEditor = document.getElementById('bookingAddressEditor');
  const addressInput = document.getElementById('returningBookingAddress');
  const useSavedAddressButton = document.getElementById('useSavedBookingAddressButton');
  const submitButton = document.getElementById('returningBookingSubmit');
  const message = document.getElementById('returningBookingMessage');

  let bookingToken = '';
  let selectedSlot = null;
  let hasHouseAddress = false;
  let completed = false;

  function normalizeTime(value) {
    return String(value || '').slice(0, 5);
  }

  function formatDate(value) {
    const date = new Date(`${value}T00:00:00+09:00`);
    if (Number.isNaN(date.getTime())) return value || '—';

    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(date);
  }

  function setMessage(text, state = '') {
    message.textContent = text || '';
    message.className = 'booking-message';
    if (state) message.classList.add(state);
  }

  function showError(text) {
    bookingToken = '';
    loading.hidden = true;
    content.hidden = true;
    errorMessage.textContent = text;
    errorBox.hidden = false;
  }

  function isAddressValid(value) {
    const normalized = String(value || '').trim();
    return normalized.length >= 5 && normalized.length <= 500;
  }

  function currentVisitAddress() {
    if (!addressEditor.hidden) {
      return addressInput.value.trim();
    }

    return '';
  }

  function addressReady() {
    return addressEditor.hidden
      ? hasHouseAddress
      : isAddressValid(currentVisitAddress());
  }

  function updateSubmitState() {
    submitButton.disabled =
      completed ||
      !bookingToken ||
      !selectedSlot ||
      !addressReady();
  }

  function clearSelection() {
    selectedSlot = null;
    selection.hidden = true;
    selectionSummary.textContent = '—';

    calendar
      .querySelectorAll('.booking-time-button')
      .forEach((button) => {
        button.classList.remove('selected');
      });

    updateSubmitState();
  }

  function selectSlot(button, bookingDate, bookingTime) {
    if (completed || !bookingToken) return;

    clearSelection();
    selectedSlot = { bookingDate, bookingTime };
    button.classList.add('selected');
    selectionSummary.textContent =
      `${formatDate(bookingDate)} ${TIME_LABELS[bookingTime] || bookingTime}`;
    selection.hidden = false;
    updateSubmitState();

    setMessage(
      addressReady()
        ? '선택한 일정을 확인한 뒤 예약을 요청해주세요.'
        : '이번 방문 주소를 입력해주세요.'
    );
  }

  function renderSlots(rows) {
    calendar.replaceChildren();
    clearSelection();

    if (!Array.isArray(rows) || rows.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = '현재 선택 가능한 일정이 없습니다. 잠시 후 다시 확인해주세요.';
      empty.className = 'booking-message';
      calendar.appendChild(empty);
      return;
    }

    const grouped = new Map();

    rows.forEach((row) => {
      const date = String(row.booking_date || '');
      const time = normalizeTime(row.booking_time);

      if (!date || !TIME_LABELS[time]) return;
      if (!grouped.has(date)) grouped.set(date, []);
      grouped.get(date).push(time);
    });

    grouped.forEach((times, date) => {
      const group = document.createElement('section');
      group.className = 'booking-date-group';

      const label = document.createElement('strong');
      label.className = 'booking-date-label';
      label.textContent = formatDate(date);

      const row = document.createElement('div');
      row.className = 'booking-time-row';

      times.forEach((time) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'booking-time-button';
        button.textContent = TIME_LABELS[time];
        button.addEventListener('click', () => {
          selectSlot(button, date, time);
        });
        row.appendChild(button);
      });

      group.append(label, row);
      calendar.appendChild(group);
    });
  }

  async function loadSlots() {
    const { data, error } =
      await window.moohaeSupabase.rpc(
        'get_public_booking_slots',
        { p_days: 30 }
      );

    if (error) throw error;
    renderSlots(Array.isArray(data) ? data : []);
  }

  function contextErrorMessage(code) {
    switch (code) {
      case 'active_booking_exists':
        return '이미 요청 또는 확정된 방문 일정이 있습니다. 일정 변경이 필요하면 무해에 문의해주세요.';

      case 'invalid_token':
      case 'invalid_or_expired_token':
        return '이 일정 링크가 만료되었거나 더 이상 사용할 수 없습니다. 무해에서 받은 최신 메시지의 링크를 이용해주세요.';

      default:
        return '일정 링크를 확인할 수 없습니다. 무해에서 받은 메시지의 링크를 다시 확인해주세요.';
    }
  }

  function bookingErrorMessage(code) {
    switch (code) {
      case 'active_booking_exists':
        return '이미 요청 또는 확정된 방문 일정이 있습니다.';

      case 'slot_unavailable':
      case 'slot_closed':
        return '방금 선택한 일정이 마감되었습니다. 다른 일정을 선택해주세요.';

      case 'address_required':
        return '이번 방문 주소를 입력해주세요.';

      case 'invalid_address':
        return '방문 주소를 확인해주세요.';

      case 'invalid_or_expired_token':
      case 'invalid_token':
        return '일정 링크가 만료되었습니다. 무해에서 받은 최신 메시지의 링크를 다시 열어주세요.';

      case 'holiday_not_available':
        return '선택한 날짜는 예약할 수 없습니다.';

      case 'booking_time_passed':
        return '이미 지난 시간입니다. 다른 일정을 선택해주세요.';

      default:
        return '예약 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }

  function showAddressEditor(force = false) {
    addressEditor.hidden = false;

    if (force) {
      addressInput.focus();
    }

    updateSubmitState();
  }

  function useSavedAddress() {
    if (!hasHouseAddress) return;

    addressInput.value = '';
    addressEditor.hidden = true;
    setMessage(selectedSlot ? '선택한 일정을 확인한 뒤 예약을 요청해주세요.' : '원하는 날짜와 시간을 선택해주세요.');
    updateSubmitState();
  }

  async function submitBooking() {
    const visitAddress = currentVisitAddress();

    if (
      completed ||
      !bookingToken ||
      !selectedSlot ||
      !addressReady()
    ) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = '예약 요청 중...';
    setMessage('선택한 일정을 확인하고 있습니다.');

    try {
      const { data, error } =
        await window.moohaeSupabase.rpc(
          'submit_public_booking_request_v2',
          {
            p_booking_token: bookingToken,
            p_booking_date: selectedSlot.bookingDate,
            p_booking_time: selectedSlot.bookingTime,
            p_visit_address: visitAddress
          }
        );

      if (error) throw error;

      const response = Array.isArray(data) ? data[0] : data;

      if (response?.ok !== true) {
        const code = String(response?.error_code || '');

        if (code === 'slot_unavailable' || code === 'slot_closed') {
          await loadSlots();
        }

        if (code === 'invalid_or_expired_token' || code === 'invalid_token') {
          bookingToken = '';
        }

        setMessage(bookingErrorMessage(code), 'error');
        submitButton.textContent = '이 일정으로 예약 요청';
        updateSubmitState();
        return;
      }

      completed = true;
      bookingToken = '';
      calendar.replaceChildren();
      selection.hidden = false;
      selectionSummary.textContent = '예약 요청이 접수되었습니다.';
      addressInput.disabled = true;
      changeAddressButton.disabled = true;
      useSavedAddressButton.disabled = true;
      submitButton.textContent = '예약 요청 완료';
      submitButton.disabled = true;
      setMessage('담당자가 일정을 확인한 뒤 최종 안내드립니다.', 'success');

    } catch (error) {
      console.error('[MOOHAE] NEXT CARE booking submit failed', error);
      setMessage('예약 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      submitButton.textContent = '이 일정으로 예약 요청';
      updateSubmitState();
    }
  }

  function readTokenAndCleanUrl() {
    const params = new URLSearchParams(window.location.search);
    const token = String(params.get('t') || '').trim().toLowerCase();

    if (!TOKEN_PATTERN.test(token)) {
      return '';
    }

    try {
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname
      );
    } catch (error) {
      console.error('[MOOHAE] booking URL cleanup failed', error);
    }

    return token;
  }

  async function start() {
    bookingToken = readTokenAndCleanUrl();

    if (!bookingToken) {
      showError('일정 링크가 올바르지 않습니다. 무해에서 받은 메시지의 링크를 다시 열어주세요.');
      return;
    }

    if (!window.moohaeSupabaseConfigReady || !window.moohaeSupabase?.rpc) {
      showError('예약 연결을 확인할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const { data, error } =
        await window.moohaeSupabase.rpc(
          'get_returning_booking_context_v2',
          {
            p_booking_token: bookingToken
          }
        );

      if (error) throw error;

      const response = Array.isArray(data) ? data[0] : data;

      if (response?.ok !== true) {
        showError(contextErrorMessage(String(response?.error_code || '')));
        return;
      }

      customerName.textContent = String(response.customer_name || '고객');
      hasHouseAddress = response.has_house_address === true;
      savedAddressNode.textContent = hasHouseAddress
        ? '저장된 HOME 주소로 방문합니다.'
        : '방문 주소를 확인해주세요.';
      addressInput.value = '';

      if (!hasHouseAddress) {
        changeAddressButton.hidden = true;
        useSavedAddressButton.hidden = true;
        showAddressEditor(false);
      }

      await loadSlots();

      loading.hidden = true;
      errorBox.hidden = true;
      content.hidden = false;
      updateSubmitState();
      setMessage('원하는 날짜와 시간을 선택해주세요.');

    } catch (error) {
      console.error('[MOOHAE] NEXT CARE booking init failed', error);
      showError('일정을 준비하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  changeAddressButton.addEventListener('click', () => {
    showAddressEditor(true);
  });

  useSavedAddressButton.addEventListener('click', useSavedAddress);
  addressInput.addEventListener('input', updateSubmitState);
  submitButton.addEventListener('click', submitBooking);

  start();
})();
