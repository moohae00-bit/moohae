(() => {
  'use strict';


  // ============================================================
  // MOOHAE CARE V7
  //
  // 핵심 원칙
  //
  // - 일반 사진 사용하지 않음
  // - 상단 서비스 오브젝트 5개만 이미지 사용
  // - 오브젝트는 투명 배경 WebP
  // - 텍스트 / 가격 / 설명은 DOM으로 출력
  // - 서비스 데이터는 이 파일 한 곳에서 관리
  // - CSS scroll-snap 기반 가로 탐색
  // ============================================================


  const IMAGE_BASE =
    './assets/images/care/';


  // ============================================================
  // TOP OBJECT ASSETS
  //
  // 현재 페이지에서 사용하는 이미지는 아래 5개뿐이다.
  //
  // 06 ~ 15 이미지는 현재 CARE 페이지에서 사용하지 않는다.
  // ============================================================

  const CARE_OBJECTS = [

    {
      key:
        'private',

      name:
        'PRIVATE',

      image:
        `${IMAGE_BASE}01_private.webp`,

      alt:
        'MOOHAE PRIVATE 전담 CARE',

      target:
        'plan-private'
    },

    {
      key:
        'corePlus',

      name:
        'CORE+',

      image:
        `${IMAGE_BASE}02_core_plus.webp`,

      alt:
        'MOOHAE CORE+ 집 전체 CARE',

      target:
        'plan-core-plus'
    },

    {
      key:
        'core',

      name:
        'CORE',

      image:
        `${IMAGE_BASE}03_core.webp`,

      alt:
        'MOOHAE CORE 생활 핵심 CARE',

      target:
        'plan-core'
    },

    {
      key:
        'oneRoom',

      name:
        'ONE ROOM',

      image:
        `${IMAGE_BASE}04_one_room.webp`,

      alt:
        'MOOHAE ONE ROOM 방 하나 CARE',

      target:
        'one-room'
    },

    {
      key:
        'oneCare',

      name:
        'ONE CARE',

      image:
        `${IMAGE_BASE}05_one_care.webp`,

      alt:
        'MOOHAE ONE CARE 개별 CARE',

      target:
        'one-care'
    }

  ];


  // ============================================================
  // CONTENT
  // ============================================================

  const CARE_CONTENT = {


    // ----------------------------------------------------------
    // WHY
    // ----------------------------------------------------------

    why: [

      {
        number:
          '01',

        copy:
          '깨끗해 보여도,\n보이지 않는 곳은\n남아 있습니다.'
      },

      {
        number:
          '02',

        copy:
          '매일 닿지만,\n매일 관리하기는\n어렵습니다.'
      },

      {
        number:
          '03',

        copy:
          '우리가 생활하는 공간은\n서로 떨어져 있지\n않습니다.'
      }

    ],


    // ----------------------------------------------------------
    // METHOD
    // ----------------------------------------------------------

    method: [

      {
        number:
          '01',

        code:
          'CHECK',

        copy:
          '먼저,\n확인합니다.'
      },

      {
        number:
          '02',

        code:
          'CARE',

        copy:
          '필요한 곳을\nCARE합니다.'
      },

      {
        number:
          '03',

        code:
          'PROOF',

        copy:
          '달라진 것을\n보여드립니다.'
      },

      {
        number:
          '04',

        code:
          'HISTORY',

        copy:
          '오늘의 CARE를\n기록합니다.'
      },

      {
        number:
          '05',

        code:
          'NEXT',

        copy:
          '다음 CARE는,\n오늘의 기록에서\n시작합니다.'
      }

    ],


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
    // MOOHAE ONE
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
      text
    ) {

      node.textContent =
        text;
    }


    return node;
  }


  function appendMultilineText(
    parent,
    value
  ) {

    const parts =
      String(
        value || ''
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


  function createObjectImage(
    item,
    eager
  ) {

    const image =
      document.createElement(
        'img'
      );


    image.src =
      item.image;


    image.alt =
      item.alt;


    image.decoding =
      'async';


    image.loading =
      eager
        ? 'eager'
        : 'lazy';


    if (
      eager
    ) {

      image.fetchPriority =
        'high';
    }


    return image;
  }


  // ============================================================
  // TOP OBJECTS
  // ============================================================

  function renderCareObjects() {

    const track =
      document.getElementById(
        'careObjectTrack'
      );


    if (
      !track
    ) {

      return;
    }


    track.replaceChildren();


    CARE_OBJECTS.forEach(
      (
        item,
        index
      ) => {

        const button =
          make(
            'button',
            'care-object-button'
          );


        button.type =
          'button';


        button.dataset.target =
          item.target;


        button.setAttribute(
          'aria-label',
          `${item.name} 서비스 보기`
        );


        const media =
          make(
            'span',
            'care-object-media'
          );


        media.appendChild(
          createObjectImage(
            item,
            index < 3
          )
        );


        button.appendChild(
          media
        );


        button.appendChild(
          make(
            'strong',
            '',
            item.name
          )
        );


        track.appendChild(
          button
        );
      }
    );
  }


  // ============================================================
  // WHY
  // ============================================================

  function renderWhy() {

    const track =
      document.getElementById(
        'whyTrack'
      );


    if (
      !track
    ) {

      return;
    }


    track.replaceChildren();


    CARE_CONTENT.why.forEach(
      (item) => {

        const card =
          make(
            'article',
            'why-card reveal'
          );


        card.appendChild(
          make(
            'span',
            'why-card-number',
            item.number
          )
        );


        const heading =
          make(
            'h3'
          );


        appendMultilineText(
          heading,
          item.copy
        );


        card.appendChild(
          heading
        );


        track.appendChild(
          card
        );
      }
    );
  }


  // ============================================================
  // METHOD
  // ============================================================

  function renderMethod() {

    const track =
      document.getElementById(
        'methodTrack'
      );


    if (
      !track
    ) {

      return;
    }


    track.replaceChildren();


    CARE_CONTENT.method.forEach(
      (item) => {

        const card =
          make(
            'article',
            'method-card reveal'
          );


        card.appendChild(
          make(
            'span',
            'method-number',
            item.number
          )
        );


        card.appendChild(
          make(
            'p',
            'method-code',
            item.code
          )
        );


        const heading =
          make(
            'h3'
          );


        appendMultilineText(
          heading,
          item.copy
        );


        card.appendChild(
          heading
        );


        track.appendChild(
          card
        );
      }
    );
  }


  // ============================================================
  // ONE CARE DETAIL
  // ============================================================

  function createOneCareDetailList(
    items
  ) {

    const list =
      make(
        'ul',
        'one-detail-list'
      );


    items.forEach(
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


        list.appendChild(
          row
        );
      }
    );


    return list;
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
    // HEAD
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

    const featureList =
      make(
        'ul',
        'service-feature-list'
      );


    service.features.forEach(
      (feature) => {

        featureList.appendChild(
          make(
            'li',
            '',
            feature
          )
        );
      }
    );


    card.appendChild(
      featureList
    );


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


      button.appendChild(
        make(
          'span',
          '',
          '개별 CARE 보기'
        )
      );


      button.appendChild(
        make(
          'span',
          '',
          '+'
        )
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


      inner.appendChild(
        createOneCareDetailList(
          service.items
        )
      );


      panel.appendChild(
        inner
      );


      button.addEventListener(
        'click',
        () => {

          const isOpen =
            button.getAttribute(
              'aria-expanded'
            ) ===
            'true';


          button.setAttribute(
            'aria-expanded',
            String(
              !isOpen
            )
          );


          panel.classList.toggle(
            'open',
            !isOpen
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


      CARE_CONTENT.plans.forEach(
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


      CARE_CONTENT.one.forEach(
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
  // SELECT OBJECT
  // ============================================================

  function selectObject(
    selectedButton
  ) {

    document
      .querySelectorAll(
        '.care-object-button'
      )
      .forEach(
        (button) => {

          const selected =
            button ===
            selectedButton;


          button.classList.toggle(
            'is-selected',
            selected
          );


          button.setAttribute(
            'aria-pressed',
            String(
              selected
            )
          );
        }
      );
  }


  // ============================================================
  // TOP OBJECT NAVIGATION
  // ============================================================

  function setupObjectNavigation() {

    const buttons =
      document.querySelectorAll(
        '.care-object-button[data-target]'
      );


    buttons.forEach(
      (button) => {

        button.setAttribute(
          'aria-pressed',
          'false'
        );


        button.addEventListener(
          'click',
          () => {

            selectObject(
              button
            );


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
      window.innerWidth <= 700
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
            0.1,

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
  // INIT
  // ============================================================

  function init() {

    renderCareObjects();

    renderWhy();

    renderMethod();

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