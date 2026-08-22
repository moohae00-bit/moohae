(() => {
  'use strict';

  const bookingCalendar =
    document.getElementById('bookingCalendar');

  const bookingMessage =
    document.getElementById('bookingMessage');

  if (
    !bookingCalendar ||
    !bookingMessage
  ) {
    return;
  }

  // 고정된 same-origin 경로만 사용.
  // 사용자 입력이나 URL parameter를 redirect 대상으로 사용하지 않는다.
  const MAIN_PAGE_PATH =
    './index.html';

  const REDIRECT_DELAY_MS =
    1800;

  let redirectScheduled =
    false;


  function isBookingComplete() {
    return Boolean(
      bookingCalendar.querySelector(
        '.booking-complete'
      ) &&
      bookingMessage.classList.contains(
        'success'
      )
    );
  }


  function scheduleRedirect() {
    if (
      redirectScheduled ||
      !isBookingComplete()
    ) {
      return;
    }

    redirectScheduled =
      true;

    window.setTimeout(
      () => {
        window.location.assign(
          MAIN_PAGE_PATH
        );
      },
      REDIRECT_DELAY_MS
    );
  }


  const observer =
    new MutationObserver(
      scheduleRedirect
    );


  observer.observe(
    bookingCalendar,
    {
      childList: true,
      subtree: true
    }
  );


  observer.observe(
    bookingMessage,
    {
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        'class'
      ]
    }
  );


  // 이미 완료 상태에서 로드된 경우까지 방어
  scheduleRedirect();
})();