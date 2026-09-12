(() => {
  'use strict';

  const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
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
  const addressInput = document.getElementById('returningBookingAddress');
  const submitButton = document.getElementById('returningBookingSubmit');
  const message = document.getElementById('returningBookingMessage');
  const backReport = document.getElementById('bookingBackReport');
  const backReportError = document.getElementById('bookingBackReportError');

  let bookingToken = '';
  let tokenExpiresAt = '';
  let selectedSlot = null;
  let completed = false;
  let reportToken = '';

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

  function isAddressValid() {
    const value = addressInput.value.trim();
    return value.length >= 5 && value.length <= 500;
  }

  function updateSubmitState() {
    submitButton.disabled = completed || !bookingToken || !selectedSlot || !isAddressValid();
  }

  function clearSelection() {
    selectedSlot = null;
    selection.hidden = true;
    selectionSummary.textContent = '—';
    calendar.querySelectorAll('.booking-time-button').forEach((button) => {
      button.classList.remove('selected');
    });
    updateSubmitState();
  }

  function selectSlot(button, bookingDate, bookingTime) {
    if (completed || !bookingToken) return;
    clearSelection();
    selectedSlot = { bookingDate, bookingTime };
    button.classList.add('selected');
    selectionSummary.textContent = `${formatDate(bookingDate)} ${TIME_LABELS[bookingTime] || bookingTime}`;
    selection.hidden = false;
    updateSubmitState();
    setMessage(isAddressValid() ? '일정과 방문 주소를 확인한 뒤 요청해주세요.' : '방문 주소를 5자 이상 입력해주세요.');
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
        button.addEventListener('click', () => selectSlot(button, date, time));
        row.appendChild(button);
      });
      group.append(label, row);
      calendar.appendChild(group);
    });
  }

  async function loadSlots() {
    const { data, error } = await window.moohaeSupabase.rpc('get_public_booking_slots', { p_days: 30 });
    if (error) throw error;
    renderSlots(Array.isArray(data) ? data : []);
  }

  function issueErrorMessage(code) {
    switch (code) {
      case 'active_booking_exists': return '이미 요청 또는 확정된 방문 일정이 있습니다. 일정 변경이 필요하면 무해에 문의해주세요.';
      case 'report_not_found': return '이 Care Report에서는 재예약을 시작할 수 없습니다.';
      case 'customer_unavailable': return '현재 이 고객 정보로는 재예약을 진행할 수 없습니다.';
      case 'house_unavailable': return 'MOOHAE HOME 정보를 확인할 수 없습니다. 무해에 문의해주세요.';
      default: return '재예약 연결을 확인할 수 없습니다. Care Report 링크를 다시 열어주세요.';
    }
  }

  function bookingErrorMessage(code) {
    switch (code) {
      case 'active_booking_exists': return '이미 요청 또는 확정된 방문 일정이 있습니다.';
      case 'slot_unavailable':
      case 'slot_closed': return '방금 선택한 일정이 마감되었습니다. 다른 일정을 선택해주세요.';
      case 'invalid_address': return '방문 주소를 확인해주세요.';
      case 'invalid_or_expired_token':
      case 'invalid_token': return '예약 연결 시간이 만료되었습니다. Care Report에서 다시 예약을 시작해주세요.';
      case 'holiday_not_available': return '선택한 날짜는 예약할 수 없습니다.';
      case 'booking_time_passed': return '이미 지난 시간입니다. 다른 일정을 선택해주세요.';
      default: return '예약 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }

  async function submitBooking() {
    if (completed || !bookingToken || !selectedSlot || !isAddressValid()) return;
    submitButton.disabled = true;
    submitButton.textContent = '예약 요청 중...';
    setMessage('선택한 일정을 확인하고 있습니다.');

    try {
      const { data, error } = await window.moohaeSupabase.rpc('submit_public_booking_request_v2', {
        p_booking_token: bookingToken,
        p_booking_date: selectedSlot.bookingDate,
        p_booking_time: selectedSlot.bookingTime,
        p_visit_address: addressInput.value.trim()
      });
      if (error) throw error;
      const response = Array.isArray(data) ? data[0] : data;
      if (response?.ok !== true) {
        const code = String(response?.error_code || '');
        if (code === 'slot_unavailable' || code === 'slot_closed') await loadSlots();
        if (code === 'invalid_or_expired_token' || code === 'invalid_token') bookingToken = '';
        setMessage(bookingErrorMessage(code), 'error');
        submitButton.textContent = '이 일정으로 방문 요청하기';
        updateSubmitState();
        return;
      }

      completed = true;
      bookingToken = '';
      tokenExpiresAt = '';
      calendar.replaceChildren();
      selection.hidden = false;
      selectionSummary.textContent = '방문 요청이 접수되었습니다.';
      addressInput.disabled = true;
      submitButton.textContent = '방문 요청 완료';
      submitButton.disabled = true;
      setMessage('담당자가 일정을 확인한 뒤 최종 안내드립니다.', 'success');
    } catch (error) {
      console.error('[MOOHAE] returning booking submit failed', error);
      setMessage('예약 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      submitButton.textContent = '이 일정으로 방문 요청하기';
      updateSubmitState();
    }
  }

  async function start() {
    reportToken = new URLSearchParams(window.location.search).get('report') || '';
    if (!UUID_PATTERN.test(reportToken)) {
      showError('재예약 링크가 올바르지 않습니다. Care Report에서 다시 시작해주세요.');
      return;
    }

    const reportUrl = new URL('./report.html', window.location.href);
    reportUrl.searchParams.set('token', reportToken);
    backReport.href = reportUrl.toString();
    backReportError.href = reportUrl.toString();

    if (!window.moohaeSupabaseConfigReady || !window.moohaeSupabase?.rpc) {
      showError('예약 연결을 확인할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const { data, error } = await window.moohaeSupabase.rpc('issue_returning_booking_token_from_report', {
        p_public_token: reportToken
      });
      if (error) throw error;
      const response = Array.isArray(data) ? data[0] : data;
      if (response?.ok !== true) {
        showError(issueErrorMessage(String(response?.error_code || '')));
        return;
      }

      const rawToken = typeof response.booking_token === 'string' ? response.booking_token : '';
      const rawExpiresAt = typeof response.expires_at === 'string' ? response.expires_at : '';
      if (!TOKEN_PATTERN.test(rawToken) || !rawExpiresAt) {
        showError('예약 연결을 확인할 수 없습니다. Care Report에서 다시 시작해주세요.');
        return;
      }

      bookingToken = rawToken;
      tokenExpiresAt = rawExpiresAt;
      customerName.textContent = String(response.customer_name || '고객');
      addressInput.value = String(response.house_address || '');

      await loadSlots();
      loading.hidden = true;
      errorBox.hidden = true;
      content.hidden = false;
      updateSubmitState();
      setMessage('원하는 날짜와 시간을 선택해주세요.');
    } catch (error) {
      console.error('[MOOHAE] returning booking init failed', error);
      showError('재예약을 준비하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  addressInput.addEventListener('input', updateSubmitState);
  submitButton.addEventListener('click', submitBooking);
  start();
})();
