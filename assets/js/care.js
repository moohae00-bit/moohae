(() => {
  'use strict';


  // ============================================================
  // MOOHAE CARE V2
  //
  // 이 파일만 수정하면
  // ONE / CORE / CORE+ / PRIVATE의
  // 이름, 가격, 방문횟수, 구성, 설명이 전체 UI에 반영됩니다.
  //
  // DATA ≠ SCREEN
  // HTML에 가격을 중복 하드코딩하지 않습니다.
  // ============================================================


  // ============================================================
  // SERVICE DATA
  // ============================================================

  const CARE_CONFIG = {

    one: {
      label:
        'MOOHAE ONE',

      items: [
        {
          id:
            'basic',

          code:
            'ONE · BASIC',

          name:
            '베이직 CARE',

          price:
            35000,

          unit:
            '방 1개 기준',

          description:
            '하나의 생활공간부터 부담 없이 시작하는 1회 CARE.'
        },

        {
          id:
            'all-in-one',

          code:
            'ONE · ALL IN ONE',

          name:
            '올인원 CARE',

          price:
            55000,

          unit:
            '방 1개 기준',

          description:
            '한 공간 안에서 조금 더 넓은 범위를 살펴보는 1회 CARE.'
        },

        {
          id:
            'fabric',

          code:
            'ONE · FABRIC',

          name:
            '패브릭 CARE',

          price:
            58000,

          unit:
            '패브릭 전체',

          description:
            '매트리스 · 소파 · 러그 · 카펫 등 생활 패브릭을 집중 CARE.'
        },

        {
          id:
            'living',

          code:
            'ONE · LIVING',

          name:
            '리빙 CARE',

          price:
            100000,

          unit:
            '거실 + 주방',

          description:
            '가족의 생활이 가장 많이 이어지는 공용공간을 위한 1회 CARE.'
        }
      ]
    },


    plans: [
      {
        id:
          'core',

        name:
          'CORE',

        headline:
          '생활의 핵심을,',

        accent:
          '1년의 주기로.',

        price:
          360000,

        priceUnit:
          '/ 1년',

        visits:
          3,

        visitLabel:
          '연 3회 CARE',

        lead:
          '몸이 자주 닿고 생활이 반복되는 핵심 영역을 1년의 CARE CYCLE 안에서 이어서 관리합니다.',

        includes: [
          '침구류',
          '소파',
          '카펫 · 패브릭',
          '전체 바닥 CARE'
        ],

        note:
          '디테일링은 포함되지 않습니다.'
      },


      {
        id:
          'core-plus',

        name:
          'CORE+',

        headline:
          '보이지 않는 곳까지,',

        accent:
          '집 전체로.',

        price:
          640000,

        priceUnit:
          '/ 1년',

        visits:
          4,

        visitLabel:
          '연 4회 CARE',

        lead:
          'CORE의 생활 핵심 CARE에 벽 · 천장 · 디테일링까지 더해 관리 범위를 집 전체로 확장합니다.',

        includes: [
          'CORE의 모든 CARE',
          '벽지',
          '천장',
          '디테일링'
        ],

        note:
          'CORE와 CORE+의 차이는 방문시간이 아니라 관리 범위입니다.'
      },


      {
        id:
          'private',

        name:
          'PRIVATE',

        headline:
          '소수의 집을 위한',

        accent:
          '전담 CARE.',

        price:
          900000,

        priceUnit:
          '/ 1년',

        visits:
          null,

        visitLabel:
          '전담 CARE CYCLE',

        lead:
          '단순한 상위 요금제가 아니라, 전담관리가 필요한 소수의 HOUSE를 위한 제한형 CARE입니다.',

        includes: [
          '전담관리',
          'HOUSE HISTORY 기반 관리',
          '우선 CHECK 영역 연속 관리',
          '고객별 CARE CYCLE 설계'
        ],

        note:
          '세부 방문횟수와 구성은 HOUSE 상태와 운영 기준에 따라 별도 설계합니다.',

        limited:
          '파트너 1명당 최대 5가구'
      }
    ]
  };


  // ============================================================
  // FORMAT
  // ============================================================

  function formatPrice(
    value
  ) {

    if (
      typeof value !==
        'number' ||

      !Number.isFinite(
        value
      )
    ) {

      return '가격 별도 안내';
    }


    return (
      `${value.toLocaleString(
        'ko-KR'
      )}원`
    );
  }


  // ============================================================
  // SAFE DOM
  // ============================================================

  function make(
    tag,
    className = '',
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
      typeof text ===
        'string' &&

      text
    ) {

      node.textContent =
        text;
    }


    return node;
  }


  // ============================================================
  // ONE
  // ============================================================

  function createOneCard(
    service
  ) {

    const card =
      make(
        'article',
        'one-service-card reveal'
      );


    card.dataset.serviceId =
      service.id;


    card.appendChild(

      make(
        'span',
        'service-code',
        service.code
      )
    );


    card.appendChild(

      make(
        'h3',
        '',
        service.name
      )
    );


    card.appendChild(

      make(
        'div',
        'one-service-price',
        formatPrice(
          service.price
        )
      )
    );


    card.appendChild(

      make(
        'span',
        'one-service-unit',
        service.unit
      )
    );


    card.appendChild(

      make(
        'p',
        'one-service-description',
        service.description
      )
    );


    return card;
  }


  function renderOneServices() {

    const container =
      document.getElementById(
        'oneServiceGrid'
      );


    if (
      !container
    ) {

      return;
    }


    container.replaceChildren();


    CARE_CONFIG.one.items.forEach(

      (service) => {

        container.appendChild(

          createOneCard(
            service
          )
        );
      }
    );
  }


  // ============================================================
  // PLAN STORY
  // ============================================================

  function createPlanSection(
    plan
  ) {

    const section =
      make(
        'section',
        `plan-story plan-${plan.id}`
      );


    section.id =
      `plan-${plan.id}`;


    const inner =
      make(
        'div',
        'plan-story-inner'
      );


    const copy =
      make(
        'div',
        'plan-copy reveal'
      );


    copy.appendChild(

      make(
        'p',
        'plan-name',
        plan.name
      )
    );


    const title =
      make(
        'h2'
      );


    title.appendChild(
      document.createTextNode(
        plan.headline
      )
    );


    title.appendChild(

      make(
        'span',
        '',
        plan.accent
      )
    );


    copy.appendChild(
      title
    );


    copy.appendChild(

      make(
        'p',
        'plan-lead',
        plan.lead
      )
    );


    const panel =
      make(
        'div',
        'plan-panel reveal'
      );


    const price =
      make(
        'div',
        'plan-price'
      );


    price.appendChild(
      document.createTextNode(
        formatPrice(
          plan.price
        )
      )
    );


    price.appendChild(

      make(
        'small',
        '',
        plan.priceUnit
      )
    );


    panel.appendChild(
      price
    );


    panel.appendChild(

      make(
        'div',
        'plan-visits',
        plan.visitLabel
      )
    );


    const list =
      make(
        'ul',
        'plan-list'
      );


    plan.includes.forEach(

      (item) => {

        list.appendChild(

          make(
            'li',
            '',
            item
          )
        );
      }
    );


    panel.appendChild(
      list
    );


    if (
      plan.limited
    ) {

      panel.appendChild(

        make(
          'div',
          'private-note',
          plan.limited
        )
      );
    }


    panel.appendChild(

      make(
        'p',
        'plan-note',
        plan.note
      )
    );


    inner.append(
      copy,
      panel
    );


    section.appendChild(
      inner
    );


    return section;
  }


  function renderPlans() {

    const container =
      document.getElementById(
        'planStoryContainer'
      );


    if (
      !container
    ) {

      return;
    }


    container.replaceChildren();


    CARE_CONFIG.plans.forEach(

      (plan) => {

        container.appendChild(

          createPlanSection(
            plan
          )
        );
      }
    );
  }


  // ============================================================
  // MOBILE SLIDER
  // ============================================================

  function setupSlider() {

    const slider =
      document.getElementById(
        'oneServiceGrid'
      );


    const dotsContainer =
      document.getElementById(
        'oneSliderDots'
      );


    if (
      !slider ||
      !dotsContainer
    ) {

      return;
    }


    const cards =
      [
        ...slider.querySelectorAll(
          '.one-service-card'
        )
      ];


    if (
      cards.length ===
        0
    ) {

      return;
    }


    dotsContainer.replaceChildren();


    const dots =
      cards.map(

        (
          card,
          index
        ) => {

          const dot =
            make(
              'button',
              'slider-dot'
            );


          dot.type =
            'button';


          dot.setAttribute(
            'aria-label',
            `MOOHAE ONE ${index + 1} 보기`
          );


          if (
            index ===
            0
          ) {

            dot.classList.add(
              'active'
            );
          }


          dot.addEventListener(

            'click',

            () => {

              slider.scrollTo({
                left:
                  card.offsetLeft -
                  slider.offsetLeft,

                behavior:
                  'smooth'
              });
            }
          );


          dotsContainer.appendChild(
            dot
          );


          return dot;
        }
      );


    let ticking =
      false;


    function updateDots() {

      const sliderRect =
        slider.getBoundingClientRect();


      const center =
        sliderRect.left +
        sliderRect.width /
        2;


      let activeIndex =
        0;


      let minDistance =
        Infinity;


      cards.forEach(

        (
          card,
          index
        ) => {

          const rect =
            card.getBoundingClientRect();


          const cardCenter =
            rect.left +
            rect.width /
            2;


          const distance =
            Math.abs(
              center -
              cardCenter
            );


          if (
            distance <
            minDistance
          ) {

            minDistance =
              distance;


            activeIndex =
              index;
          }
        }
      );


      dots.forEach(

        (
          dot,
          index
        ) => {

          const active =
            index ===
            activeIndex;


          dot.classList.toggle(
            'active',
            active
          );


          dot.setAttribute(
            'aria-current',
            active
              ? 'true'
              : 'false'
          );
        }
      );
    }


    slider.addEventListener(

      'scroll',

      () => {

        if (
          ticking
        ) {

          return;
        }


        ticking =
          true;


        window.requestAnimationFrame(

          () => {

            updateDots();


            ticking =
              false;
          }
        );
      },

      {
        passive:
          true
      }
    );


    window.addEventListener(
      'resize',
      updateDots,
      {
        passive:
          true
      }
    );


    updateDots();
  }


  // ============================================================
  // REVEAL
  //
  // site.js가 기존 .reveal을 처리하지만,
  // JS에서 동적으로 만든 ONE / PLAN 요소는
  // site.js 실행 이후 생성되므로 별도 observer가 필요합니다.
  // ============================================================

  function setupDynamicReveal() {

    const nodes =
      document.querySelectorAll(
        '.care-page .reveal:not(.in-view)'
      );


    if (
      !('IntersectionObserver' in window)
    ) {

      nodes.forEach(

        (node) => {

          node.classList.add(
            'in-view'
          );
        }
      );


      return;
    }


    const observer =
      new IntersectionObserver(

        (
          entries
        ) => {

          entries.forEach(

            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target
                  .classList
                  .add(
                    'in-view'
                  );


                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },

        {
          threshold:
            0.1,

          rootMargin:
            '0px 0px -5% 0px'
        }
      );


    nodes.forEach(

      (node) => {

        observer.observe(
          node
        );
      }
    );
  }


  // ============================================================
  // INIT
  // ============================================================

  function init() {

    renderOneServices();

    renderPlans();

    setupSlider();

    setupDynamicReveal();
  }


  // ============================================================
  // START
  // ============================================================

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init,
      {
        once:
          true
      }
    );

  } else {

    init();
  }

})();