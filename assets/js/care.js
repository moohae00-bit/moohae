(() => {
  'use strict';

  // ============================================================
  // MOOHAE CARE
  //
  // 이 파일에서 1회 관리 서비스의
  // 이름 / 가격 / 기준 / 설명을 관리합니다.
  //
  // 앞으로 가격이나 서비스 내용을 변경할 때는
  // 아래 ONE_TIME_SERVICES만 수정하면 됩니다.
  // ============================================================


  // ============================================================
  // ONE-TIME SERVICE DATA
  // ============================================================

  const ONE_TIME_SERVICES = [
    {
      id: 'room',
      name: 'MOOHAE ROOM',
      koreanName: '룸',
      price: 35000,
      unit: '방 1개 기준',
      description:
        '하나의 생활공간부터 시작하는 기본 관리'
    },

    {
      id: 'room-plus',
      name: 'MOOHAE ROOM+',
      koreanName: '룸 플러스',
      price: 55000,
      unit: '방 1개 기준',
      description:
        '생활 접촉면까지 조금 더 세심하게 살피는 공간 관리'
    },

    {
      id: 'fabric',
      name: 'MOOHAE FABRIC',
      koreanName: '패브릭',
      price: 58000,
      unit: '패브릭 전체',
      description:
        '매트리스 · 소파 · 러그 · 카펫 등 생활 패브릭 집중 관리'
    },

    {
      id: 'living',
      name: 'MOOHAE LIVING',
      koreanName: '리빙',
      price: 100000,
      unit: '거실 + 주방',
      description:
        '가족의 생활이 가장 많이 이어지는 공용공간 관리'
    }
  ];


  // ============================================================
  // PRICE FORMATTER
  //
  // 35000 → 35,000원
  // ============================================================

  function formatPrice(price) {
    if (
      typeof price !== 'number' ||
      !Number.isFinite(price)
    ) {
      return '';
    }

    return `${price.toLocaleString('ko-KR')}원`;
  }


  // ============================================================
  // SAFE DOM ELEMENT CREATOR
  // ============================================================

  function createElement(
    tag,
    className = '',
    text = ''
  ) {
    const element =
      document.createElement(tag);

    if (className) {
      element.className =
        className;
    }

    if (
      typeof text === 'string' &&
      text
    ) {
      element.textContent =
        text;
    }

    return element;
  }


  // ============================================================
  // CREATE ONE-TIME SERVICE CARD
  // ============================================================

  function createServiceCard(service) {
    const card =
      createElement(
        'article',
        'one-time-card'
      );

    card.dataset.serviceId =
      service.id;


    // ----------------------------------------------------------
    // SERVICE NAME
    // ----------------------------------------------------------

    const top =
      createElement(
        'div',
        'one-time-card-top'
      );

    const name =
      createElement(
        'p',
        'one-time-name',
        service.name
      );

    const koreanName =
      createElement(
        'p',
        'one-time-korean-name',
        service.koreanName
      );

    top.append(
      name,
      koreanName
    );

    card.appendChild(top);


    // ----------------------------------------------------------
    // PRICE
    // ----------------------------------------------------------

    const priceBlock =
      createElement(
        'div',
        'one-time-price-block'
      );

    const price =
      createElement(
        'strong',
        'one-time-price',
        formatPrice(
          service.price
        )
      );

    const unit =
      createElement(
        'span',
        'one-time-unit',
        service.unit
      );

    priceBlock.append(
      price,
      unit
    );

    card.appendChild(
      priceBlock
    );


    // ----------------------------------------------------------
    // DESCRIPTION
    // ----------------------------------------------------------

    const description =
      createElement(
        'p',
        'one-time-description',
        service.description
      );

    card.appendChild(
      description
    );


    return card;
  }


  // ============================================================
  // RENDER ONE-TIME SERVICES
  //
  // care.html:
  // id="oneTimeServiceGrid"
  // ============================================================

  function renderOneTimeServices() {
    const container =
      document.getElementById(
        'oneTimeServiceGrid'
      );

    if (!container) {
      return;
    }

    container.replaceChildren();

    ONE_TIME_SERVICES.forEach(
      (service) => {
        container.appendChild(
          createServiceCard(
            service
          )
        );
      }
    );
  }


  // ============================================================
  // GENERIC MOBILE SLIDER
  //
  // 실제 가로 스와이프와 카드 스냅은 CSS가 담당합니다.
  //
  // JS 역할:
  // 1. 현재 카드 확인
  // 2. 하단 점 인디케이터 업데이트
  // 3. 점을 누르면 해당 카드로 이동
  //
  // JS에 문제가 생겨도 CSS 스와이프는 계속 사용할 수 있습니다.
  // ============================================================

  function setupSlider({
    slider,
    cardSelector,
    dotsContainer,
    labelPrefix
  }) {
    if (!slider) {
      return;
    }


    const cards =
      [
        ...slider.querySelectorAll(
          cardSelector
        )
      ];


    if (
      cards.length === 0
    ) {
      return;
    }


    let dots = [];


    // ==========================================================
    // CREATE DOTS
    // ==========================================================

    if (dotsContainer) {
      dotsContainer.replaceChildren();


      dots =
        cards.map(
          (_, index) => {
            const dot =
              document.createElement(
                'button'
              );


            dot.type =
              'button';


            dot.className =
              'slider-dot';


            dot.setAttribute(
              'aria-label',
              `${labelPrefix} ${index + 1} 보기`
            );


            if (
              index === 0
            ) {
              dot.classList.add(
                'active'
              );
            }


            dot.addEventListener(
              'click',
              () => {
                scrollToCard(
                  slider,
                  cards[index]
                );
              }
            );


            dotsContainer.appendChild(
              dot
            );


            return dot;
          }
        );
    }


    // ==========================================================
    // SCROLL TO CARD
    // ==========================================================

    function scrollToCard(
      container,
      card
    ) {
      const containerRect =
        container.getBoundingClientRect();


      const cardRect =
        card.getBoundingClientRect();


      const target =
        container.scrollLeft +
        (
          cardRect.left -
          containerRect.left
        );


      container.scrollTo({
        left: target,
        behavior: 'smooth'
      });
    }


    // ==========================================================
    // FIND ACTIVE CARD
    // ==========================================================

    function getActiveIndex() {
      const sliderRect =
        slider.getBoundingClientRect();


      const sliderCenter =
        sliderRect.left +
        (
          sliderRect.width / 2
        );


      let closestIndex =
        0;


      let closestDistance =
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
            (
              rect.width / 2
            );


          const distance =
            Math.abs(
              sliderCenter -
              cardCenter
            );


          if (
            distance <
            closestDistance
          ) {
            closestDistance =
              distance;


            closestIndex =
              index;
          }
        }
      );


      return closestIndex;
    }


    // ==========================================================
    // UPDATE DOT
    // ==========================================================

    function updateActiveDot() {
      if (
        dots.length === 0
      ) {
        return;
      }


      const activeIndex =
        getActiveIndex();


      dots.forEach(
        (
          dot,
          index
        ) => {
          dot.classList.toggle(
            'active',
            index ===
              activeIndex
          );


          dot.setAttribute(
            'aria-current',
            index === activeIndex
              ? 'true'
              : 'false'
          );
        }
      );
    }


    // ==========================================================
    // SCROLL PERFORMANCE CONTROL
    // ==========================================================

    let ticking =
      false;


    slider.addEventListener(
      'scroll',
      () => {
        if (ticking) {
          return;
        }


        ticking =
          true;


        window.requestAnimationFrame(
          () => {
            updateActiveDot();

            ticking =
              false;
          }
        );
      },
      {
        passive: true
      }
    );


    // ==========================================================
    // RESIZE
    // ==========================================================

    window.addEventListener(
      'resize',
      () => {
        updateActiveDot();
      },
      {
        passive: true
      }
    );


    updateActiveDot();
  }


  // ============================================================
  // ONE-TIME CARE MOBILE SLIDER
  // ============================================================

  function setupOneTimeServiceSlider() {
    const slider =
      document.getElementById(
        'oneTimeServiceGrid'
      );


    const dotsContainer =
      document.getElementById(
        'oneTimeSliderDots'
      );


    setupSlider({
      slider,

      cardSelector:
        '.one-time-card',

      dotsContainer,

      labelPrefix:
        '1회 관리 서비스'
    });
  }


  // ============================================================
  // MOOHAE 365 MOBILE SLIDER
  // ============================================================

  function setupPlanSlider() {
    const slider =
      document.querySelector(
        '.plan-grid'
      );


    const dotsContainer =
      document.getElementById(
        'planSliderDots'
      );


    setupSlider({
      slider,

      cardSelector:
        '.plan-card',

      dotsContainer,

      labelPrefix:
        'MOOHAE 365 플랜'
    });
  }


  // ============================================================
  // INIT
  // ============================================================

  function init() {

    // 1회 관리 서비스 생성
    renderOneTimeServices();


    // 서비스 카드가 DOM에 만들어진 뒤
    // 슬라이더를 연결해야 합니다.
    setupOneTimeServiceSlider();


    // MOOHAE 365
    setupPlanSlider();
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
        once: true
      }
    );

  } else {
    init();
  }

})();