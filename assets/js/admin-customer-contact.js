(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN
  // CUSTOMER CONTACT + ADDRESS
  //
  // - 전화하기
  // - 문자하기
  // - 주소 표시
  // - 주소 복사
  //
  // 핵심 admin-customer-detail.js와 분리
  //
  // 기존 JS가 전화번호 DOM을 다시 쓰더라도
  // MutationObserver가 다시 액션 UI를 복원한다.
  // ============================================================


  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  const phoneTarget =
    document.getElementById(
      'detailPhone'
    );


  const addressTarget =
    document.getElementById(
      'detailAddress'
    );


  const detailMessage =
    document.getElementById(
      'detailMessage'
    );


  if (
    !phoneTarget ||
    !addressTarget
  ) {

    return;
  }



  // ============================================================
  // STATE
  // ============================================================

  let loadedPhone =
    '';


  let loadedAddress =
    '';


  let renderingPhone =
    false;



  // ============================================================
  // DOM HELPER
  // ============================================================

  function make(
    tag,
    className,
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



  // ============================================================
  // MESSAGE
  // ============================================================

  function setMessage(
    text,
    ok = false
  ) {

    if (
      !detailMessage
    ) {

      return;
    }


    detailMessage.textContent =
      text;


    detailMessage.classList.toggle(
      'success',
      ok
    );
  }



  // ============================================================
  // PHONE NORMALIZATION
  // ============================================================

  function normalizePhone(
    value
  ) {

    if (
      typeof value !==
      'string'
    ) {

      return '';
    }


    const trimmed =
      value.trim();


    const hasLeadingPlus =
      trimmed.startsWith(
        '+'
      );


    const digits =
      trimmed.replace(
        /\D/g,
        ''
      );


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



  // ============================================================
  // CONTACT LINK
  // ============================================================

  function createActionLink(
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


    link.dataset.moohaeContactAction =
      'true';


    return link;
  }



  // ============================================================
  // RENDER PHONE
  // ============================================================

  function renderPhone() {

    if (
      renderingPhone
    ) {

      return;
    }


    const visiblePhone =
      loadedPhone.trim();


    if (
      !visiblePhone
    ) {

      return;
    }


    const safePhone =
      normalizePhone(
        visiblePhone
      );


    if (
      !safePhone
    ) {

      return;
    }


    // 이미 정상 렌더링됐으면 재생성하지 않는다.

    const existingActions =
      phoneTarget.querySelector(
        '[data-moohae-contact-action="true"]'
      );


    const existingNumber =
      phoneTarget.querySelector(
        '.contact-number'
      );


    if (
      existingActions &&
      existingNumber &&
      existingNumber.textContent.trim() ===
        visiblePhone
    ) {

      return;
    }


    renderingPhone =
      true;


    try {

      const number =
        make(
          'span',
          'contact-number',
          visiblePhone
        );


      const actions =
        make(
          'div',
          'contact-action-row'
        );


      const call =
        createActionLink(
          '전화하기',
          `tel:${safePhone}`,
          'contact-action contact-action-primary'
        );


      const sms =
        createActionLink(
          '문자하기',
          `sms:${safePhone}`,
          'contact-action contact-action-secondary'
        );


      actions.append(
        call,
        sms
      );


      phoneTarget.replaceChildren(
        number,
        actions
      );


    } finally {

      renderingPhone =
        false;
    }
  }



  // ============================================================
  // COPY TEXT
  // ============================================================

  async function copyPlainText(
    value
  ) {

    if (
      typeof value !==
        'string' ||
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

        await navigator
          .clipboard
          .writeText(
            text
          );


        return true;
      }

    } catch (
      error
    ) {

      console.warn(
        'MOOHAE clipboard API unavailable:',
        error
      );
    }



    // ==========================================================
    // FALLBACK
    // ==========================================================

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


    } catch (
      error
    ) {

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

  function renderAddress() {

    addressTarget.replaceChildren();


    const address =
      loadedAddress.trim();


    if (
      !address
    ) {

      addressTarget.appendChild(

        make(
          'span',
          'address-empty',
          '등록된 주소 없음'
        )
      );


      return;
    }


    const text =
      make(
        'span',
        'address-text',
        address
      );


    const button =
      make(
        'button',
        'address-copy-button',
        '주소 복사'
      );


    button.type =
      'button';



    button.addEventListener(
      'click',
      async () => {

        button.disabled =
          true;


        const copied =
          await copyPlainText(
            address
          );


        button.textContent =
          copied
            ? '복사 완료'
            : '복사 실패';


        if (
          copied
        ) {

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

            button.textContent =
              '주소 복사';


            button.disabled =
              false;
          },

          1600
        );
      }
    );


    addressTarget.append(
      text,
      button
    );
  }



  // ============================================================
  // LOAD CUSTOMER CONTACT DATA
  // ============================================================

  async function loadContactData() {

    const customerId =
      new URLSearchParams(
        window.location.search
      ).get(
        'id'
      );


    if (
      !customerId ||
      !UUID_PATTERN.test(
        customerId
      ) ||
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
          .from(
            'customers'
          )
          .select(
            'phone, address'
          )
          .eq(
            'id',
            customerId
          )
          .maybeSingle();


      if (
        error
      ) {

        throw error;
      }


      if (
        !data
      ) {

        return;
      }


      loadedPhone =
        typeof data.phone ===
          'string'

          ? data.phone

          : '';


      loadedAddress =
        typeof data.address ===
          'string'

          ? data.address

          : '';


      renderPhone();


      renderAddress();


    } catch (
      error
    ) {

      console.error(
        'MOOHAE customer contact load error:',
        error
      );


      loadedAddress =
        '';


      renderAddress();
    }
  }



  // ============================================================
  // PHONE MUTATION WATCH
  //
  // admin-customer-detail.js가 비동기로
  // detailPhone.textContent를 다시 입력하면
  // 전화 / 문자 UI를 자동으로 복원한다.
  // ============================================================

  const phoneObserver =
    new MutationObserver(
      () => {

        if (
          renderingPhone ||
          !loadedPhone
        ) {

          return;
        }


        queueMicrotask(
          () => {

            renderPhone();
          }
        );
      }
    );


  phoneObserver.observe(
    phoneTarget,
    {
      childList:
        true,

      subtree:
        true,

      characterData:
        true
    }
  );



  // ============================================================
  // START
  // ============================================================

  loadContactData();

})();