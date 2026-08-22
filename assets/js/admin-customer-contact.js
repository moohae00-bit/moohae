(() => {
  'use strict';

  // ============================================================
  // MOOHAE ADMIN — CUSTOMER CONTACT / ADDRESS
  //
  // 역할
  // 1. 고객 연락처를 전화 / 문자 링크로 안전하게 표시
  // 2. 고객 주소를 조회해 고객 기본정보에 표시
  // 3. 주소 복사 기능 제공
  //
  // 핵심 운영 JS(admin-customer-detail.js)는 건드리지 않는다.
  // ============================================================

  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const phoneTarget =
    document.getElementById('detailPhone');

  const addressTarget =
    document.getElementById('detailAddress');

  const detailMessage =
    document.getElementById('detailMessage');

  if (
    !phoneTarget ||
    !addressTarget
  ) {
    return;
  }


  // ============================================================
  // HELPERS
  // ============================================================

  function make(
    tag,
    className,
    text = ''
  ) {
    const node =
      document.createElement(tag);

    if (className) {
      node.className =
        className;
    }

    if (text) {
      node.textContent =
        text;
    }

    return node;
  }


  function setMessage(
    text,
    ok = false
  ) {
    if (!detailMessage) {
      return;
    }

    detailMessage.textContent =
      text;

    detailMessage.classList.toggle(
      'success',
      ok
    );
  }


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
      trimmed.replace(/\D/g, '');

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


  function makeContactAction(
    label,
    href,
    className
  ) {
    const link =
      document.createElement('a');

    link.className =
      className;

    link.href =
      href;

    link.textContent =
      label;

    link.rel =
      'nofollow';

    return link;
  }


  function renderPhone(
    phone
  ) {
    phoneTarget.replaceChildren();

    const visiblePhone =
      typeof phone === 'string' &&
      phone.trim()
        ? phone.trim()
        : '—';

    const safePhone =
      normalizePhone(
        visiblePhone
      );

    phoneTarget.appendChild(
      make(
        'span',
        'contact-number',
        visiblePhone
      )
    );

    if (!safePhone) {
      return;
    }

    const actions =
      make(
        'div',
        'contact-action-row'
      );

    actions.append(
      makeContactAction(
        '전화하기',
        `tel:${safePhone}`,
        'contact-action contact-action-primary'
      ),

      makeContactAction(
        '문자하기',
        `sms:${safePhone}`,
        'contact-action contact-action-secondary'
      )
    );

    phoneTarget.appendChild(
      actions
    );
  }


  // ============================================================
  // CLIPBOARD
  // ============================================================

  async function copyPlainText(
    value
  ) {
    if (
      typeof value !== 'string' ||
      !value.trim()
    ) {
      return false;
    }

    const text =
      value.trim();

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          text
        );

        return true;
      }
    } catch (error) {
      console.warn(
        'MOOHAE clipboard API unavailable:',
        error
      );
    }


    // ----------------------------------------------------------
    // FALLBACK
    // ----------------------------------------------------------

    const textarea =
      document.createElement(
        'textarea'
      );

    textarea.value =
      text;

    textarea.setAttribute(
      'readonly',
      ''
    );

    textarea.className =
      'clipboard-fallback';

    document.body.appendChild(
      textarea
    );

    textarea.select();

    let copied =
      false;

    try {
      copied =
        document.execCommand(
          'copy'
        );
    } catch (error) {
      console.warn(
        'MOOHAE clipboard fallback failed:',
        error
      );
    }

    textarea.remove();

    return copied;
  }


  // ============================================================
  // ADDRESS
  // ============================================================

  function renderAddress(
    address
  ) {
    addressTarget.replaceChildren();

    const normalizedAddress =
      typeof address === 'string'
        ? address.trim()
        : '';

    if (!normalizedAddress) {
      addressTarget.appendChild(
        make(
          'span',
          'address-empty',
          '등록된 주소 없음'
        )
      );

      return;
    }


    const addressText =
      make(
        'span',
        'address-text',
        normalizedAddress
      );


    const copyButton =
      make(
        'button',
        'address-copy-button',
        '주소 복사'
      );

    copyButton.type =
      'button';


    copyButton.addEventListener(
      'click',
      async () => {
        copyButton.disabled =
          true;

        const copied =
          await copyPlainText(
            normalizedAddress
          );

        copyButton.textContent =
          copied
            ? '복사 완료'
            : '복사 실패';


        if (copied) {
          setMessage(
            '고객 주소가 복사되었습니다.',
            true
          );
        } else {
          setMessage(
            '주소를 복사하지 못했습니다. 주소를 길게 눌러 직접 복사해주세요.'
          );
        }


        window.setTimeout(
          () => {
            copyButton.textContent =
              '주소 복사';

            copyButton.disabled =
              false;
          },
          1600
        );
      }
    );


    addressTarget.append(
      addressText,
      copyButton
    );
  }


  // ============================================================
  // LOAD CONTACT DATA
  // ============================================================

  async function loadContactData() {
    const customerId =
      new URLSearchParams(
        window.location.search
      ).get('id');


    if (
      !customerId ||
      !UUID_PATTERN.test(customerId) ||
      !window.moohaeSupabase
    ) {
      return;
    }


    try {
      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .from('customers')
          .select('phone, address')
          .eq('id', customerId)
          .maybeSingle();


      if (error) {
        throw error;
      }


      if (!data) {
        return;
      }


      renderPhone(
        data.phone
      );


      renderAddress(
        data.address
      );


    } catch (error) {
      console.error(
        'MOOHAE customer contact load error:',
        error
      );


      // 연락처/주소 보조 기능에 문제가 생겨도
      // 기존 고객 상세 기능은 계속 작동하도록 오류를 격리한다.

      if (
        !addressTarget.textContent.trim() ||
        addressTarget.textContent.trim() === '—'
      ) {
        renderAddress('');
      }
    }
  }


  // ============================================================
  // START
  // ============================================================

  loadContactData();

})();