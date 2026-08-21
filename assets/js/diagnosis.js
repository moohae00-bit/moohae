(() => {
  'use strict';

  // ============================================================
  // MOOHAE CHECK V2
  //
  // 역할
  // 1. 5개 질문 응답 관리
  // 2. 고객에게 관리 유형 추천
  // 3. 가격은 표시하지 않음
  // 4. 상담 신청 시 Edge Function으로 V2 응답 전달
  // 5. 최종 공식 플랜은 서버 응답을 기준으로 반영
  // ============================================================


  // ============================================================
  // ELEMENTS
  // ============================================================

  const qs = [
    ...document.querySelectorAll('.question')
  ];

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

  const submitForm =
    document.getElementById('diagnosisSubmitForm');

  const submitButton =
    document.getElementById('diagnosisSubmitButton');

  const submitMessage =
    document.getElementById('diagnosisSubmitMessage');


  // ============================================================
  // STATE
  // ============================================================

  const answers =
    qs.map(() => []);

  let current = 0;

  let resultData = {
    level: '',
    title: '',
    copy: '',
    recommendation: '',
    plan: ''
  };


  // ============================================================
  // FORM SAFETY
  // ============================================================

  // 브라우저 기본 form submit으로 페이지가 이동하거나
  // 의도하지 않은 방식으로 전송되는 것을 막는다.
  if (submitForm) {
    submitForm.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        return false;
      }
    );
  }


  // ============================================================
  // QUESTION UI
  // ============================================================

  function render() {
    qs.forEach(
      (question, index) => {
        question.hidden =
          index !== current;

        question.classList.toggle(
          'active',
          index === current
        );
      }
    );


    if (progress) {
      progress.style.width =
        `${(current / qs.length) * 100}%`;
    }


    if (prev) {
      prev.style.visibility =
        current === 0
          ? 'hidden'
          : 'visible';
    }


    if (next) {
      next.textContent =
        current === qs.length - 1
          ? '결과 보기'
          : '다음';
    }
  }


  // ============================================================
  // ANSWER SELECTION
  // ============================================================

  qs.forEach(
    (question, qIndex) => {
      const single =
        question.dataset.single === 'true';


      question
        .querySelectorAll('.option')
        .forEach((button) => {
          button.type = 'button';


          button.addEventListener(
            'click',
            () => {
              const value =
                button.textContent.trim();


              // --------------------------------------------------
              // 단일 선택 질문
              // Q5
              // --------------------------------------------------

              if (single) {
                question
                  .querySelectorAll('.option')
                  .forEach((item) => {
                    item.classList.remove(
                      'selected'
                    );
                  });


                answers[qIndex] = [
                  value
                ];


                button.classList.add(
                  'selected'
                );

                return;
              }


              // --------------------------------------------------
              // 복수 선택 질문
              // --------------------------------------------------

              button.classList.toggle(
                'selected'
              );


              if (
                button.classList.contains(
                  'selected'
                )
              ) {
                if (
                  !answers[qIndex].includes(
                    value
                  )
                ) {
                  answers[qIndex].push(
                    value
                  );
                }

              } else {
                answers[qIndex] =
                  answers[qIndex].filter(
                    (item) =>
                      item !== value
                  );
              }
            }
          );
        });
    }
  );


  // ============================================================
  // DOM HELPER
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


  // ============================================================
  // CLIENT-SIDE PERSONALIZATION
  //
  // 고객에게 즉시 결과를 보여주기 위한 UI용 판정.
  //
  // 실제 DB에 저장되는 공식 recommended_plan은
  // Edge Function에서 동일한 응답을 다시 검증하고 계산한다.
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
      spaces.length >= 2 ||
      spaces.includes(
        '여러 공간에 고르게'
      );


    const manySurfaces =
      surfaces.length >= 3 ||
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


    const wantsSOS =
      worries.includes(
        '예상하지 못한 오염이 생길 때도 도움받고 싶다'
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


    const wantsConsult =
      preference.includes(
        '상담을 통해'
      );


    // ==========================================================
    // PLAN
    //
    // 가격은 존재하지 않는다.
    // ==========================================================

    let plan =
      'STANDARD';

    let level =
      'STANDARD';


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
    // PERSONALIZED DETAILS
    // ==========================================================

    const details = [];


    if (manySpaces) {
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


    if (feelsRecurring) {
      details.push(
        '관리 후에도 다시 신경 쓰이는 반복적인 부담'
      );
    }


    if (unsureScope) {
      details.push(
        '언제 어디까지 관리해야 할지 계속 판단해야 하는 부담'
      );
    }


    if (childFocus) {
      details.push(
        '아이의 생활공간을 조금 더 세심하게 살피고 싶은 마음'
      );
    }


    if (petFocus) {
      details.push(
        '반려동물이 머무는 생활공간을 조금 더 세심하게 관리하고 싶은 마음'
      );
    }


    if (wantsSOS) {
      details.push(
        '예상하지 못한 오염이 생겼을 때도 도움받고 싶은 필요'
      );
    }


    // ==========================================================
    // RESULT COPY
    // ==========================================================

    let title = '';
    let copy = '';
    let recommendation = '';


    // ----------------------------------------------------------
    // SIGNATURE
    // ----------------------------------------------------------

    if (
      plan === 'SIGNATURE'
    ) {
      title =
        '우리 집의 생활 흐름까지 기억하며 관리해주는 방식이 잘 맞아 보여요.';


      copy =
        `선택하신 내용을 보면 ${details
          .slice(0, 4)
          .join(', ')}이 함께 보여요. ` +

        '정해진 케어를 반복하는 것보다 우리 집의 생활방식과 이전 관리 내용을 담당자가 이해하고, 필요한 시점과 영역을 함께 판단해주길 원하는 쪽에 가깝습니다.';


      recommendation =
        'SIGNATURE는 우리 집의 관리 이력을 바탕으로 보다 세심하게 관리 흐름을 이어가는 유형입니다. 담당 관리자가 이전 Care History를 확인하고 다음 관리까지 함께 설계합니다.';


    // ----------------------------------------------------------
    // PLUS
    // ----------------------------------------------------------

    } else if (
      plan === 'PLUS'
    ) {
      title =
        '집 전체의 기본 관리에 더해, 마음이 쓰이는 생활영역을 조금 더 세심하게 살펴보는 방식이 잘 맞아 보여요.';


      copy =
        `선택하신 내용을 보면 ${details
          .slice(0, 4)
          .join(', ')}이 중요해 보여요. ` +

        '모든 공간을 똑같이 관리하기보다 집 전체의 기본적인 관리 흐름을 유지하면서 실제 사용이 많거나 더 신경 쓰이는 생활영역에 관리 비중을 두는 방식이 잘 맞습니다.';


      recommendation =
        'PLUS는 집 전체의 기본적인 관리 흐름과 함께 아이·반려동물·특정 생활동선처럼 더 신경 쓰이는 영역을 조금 더 세심하게 이어서 관리하는 유형입니다.';


    // ----------------------------------------------------------
    // STANDARD
    // ----------------------------------------------------------

    } else {
      title =
        '우리 집의 기본적인 관리 흐름부터 꾸준히 이어가는 방식이 잘 맞아 보여요.';


      copy =
        `선택하신 내용을 보면 ${details
          .slice(0, 3)
          .join(', ')}이 먼저 보여요. ` +

        '특정 한 곳에 관리가 집중되기보다 평소 자주 사용하는 주요 생활 공간과 접촉면을 일정한 흐름으로 살펴보는 것이 좋은 시작점이 될 수 있습니다.';


      recommendation =
        'STANDARD는 우리 집의 주요 생활공간과 생활 접촉면을 기본으로 살펴보며 관리의 흐름을 꾸준히 이어가는 유형입니다.';
    }


    // ----------------------------------------------------------
    // CONSULTATION
    // ----------------------------------------------------------

    if (wantsConsult) {
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
  // RESULT VIEW
  // ============================================================

  function renderRecommendationPlan(
    plan,
    recommendation
  ) {
    const rec =
      document.getElementById(
        'resultRecommend'
      );

    if (!rec) {
      return;
    }


    rec.replaceChildren();


    // 가격 없이 플랜명만 표시
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


    if (resultLevel) {
      resultLevel.textContent =
        resultData.plan;
    }


    if (resultTitle) {
      resultTitle.textContent =
        resultData.title;
    }


    if (resultCopy) {
      resultCopy.textContent =
        resultData.copy;
    }


    renderRecommendationPlan(
      resultData.plan,
      resultData.recommendation
    );


    // ----------------------------------------------------------
    // HOME PROFILE SUMMARY
    // ----------------------------------------------------------

    const summary =
      document.getElementById(
        'resultSummary'
      );


    if (summary) {
      summary.replaceChildren();


      appendText(
        summary,
        'strong',
        '우리 집 Home Profile 시작점'
      );


      answers.forEach(
        (group, index) => {
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
        answers[current].length === 0
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
        current += 1;

        render();

        return;
      }


      // --------------------------------------------------------
      // RESULT
      // --------------------------------------------------------

      buildResult();


      qs.forEach(
        (question) => {
          question.hidden = true;
        }
      );


      if (navButtons) {
        navButtons.hidden = true;
      }


      if (progress) {
        progress.style.width =
          '100%';
      }


      if (result) {
        result.style.display =
          'block';


        result.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
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
        current > 0
      ) {
        current -= 1;

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
    if (!submitMessage) {
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
  // SEND MOOHAE CHECK
  // ============================================================

  async function sendDiagnosis() {
    const name =
      document
        .getElementById(
          'customerName'
        )
        ?.value
        .trim() || '';


    const phone =
      document
        .getElementById(
          'customerPhone'
        )
        ?.value
        .trim() || '';


    const privacy =
      document
        .getElementById(
          'privacyConsent'
        )
        ?.checked === true;


    const website =
      document
        .getElementById(
          'websiteField'
        )
        ?.value || '';


    // ----------------------------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------------------------

    if (!name) {
      setSubmitMessage(
        '이름을 입력해주세요.',
        true
      );

      return;
    }


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


    if (!privacy) {
      setSubmitMessage(
        '개인정보 수집·이용 동의가 필요합니다.',
        true
      );

      return;
    }


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


    // ----------------------------------------------------------
    // SUBMIT UI
    // ----------------------------------------------------------

    submitButton.disabled =
      true;


    submitButton.textContent =
      '보내는 중...';


    setSubmitMessage(
      ''
    );


    // ==========================================================
    // V2 PAYLOAD
    //
    // client_result_* / recommended_plan은
    // 서버가 공식 판정에 사용하지 않는다.
    //
    // 실제 공식 플랜은 Edge Function이
    // answers를 다시 검증한 뒤 계산한다.
    // ==========================================================

    const payload = {
      name,
      phone,

      privacy_consent: true,

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


      if (error) {
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


        if (resultLevel) {
          resultLevel.textContent =
            serverPlan;
        }


        renderRecommendationPlan(
          serverPlan,
          resultData.recommendation
        );
      }


      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      setSubmitMessage(
        '전달되었습니다. 무해가 체크 내용을 확인한 뒤 연락드리겠습니다.'
      );


      submitButton.textContent =
        '전달 완료';


      submitButton.disabled =
        true;


    } catch (error) {
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
  // SUBMIT BUTTON
  // ============================================================

  submitButton?.addEventListener(
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