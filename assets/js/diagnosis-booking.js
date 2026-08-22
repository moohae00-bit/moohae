(() => {
  'use strict';

  // ============================================================
  // MOOHAE CHECK — PUBLIC BOOKING MODULE
  //
  // 기존 diagnosis.js는 수정하지 않는다.
  // submit-diagnosis Edge Function의 성공 응답을 감지해
  // 예약 토큰을 현재 페이지 메모리에서만 보관하고,
  // 공개 예약 RPC와 연결한다.
  // ============================================================

  const bookingSection =
    document.getElementById('bookingSection');

  const bookingCalendar =
    document.getElementById('bookingCalendar');

  const bookingSelection =
    document.getElementById('bookingSelection');

  const bookingSelectedSummary =
    document.getElementById('bookingSelectedSummary');

  const bookingSubmitButton =
    document.getElementById('bookingSubmitButton');

  const bookingMessage =
    document.getElementById('bookingMessage');


  if (
    !bookingSection ||
    !bookingCalendar ||
    !bookingSelection ||
    !bookingSelectedSummary ||
    !bookingSubmitButton ||
    !bookingMessage
  ) {
    return;
  }


  // ============================================================
  // STATE
  //
  // 예약 토큰은 localStorage / sessionStorage / URL / HTML에
  // 저장하지 않고 현재 JS 실행 메모리에서만 유지한다.
  // ============================================================

  let bookingToken = '';
  let bookingTokenExpiresAt = '';
  let selectedBookingSlot = null;
  let bookingCompleted = false;


  // ============================================================
  // UI HELPERS
  // ============================================================

  function appendText(
    parent,
    tag,
    text
  ) {
    const node =
      document.createElement(tag);

    node.textContent =
      text;

    parent.appendChild(
      node
    );

    return node;
  }


  function setBookingMessage(
    text,
    isError = false,
    isSuccess = false
  ) {
    bookingMessage.textContent =
      text;

    bookingMessage.classList.toggle(
      'error',
      isError
    );

    bookingMessage.classList.toggle(
      'success',
      isSuccess
    );
  }


  function formatBookingDate(
    value
  ) {
    if (
      typeof value !== 'string' ||
      !value
    ) {
      return value || '—';
    }

    const date =
      new Date(
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
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      }
    ).format(
      date
    );
  }


  function normalizeBookingTime(
    value
  ) {
    if (
      typeof value !== 'string'
    ) {
      return '';
    }

    return value.slice(
      0,
      5
    );
  }


  function clearBookingSelection() {
    selectedBookingSlot =
      null;

    bookingSelection.hidden =
      true;

    bookingSelectedSummary.textContent =
      '—';

    bookingSubmitButton.disabled =
      true;

    bookingCalendar
      .querySelectorAll(
        '.public-booking-time'
      )
      .forEach(
        (button) => {
          button.classList.remove(
            'selected'
          );
        }
      );
  }


  // ============================================================
  // SLOT SELECTION
  // ============================================================

  function selectBookingSlot(
    button,
    bookingDate,
    bookingTime
  ) {
    if (
      bookingCompleted ||
      !bookingToken
    ) {
      return;
    }

    clearBookingSelection();

    selectedBookingSlot = {
      bookingDate,
      bookingTime
    };

    button.classList.add(
      'selected'
    );

    bookingSelection.hidden =
      false;

    bookingSelectedSummary.textContent =
      `${formatBookingDate(
        bookingDate
      )} ${bookingTime}`;

    bookingSubmitButton.disabled =
      false;

    setBookingMessage(
      '선택한 일정을 확인한 뒤 방문 요청 버튼을 눌러주세요.'
    );
  }


  // ============================================================
  // SLOT RENDER
  // ============================================================

  function renderBookingSlots(
    rows
  ) {
    bookingCalendar.replaceChildren();

    clearBookingSelection();

    const grouped =
      new Map();

    for (
      const row of rows || []
    ) {
      const date =
        typeof row?.booking_date ===
          'string'
          ? row.booking_date
          : '';

      const time =
        normalizeBookingTime(
          row?.booking_time
        );

      if (
        !date ||
        !time
      ) {
        continue;
      }

      if (
        !grouped.has(
          date
        )
      ) {
        grouped.set(
          date,
          []
        );
      }

      grouped
        .get(
          date
        )
        .push(
          time
        );
    }


    // 화면이 지나치게 길어지지 않도록
    // 가까운 예약 가능 날짜 10개까지만 노출한다.
    const visibleDates = [
      ...grouped.entries()
    ].slice(
      0,
      10
    );


    if (
      visibleDates.length === 0
    ) {
      const empty =
        document.createElement(
          'div'
        );

      empty.className =
        'booking-complete';

      appendText(
        empty,
        'strong',
        '현재 선택 가능한 방문 시간이 없습니다.'
      );

      appendText(
        empty,
        'p',
        '일정이 다시 열리면 이 화면에 표시됩니다. 급한 상담은 카카오 상담을 이용해주세요.'
      );

      bookingCalendar.appendChild(
        empty
      );

      setBookingMessage(
        '현재 예약 가능한 시간이 없습니다.'
      );

      return;
    }


    for (
      const [
        date,
        times
      ]
      of visibleDates
    ) {
      const card =
        document.createElement(
          'article'
        );

      card.className =
        'public-booking-day';


      const head =
        document.createElement(
          'div'
        );

      head.className =
        'public-booking-day-head';


      appendText(
        head,
        'span',
        'AVAILABLE DATE'
      );

      appendText(
        head,
        'strong',
        formatBookingDate(
          date
        )
      );


      const timeList =
        document.createElement(
          'div'
        );

      timeList.className =
        'public-booking-times';


      for (
        const time
        of times
      ) {
        const button =
          document.createElement(
            'button'
          );

        button.type =
          'button';

        button.className =
          'public-booking-time';

        button.textContent =
          time;

        button.addEventListener(
          'click',
          () => {
            selectBookingSlot(
              button,
              date,
              time
            );
          }
        );

        timeList.appendChild(
          button
        );
      }


      card.append(
        head,
        timeList
      );

      bookingCalendar.appendChild(
        card
      );
    }
  }


  // ============================================================
  // LOAD PUBLIC SLOTS
  // ============================================================

  async function loadPublicBookingSlots() {
    if (
      !bookingToken
    ) {
      return;
    }

    bookingSection.hidden =
      false;

    bookingSubmitButton.hidden =
      false;

    bookingSubmitButton.disabled =
      true;

    bookingSubmitButton.textContent =
      '이 일정으로 방문 요청하기';

    bookingCalendar.replaceChildren();

    setBookingMessage(
      '예약 가능한 시간을 확인하고 있습니다.'
    );


    try {
      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            'get_public_booking_slots',
            {
              p_days: 21
            }
          );


      if (
        error
      ) {
        throw error;
      }


      renderBookingSlots(
        Array.isArray(data)
          ? data
          : []
      );


      if (
        Array.isArray(data) &&
        data.length > 0
      ) {
        setBookingMessage(
          '원하는 날짜와 시간을 선택해주세요.'
        );
      }


    } catch (
      error
    ) {
      console.error(
        '[MOOHAE] public booking slots failed',
        error
      );

      clearBookingSelection();

      setBookingMessage(
        '예약 가능 시간을 불러오지 못했습니다. 잠시 후 다시 확인해주세요.',
        true
      );
    }
  }


  // ============================================================
  // BOOKING COMPLETE
  // ============================================================

  function renderBookingComplete(
    bookingDate,
    bookingTime
  ) {
    bookingCalendar.replaceChildren();

    const complete =
      document.createElement(
        'div'
      );

    complete.className =
      'booking-complete';

    appendText(
      complete,
      'strong',
      '방문 요청이 접수되었습니다.'
    );

    appendText(
      complete,
      'p',
      `${formatBookingDate(
        bookingDate
      )} ${bookingTime}로 요청되었습니다. 담당자가 일정을 확인한 뒤 최종 예약을 안내드립니다.`
    );

    bookingCalendar.appendChild(
      complete
    );

    bookingSelection.hidden =
      true;

    bookingSubmitButton.hidden =
      true;

    setBookingMessage(
      '예약 요청이 정상적으로 전달되었습니다.',
      false,
      true
    );
  }


  // ============================================================
  // ERROR MESSAGE
  // ============================================================

  function getBookingErrorMessage(
    errorCode
  ) {
    switch (
      errorCode
    ) {
      case 'slot_unavailable':
      case 'slot_closed':
        return '방금 선택한 시간이 마감되었습니다. 다른 시간을 선택해주세요.';

      case 'active_booking_exists':
        return '이미 접수된 방문 예약이 있습니다. 일정 변경이 필요하면 무해에 문의해주세요.';

      case 'invalid_or_expired_token':
      case 'invalid_token':
        return '예약 가능한 시간이 만료되었습니다. 체크를 다시 진행하거나 무해에 문의해주세요.';

      case 'booking_time_passed':
        return '이미 지난 시간입니다. 다른 시간을 선택해주세요.';

      case 'invalid_booking_date':
      case 'invalid_booking_time':
      case 'weekend_not_available':
        return '선택한 일정을 사용할 수 없습니다. 다른 시간을 선택해주세요.';

      default:
        return '예약 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }


  // ============================================================
  // SUBMIT BOOKING
  // ============================================================

  async function submitBookingRequest() {
    if (
      bookingCompleted ||
      !bookingToken ||
      !selectedBookingSlot
    ) {
      return;
    }


    const {
      bookingDate,
      bookingTime
    } =
      selectedBookingSlot;


    bookingSubmitButton.disabled =
      true;

    bookingSubmitButton.textContent =
      '예약 요청 중...';

    setBookingMessage(
      '선택한 일정을 확인하고 있습니다.'
    );


    try {
      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .rpc(
            'submit_public_booking_request',
            {
              p_booking_token:
                bookingToken,

              p_booking_date:
                bookingDate,

              p_booking_time:
                bookingTime
            }
          );


      if (
        error
      ) {
        throw error;
      }


      const response =
        Array.isArray(data)
          ? data[0]
          : data;


      if (
        response?.ok !== true
      ) {
        const errorCode =
          typeof response?.error_code ===
            'string'
            ? response.error_code
            : '';

        setBookingMessage(
          getBookingErrorMessage(
            errorCode
          ),
          true
        );


        if (
          errorCode ===
            'slot_unavailable' ||
          errorCode ===
            'slot_closed'
        ) {
          await loadPublicBookingSlots();
        }


        if (
          errorCode ===
            'invalid_or_expired_token' ||
          errorCode ===
            'invalid_token'
        ) {
          bookingToken =
            '';

          bookingTokenExpiresAt =
            '';
        }


        bookingSubmitButton.textContent =
          '이 일정으로 방문 요청하기';

        bookingSubmitButton.disabled =
          true;

        return;
      }


      // 성공 시 raw token은 즉시 메모리에서 제거한다.
      bookingCompleted =
        true;

      bookingToken =
        '';

      bookingTokenExpiresAt =
        '';

      selectedBookingSlot =
        null;


      renderBookingComplete(
        bookingDate,
        bookingTime
      );


    } catch (
      error
    ) {
      console.error(
        '[MOOHAE] public booking request failed',
        error
      );

      setBookingMessage(
        '예약 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        true
      );

      bookingSubmitButton.disabled =
        false;

      bookingSubmitButton.textContent =
        '이 일정으로 방문 요청하기';
    }
  }


  bookingSubmitButton.addEventListener(
    'click',
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      submitBookingRequest();
    }
  );


  // ============================================================
  // EDGE FUNCTION RESPONSE BRIDGE
  //
  // 기존 diagnosis.js를 수정하지 않기 위해
  // Supabase Functions invoke를 안전하게 감싼다.
  //
  // submit-diagnosis의 원래 응답은 그대로 diagnosis.js에 반환한다.
  // 이 모듈은 booking 관련 필드만 별도로 읽는다.
  // ============================================================

  function installDiagnosisResponseBridge() {
    const functionsClient =
      window
        .moohaeSupabase
        ?.functions;

    if (
      !functionsClient ||
      typeof functionsClient.invoke !==
        'function'
    ) {
      return false;
    }


    // 중복 설치 방지
    if (
      functionsClient.__moohaeBookingBridgeInstalled ===
      true
    ) {
      return true;
    }


    const originalInvoke =
      functionsClient
        .invoke
        .bind(
          functionsClient
        );


    functionsClient.invoke =
      async (
        functionName,
        options
      ) => {
        const response =
          await originalInvoke(
            functionName,
            options
          );


        if (
          functionName ===
            'submit-diagnosis' &&
          response?.data?.ok ===
            true
        ) {
          const rawToken =
            typeof response.data.booking_token ===
              'string'
              ? response.data.booking_token
              : '';

          const rawExpiresAt =
            typeof response.data.booking_token_expires_at ===
              'string'
              ? response.data.booking_token_expires_at
              : '';


          if (
            response.data.booking_available ===
              true &&
            /^[0-9a-f]{64}$/.test(
              rawToken
            ) &&
            rawExpiresAt
          ) {
            bookingToken =
              rawToken;

            bookingTokenExpiresAt =
              rawExpiresAt;

            bookingCompleted =
              false;


            // 예약 토큰을 DOM 속성이나 저장소에 기록하지 않는다.
            await loadPublicBookingSlots();


            bookingSection.scrollIntoView(
              {
                behavior:
                  'smooth',

                block:
                  'nearest'
              }
            );


          } else {
            bookingToken =
              '';

            bookingTokenExpiresAt =
              '';

            bookingSection.hidden =
              false;

            bookingCalendar.replaceChildren();

            bookingSelection.hidden =
              true;

            bookingSubmitButton.hidden =
              true;


            setBookingMessage(
              '체크 결과는 정상적으로 전달되었습니다. 현재 온라인 예약 연결만 일시적으로 사용할 수 없습니다. 카카오 상담을 이용해주세요.',
              true
            );
          }
        }


        // 기존 diagnosis.js에 원본 응답을 그대로 반환한다.
        return response;
      };


    functionsClient.__moohaeBookingBridgeInstalled =
      true;


    return true;
  }


  // ============================================================
  // START
  // ============================================================

  if (
    !installDiagnosisResponseBridge()
  ) {
    window.addEventListener(
      'load',
      () => {
        if (
          !installDiagnosisResponseBridge()
        ) {
          console.error(
            '[MOOHAE] booking bridge installation failed'
          );
        }
      },
      {
        once: true
      }
    );
  }
})();