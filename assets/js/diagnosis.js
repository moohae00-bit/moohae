(() => {
  'use strict';

  // ============================================================
  // MOOHAE CHECK V2 + PUBLIC BOOKING
  // ============================================================

  const qs = [...document.querySelectorAll('.question')];

  const progress =
    document.getElementById('progress');

  const prev =
    document.getElementById('prev');

  const next =
    document.getElementById('next');

  const result =
    document.getElementById('result');

  const navButtons =
    document.getElementById('navButtons');


  // ============================================================
  // DIAGNOSIS SUBMIT
  // ============================================================

  const submitForm =
    document.getElementById('diagnosisSubmitForm');

  const submitButton =
    document.getElementById('diagnosisSubmitButton');

  const submitMessage =
    document.getElementById('diagnosisSubmitMessage');


  // ============================================================
  // BOOKING
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

  const bookingAddressField =
    document.getElementById('bookingAddressField');

  const bookingAddress =
    document.getElementById('bookingAddress');


  // ============================================================
  // STATE
  // ============================================================

  const answers =
    qs.map(() => []);

  let current =
    0;

  let resultData = {
    level: '',
    title: '',
    copy: '',
    recommendation: '',
    plan: ''
  };


  // 예약 raw token은
  // localStorage / sessionStorage / URL / DOM에 저장하지 않는다.

  let bookingToken =
    '';

  let bookingTokenExpiresAt =
    '';

  let selectedBookingSlot =
    null;

  let bookingCompleted =
    false;


  // ============================================================
  // BLOCK NATIVE SUBMIT
  // ============================================================

  if (
    submitForm
  ) {
    submitForm.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
      }
    );
  }


  // ============================================================
  // QUESTION RENDER
  // ============================================================

  function render() {
    qs.forEach(
      (
        question,
        index
      ) => {

        question.hidden =
          index !== current;

        question.classList.toggle(
          'active',
          index === current
        );
      }
    );


    if (
      progress
    ) {
      progress.style.width =
        `${(current / qs.length) * 100}%`;
    }


    if (
      prev
    ) {
      prev.style.visibility =
        current === 0
          ? 'hidden'
          : 'visible';
    }


    if (
      next
    ) {
      next.textContent =
        current ===
        qs.length - 1

          ? '결과 보기'

          : '다음';
    }
  }


  // ============================================================
  // QUESTION ANSWERS
  // ============================================================

  qs.forEach(
    (
      question,
      qIndex
    ) => {

      const single =
        question.dataset.single ===
        'true';


      question
        .querySelectorAll(
          '.option'
        )
        .forEach(
          (button) => {

            button.type =
              'button';


            button.addEventListener(
              'click',
              () => {

                const value =
                  button
                    .textContent
                    .trim();


                // ------------------------------------------------
                // SINGLE
                // ------------------------------------------------

                if (
                  single
                ) {

                  question
                    .querySelectorAll(
                      '.option'
                    )
                    .forEach(
                      (item) => {

                        item.classList.remove(
                          'selected'
                        );
                      }
                    );


                  answers[qIndex] = [
                    value
                  ];


                  button.classList.add(
                    'selected'
                  );


                  return;
                }


                // ------------------------------------------------
                // MULTIPLE
                // ------------------------------------------------

                button.classList.toggle(
                  'selected'
                );


                if (
                  button.classList.contains(
                    'selected'
                  )
                ) {

                  if (
                    !answers[qIndex]
                      .includes(
                        value
                      )
                  ) {

                    answers[qIndex]
                      .push(
                        value
                      );
                  }

                } else {

                  answers[qIndex] =
                    answers[qIndex]
                      .filter(
                        (item) =>
                          item !== value
                      );
                }
              }
            );
          }
        );
    }
  );


  // ============================================================
  // DOM TEXT HELPER
  // ============================================================

  function appendText(
    parent,
    tag,
    text
  ) {

    const node =
      document.createElement(
        tag
      );


    node.textContent =
      text;


    parent.appendChild(
      node
    );


    return node;
  }


  // ============================================================
  // BUILD PERSONALIZED RESULT
  // ============================================================

  function buildPersonalizedCopy() {

    const household =
      answers[0] || [];

    const spaces =
      answers[1] || [];

    const surfaces =
      answers[2] || [];

    const worries =
      answers[3] || [];

    const preference =
      answers[4]?.[0] || '';


    const hasChild =
      household.includes(
        '아이'
      );


    const hasPet =
      household.includes(
        '반려동물'
      );


    const manySpaces =
      spaces.length >= 2 ||
      spaces.includes(
        '여러 공간에 고르게'
      );


    const manySurfaces =
      surfaces.length >= 3 ||
      surfaces.includes(
        '여러 곳이 함께'
      );


    const feelsRecurring =
      worries.includes(
        '관리해도 금방 다시 신경 쓰인다'
      );


    const unsureScope =
      worries.includes(
        '언제, 어디까지 관리해야 할지 모르겠다'
      );


    const childFocus =
      worries.includes(
        '아이의 생활공간은 조금 더 세심하게 보고 싶다'
      );


    const petFocus =
      worries.includes(
        '반려동물의 생활공간은 조금 더 세심하게 보고 싶다'
      );


    const wantsSOS =
      worries.includes(
        '예상하지 못한 오염이 생길 때도 도움받고 싶다'
      );


    const wantsDedicated =
      preference.includes(
        '담당 관리자가'
      );


    const wantsPlus =
      preference.includes(
        '더 신경 쓰이는 생활까지'
      );


    const wantsConsult =
      preference.includes(
        '상담을 통해'
      );


    let plan =
      'STANDARD';

    let level =
      'STANDARD';


    // ==========================================================
    // PLAN LOGIC
    // ==========================================================

    if (
      wantsDedicated ||
      wantsSOS
    ) {

      plan =
        'SIGNATURE';

      level =
        'SIGNATURE';

    } else if (
      wantsPlus ||
      childFocus ||
      petFocus ||
      (
        hasChild &&
        manySurfaces
      ) ||
      (
        hasPet &&
        manySurfaces
      ) ||
      (
        feelsRecurring &&
        unsureScope
      )
    ) {

      plan =
        'PLUS';

      level =
        'PLUS';
    }


    // ==========================================================
    // DETAIL COPY
    // ==========================================================

    const details =
      [];


    if (
      manySpaces
    ) {

      details.push(
        '한 공간이 아니라 집 전체의 생활 흐름을 함께 관리하고 싶은 점'
      );

    } else if (
      spaces.length
    ) {

      details.push(
        `${spaces.join('·')}처럼 실제로 오래 머무는 공간을 잘 관리하고 싶은 점`
      );
    }


    if (
      surfaces.length
    ) {

      details.push(
        `${surfaces.join('·')}처럼 몸이 자주 닿는 곳이 특히 신경 쓰이는 점`
      );
    }


    if (
      feelsRecurring
    ) {

      details.push(
        '관리 후에도 다시 신경 쓰이는 반복적인 부담'
      );
    }


    if (
      unsureScope
    ) {

      details.push(
        '언제 어디까지 관리해야 할지 계속 판단해야 하는 부담'
      );
    }


    if (
      childFocus
    ) {

      details.push(
        '아이의 생활공간을 조금 더 세심하게 살피고 싶은 마음'
      );
    }


    if (
      petFocus
    ) {

      details.push(
        '반려동물이 머무는 생활공간을 조금 더 세심하게 관리하고 싶은 마음'
      );
    }


    if (
      wantsSOS
    ) {

      details.push(
        '예상하지 못한 오염이 생겼을 때도 도움받고 싶은 필요'
      );
    }


    let title =
      '';

    let copy =
      '';

    let recommendation =
      '';


    // ==========================================================
    // SIGNATURE
    // ==========================================================

    if (
      plan ===
      'SIGNATURE'
    ) {

      title =
        '우리 집의 생활 흐름까지 기억하며 관리해주는 방식이 잘 맞아 보여요.';


      copy =
        `선택하신 내용을 보면 ${details.slice(0, 4).join(', ')}이 함께 보여요. ` +
        '정해진 케어를 반복하는 것보다 우리 집의 생활방식과 이전 관리 내용을 담당자가 이해하고, 필요한 시점과 영역을 함께 판단해주길 원하는 쪽에 가깝습니다.';


      recommendation =
        'SIGNATURE는 우리 집의 관리 이력을 바탕으로 보다 세심하게 관리 흐름을 이어가는 유형입니다. 담당 관리자가 이전 Care History를 확인하고 다음 관리까지 함께 설계합니다.';


    // ==========================================================
    // PLUS
    // ==========================================================

    } else if (
      plan ===
      'PLUS'
    ) {

      title =
        '집 전체의 기본 관리에 더해, 마음이 쓰이는 생활영역을 조금 더 세심하게 살펴보는 방식이 잘 맞아 보여요.';


      copy =
        `선택하신 내용을 보면 ${details.slice(0, 4).join(', ')}이 중요해 보여요. ` +
        '모든 공간을 똑같이 관리하기보다 집 전체의 기본적인 관리 흐름을 유지하면서 실제 사용이 많거나 더 신경 쓰이는 생활영역에 관리 비중을 두는 방식이 잘 맞습니다.';


      recommendation =
        'PLUS는 집 전체의 기본적인 관리 흐름과 함께 아이·반려동물·특정 생활동선처럼 더 신경 쓰이는 영역을 조금 더 세심하게 이어서 관리하는 유형입니다.';


    // ==========================================================
    // STANDARD
    // ==========================================================

    } else {

      title =
        '우리 집의 기본적인 관리 흐름부터 꾸준히 이어가는 방식이 잘 맞아 보여요.';


      copy =
        `선택하신 내용을 보면 ${details.slice(0, 3).join(', ')}이 먼저 보여요. ` +
        '특정 한 곳에 관리가 집중되기보다 평소 자주 사용하는 주요 생활 공간과 접촉면을 일정한 흐름으로 살펴보는 것이 좋은 시작점이 될 수 있습니다.';


      recommendation =
        'STANDARD는 우리 집의 주요 생활공간과 생활 접촉면을 기본으로 살펴보며 관리의 흐름을 꾸준히 이어가는 유형입니다.';
    }


    if (
      wantsConsult
    ) {

      recommendation +=
        ' 아직 어떤 관리 유형이 맞을지 확신하기 어렵다면 상담에서 Home Profile을 함께 확인한 뒤 관리 범위와 우선순위를 정할 수 있습니다.';
    }


    return {
      level,
      title,
      copy,
      recommendation,
      plan
    };
  }


  // ============================================================
  // RECOMMENDATION
  // ============================================================

  function renderRecommendationPlan(
    plan,
    recommendation
  ) {

    const rec =
      document.getElementById(
        'resultRecommend'
      );


    if (
      !rec
    ) {
      return;
    }


    rec.replaceChildren();


    appendText(
      rec,
      'strong',
      plan
    );


    appendText(
      rec,
      'p',
      recommendation
    );
  }


  // ============================================================
  // RESULT
  // ============================================================

  function buildResult() {

    resultData =
      buildPersonalizedCopy();


    const resultLevel =
      document.getElementById(
        'resultLevel'
      );


    const resultTitle =
      document.getElementById(
        'resultTitle'
      );


    const resultCopy =
      document.getElementById(
        'resultCopy'
      );


    if (
      resultLevel
    ) {

      resultLevel.textContent =
        resultData.plan;
    }


    if (
      resultTitle
    ) {

      resultTitle.textContent =
        resultData.title;
    }


    if (
      resultCopy
    ) {

      resultCopy.textContent =
        resultData.copy;
    }


    renderRecommendationPlan(
      resultData.plan,
      resultData.recommendation
    );


    const summary =
      document.getElementById(
        'resultSummary'
      );


    if (
      summary
    ) {

      summary.replaceChildren();


      appendText(
        summary,
        'strong',
        '우리 집 Home Profile 시작점'
      );


      answers.forEach(
        (
          group,
          index
        ) => {

          appendText(
            summary,
            'p',
            `Q${index + 1}  ${group.join(' · ')}`
          );
        }
      );
    }
  }


  // ============================================================
  // NEXT
  // ============================================================

  next?.addEventListener(
    'click',
    () => {

      if (
        answers[current].length ===
        0
      ) {

        alert(
          '한 개 이상 선택해주세요.'
        );


        return;
      }


      if (
        current <
        qs.length - 1
      ) {

        current +=
          1;


        render();


        return;
      }


      buildResult();


      qs.forEach(
        (question) => {

          question.hidden =
            true;
        }
      );


      if (
        navButtons
      ) {

        navButtons.hidden =
          true;
      }


      if (
        progress
      ) {

        progress.style.width =
          '100%';
      }


      if (
        result
      ) {

        result.style.display =
          'block';


        result.scrollIntoView(
          {
            behavior:
              'smooth',

            block:
              'start'
          }
        );
      }
    }
  );


  // ============================================================
  // PREVIOUS
  // ============================================================

  prev?.addEventListener(
    'click',
    () => {

      if (
        current > 0
      ) {

        current -=
          1;


        render();
      }
    }
  );


  // ============================================================
  // SUBMIT MESSAGE
  // ============================================================

  function setSubmitMessage(
    text,
    isError = false
  ) {

    if (
      !submitMessage
    ) {
      return;
    }


    submitMessage.textContent =
      text;


    submitMessage.classList.toggle(
      'error',
      isError
    );


    submitMessage.classList.toggle(
      'success',
      !isError &&
      Boolean(text)
    );
  }


  // ============================================================
  // BOOKING MESSAGE
  // ============================================================

  function setBookingMessage(
    text,
    isError = false,
    isSuccess = false
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
      isError
    );


    bookingMessage.classList.toggle(
      'success',
      isSuccess
    );
  }


  // ============================================================
  // FORMAT BOOKING DATE
  // ============================================================

  function formatBookingDate(
    value
  ) {

    if (
      typeof value !==
        'string' ||
      !value
    ) {

      return value ||
        '—';
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
        month:
          'long',

        day:
          'numeric',

        weekday:
          'short'
      }
    ).format(
      date
    );
  }


  // ============================================================
  // NORMALIZE BOOKING TIME
  // ============================================================

  function normalizeBookingTime(
    value
  ) {

    return typeof value ===
      'string'

      ? value.slice(
          0,
          5
        )

      : '';
  }


  // ============================================================
  // ADDRESS
  // ============================================================

  function getBookingAddressValue() {

    return (
      bookingAddress
        ?.value
        ?.trim() ||
      ''
    );
  }


  function isBookingAddressValid() {

    const address =
      getBookingAddressValue();


    return (
      address.length >=
        5 &&
      address.length <=
        500
    );
  }


  function updateBookingSubmitState() {

    if (
      !bookingSubmitButton
    ) {
      return;
    }


    bookingSubmitButton.disabled =

      bookingCompleted ||

      !bookingToken ||

      !selectedBookingSlot ||

      !isBookingAddressValid();
  }


  // ============================================================
  // CLEAR BOOKING SELECTION
  // ============================================================

  function clearBookingSelection() {

    selectedBookingSlot =
      null;


    if (
      bookingSelection
    ) {

      bookingSelection.hidden =
        true;
    }


    if (
      bookingSelectedSummary
    ) {

      bookingSelectedSummary.textContent =
        '—';
    }


    if (
      bookingAddressField
    ) {

      bookingAddressField.hidden =
        true;
    }


    if (
      bookingSubmitButton
    ) {

      bookingSubmitButton.disabled =
        true;
    }


    bookingCalendar
      ?.querySelectorAll(
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
  // SELECT BOOKING SLOT
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


    if (
      bookingSelection
    ) {

      bookingSelection.hidden =
        false;
    }


    if (
      bookingSelectedSummary
    ) {

      bookingSelectedSummary.textContent =
        `${formatBookingDate(
          bookingDate
        )} ${bookingTime}`;
    }


    if (
      bookingAddressField
    ) {

      bookingAddressField.hidden =
        false;
    }


    updateBookingSubmitState();


    setBookingMessage(

      isBookingAddressValid()

        ? '선택한 일정과 방문 주소를 확인한 뒤 방문 요청 버튼을 눌러주세요.'

        : '선택한 일정으로 방문할 주소를 입력해주세요.'
    );


    bookingAddress?.focus(
      {
        preventScroll:
          true
      }
    );
  }


  // ============================================================
  // RENDER BOOKING SLOTS
  // ============================================================

  function renderBookingSlots(
    rows
  ) {

    if (
      !bookingCalendar
    ) {
      return;
    }


    bookingCalendar.replaceChildren();


    clearBookingSelection();


    const grouped =
      new Map();


    for (
      const row
      of rows || []
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


    const visibleDates = [
      ...grouped.entries()
    ].slice(
      0,
      10
    );


    // ==========================================================
    // EMPTY
    // ==========================================================

    if (
      visibleDates.length ===
      0
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


    // ==========================================================
    // DATES
    // ==========================================================

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
  // LOAD BOOKING SLOTS
  // ============================================================

  async function loadPublicBookingSlots() {

    if (
      !bookingSection ||
      !bookingToken ||
      !window.moohaeSupabase?.rpc
    ) {
      return;
    }


    bookingSection.hidden =
      false;


    if (
      bookingSubmitButton
    ) {

      bookingSubmitButton.hidden =
        false;


      bookingSubmitButton.disabled =
        true;


      bookingSubmitButton.textContent =
        '이 일정으로 방문 요청하기';
    }


    if (
      bookingAddressField
    ) {

      bookingAddressField.hidden =
        true;
    }


    bookingCalendar
      ?.replaceChildren();


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
              p_days:
                21
            }
          );


      if (
        error
      ) {

        throw error;
      }


      renderBookingSlots(
        Array.isArray(
          data
        )

          ? data

          : []
      );


      if (
        Array.isArray(
          data
        ) &&
        data.length >
          0
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

    if (
      !bookingCalendar
    ) {
      return;
    }


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


    if (
      bookingSelection
    ) {

      bookingSelection.hidden =
        true;
    }


    if (
      bookingAddressField
    ) {

      bookingAddressField.hidden =
        true;
    }


    if (
      bookingSubmitButton
    ) {

      bookingSubmitButton.hidden =
        true;
    }


    setBookingMessage(
      '예약 요청이 정상적으로 전달되었습니다.',
      false,
      true
    );
  }


  // ============================================================
  // BOOKING ERRORS
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


      case 'invalid_address':

        return '방문 주소를 5자 이상 정확하게 입력해주세요.';


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
      !selectedBookingSlot ||
      !bookingSubmitButton ||
      !window.moohaeSupabase?.rpc
    ) {

      return;
    }


    const {
      bookingDate,
      bookingTime
    } =
      selectedBookingSlot;


    const visitAddress =
      getBookingAddressValue();


    // ==========================================================
    // ADDRESS CLIENT VALIDATION
    // 서버에서도 다시 검증됨
    // ==========================================================

    if (
      visitAddress.length <
        5 ||
      visitAddress.length >
        500
    ) {

      setBookingMessage(
        '방문 주소를 5자 이상 정확하게 입력해주세요.',
        true
      );


      bookingAddress?.focus();


      updateBookingSubmitState();


      return;
    }


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
            'submit_public_booking_request_v2',
            {
              p_booking_token:
                bookingToken,

              p_booking_date:
                bookingDate,

              p_booking_time:
                bookingTime,

              p_visit_address:
                visitAddress
            }
          );


      if (
        error
      ) {

        throw error;
      }


      const response =
        Array.isArray(
          data
        )

          ? data[0]

          : data;


      if (
        response?.ok !==
        true
      ) {

        const errorCode =
          typeof response?.error_code ===
            'string'

            ? response.error_code

            : '';


        // ------------------------------------------------------
        // SLOT WAS TAKEN
        // ------------------------------------------------------

        if (
          errorCode ===
            'slot_unavailable' ||
          errorCode ===
            'slot_closed'
        ) {

          await loadPublicBookingSlots();
        }


        // ------------------------------------------------------
        // TOKEN INVALID
        // ------------------------------------------------------

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


        setBookingMessage(
          getBookingErrorMessage(
            errorCode
          ),
          true
        );


        bookingSubmitButton.textContent =
          '이 일정으로 방문 요청하기';


        bookingSubmitButton.disabled =
          true;


        return;
      }


      // ========================================================
      // SUCCESS
      // ========================================================

      bookingCompleted =
        true;


      // raw token 즉시 폐기

      bookingToken =
        '';


      bookingTokenExpiresAt =
        '';


      selectedBookingSlot =
        null;


      if (
        bookingAddress
      ) {

        bookingAddress.value =
          '';
      }


      if (
        bookingAddressField
      ) {

        bookingAddressField.hidden =
          true;
      }


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


      bookingSubmitButton.textContent =
        '이 일정으로 방문 요청하기';


      updateBookingSubmitState();
    }
  }


  // ============================================================
  // ADDRESS INPUT EVENT
  // ============================================================

  bookingAddress
    ?.addEventListener(
      'input',
      () => {

        updateBookingSubmitState();


        if (
          selectedBookingSlot
        ) {

          setBookingMessage(

            isBookingAddressValid()

              ? '선택한 일정과 방문 주소를 확인한 뒤 방문 요청 버튼을 눌러주세요.'

              : '방문 주소를 5자 이상 입력해주세요.'
          );
        }
      }
    );


  // ============================================================
  // BOOKING BUTTON
  // ============================================================

  bookingSubmitButton
    ?.addEventListener(
      'click',
      (event) => {

        event.preventDefault();

        event.stopPropagation();


        submitBookingRequest();
      }
    );


  // ============================================================
  // SEND MOOHAE CHECK
  // ============================================================

  async function sendDiagnosis() {

    const name =
      document
        .getElementById(
          'customerName'
        )
        ?.value
        .trim() ||
      '';


    const phone =
      document
        .getElementById(
          'customerPhone'
        )
        ?.value
        .trim() ||
      '';


    const privacy =
      document
        .getElementById(
          'privacyConsent'
        )
        ?.checked ===
      true;


    const website =
      document
        .getElementById(
          'websiteField'
        )
        ?.value ||
      '';


    // ==========================================================
    // NAME
    // ==========================================================

    if (
      !name
    ) {

      setSubmitMessage(
        '이름을 입력해주세요.',
        true
      );


      return;
    }


    // ==========================================================
    // PHONE
    // ==========================================================

    if (
      !/^[0-9+\-\s()]{9,20}$/.test(
        phone
      )
    ) {

      setSubmitMessage(
        '연락처를 확인해주세요.',
        true
      );


      return;
    }


    // ==========================================================
    // PRIVACY
    // ==========================================================

    if (
      !privacy
    ) {

      setSubmitMessage(
        '개인정보 수집·이용 동의가 필요합니다.',
        true
      );


      return;
    }


    // ==========================================================
    // SUPABASE
    // ==========================================================

    if (
      !window
        .moohaeSupabase
        ?.functions
        ?.invoke
    ) {

      setSubmitMessage(
        '전송 연결을 불러오지 못했습니다. 페이지를 새로고침 후 다시 시도해주세요.',
        true
      );


      console.error(
        '[MOOHAE] Supabase client/functions unavailable'
      );


      return;
    }


    submitButton.disabled =
      true;


    submitButton.textContent =
      '보내는 중...';


    setSubmitMessage(
      ''
    );


    // ==========================================================
    // V2 PAYLOAD
    // ==========================================================

    const payload = {

      name,

      phone,


      privacy_consent:
        true,


      website,


      household:
        answers[0],


      spaces:
        answers[1],


      contact_surfaces:
        answers[2],


      worries:
        answers[3],


      management_preference:
        answers[4],


      client_result_level:
        resultData.level,


      client_result_message:
        `${resultData.title} ${resultData.copy}`,


      recommended_plan:
        resultData.plan
    };


    try {

      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .functions
          .invoke(
            'submit-diagnosis',
            {
              body:
                payload
            }
          );


      if (
        error
      ) {

        console.error(
          '[MOOHAE] Edge Function invoke error',
          error
        );


        throw error;
      }


      if (
        !data?.ok
      ) {

        console.error(
          '[MOOHAE] Edge Function rejected payload',
          data
        );


        throw new Error(
          data?.error ||
          'submission_failed'
        );
      }


      // ========================================================
      // SERVER RESULT IS AUTHORITATIVE
      // ========================================================

      const serverPlan =
        typeof data.recommended_plan ===
          'string'

          ? data.recommended_plan

          : '';


      if (
        [
          'STANDARD',
          'PLUS',
          'SIGNATURE'
        ].includes(
          serverPlan
        )
      ) {

        resultData.plan =
          serverPlan;


        resultData.level =
          serverPlan;


        const resultLevel =
          document.getElementById(
            'resultLevel'
          );


        if (
          resultLevel
        ) {

          resultLevel.textContent =
            serverPlan;
        }


        renderRecommendationPlan(
          serverPlan,
          resultData.recommendation
        );
      }


      submitButton.textContent =
        '전달 완료';


      submitButton.disabled =
        true;


      // ========================================================
      // BOOKING TOKEN
      // ========================================================

      const rawBookingToken =
        typeof data.booking_token ===
          'string'

          ? data.booking_token

          : '';


      const rawBookingExpiresAt =
        typeof data.booking_token_expires_at ===
          'string'

          ? data.booking_token_expires_at

          : '';


      if (
        data.booking_available ===
          true &&

        /^[0-9a-f]{64}$/.test(
          rawBookingToken
        ) &&

        rawBookingExpiresAt
      ) {

        bookingToken =
          rawBookingToken;


        bookingTokenExpiresAt =
          rawBookingExpiresAt;


        bookingCompleted =
          false;


        setSubmitMessage(
          '체크 결과가 전달되었습니다. 아래에서 방문 가능한 일정을 바로 선택할 수 있습니다.'
        );


        await loadPublicBookingSlots();


        bookingSection
          ?.scrollIntoView(
            {
              behavior:
                'smooth',

              block:
                'nearest'
            }
          );


      // ========================================================
      // BOOKING UNAVAILABLE
      // ========================================================

      } else {

        bookingToken =
          '';


        bookingTokenExpiresAt =
          '';


        setSubmitMessage(
          '체크 결과가 정상적으로 전달되었습니다.'
        );


        if (
          bookingSection
        ) {

          bookingSection.hidden =
            false;
        }


        bookingCalendar
          ?.replaceChildren();


        if (
          bookingSelection
        ) {

          bookingSelection.hidden =
            true;
        }


        if (
          bookingAddressField
        ) {

          bookingAddressField.hidden =
            true;
        }


        if (
          bookingSubmitButton
        ) {

          bookingSubmitButton.hidden =
            true;
        }


        setBookingMessage(
          '체크 결과는 정상적으로 전달되었습니다. 현재 온라인 예약 연결만 일시적으로 사용할 수 없습니다. 카카오 상담을 이용해주세요.',
          true
        );
      }


    } catch (
      error
    ) {

      console.error(
        '[MOOHAE] diagnosis submit failed',
        error
      );


      setSubmitMessage(
        '전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        true
      );


      submitButton.disabled =
        false;


      submitButton.textContent =
        '체크 결과 보내고 관리 상담 신청하기';
    }
  }


  // ============================================================
  // DIAGNOSIS SUBMIT BUTTON
  // ============================================================

  submitButton
    ?.addEventListener(
      'click',
      (event) => {

        event.preventDefault();

        event.stopPropagation();


        sendDiagnosis();
      }
    );


  // ============================================================
  // START
  // ============================================================

  render();

})();