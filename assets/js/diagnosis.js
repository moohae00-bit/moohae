(() => {
  'use strict';

  // ============================================================
  // MOOHAE CHECK V2 + PUBLIC BOOKING
  //
  // BOOKING POLICY
  //
  // 예약 가능:
  // 월요일 ~ 토요일
  //
  // 예약 불가:
  // 일요일
  // booking_holidays에 등록된 공휴일
  //
  // DB 저장 시작시간:
  // 10:00
  // 13:00
  // 16:00
  //
  // 고객 표시:
  // 오전 10:00 ~ 12:30
  // 오후 13:00 ~ 15:30
  // 오후 16:00 ~ 18:30
  //
  // 고객에게 보여주는 예약 가능 날짜:
  // 최대 5일
  //
  // IMPORTANT:
  // 표시시간과 DB 저장시간을 분리한다.
  // 서버에는 반드시 시작시간만 전송한다.
  // ============================================================


  // ============================================================
  // QUESTION
  // ============================================================

  const qs =
    [
      ...document.querySelectorAll(
        '.question'
      )
    ];


  const progress =
    document.getElementById(
      'progress'
    );


  const prev =
    document.getElementById(
      'prev'
    );


  const next =
    document.getElementById(
      'next'
    );


  const result =
    document.getElementById(
      'result'
    );


  const navButtons =
    document.getElementById(
      'navButtons'
    );


  // ============================================================
  // DIAGNOSIS SUBMIT
  // ============================================================

  const submitForm =
    document.getElementById(
      'diagnosisSubmitForm'
    );


  const submitButton =
    document.getElementById(
      'diagnosisSubmitButton'
    );


  const submitMessage =
    document.getElementById(
      'diagnosisSubmitMessage'
    );


  // ============================================================
  // BOOKING
  // ============================================================

  const bookingSection =
    document.getElementById(
      'bookingSection'
    );


  const bookingCalendar =
    document.getElementById(
      'bookingCalendar'
    );


  const bookingSelection =
    document.getElementById(
      'bookingSelection'
    );


  const bookingSelectedSummary =
    document.getElementById(
      'bookingSelectedSummary'
    );


  const bookingSubmitButton =
    document.getElementById(
      'bookingSubmitButton'
    );


  const bookingMessage =
    document.getElementById(
      'bookingMessage'
    );


  const bookingAddressField =
    document.getElementById(
      'bookingAddressField'
    );


  const bookingAddress =
    document.getElementById(
      'bookingAddress'
    );


  // ============================================================
  // BOOKING DISPLAY CONFIG
  //
  // 실제 DB에는 key 값만 저장한다.
  // 고객에게는 label만 보여준다.
  // ============================================================

  const BOOKING_TIME_LABELS =
    Object.freeze({

      '10:00':
        '오전 10:00 ~ 12:30',

      '13:00':
        '오후 13:00 ~ 15:30',

      '16:00':
        '오후 16:00 ~ 18:30'

    });


  const MAX_VISIBLE_BOOKING_DATES =
    5;


  // ============================================================
  // STATE
  // ============================================================

  const answers =
    qs.map(
      () => []
    );


  let current =
    0;


  let resultData = {

    level:
      '',

    title:
      '',

    copy:
      '',

    recommendation:
      '',

    plan:
      '',

    highlights:
      []

  };


  /*
   * SECURITY
   *
   * 예약 raw token은:
   *
   * - localStorage
   * - sessionStorage
   * - URL
   * - DOM
   *
   * 어디에도 저장하지 않는다.
   */

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
      (
        event
      ) => {

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
        `${
          (
            current /
            qs.length
          ) *
          100
        }%`;

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
        question.dataset
          .single ===
        'true';


      question
        .querySelectorAll(
          '.option'
        )
        .forEach(
          (
            button
          ) => {

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
                      (
                        item
                      ) => {

                        item.classList.remove(
                          'selected'
                        );

                      }
                    );


                  answers[qIndex] =
                    [
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
                    !answers[
                      qIndex
                    ].includes(
                      value
                    )
                  ) {

                    answers[
                      qIndex
                    ].push(
                      value
                    );

                  }

                } else {

                  answers[
                    qIndex
                  ] =
                    answers[
                      qIndex
                    ].filter(
                      (
                        item
                      ) =>
                        item !==
                        value
                    );

                }

              }
            );

          }
        );

    }
  );


  // ============================================================
  // SAFE DOM TEXT HELPER
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
  // CARE PLAN COMPATIBILITY
  // ============================================================

  /*
   * 과거 DB / Edge Function 데이터와
   * 최신 고객 표시명을 분리한다.
   *
   * 과거:
   * STANDARD / PLUS / SIGNATURE
   *
   * 현재 고객 화면:
   * CORE / CORE+ / PRIVATE
   */

  const PLAN_COMPATIBILITY =
    Object.freeze({

      STANDARD:
        'CORE',

      standard:
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

      corePlus:
        'CORE+',

      'core-plus':
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


  // ============================================================
  // CUSTOMER CARE PLAN DATA
  // ============================================================

  const CARE_PLANS =
    Object.freeze({

      CORE: {

        name:
          'CORE',

        headline:
          '생활의 핵심을\n1년의 주기로.',

        description:
          '침구·소파·패브릭과 바닥처럼 자주 생활하는 곳을 정기적으로 CARE합니다.',

        href:
          './care.html#core'

      },


      'CORE+': {

        name:
          'CORE+',

        headline:
          '집 전체를\n더 깊이 CARE.',

        description:
          '생활의 핵심 영역을 넘어 집 전체의 CARE가 필요한 경우에 맞습니다.',

        href:
          './care.html#core-plus'

      },


      PRIVATE: {

        name:
          'PRIVATE',

        headline:
          '우리 집을 위한\n전담 CARE.',

        description:
          '집의 CARE HISTORY를 바탕으로 전담 관리가 필요한 경우에 살펴볼 수 있습니다.',

        href:
          './care.html#private'

      }

    });


  // ============================================================
  // PLAN NORMALIZER
  // ============================================================

  function normalizePlan(
    value
  ) {

    return (
      PLAN_COMPATIBILITY[
        value
      ] ||
      'CORE'
    );

  }


  // ============================================================
  // LEGACY DB / EDGE FUNCTION COMPATIBILITY
  // ============================================================

  function toLegacyPlan(
    value
  ) {

    const plan =
      normalizePlan(
        value
      );


    if (
      plan ===
      'CORE+'
    ) {

      return 'PLUS';

    }


    if (
      plan ===
      'PRIVATE'
    ) {

      return 'SIGNATURE';

    }


    return 'STANDARD';

  }


  // ============================================================
  // BUILD PERSONALIZED RESULT
  // ============================================================

  function buildPersonalizedCopy() {

    const household =
      answers[0] ||
      [];


    const spaces =
      answers[1] ||
      [];


    const surfaces =
      answers[2] ||
      [];


    const worries =
      answers[3] ||
      [];


    const preference =
      answers[4]?.[0] ||
      '';


    // ----------------------------------------------------------
    // HOUSEHOLD
    // ----------------------------------------------------------

    const hasChild =
      household.includes(
        '아이'
      );


    const hasPet =
      household.includes(
        '반려동물'
      );


    // ----------------------------------------------------------
    // SPACE / SURFACE
    // ----------------------------------------------------------

    const manySpaces =
      spaces.length >=
        2 ||

      spaces.includes(
        '여러 공간에 고르게'
      );


    const manySurfaces =
      surfaces.length >=
        3 ||

      surfaces.includes(
        '여러 곳이 함께'
      );


    // ----------------------------------------------------------
    // WORRIES
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // MANAGEMENT PREFERENCE
    // ----------------------------------------------------------

    const wantsDedicated =
      preference.includes(
        '담당 관리자가'
      );


    const wantsPlus =
      preference.includes(
        '더 신경 쓰이는 생활까지'
      );


    // ==========================================================
    // PLAN DECISION
    // ==========================================================

    /*
     * PRIVATE는 단순 고점수 자동 추천이 아니다.
     *
     * 현재 CHECK에서 고객이
     * 전담 관리자를 명시적으로 원하는 경우에만
     * PRIVATE를 추천한다.
     */

    let plan =
      'CORE';


    if (
      wantsDedicated
    ) {

      plan =
        'PRIVATE';

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
      ) ||

      (
        manySpaces &&
        manySurfaces
      )

    ) {

      plan =
        'CORE+';

    }


    const planInfo =
      CARE_PLANS[
        plan
      ];


    // ==========================================================
    // RESULT HIGHLIGHTS
    // ==========================================================

    const highlights =
      [];


    if (
      surfaces.length
    ) {

      highlights.push(
        '침구 · 패브릭'
      );

    }


    if (
      manySpaces ||
      spaces.length
    ) {

      highlights.push(
        '생활 공간'
      );

    }


    if (

      feelsRecurring ||

      unsureScope ||

      wantsDedicated ||

      wantsPlus

    ) {

      highlights.push(
        'CARE 주기'
      );

    }


    if (
      !highlights.length
    ) {

      highlights.push(
        '생활 환경'
      );

    }


    return {

      level:
        plan,

      title:
        `우리 집에는 ${plan}가 잘 맞습니다.`,

      copy:
        planInfo.description,

      recommendation:
        planInfo.description,

      plan,

      highlights:
        [
          ...new Set(
            highlights
          )
        ].slice(
          0,
          3
        )

    };

  }


  // ============================================================
  // RENDER RECOMMENDATION PLAN
  // ============================================================

  function renderRecommendationPlan(
    plan
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


    const normalized =
      normalizePlan(
        plan
      );


    const info =
      CARE_PLANS[
        normalized
      ];


    rec.replaceChildren();


    // ----------------------------------------------------------
    // PLAN NAME
    // ----------------------------------------------------------

    const name =
      appendText(
        rec,
        'p',
        info.name
      );


    name.className =
      'result-plan-name';


    // ----------------------------------------------------------
    // HEADLINE
    // ----------------------------------------------------------

    const headline =
      appendText(
        rec,
        'h3',
        info.headline
      );


    headline.className =
      'result-plan-copy';


    headline.style.whiteSpace =
      'pre-line';


    // ----------------------------------------------------------
    // DESCRIPTION
    // ----------------------------------------------------------

    const desc =
      appendText(
        rec,
        'p',
        info.description
      );


    desc.className =
      'result-plan-desc';


    // ----------------------------------------------------------
    // CARE PAGE LINK
    // ----------------------------------------------------------

    const link =
      document.createElement(
        'a'
      );


    link.className =
      'result-plan-link';


    link.href =
      info.href;


    link.textContent =
      `${info.name} 자세히 보기`;


    rec.appendChild(
      link
    );

  }


  // ============================================================
  // OTHER CARE PLAN EXPLORATION
  // ============================================================

  function renderPlanExplore(
    plan
  ) {

    const nav =
      document.getElementById(
        'planExplore'
      );


    if (
      !nav
    ) {

      return;

    }


    nav.replaceChildren();


    const title =
      appendText(
        nav,
        'span',
        '다른 CARE도 살펴보세요.'
      );


    title.className =
      'plan-explore-title';


    const list =
      document.createElement(
        'div'
      );


    list.className =
      'plan-explore-list';


    [
      'CORE',
      'CORE+',
      'PRIVATE'
    ]
      .forEach(
        (
          key
        ) => {

          const info =
            CARE_PLANS[
              key
            ];


          const link =
            document.createElement(
              'a'
            );


          link.className =
            'plan-explore-link';


          link.href =
            info.href;


          link.textContent =
            info.name;


          // ----------------------------------------------------
          // CURRENT RECOMMENDATION
          // ----------------------------------------------------

          if (
            key ===
            normalizePlan(
              plan
            )
          ) {

            link.setAttribute(
              'aria-current',
              'true'
            );


            const badge =
              document.createElement(
                'span'
              );


            badge.className =
              'plan-explore-badge';


            badge.textContent =
              'YOUR CARE';


            link.appendChild(
              badge
            );

          }


          list.appendChild(
            link
          );

        }
      );


    nav.appendChild(
      list
    );

  }


  // ============================================================
  // RESULT SUMMARY
  // ============================================================

  function renderResultSummary(
    highlights
  ) {

    const summary =
      document.getElementById(
        'resultSummary'
      );


    if (
      !summary
    ) {

      return;

    }


    summary.replaceChildren();


    appendText(
      summary,
      'strong',
      '이번 CHECK에서 확인한 핵심'
    );


    const list =
      document.createElement(
        'ul'
      );


    (
      highlights ||
      []
    )
      .slice(
        0,
        3
      )
      .forEach(
        (
          item
        ) => {

          appendText(
            list,
            'li',
            item
          );

        }
      );


    summary.appendChild(
      list
    );

  }


  // ============================================================
  // BUILD RESULT
  // ============================================================

  function buildResult() {

    resultData =
      buildPersonalizedCopy();


    const resultTitle =
      document.getElementById(
        'resultTitle'
      );


    const resultCopy =
      document.getElementById(
        'resultCopy'
      );


    if (
      resultTitle
    ) {

      resultTitle.textContent =
        '우리 집에는\n이 CARE가 잘 맞습니다.';


      resultTitle.style.whiteSpace =
        'pre-line';

    }


    /*
     * 과거의 긴 분석 문단은
     * 고객 결과 화면에서 숨긴다.
     */

    if (
      resultCopy
    ) {

      resultCopy.textContent =
        '';


      resultCopy.hidden =
        true;

    }


    renderRecommendationPlan(
      resultData.plan
    );


    renderResultSummary(
      resultData.highlights
    );


    renderPlanExplore(
      resultData.plan
    );

  }


  // ============================================================
  // NEXT
  // ============================================================

  next?.addEventListener(
    'click',
    () => {

      if (
        answers[
          current
        ].length ===
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
        (
          question
        ) => {

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


        result.scrollIntoView({

          behavior:
            'smooth',

          block:
            'start'

        });

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
        current >
        0
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
      Boolean(
        text
      )
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
  // BOOKING TIME LABEL
  //
  // DB 시작시간 → 고객 표시 범위
  // ============================================================

  function getBookingTimeLabel(
    value
  ) {

    const normalized =
      normalizeBookingTime(
        value
      );


    return (
      BOOKING_TIME_LABELS[
        normalized
      ] ||
      normalized ||
      '—'
    );

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
        (
          button
        ) => {

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

      /*
       * 서버에 보내는 값은
       * 반드시 시작시간 그대로 유지.
       */
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
        `${
          formatBookingDate(
            bookingDate
          )
        } ${
          getBookingTimeLabel(
            bookingTime
          )
        }`;

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


    bookingAddress?.focus({

      preventScroll:
        true

    });

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
      const row of
      rows ||
      []
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


      /*
       * 프론트에서도 허용된 시간만 방어적으로 표시.
       *
       * 서버가 최종 권한이지만,
       * 예상치 못한 데이터가 내려와도
       * 고객 화면에는 노출하지 않는다.
       */

      if (
        !Object.prototype
          .hasOwnProperty
          .call(
            BOOKING_TIME_LABELS,
            time
          )
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


    // ==========================================================
    // 고객에게 최대 5개의 예약 가능 날짜만 표시
    //
    // 서버에서도 5일 제한을 적용하지만,
    // 프론트에서도 정책을 한 번 더 보장한다.
    // ==========================================================

    const visibleDates =
      [
        ...grouped.entries()
      ]
        .slice(
          0,
          MAX_VISIBLE_BOOKING_DATES
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
      ] of visibleDates
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
        const time of
        times
      ) {

        const button =
          document.createElement(
            'button'
          );


        button.type =
          'button';


        button.className =
          'public-booking-time';


        /*
         * 고객에게는 실제 CARE 범위를 표시.
         */
        button.textContent =
          getBookingTimeLabel(
            time
          );


        button.dataset.bookingTime =
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

      !window
        .moohaeSupabase
        ?.rpc

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

              /*
               * 5일만 조회한다는 뜻이 아니다.
               *
               * 일요일 / 공휴일 / 마감 슬롯 등을 제외한
               * 실제 예약 가능일 5개를 찾기 위해
               * 충분한 검색 범위를 서버에 요청한다.
               */
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

      `${
        formatBookingDate(
          bookingDate
        )
      } ${
        getBookingTimeLabel(
          bookingTime
        )
      }로 요청되었습니다. 담당자가 일정을 확인한 뒤 최종 예약을 안내드립니다.`

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


      case 'holiday_not_available':

        return '공휴일에는 방문 예약을 받을 수 없습니다. 다른 날짜를 선택해주세요.';


      case 'weekend_not_available':

        return '일요일에는 방문 예약을 받을 수 없습니다. 다른 날짜를 선택해주세요.';


      case 'invalid_booking_date':

        return '선택한 날짜를 사용할 수 없습니다. 다른 날짜를 선택해주세요.';


      case 'invalid_booking_time':

        return '선택한 방문 시간을 사용할 수 없습니다. 다른 시간을 선택해주세요.';


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

      !window
        .moohaeSupabase
        ?.rpc

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
    //
    // 서버에서도 다시 검증된다.
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

              /*
               * 고객 화면의 범위 텍스트가 아니라
               * 서버에는 시작시간만 보낸다.
               *
               * 10:00
               * 13:00
               * 16:00
               */
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
          typeof response
            ?.error_code ===
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


      /*
       * raw booking token은
       * 예약 완료 즉시 메모리에서도 폐기한다.
       */

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

  bookingAddress?.addEventListener(
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

  bookingSubmitButton?.addEventListener(
    'click',
    (
      event
    ) => {

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
    // PAYLOAD
    // ==========================================================

    const payload = {

      name,

      phone,

      privacy_consent:
        true,

      /*
       * honeypot
       */
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
        `${
          resultData.title
        } ${
          resultData.copy
        }`,

      /*
       * 기존 Edge Function / DB가
       * STANDARD / PLUS / SIGNATURE를
       * 기대하는 동안 저장 단계에서는
       * legacy 명칭을 유지한다.
       *
       * 고객 화면은
       * CORE / CORE+ / PRIVATE만 사용.
       */
      recommended_plan:
        toLegacyPlan(
          resultData.plan
        )

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

      /*
       * 서버가 기존 STANDARD / PLUS / SIGNATURE를
       * 반환하더라도 고객에게는
       * CORE / CORE+ / PRIVATE로 변환한다.
       */

      const serverPlan =
        typeof data
          .recommended_plan ===
          'string'

          ? data.recommended_plan

          : '';


      if (
        serverPlan
      ) {

        const normalizedServerPlan =
          normalizePlan(
            serverPlan
          );


        resultData.plan =
          normalizedServerPlan;


        resultData.level =
          normalizedServerPlan;


        renderRecommendationPlan(
          normalizedServerPlan
        );


        renderPlanExplore(
          normalizedServerPlan
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
        typeof data
          .booking_token ===
          'string'

          ? data.booking_token

          : '';


      const rawBookingExpiresAt =
        typeof data
          .booking_token_expires_at ===
          'string'

          ? data.booking_token_expires_at

          : '';


      /*
       * raw token은 형식 검증 후
       * 메모리 변수에만 보관한다.
       */

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
          ?.scrollIntoView({

            behavior:
              'smooth',

            block:
              'nearest'

          });


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

  submitButton?.addEventListener(
    'click',
    (
      event
    ) => {

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