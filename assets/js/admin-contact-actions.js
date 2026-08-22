(() => {
  'use strict';

  const phoneTarget =
    document.getElementById(
      'detailPhone'
    );

  if (!phoneTarget) {
    return;
  }


  // ============================================================
  // PHONE NORMALIZATION
  //
  // href에 DB 원문을 그대로 넣지 않고
  // 숫자 및 선행 + 만 허용한다.
  // ============================================================

  function normalizePhone(
    value
  ) {
    if (
      typeof value !== 'string'
    ) {
      return '';
    }

    const trimmed =
      value.trim();

    const hasLeadingPlus =
      trimmed.startsWith('+');

    const digits =
      trimmed.replace(
        /\D/g,
        ''
      );

    // 국제전화 번호 범위를 고려한 최소/최대 길이
    if (
      digits.length < 9 ||
      digits.length > 15
    ) {
      return '';
    }

    return hasLeadingPlus
      ? `+${digits}`
      : digits;
  }


  function buildActionLink(
    label,
    href,
    className
  ) {
    const link =
      document.createElement(
        'a'
      );

    link.className =
      className;

    link.href =
      href;

    link.textContent =
      label;

    link.rel =
      'nofollow';

    link.dataset.contactAction =
      'true';

    return link;
  }


  function enhancePhone() {

    // 이미 전화/문자 버튼이 생성된 경우 중복 생성 방지
    if (
      phoneTarget.querySelector(
        'a[data-contact-action="true"]'
      )
    ) {
      return;
    }

    const visiblePhone =
      phoneTarget.textContent.trim();

    const safePhone =
      normalizePhone(
        visiblePhone
      );

    if (!safePhone) {
      return;
    }


    // 표시용 번호
    const number =
      document.createElement(
        'div'
      );

    number.textContent =
      visiblePhone;


    // 기존 관리자 버튼 디자인 재사용
    const actions =
      document.createElement(
        'div'
      );

    actions.className =
      'report-action-row';


    const callLink =
      buildActionLink(
        '전화하기',
        `tel:${safePhone}`,
        'primary-button report-action-button'
      );


    const smsLink =
      buildActionLink(
        '문자하기',
        `sms:${safePhone}`,
        'secondary-button report-action-button'
      );


    actions.append(
      callLink,
      smsLink
    );


    // innerHTML 사용하지 않음
    phoneTarget.replaceChildren(
      number,
      actions
    );
  }


  // 고객 상세 JS가 비동기로 전화번호를 입력하기 때문에
  // 실제 번호가 들어오는 순간을 감지한다.
  let queued =
    false;


  function queueEnhance() {
    if (queued) {
      return;
    }

    queued =
      true;

    queueMicrotask(
      () => {
        queued =
          false;

        enhancePhone();
      }
    );
  }


  const observer =
    new MutationObserver(
      queueEnhance
    );


  observer.observe(
    phoneTarget,
    {
      childList: true,
      subtree: true,
      characterData: true
    }
  );


  queueEnhance();
})();