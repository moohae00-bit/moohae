(() => {
  'use strict';


  // ============================================================
  // MOOHAE CARE V3
  // 서비스명 / 가격 / 방문횟수 / 구성 / 설명은
  // 이 CARE_CONFIG 한 곳에서 관리합니다.
  // ============================================================

  const CARE_CONFIG = {

    one: {

      items: [

        {
          id: 'basic',

          code: 'ONE · BASIC',

          name: '베이직 CARE',

          scope: '방 1개 기준 · 생활 핵심 영역',

          price: 35000,

          description:
            '하나의 생활공간부터 부담 없이 시작하는 1회 CARE.'
        },


        {
          id: 'all-in-one',

          code: 'ONE · ALL IN ONE',

          name: '올인원 CARE',

          scope: '방 1개 기준 · 확장 CARE',

          price: 55000,

          description:
            '한 공간 안에서 조금 더 넓은 범위를 살펴보는 1회 CARE.'
        },


        {
          id: 'fabric',

          code: 'ONE · FABRIC',

          name: '패브릭 CARE',

          scope:
            '매트리스 · 소파 · 러그 · 카펫',

          price: 58000,

          description:
            '생활 속 패브릭을 집중적으로 확인하고 CARE합니다.'
        },


        {
          id: 'living',

          code: 'ONE · LIVING',

          name: '리빙 CARE',

          scope: '거실 + 주방',

          price: 100000,

          description:
            '가족의 생활이 가장 많이 이어지는 공용공간을 위한 1회 CARE.'
        }

      ]

    },


    plans: [

      {
        id: 'core',

        className: 'core',

        name: 'CORE',

        headline:
          '생활의 핵심을,',

        accent:
          '1년의 주기로.',

        price: 360000,

        priceUnit:
          '/ 1년',

        visitLabel:
          '연 3회 CARE',

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
        id: 'core-plus',

        className:
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

        visitLabel:
          '연 4회 CARE',

        includes: [
          'CORE의 모든 CARE',
          '벽지',
          '천장',
          '디테일링'
        ],

        note:
          'CORE보다 관리 범위를 집 전체로 확장합니다.'
      },


      {
        id:
          'private',

        className:
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

        visitLabel:
          '전담관리',

        includes: [
          '전담관리',
          'HOUSE HISTORY 기반 관리',
          '우선 CHECK 영역 연속 관리',
          '고객별 CARE CYCLE 설계'
        ],

        note:
          '세부 방문횟수와 서비스 구성은 HOUSE 상태와 운영 기준에 따라 별도 설계합니다.',

        limited:
          '파트너 1명당 최대 5가구'
      }

    ]

  };


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
        'p',
        'one-service-scope',
        service.scope
      )
    );


    card.appendChild(

      make(
        'div',
        'one-service-price',
        `1회 CARE · ${formatPrice(
          service.price
        )}`
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


    CARE_CONFIG
      .one
      .items
      .forEach(

        (
          service
        ) => {

          container.appendChild(

            createOneCard(
              service
            )
          );
        }
      );
  }


  // ============================================================
  // CHOOSE YOUR CARE
  // ============================================================

  function createChooseCard(
    plan
  ) {

    const card =
      make(

        'article',

        `choose-card ${plan.className} reveal`
      );


    card.dataset.planId =
      plan.id;


    card.appendChild(

      make(
        'p',
        'choose-name',
        plan.name
      )
    );


    const title =
      make(
        'h3'
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


    card.appendChild(
      title
    );


    card.appendChild(

      make(
        'p',
        'choose-visits',
        plan.visitLabel
      )
    );


    const list =
      make(
        'ul',
        'choose-list'
      );


    plan.includes.forEach(

      (
        item
      ) => {

        list.appendChild(

          make(
            'li',
            '',
            item
          )
        );
      }
    );


    card.appendChild(
      list
    );


    const bottom =
      make(
        'div',
        'choose-bottom'
      );


    const price =
      make(
        'div',
        'choose-price'
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


    bottom.appendChild(
      price
    );


    if (
      plan.limited
    ) {

      bottom.appendChild(

        make(
          'div',
          'choose-limited',
          plan.limited
        )
      );
    }


    bottom.appendChild(

      make(
        'p',
        'choose-note',
        plan.note
      )
    );


    card.appendChild(
      bottom
    );


    return card;
  }


  function renderChooseCare() {

    const container =
      document.getElementById(
        'chooseCareGrid'
      );


    if (
      !container
    ) {

      return;
    }


    container.replaceChildren();


    CARE_CONFIG
      .plans
      .forEach(

        (
          plan
        ) => {

          container.appendChild(

            createChooseCard(
              plan
            )
          );
        }
      );
  }


  // ============================================================
  // MOBILE ONE SLIDER
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
  // ============================================================

  function setupDynamicReveal() {

    const nodes =
      document.querySelectorAll(
        '.care-page .reveal:not(.in-view)'
      );


    if (
      !(
        'IntersectionObserver'
        in window
      )
    ) {

      nodes.forEach(

        (
          node
        ) => {

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

            (
              entry
            ) => {

              if (
                !entry.isIntersecting
              ) {

                return;
              }


              entry
                .target
                .classList
                .add(
                  'in-view'
                );


              observer.unobserve(
                entry.target
              );
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

      (
        node
      ) => {

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

    renderChooseCare();

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