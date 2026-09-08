(() => {
  'use strict';

  // ============================================================
  // MOOHAE HOME CHECK · CARE PLAN V3 DISPLAY
  //
  // 기존 diagnosis.js의 안정된 설문/예약/전송 로직은 건드리지 않는다.
  // HOME CHECK 최종 6문항의 고객용 결과 표시만
  // CORE / CORE+ / PRIVATE 3단계 기준으로 보정한다.
  //
  // 서버가 최종 authoritative 판정을 다시 수행하므로
  // 이 파일과 submit-diagnosis의 판정 기준은 동일해야 한다.
  // ============================================================

  const homePanel =
    document.getElementById('homeCheckPanel');

  const nextButton =
    document.getElementById('next');

  if (
    !homePanel ||
    !nextButton
  ) {
    return;
  }


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


  function selectedValues(
    question
  ) {

    if (
      !question
    ) {
      return [];
    }


    return [

      ...question.querySelectorAll(
        '.option.selected'
      )

    ]
      .map(
        (button) =>
          button.textContent.trim()
      )
      .filter(Boolean);
  }


  function getHomeAnswers() {

    const questions = [

      ...homePanel.querySelectorAll(
        '.question'
      )

    ];


    if (
      questions.length !==
        6
    ) {
      return null;
    }


    return questions.map(
      selectedValues
    );
  }


  function decidePlan(
    answers
  ) {

    const focusAreas =
      answers?.[0] ||
      [];


    const primaryConcern =
      answers?.[1]?.[0] ||
      '';


    const primaryCurrentManagement =
      answers?.[2]?.[0] ||
      '';


    const primaryVisitGoal =
      answers?.[3]?.[0] ||
      '';


    const hasMultipleFocus =
      focusAreas.length >=
        2;


    const childOrPetFocus =
      focusAreas.some(
        (value) =>
          value ===
            '아이 생활공간' ||
          value ===
            '반려동물 생활공간'
      ) ||
      primaryConcern ===
        '아이가 생활하는 곳이라 신경 쓰여요' ||
      primaryConcern ===
        '반려동물이 함께 생활해요';


    const managementBurden =
      primaryConcern ===
        '평소 관리하기 어려워요' ||
      primaryCurrentManagement ===
        '따로 관리하지 못하고 있어요';


    const alreadyUsesSpecialCare =
      primaryCurrentManagement ===
        '전용 장비를 사용해요' ||
      primaryCurrentManagement ===
        '전문 CARE를 받아요';


    const needsScopeHelp =
      primaryVisitGoal ===
        '관리가 필요한 곳';


    const needsOngoingCycle =
      primaryVisitGoal ===
        '적절한 관리 주기';


    // ==========================================================
    // PRIVATE
    //
    // 단순 관심이 아니라
    //
    // 1. 관리 영역 2개 이상
    // 2. 지속적인 관리 주기 필요
    // 3. 아이/반려동물 또는 관리 부담 또는 기존 전문 CARE
    //
    // 세 조건이 함께 확인될 때만 PRIVATE
    // ==========================================================

    const privateNeed =
      hasMultipleFocus &&
      needsOngoingCycle &&
      (
        childOrPetFocus ||
        managementBurden ||
        alreadyUsesSpecialCare
      );


    if (
      privateNeed
    ) {
      return 'PRIVATE';
    }


    // ==========================================================
    // CORE+
    // ==========================================================

    const corePlusNeed =
      childOrPetFocus ||
      hasMultipleFocus ||
      managementBurden ||
      primaryConcern ===
        '먼지·털 등이 신경 쓰여요' ||
      needsScopeHelp ||
      needsOngoingCycle;


    return corePlusNeed
      ? 'CORE+'
      : 'CORE';
  }


  function appendText(
    parent,
    tag,
    text,
    className = ''
  ) {

    const node =
      document.createElement(
        tag
      );


    node.textContent =
      text;


    if (
      className
    ) {
      node.className =
        className;
    }


    parent.appendChild(
      node
    );


    return node;
  }


  function renderRecommendation(
    plan
  ) {

    const rec =
      document.getElementById(
        'resultRecommend'
      );


    const info =
      CARE_PLANS[
        plan
      ];


    if (
      !rec ||
      !info
    ) {
      return;
    }


    rec.replaceChildren();


    appendText(
      rec,
      'p',
      info.name,
      'result-plan-name'
    );


    const headline =
      appendText(
        rec,
        'h3',
        info.headline,
        'result-plan-copy'
      );


    headline.style.whiteSpace =
      'pre-line';


    appendText(
      rec,
      'p',
      info.description,
      'result-plan-desc'
    );


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


    appendText(
      nav,
      'span',
      '다른 CARE도 살펴보세요.',
      'plan-explore-title'
    );


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
        (key) => {

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


          if (
            key ===
              plan
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


  function syncPlanView() {

    const result =
      document.getElementById(
        'result'
      );


    if (
      !result ||
      result.style.display !==
        'block'
    ) {
      return;
    }


    const answers =
      getHomeAnswers();


    if (
      !answers ||
      answers.some(
        (answer) =>
          !Array.isArray(
            answer
          ) ||
          answer.length ===
            0
      )
    ) {
      return;
    }


    const plan =
      decidePlan(
        answers
      );


    renderRecommendation(
      plan
    );


    renderPlanExplore(
      plan
    );
  }


  // ============================================================
  // 기존 diagnosis.js가 먼저 결과를 만든 뒤
  // 동일 이벤트 턴 마지막에서 V3 결과를 적용한다.
  // ============================================================

  nextButton.addEventListener(
    'click',
    () => {

      window.setTimeout(
        syncPlanView,
        0
      );

    }
  );

})();