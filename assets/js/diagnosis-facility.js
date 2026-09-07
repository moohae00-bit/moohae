(() => {
  'use strict';


  // ============================================================
  // MOOHAE FACILITY CHECK V3
  //
  // 목표
  //
  // 1. 기존 HOME CHECK diagnosis.js와 상태를 완전히 분리한다.
  // 2. 한 페이지 안에서 개인 / 시설 탭을 전환한다.
  // 3. 시설 7문항을 DB V3 허용값과 정확히 동일하게 전송한다.
  // 4. 시설 Q1의 "기타"는 상세 텍스트 없이 "기타"만 저장한다.
  // 5. 시설에서는 CARE PLAN / 가격을 자동 추천하지 않는다.
  // ============================================================


  const HOME_INTRO =
    Object.freeze({

      title:
        '우리 집은\n어떻게 관리하면 좋을까요?',

      copy:
        '더 정확한 HOME CHECK를 위해\n방문 전 몇 가지만 여쭤볼게요.'

    });


  const FACILITY_INTRO =
    Object.freeze({

      title:
        '시설은\n어떻게 관리하면 좋을까요?',

      copy:
        '시설의 운영 방식과 관리 범위를 이해하기 위해\n몇 가지만 여쭤볼게요.'

    });


  // ============================================================
  // DOM
  // ============================================================


  const homeTab =
    document.getElementById(
      'homeCheckTab'
    );


  const facilityTab =
    document.getElementById(
      'facilityCheckTab'
    );


  const homePanel =
    document.getElementById(
      'homeCheckPanel'
    );


  const facilityPanel =
    document.getElementById(
      'facilityCheckPanel'
    );


  const introTitle =
    document.getElementById(
      'checkIntroTitle'
    );


  const introCopy =
    document.getElementById(
      'checkIntroCopy'
    );


  const facilityQuestions =
    [
      ...document.querySelectorAll(
        '.facility-question'
      )
    ];


  const facilityProgress =
    document.getElementById(
      'facilityProgress'
    );


  const facilityProgressCount =
    document.getElementById(
      'facilityProgressCount'
    );


  const facilityPrev =
    document.getElementById(
      'facilityPrev'
    );


  const facilityNext =
    document.getElementById(
      'facilityNext'
    );


  const facilityNavButtons =
    document.getElementById(
      'facilityNavButtons'
    );


  const facilityResult =
    document.getElementById(
      'facilityResult'
    );


  const facilityResultSummary =
    document.getElementById(
      'facilityResultSummary'
    );


  const facilitySubmitForm =
    document.getElementById(
      'facilitySubmitForm'
    );


  const facilitySubmitButton =
    document.getElementById(
      'facilitySubmitButton'
    );


  const facilitySubmitMessage =
    document.getElementById(
      'facilitySubmitMessage'
    );


  const facilityName =
    document.getElementById(
      'facilityName'
    );


  const facilityCustomerName =
    document.getElementById(
      'facilityCustomerName'
    );


  const facilityCustomerPhone =
    document.getElementById(
      'facilityCustomerPhone'
    );


  const facilityPrivacyConsent =
    document.getElementById(
      'facilityPrivacyConsent'
    );


  const facilityWebsiteField =
    document.getElementById(
      'facilityWebsiteField'
    );


  // ============================================================
  // DOM SAFETY CHECK
  // ============================================================


  if (
    !homeTab ||
    !facilityTab ||
    !homePanel ||
    !facilityPanel ||
    facilityQuestions.length !==
      7
  ) {

    console.error(
      '[MOOHAE] Facility Check DOM is incomplete.'
    );


    return;

  }


  // ============================================================
  // STATE
  // ============================================================


  const facilityAnswers =
    facilityQuestions.map(
      () => []
    );


  let facilityCurrent =
    0;


  let activeCheckType =
    'home';


  let facilitySubmitted =
    false;


  // ============================================================
  // SAFE DOM HELPERS
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


  function setFacilitySubmitMessage(
    text,
    isError = false,
    isSuccess = false
  ) {

    if (
      !facilitySubmitMessage
    ) {

      return;

    }


    facilitySubmitMessage.textContent =
      text;


    facilitySubmitMessage
      .classList
      .toggle(
        'error',
        isError
      );


    facilitySubmitMessage
      .classList
      .toggle(
        'success',
        isSuccess
      );

  }


  // ============================================================
  // CHECK TYPE TABS
  // ============================================================


  function setIntro(
    type
  ) {

    const data =
      type ===
        'facility'

        ? FACILITY_INTRO
        : HOME_INTRO;


    if (
      introTitle
    ) {

      introTitle.textContent =
        data.title;


      introTitle.style.whiteSpace =
        'pre-line';

    }


    if (
      introCopy
    ) {

      introCopy.textContent =
        data.copy;


      introCopy.style.whiteSpace =
        'pre-line';

    }

  }


  function setCheckType(
    type
  ) {

    activeCheckType =
      type ===
        'facility'

        ? 'facility'
        : 'home';


    const isFacility =
      activeCheckType ===
        'facility';


    homeTab
      .classList
      .toggle(
        'is-active',
        !isFacility
      );


    facilityTab
      .classList
      .toggle(
        'is-active',
        isFacility
      );


    homeTab.setAttribute(
      'aria-selected',
      String(
        !isFacility
      )
    );


    facilityTab.setAttribute(
      'aria-selected',
      String(
        isFacility
      )
    );


    homePanel.hidden =
      isFacility;


    facilityPanel.hidden =
      !isFacility;


    homePanel
      .classList
      .toggle(
        'is-active',
        !isFacility
      );


    facilityPanel
      .classList
      .toggle(
        'is-active',
        isFacility
      );


    setIntro(
      activeCheckType
    );


    if (
      isFacility &&
      !facilitySubmitted
    ) {

      renderFacilityQuestion();

    }

  }


  homeTab.addEventListener(
    'click',
    () => {

      setCheckType(
        'home'
      );

    }
  );


  facilityTab.addEventListener(
    'click',
    () => {

      setCheckType(
        'facility'
      );

    }
  );


  // ============================================================
  // FACILITY QUESTION RENDER
  // ============================================================


  function renderFacilityQuestion() {

    facilityQuestions.forEach(
      (
        question,
        index
      ) => {

        const active =
          index ===
            facilityCurrent;


        question.hidden =
          !active;


        question
          .classList
          .toggle(
            'is-active',
            active
          );

      }
    );


    if (
      facilityProgress
    ) {

      facilityProgress.style.width =
        `${
          (
            (
              facilityCurrent +
              1
            ) /
            facilityQuestions.length
          ) *
          100
        }%`;

    }


    if (
      facilityProgressCount
    ) {

      facilityProgressCount.textContent =
        `${
          facilityCurrent +
          1
        } / ${
          facilityQuestions.length
        }`;

    }


    if (
      facilityPrev
    ) {

      facilityPrev.style.visibility =
        facilityCurrent ===
          0

          ? 'hidden'
          : 'visible';

    }


    if (
      facilityNext
    ) {

      facilityNext.textContent =
        facilityCurrent ===
          facilityQuestions.length -
          1

          ? '결과 보기'
          : '다음';

    }

  }


  // ============================================================
  // FACILITY OPTION SELECTION
  // ============================================================


  facilityQuestions.forEach(
    (
      question,
      questionIndex
    ) => {

      const single =
        question.dataset
          .single ===
        'true';


      const maxSelect =
        Number(
          question.dataset
            .maxSelect ||
          0
        );


      const exclusiveValue =
        String(
          question.dataset
            .exclusiveValue ||
          ''
        );


      const buttons =
        [
          ...question.querySelectorAll(
            '.facility-option'
          )
        ];


      buttons.forEach(
        (
          button
        ) => {

          button.addEventListener(
            'click',
            () => {

              const value =
                button
                  .textContent
                  .trim();


              // ==================================================
              // SINGLE
              // ==================================================


              if (
                single
              ) {

                buttons.forEach(
                  (
                    item
                  ) => {

                    item.classList.remove(
                      'is-selected'
                    );

                  }
                );


                button.classList.add(
                  'is-selected'
                );


                facilityAnswers[
                  questionIndex
                ] =
                  [
                    value
                  ];


                return;

              }


              // ==================================================
              // EXCLUSIVE VALUE
              //
              // Q4 "현재는 없음"은
              // 다른 값과 함께 선택할 수 없다.
              // ==================================================


              if (
                exclusiveValue &&
                value ===
                  exclusiveValue
              ) {

                buttons.forEach(
                  (
                    item
                  ) => {

                    item.classList.remove(
                      'is-selected'
                    );

                  }
                );


                button.classList.add(
                  'is-selected'
                );


                facilityAnswers[
                  questionIndex
                ] =
                  [
                    exclusiveValue
                  ];


                return;

              }


              if (
                exclusiveValue
              ) {

                const exclusiveButton =
                  buttons.find(
                    (
                      item
                    ) =>
                      item
                        .textContent
                        .trim() ===
                      exclusiveValue
                  );


                exclusiveButton
                  ?.classList
                  .remove(
                    'is-selected'
                  );


                facilityAnswers[
                  questionIndex
                ] =
                  facilityAnswers[
                    questionIndex
                  ]
                    .filter(
                      (
                        item
                      ) =>
                        item !==
                          exclusiveValue
                    );

              }


              const alreadySelected =
                button
                  .classList
                  .contains(
                    'is-selected'
                  );


              if (
                !alreadySelected &&
                maxSelect >
                  0 &&
                facilityAnswers[
                  questionIndex
                ].length >=
                  maxSelect
              ) {

                alert(
                  `최대 ${maxSelect}개까지 선택할 수 있습니다.`
                );


                return;

              }


              button
                .classList
                .toggle(
                  'is-selected'
                );


              if (
                button
                  .classList
                  .contains(
                    'is-selected'
                  )
              ) {

                if (
                  !facilityAnswers[
                    questionIndex
                  ]
                    .includes(
                      value
                    )
                ) {

                  facilityAnswers[
                    questionIndex
                  ]
                    .push(
                      value
                    );

                }

              } else {

                facilityAnswers[
                  questionIndex
                ] =
                  facilityAnswers[
                    questionIndex
                  ]
                    .filter(
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
  // VALIDATION
  // ============================================================


  function validateFacilityCurrentAnswer() {

    const answer =
      facilityAnswers[
        facilityCurrent
      ];


    if (
      !Array.isArray(
        answer
      ) ||
      answer.length ===
        0
    ) {

      alert(
        '한 개 이상 선택해주세요.'
      );


      return false;

    }


    const question =
      facilityQuestions[
        facilityCurrent
      ];


    const maxSelect =
      Number(
        question.dataset
          .maxSelect ||
        0
      );


    if (
      maxSelect >
        0 &&
      answer.length >
        maxSelect
    ) {

      alert(
        `최대 ${maxSelect}개까지 선택할 수 있습니다.`
      );


      return false;

    }


    const exclusiveValue =
      String(
        question.dataset
          .exclusiveValue ||
        ''
      );


    if (
      exclusiveValue &&
      answer.includes(
        exclusiveValue
      ) &&
      answer.length !==
        1
    ) {

      alert(
        `'${exclusiveValue}'은 다른 항목과 함께 선택할 수 없습니다.`
      );


      return false;

    }


    return true;

  }


  // ============================================================
  // RESULT SUMMARY
  // ============================================================


  function addFacilitySummaryCard(
    label,
    value
  ) {

    if (
      !facilityResultSummary
    ) {

      return;

    }


    const card =
      document.createElement(
        'div'
      );


    card.className =
      'facility-summary-card';


    appendText(
      card,
      'span',
      label
    );


    appendText(
      card,
      'strong',
      value ||
        '—'
    );


    facilityResultSummary.appendChild(
      card
    );

  }


  function renderFacilityResultSummary() {

    if (
      !facilityResultSummary
    ) {

      return;

    }


    facilityResultSummary.replaceChildren();


    addFacilitySummaryCard(
      '가장 신경 쓰이는 곳',
      facilityAnswers[
        0
      ].join(
        ' · '
      )
    );


    addFacilitySummaryCard(
      '현재 관리 방식',
      facilityAnswers[
        2
      ]?.[0] ||
        '—'
    );


    addFacilitySummaryCard(
      '선호 CARE 방식',
      facilityAnswers[
        5
      ]?.[0] ||
        '—'
    );

  }


  function showFacilityResult() {

    facilityQuestions.forEach(
      (
        question
      ) => {

        question.hidden =
          true;


        question
          .classList
          .remove(
            'is-active'
          );

      }
    );


    if (
      facilityNavButtons
    ) {

      facilityNavButtons.hidden =
        true;

    }


    if (
      facilityProgress
    ) {

      facilityProgress.style.width =
        '100%';

    }


    if (
      facilityProgressCount
    ) {

      facilityProgressCount.textContent =
        '7 / 7';

    }


    renderFacilityResultSummary();


    if (
      facilityResult
    ) {

      facilityResult.hidden =
        false;


      facilityResult.scrollIntoView(
        {

          behavior:
            'smooth',

          block:
            'start'

        }
      );

    }

  }


  // ============================================================
  // NEXT
  // ============================================================


  facilityNext
    ?.addEventListener(
      'click',
      () => {

        if (
          !validateFacilityCurrentAnswer()
        ) {

          return;

        }


        if (
          facilityCurrent <
            facilityQuestions.length -
            1
        ) {

          facilityCurrent +=
            1;


          renderFacilityQuestion();


          return;

        }


        showFacilityResult();

      }
    );


  // ============================================================
  // PREVIOUS
  // ============================================================


  facilityPrev
    ?.addEventListener(
      'click',
      () => {

        if (
          facilityCurrent >
            0
        ) {

          facilityCurrent -=
            1;


          renderFacilityQuestion();

        }

      }
    );


  // ============================================================
  // FACILITY PAYLOAD
  // ============================================================


  function buildFacilityPayload() {

    return {

      customer_type:
        'facility',


      name:
        facilityCustomerName
          ?.value
          .trim() ||
        '',


      phone:
        facilityCustomerPhone
          ?.value
          .trim() ||
        '',


      privacy_consent:
        facilityPrivacyConsent
          ?.checked ===
        true,


      website:
        facilityWebsiteField
          ?.value ||
        '',


      facility_name:
        facilityName
          ?.value
          .trim() ||
        '',


      // ========================================================
      // Q1
      //
      // "기타"는 상세 입력 자체를 받지 않는다.
      // DB에도 정확히 "기타"만 전달한다.
      // ========================================================

      facility_focus_areas:
        facilityAnswers[
          0
        ]
          .map(
            (
              value
            ) =>
              String(
                value
              )
                .startsWith(
                  '기타'
                )

                ? '기타'
                : value
          ),


      // Q2

      facility_pain_point:
        facilityAnswers[
          1
        ]?.[0] ||
        '',


      // Q3

      facility_management_method:
        facilityAnswers[
          2
        ]?.[0] ||
        '',


      // Q4

      facility_care_need_areas:
        facilityAnswers[
          3
        ],


      // Q5

      facility_decision_factor:
        facilityAnswers[
          4
        ]?.[0] ||
        '',


      // Q6

      facility_service_preference:
        facilityAnswers[
          5
        ]?.[0] ||
        '',


      // Q7

      facility_sales_preference:
        facilityAnswers[
          6
        ]?.[0] ||
        ''

    };

  }


  // ============================================================
  // FACILITY FORM VALIDATION
  // ============================================================


  function validateFacilityForm(
    payload
  ) {


    // ==========================================================
    // FACILITY NAME
    // ==========================================================


    if (
      !payload
        .facility_name
    ) {

      setFacilitySubmitMessage(
        '시설명을 입력해주세요.',
        true
      );


      facilityName
        ?.focus();


      return false;

    }


    if (
      payload
        .facility_name
        .length >
      120
    ) {

      setFacilitySubmitMessage(
        '시설명은 120자 이내로 입력해주세요.',
        true
      );


      facilityName
        ?.focus();


      return false;

    }


    // ==========================================================
    // NAME
    // ==========================================================


    if (
      !payload.name
    ) {

      setFacilitySubmitMessage(
        '담당자 이름을 입력해주세요.',
        true
      );


      facilityCustomerName
        ?.focus();


      return false;

    }


    // ==========================================================
    // PHONE
    // ==========================================================


    if (
      !/^[0-9+\-\s()]{9,20}$/
        .test(
          payload.phone
        )
    ) {

      setFacilitySubmitMessage(
        '연락처를 확인해주세요.',
        true
      );


      facilityCustomerPhone
        ?.focus();


      return false;

    }


    // ==========================================================
    // PRIVACY
    // ==========================================================


    if (
      payload
        .privacy_consent !==
      true
    ) {

      setFacilitySubmitMessage(
        '개인정보 수집·이용 동의가 필요합니다.',
        true
      );


      facilityPrivacyConsent
        ?.focus();


      return false;

    }


    // ==========================================================
    // ALL 7 ANSWERS
    // ==========================================================


    const allAnswersReady =
      facilityAnswers
        .every(
          (
            answer
          ) =>
            Array.isArray(
              answer
            ) &&
            answer.length >
              0
        );


    if (
      !allAnswersReady
    ) {

      setFacilitySubmitMessage(
        '시설 CHECK 응답을 다시 확인해주세요.',
        true
      );


      return false;

    }


    // ==========================================================
    // Q4 EXCLUSIVE VALUE
    // ==========================================================


    if (
      payload
        .facility_care_need_areas
        .includes(
          '현재는 없음'
        ) &&
      payload
        .facility_care_need_areas
        .length !==
      1
    ) {

      setFacilitySubmitMessage(
        "'현재는 없음'은 다른 항목과 함께 선택할 수 없습니다.",
        true
      );


      return false;

    }


    return true;

  }


  // ============================================================
  // FACILITY SUBMIT
  // ============================================================


  async function submitFacilityDiagnosis() {


    if (
      facilitySubmitted
    ) {

      return;

    }


    const payload =
      buildFacilityPayload();


    if (
      !validateFacilityForm(
        payload
      )
    ) {

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

      setFacilitySubmitMessage(
        '전송 연결을 불러오지 못했습니다. 페이지를 새로고침 후 다시 시도해주세요.',
        true
      );


      console.error(
        '[MOOHAE] Supabase client/functions unavailable'
      );


      return;

    }


    // ==========================================================
    // BUSY
    // ==========================================================


    if (
      facilitySubmitButton
    ) {

      facilitySubmitButton.disabled =
        true;


      facilitySubmitButton.textContent =
        '보내는 중...';

    }


    setFacilitySubmitMessage(
      ''
    );


    try {


      // ========================================================
      // EDGE FUNCTION
      // ========================================================


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


      // ========================================================
      // INVOKE ERROR
      // ========================================================


      if (
        error
      ) {

        console.error(
          '[MOOHAE] Facility Edge Function invoke error',
          error
        );


        throw error;

      }


      // ========================================================
      // SERVER REJECTED
      // ========================================================


      if (
        !data?.ok
      ) {

        console.error(
          '[MOOHAE] Facility Edge Function rejected payload',
          data
        );


        throw new Error(
          data?.error ||
          'facility_submission_failed'
        );

      }


      // ========================================================
      // CUSTOMER TYPE VERIFY
      // ========================================================


      if (
        data
          .customer_type !==
        'facility'
      ) {

        throw new Error(
          'unexpected_customer_type'
        );

      }


      // ========================================================
      // SUCCESS
      // ========================================================


      facilitySubmitted =
        true;


      if (
        facilitySubmitButton
      ) {

        facilitySubmitButton.disabled =
          true;


        facilitySubmitButton.textContent =
          '전달 완료';

      }


      setFacilitySubmitMessage(

        '시설 CHECK가 정상적으로 전달되었습니다. 체크 내용을 기준으로 상담을 이어가겠습니다.',

        false,

        true

      );


      // ========================================================
      // SECURITY
      //
      // Edge Function이 booking_token을 반환하더라도
      // 시설 상담 화면에서는 저장하거나 노출하지 않는다.
      //
      // localStorage
      // sessionStorage
      // URL
      // DOM
      //
      // 어디에도 기록하지 않는다.
      // ========================================================


      if (
        facilitySubmitForm
      ) {

        const complete =
          document.createElement(
            'div'
          );


        complete.className =
          'facility-submit-complete';


        complete.textContent =
          '접수가 완료되었습니다. 시설 운영 방식과 체크 내용을 확인한 뒤 필요한 CARE 범위를 함께 정리합니다.';


        facilitySubmitForm
          .insertAdjacentElement(
            'afterend',
            complete
          );

      }


    } catch (
      error
    ) {


      console.error(
        '[MOOHAE] Facility diagnosis submit failed',
        error
      );


      setFacilitySubmitMessage(
        '전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        true
      );


      if (
        facilitySubmitButton
      ) {

        facilitySubmitButton.disabled =
          false;


        facilitySubmitButton.textContent =
          '시설 CHECK 보내고 상담 신청하기';

      }

    }

  }


  // ============================================================
  // BLOCK NATIVE SUBMIT
  // ============================================================


  facilitySubmitForm
    ?.addEventListener(
      'submit',
      (
        event
      ) => {

        event.preventDefault();

        event.stopPropagation();

      }
    );


  // ============================================================
  // SUBMIT BUTTON
  // ============================================================


  facilitySubmitButton
    ?.addEventListener(
      'click',
      (
        event
      ) => {

        event.preventDefault();

        event.stopPropagation();


        submitFacilityDiagnosis();

      }
    );


  // ============================================================
  // KEYBOARD TAB SUPPORT
  // ============================================================


  [
    homeTab,
    facilityTab
  ]
    .forEach(
      (
        tab,
        index,
        tabs
      ) => {

        tab.addEventListener(
          'keydown',
          (
            event
          ) => {

            if (
              event.key !==
                'ArrowLeft' &&
              event.key !==
                'ArrowRight'
            ) {

              return;

            }


            event.preventDefault();


            const direction =
              event.key ===
                'ArrowRight'

                ? 1
                : -1;


            const nextIndex =
              (
                index +
                direction +
                tabs.length
              ) %
              tabs.length;


            tabs[
              nextIndex
            ]
              .focus();


            tabs[
              nextIndex
            ]
              .click();

          }
        );

      }
    );


  // ============================================================
  // START
  // ============================================================


  setCheckType(
    activeCheckType
  );


  renderFacilityQuestion();


})();