(() => {
  'use strict';


  // ============================================================
  // MOOHAE CARE V5
  //
  // DATA
  // ↓
  // UI RENDER
  // ↓
  // HORIZONTAL NAVIGATION
  //
  // 서비스 정보는 이 파일 한 곳에서 관리한다.
  // ============================================================


  // ============================================================
  // SERVICE DATA
  // ============================================================

  const SERVICE_DATA = {


    // ----------------------------------------------------------
    // CARE PLAN
    // ----------------------------------------------------------

    plans: [


      {
        id:
          'plan-private',

        name:
          'PRIVATE',

        copy:
          '우리 집을 위한\n전담 CARE.',

        price:
          '1,140,000원',

        priceUnit:
          '/ 1년',

        visits:
          '연 6회',

        features: [
          '전담 파트너',
          '집별 CARE 설계',
          '지속적인 CARE HISTORY',
          '파트너당 최대 5가구'
        ],

        note:
          '단순 방문 횟수가 아닌, 우리 집을 이해하는 전담관리 서비스입니다.'
      },


      {
        id:
          'plan-core-plus',

        name:
          'CORE+',

        copy:
          '집 전체를\n더 깊이 CARE.',

        price:
          '640,000원',

        priceUnit:
          '/ 1년',

        visits:
          '연 4회',

        features: [
          '침구류',
          '소파',
          '카펫·패브릭',
          '전체 바닥',
          '벽지',
          '천장',
          '디테일링'
        ],

        note:
          '생활의 핵심에서 벽과 천장, 디테일링까지 CARE 범위를 확장합니다.'
      },


      {
        id:
          'plan-core',

        name:
          'CORE',

        copy:
          '생활의 핵심을\n1년의 주기로.',

        price:
          '390,000원',

        priceUnit:
          '/ 1년',

        visits:
          '연 3회',

        features: [
          '침구류',
          '소파',
          '카펫·패브릭',
          '전체 바닥'
        ],

        note:
          '가정에서 가장 자주 생활하고 접촉하는 핵심 영역을 주기적으로 CARE합니다.'
      }

    ],


    // ----------------------------------------------------------
    // ONE
    // ----------------------------------------------------------

    one: [


      {
        id:
          'one-room',

        name:
          'ONE ROOM',

        copy:
          '방 하나를\n한 번에.',

        price:
          '79,000원',

        priceUnit:
          '/ ROOM',

        features: [
          '침구류',
          '매트리스',
          '바닥',
          '방 안의 관리 가능한 가구'
        ],

        note:
          'MOOHAE ONE의 대표 서비스입니다.'
      },


      {
        id:
          'one-care',

        name:
          'ONE CARE',

        copy:
          '필요한 곳만,\n하나씩.',

        price:
          '29,000원~',

        priceUnit:
          '',

        features: [
          '필요한 영역을 하나씩 선택'
        ],

        note:
          '크기와 관리 범위에 따라 금액이 달라질 수 있습니다.',

        items: [

          {
            name:
              'SOFA',

            price:
              '49,000원~'
          },

          {
            name:
              'MATTRESS',

            price:
              '39,000원~'
          },

          {
            name:
              'BEDDING',

            price:
              '29,000원~'
          },

          {
            name:
              'RUG',

            price:
              '29,000원~'
          },

          {
            name:
              'FLOOR',

            price:
              '39,000원~'
          }

        ]
      }

    ]

  };


  // ============================================================
  // SAFE DOM HELPER
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
      text
    ) {

      node.textContent =
        text;
    }


    return node;
  }


  // ============================================================
  // MULTILINE TEXT
  // ============================================================

  function appendMultilineText(
    parent,
    text
  ) {

    const parts =
      String(
        text || ''
      ).split(
        '\n'
      );


    parts.forEach(
      (
        part,
        index
      ) => {

        if (
          index > 0
        ) {

          parent.appendChild(
            document.createElement(
              'br'
            )
          );
        }


        parent.appendChild(
          document.createTextNode(
            part
          )
        );
      }
    );
  }


  // ============================================================
  // SERVICE CARD
  // ============================================================

  function createServiceCard(
    service,
    options = {}
  ) {

    const card =
      make(
        'article',
        'service-card reveal'
      );


    card.id =
      service.id;


    card.tabIndex =
      -1;


    // ----------------------------------------------------------
    // TOP
    // ----------------------------------------------------------

    const top =
      make(
        'div',
        'service-card-top'
      );


    top.appendChild(
      make(
        'p',
        'service-name',
        service.name
      )
    );


    if (
      service.visits
    ) {

      top.appendChild(
        make(
          'span',
          'service-visits',
          service.visits
        )
      );
    }


    card.appendChild(
      top
    );


    // ----------------------------------------------------------
    // COPY
    // ----------------------------------------------------------

    const heading =
      make(
        'h3'
      );


    appendMultilineText(
      heading,
      service.copy
    );


    card.appendChild(
      heading
    );


    // ----------------------------------------------------------
    // PRICE
    // ----------------------------------------------------------

    const price =
      make(
        'p',
        'service-price'
      );


    price.appendChild(
      document.createTextNode(
        service.price
      )
    );


    if (
      service.priceUnit
    ) {

      price.appendChild(
        make(
          'small',
          '',
          service.priceUnit
        )
      );
    }


    card.appendChild(
      price
    );


    card.appendChild(
      make(
        'div',
        'service-divider'
      )
    );


    // ----------------------------------------------------------
    // FEATURES
    // ----------------------------------------------------------

    if (
      Array.isArray(
        service.features
      ) &&
      service.features.length
    ) {

      const list =
        make(
          'ul',
          'service-feature-list'
        );


      service.features.forEach(
        (feature) => {

          list.appendChild(
            make(
              'li',
              '',
              feature
            )
          );
        }
      );


      card.appendChild(
        list
      );
    }


    // ----------------------------------------------------------
    // ONE CARE DETAIL
    // ----------------------------------------------------------

    if (
      options.expandable &&
      Array.isArray(
        service.items
      )
    ) {

      const button =
        make(
          'button',
          'one-detail-button'
        );


      button.type =
        'button';


      button.setAttribute(
        'aria-expanded',
        'false'
      );


      const label =
        make(
          'span',
          '',
          '개별 CARE 보기'
        );


      const icon =
        make(
          'span',
          '',
          '+'
        );


      button.append(
        label,
        icon
      );


      const panel =
        make(
          'div',
          'one-detail-panel'
        );


      const inner =
        make(
          'div',
          'one-detail-panel-inner'
        );


      const detailList =
        make(
          'ul',
          'one-detail-list'
        );


      service.items.forEach(
        (item) => {

          const row =
            make(
              'li'
            );


          row.appendChild(
            make(
              'strong',
              '',
              item.name
            )
          );


          row.appendChild(
            make(
              'span',
              '',
              item.price
            )
          );


          detailList.appendChild(
            row
          );
        }
      );


      inner.appendChild(
        detailList
      );


      panel.appendChild(
        inner
      );


      button.addEventListener(
        'click',
        () => {

          const open =
            button.getAttribute(
              'aria-expanded'
            ) ===
            'true';


          button.setAttribute(
            'aria-expanded',
            String(
              !open
            )
          );


          panel.classList.toggle(
            'open',
            !open
          );
        }
      );


      card.append(
        button,
        panel
      );
    }


    // ----------------------------------------------------------
    // NOTE
    // ----------------------------------------------------------

    if (
      service.note
    ) {

      card.appendChild(
        make(
          'p',
          'service-card-note',
          service.note
        )
      );
    }


    return card;
  }


  // ============================================================
  // RENDER SERVICES
  // ============================================================

  function renderServices() {

    const planTrack =
      document.getElementById(
        'carePlanTrack'
      );


    const oneTrack =
      document.getElementById(
        'oneTrack'
      );


    if (
      planTrack
    ) {

      planTrack.replaceChildren();


      SERVICE_DATA
        .plans
        .forEach(
          (service) => {

            planTrack.appendChild(
              createServiceCard(
                service
              )
            );
          }
        );
    }


    if (
      oneTrack
    ) {

      oneTrack.replaceChildren();


      SERVICE_DATA
        .one
        .forEach(
          (service) => {

            oneTrack.appendChild(
              createServiceCard(
                service,
                {
                  expandable:
                    service.id ===
                    'one-care'
                }
              )
            );
          }
        );
    }
  }


  // ============================================================
  // REVEAL
  // ============================================================

  function setupReveal() {

    const elements =
      document.querySelectorAll(
        '.care-page .reveal'
      );


    if (
      !elements.length
    ) {

      return;
    }


    if (
      !(
        'IntersectionObserver'
        in window
      )
    ) {

      elements.forEach(
        (element) => {

          element.classList.add(
            'in-view'
          );
        }
      );


      return;
    }


    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

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
            0.10,

          rootMargin:
            '0px 0px -5% 0px'
        }
      );


    elements.forEach(
      (element) => {

        observer.observe(
          element
        );
      }
    );
  }


  // ============================================================
  // OBJECT NAVIGATION
  // ============================================================

  function setupObjectNavigation() {

    const buttons =
      document.querySelectorAll(
        '.care-object-button[data-target]'
      );


    buttons.forEach(
      (button) => {

        button.addEventListener(
          'click',
          () => {

            const targetId =
              String(
                button.dataset.target ||
                ''
              ).trim();


            if (
              !targetId
            ) {

              return;
            }


            const target =
              document.getElementById(
                targetId
              );


            if (
              !target
            ) {

              return;
            }


            moveToServiceCard(
              target
            );
          }
        );
      }
    );
  }


  // ============================================================
  // MOVE TO SERVICE CARD
  //
  // 1. 섹션으로 세로 이동
  // 2. 가로 슬라이더 중앙 정렬
  // 3. 약한 highlight
  // ============================================================

  function moveToServiceCard(
    card
  ) {

    const track =
      card.closest(
        '.service-card-track'
      );


    const section =
      card.closest(
        '.care-section'
      );


    const headerOffset =
      window.innerWidth <=
        700
        ? 78
        : 96;


    if (
      section
    ) {

      const sectionTop =
        section
          .getBoundingClientRect()
          .top +
        window.scrollY -
        headerOffset;


      window.scrollTo({
        top:
          sectionTop,

        behavior:
          'smooth'
      });
    }


    window.setTimeout(
      () => {

        if (
          track
        ) {

          const targetLeft =
            card.offsetLeft -
            (
              track.clientWidth -
              card.clientWidth
            ) /
            2;


          track.scrollTo({
            left:
              Math.max(
                0,
                targetLeft
              ),

            behavior:
              'smooth'
          });
        }


        card.classList.remove(
          'care-card-highlight'
        );


        void card.offsetWidth;


        card.classList.add(
          'care-card-highlight'
        );


        window.setTimeout(
          () => {

            card.classList.remove(
              'care-card-highlight'
            );
          },
          750
        );

      },
      280
    );
  }


  // ============================================================
  // KEYBOARD SUPPORT FOR OBJECTS
  // already native button, only focus style handled by browser
  // ============================================================


  // ============================================================
  // INIT
  // ============================================================

  function init() {

    renderServices();

    setupReveal();

    setupObjectNavigation();
  }


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