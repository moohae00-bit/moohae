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
  // 35000
  // ↓
  // 35,000원
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
  // ELEMENT CREATOR
  //
  // innerHTML을 사용하지 않고 DOM API로 생성합니다.
  // 서비스 데이터가 변경되더라도 안전하게 화면에 출력됩니다.
  // ============================================================

  function createElement(
    tag,
    className,
    text
  ) {
    const element =
      document.createElement(tag);


    if (className) {
      element.className =
        className;
    }


    if (
      typeof text === 'string'
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
    // TOP
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


    top.appendChild(
      name
    );


    top.appendChild(
      koreanName
    );


    card.appendChild(
      top
    );


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


    priceBlock.appendChild(
      price
    );


    priceBlock.appendChild(
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
  // care.html 안의
  //
  // id="oneTimeServiceGrid"
  //
  // 영역에 서비스 카드를 자동으로 생성합니다.
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
        const card =
          createServiceCard(
            service
          );


        container.appendChild(
          card
        );
      }
    );
  }


  // ============================================================
  // MOBILE PLAN SWIPE
  //
  // 실제 스와이프 동작은 CSS scroll-snap이 담당합니다.
  //
  // JS에서는 현재 보이는 카드에 맞춰
  // 하단 인디케이터만 업데이트합니다.
  //
  // 인디케이터가 HTML에 없더라도
  // 가격표 자체에는 영향을 주지 않습니다.
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


    if (!slider) {
      return;
    }


    const cards =
      [
        ...slider.querySelectorAll(
          '.plan-card'
        )
      ];


    if (
      cards.length === 0
    ) {
      return;
    }


    // ----------------------------------------------------------
    // DOTS
    // ----------------------------------------------------------

    let dots = [];


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
              'plan-slider-dot';


            dot.setAttribute(
              'aria-label',
              `${index + 1}번째 관리 플랜 보기`
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
                cards[index]
                  .scrollIntoView({
                    behavior: 'smooth',

                    block: 'nearest',

                    inline: 'start'
                  });
              }
            );


            dotsContainer.appendChild(
              dot
            );


            return dot;
          }
        );
    }


    // ----------------------------------------------------------
    // ACTIVE DOT
    // ----------------------------------------------------------

    function updateActiveDot() {
      if (
        dots.length === 0
      ) {
        return;
      }


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


      dots.forEach(
        (
          dot,
          index
        ) => {
          dot.classList.toggle(
            'active',
            index ===
              closestIndex
          );
        }
      );
    }


    // ----------------------------------------------------------
    // SCROLL EVENT
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // RESIZE
    // ----------------------------------------------------------

    window.addEventListener(
      'resize',
      updateActiveDot,
      {
        passive: true
      }
    );


    updateActiveDot();
  }


  // ============================================================
  // START
  // ============================================================

  function init() {
    renderOneTimeServices();

    setupPlanSlider();
  }


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