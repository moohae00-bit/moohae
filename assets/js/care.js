(() => {
  'use strict';

  // ============================================================
  // MOOHAE CARE
  // FINAL INTEGRATED VERSION
  //
  // 주요 관리 항목:
  // - 서비스명
  // - 가격
  // - 방문 횟수
  // - 카피
  // - 이미지 경로
  //
  // 가능한 한 이 파일 상단 데이터 객체에서 관리합니다.
  // ============================================================


  // ============================================================
  // PATH
  // ============================================================

  const IMAGE_BASE =
    './assets/images/care/';


  // ============================================================
  // MOTION
  // ============================================================

  const MOTION = {
    horizontalDuration: 650,
    verticalDelay: 320,
    highlightDuration: 820
  };


  const prefersReducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );


  // ============================================================
  // IMAGE ASSETS
  // ============================================================

  const CARE_ASSETS = {

    objects: [
      {
        key: 'private',
        name: 'PRIVATE',

        image:
          `${IMAGE_BASE}01_private.webp`,

        alt:
          'MOOHAE PRIVATE 전담 CARE',

        target:
          'plan-private'
      },

      {
        key: 'corePlus',
        name: 'CORE+',

        image:
          `${IMAGE_BASE}02_core_plus.webp`,

        alt:
          'MOOHAE CORE+ 집 전체 CARE',

        target:
          'plan-core-plus'
      },

      {
        key: 'core',
        name: 'CORE',

        image:
          `${IMAGE_BASE}03_core.webp`,

        alt:
          'MOOHAE CORE 생활 핵심 CARE',

        target:
          'plan-core'
      },

      {
        key: 'oneRoom',
        name: 'ONE ROOM',

        image:
          `${IMAGE_BASE}04_one_room.webp`,

        alt:
          'MOOHAE ONE ROOM 방 하나 CARE',

        target:
          'one-room'
      },

      {
        key: 'oneCare',
        name: 'ONE CARE',

        image:
          `${IMAGE_BASE}05_one_care.webp`,

        alt:
          'MOOHAE ONE CARE 개별 CARE',

        target:
          'one-mattress'
      }
    ],


    proof: {

      before: {
        image:
          `${IMAGE_BASE}16_proof_before.webp`,

        alt:
          'CARE 전 깨끗한 물 필터'
      },


      after: {
        image:
          `${IMAGE_BASE}17_proof_after.webp`,

        alt:
          'CARE 후 포집 결과가 확인되는 물 필터'
      }
    }
  };


  // ============================================================
  // PAGE CONTENT
  // ============================================================

  const CARE_CONTENT = {

    // ----------------------------------------------------------
    // LIVING ENVIRONMENT
    // ----------------------------------------------------------

    need: [
      {
        number: '01',

        icon: 'sofa',

        copy:
          '보이지 않아도,\n남아 있습니다.',

        accentLine: 1,

        note:
          '침구 · 소파 · 러그'
      },

      {
        number: '02',

        icon: 'bedding',

        copy:
          '매일 닿지만,\n매일 관리하기는 어렵습니다.',

        accentLine: 1,

        note: ''
      },

      {
        number: '03',

        icon: 'space',

        copy:
          '공간은\n서로 이어져 있습니다.',

        accentLine: 1,

        note:
          '바닥에서 가구와 패브릭까지.'
      }
    ],


    // ----------------------------------------------------------
    // CARE FLOW
    // ----------------------------------------------------------

    flow: [
      {
        number: '01',
        code: 'CHECK',
        icon: 'check',

        copy:
          '먼저,\n확인합니다.'
      },

      {
        number: '02',
        code: 'CARE',
        icon: 'care',

        copy:
          '필요한 곳을\nCARE합니다.'
      },

      {
        number: '03',
        code: 'PROOF',
        icon: 'proof',

        copy:
          '달라진 것을\n보여드립니다.'
      },

      {
        number: '04',
        code: 'HISTORY',
        icon: 'history',

        copy:
          '오늘의 CARE를\n기록합니다.'
      },

      {
        number: '05',
        code: 'NEXT',
        icon: 'next',

        copy:
          '다음 CARE로\n이어갑니다.'
      }
    ],


    // ----------------------------------------------------------
    // CARE PLAN
    // ----------------------------------------------------------

    plans: [

      // PRIVATE
      {
        id:
          'plan-private',

        name:
          'PRIVATE',

        copy:
          '우리 집을 위한\n전담 CARE.',

        visits:
          '연 6회',

        price:
          '1,140,000원',

        priceUnit:
          '/ 1년',

        summary:
          '우리 집의 기록과 생활 흐름을 이해하는 전담관리.',

        scope:
          '전담 파트너 · 집별 CARE 설계 · CARE HISTORY',

        details: [
          '전담 파트너',
          '집별 CARE 설계',
          'CARE HISTORY'
        ],

        note:
          '전담관리가 필요한 소수의 HOUSE를 위한 제한형 CARE입니다.'
      },


      // CORE+
      {
        id:
          'plan-core-plus',

        name:
          'CORE+',

        copy:
          '집 전체를\n더 깊이 CARE.',

        visits:
          '연 4회',

        price:
          '640,000원',

        priceUnit:
          '/ 1년',

        summary:
          '생활의 핵심에서 벽과 천장, 디테일링까지.',

        scope:
          '침구 · 소파 · 패브릭 · 바닥 + 벽 · 천장 · 디테일링',

        details: [
          '침구류',
          '소파',
          '카펫·패브릭',
          '전체 바닥',
          '벽지',
          '천장',
          '디테일링'
        ],

        note:
          '방문 시간보다 관리 범위와 CARE CYCLE을 중심으로 설계합니다.'
      },


      // CORE
      {
        id:
          'plan-core',

        name:
          'CORE',

        copy:
          '생활의 핵심을\n1년의 주기로.',

        visits:
          '연 3회',

        price:
          '390,000원',

        priceUnit:
          '/ 1년',

        summary:
          '가장 자주 생활하고 접촉하는 핵심 영역을 주기적으로.',

        scope:
          '침구 · 소파 · 카펫·패브릭 · 전체 바닥',

        details: [
          '침구류',
          '소파',
          '카펫·패브릭',
          '전체 바닥'
        ],

        note:
          '디테일링은 포함되지 않습니다.'
      }
    ],


    // ----------------------------------------------------------
    // MOOHAE ONE
    // ----------------------------------------------------------

    one: [

      // ONE ROOM
      {
        id:
          'one-room',

        name:
          'ONE ROOM',

        description:
          '방 하나를 한 번에.',

        price:
          '79,000원',

        image:
          `${IMAGE_BASE}04_one_room.webp`,

        alt:
          '침대와 바닥, 협탁이 포함된 MOOHAE ONE ROOM 오브젝트'
      },


      // MATTRESS
      {
        id:
          'one-mattress',

        name:
          'MATTRESS',

        description:
          '매일 가장 오래 머무는 곳.',

        price:
          '39,000원~',

        image:
          `${IMAGE_BASE}07_mattress.webp`,

        alt:
          '정돈된 매트리스 오브젝트'
      },


      // SOFA
      {
        id:
          'one-sofa',

        name:
          'SOFA',

        description:
          '가족의 일상이 머무는 곳.',

        price:
          '49,000원~',

        image:
          `${IMAGE_BASE}06_sofa.webp`,

        alt:
          '패브릭 소파 오브젝트'
      },


      // BEDDING
      {
        id:
          'one-bedding',

        name:
          'BEDDING',

        description:
          '매일 피부와 가장 가까운 곳.',

        price:
          '29,000원~',

        image:
          `${IMAGE_BASE}08_bedding.webp`,

        alt:
          '이불과 베개가 정돈된 침구류 오브젝트'
      },


      // RUG
      {
        id:
          'one-rug',

        name:
          'RUG',

        description:
          '생활먼지가 머무르기 쉬운 곳.',

        price:
          '29,000원~',

        image:
          `${IMAGE_BASE}09_rug.webp`,

        alt:
          'MOOHAE 러그 CARE 오브젝트'
      },


      // FLOOR
      {
        id:
          'one-floor',

        name:
          'FLOOR',

        description:
          '집 전체를 연결하는 바닥.',

        price:
          '39,000원~',

        image:
          `${IMAGE_BASE}10_floor.webp`,

        alt:
          'MOOHAE 바닥 CARE 오브젝트'
      }
    ]
  };


  // ============================================================
  // SAFE DOM HELPERS
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
    value,
    accentLine = -1
  ) {

    String(
      value || ''
    )
      .split('\n')
      .forEach(
        (
          line,
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


          if (
            index ===
            accentLine
          ) {

            parent.appendChild(
              make(
                'strong',
                '',
                line
              )
            );

          } else {

            parent.appendChild(
              document.createTextNode(
                line
              )
            );
          }
        }
      );
  }


  function createImage(
    src,
    alt,
    eager = false
  ) {

    const image =
      document.createElement(
        'img'
      );


    image.src =
      src;


    image.alt =
      alt || '';


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
  // SOFT MINIMAL SVG ICON SYSTEM
  // ============================================================

  const SVG_NS =
    'http://www.w3.org/2000/svg';


  const ICONS = {

    sofa: [
      [
        'path',
        {
          d:
            'M10 24v-6.5A3.5 3.5 0 0 1 13.5 14h21A3.5 3.5 0 0 1 38 17.5V24'
        }
      ],

      [
        'path',
        {
          d:
            'M8 23h32a3 3 0 0 1 3 3v9H5v-9a3 3 0 0 1 3-3Z'
        }
      ],

      [
        'path',
        {
          d:
            'M9 35v4M39 35v4'
        }
      ],

      [
        'path',
        {
          d:
            'M24 14v9'
        }
      ]
    ],


    bedding: [
      [
        'path',
        {
          d:
            'M8 18h32v19H8z'
        }
      ],

      [
        'path',
        {
          d:
            'M8 25h32'
        }
      ],

      [
        'path',
        {
          d:
            'M12 18v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4'
        }
      ],

      [
        'path',
        {
          d:
            'M8 37v3M40 37v3'
        }
      ],

      [
        'path',
        {
          d:
            'M27 27c3 1 6 1 9 0'
        }
      ]
    ],


    space: [
      [
        'path',
        {
          d:
            'M7 35h34'
        }
      ],

      [
        'path',
        {
          d:
            'M10 35V20h13v15'
        }
      ],

      [
        'path',
        {
          d:
            'M28 35V16h10v19'
        }
      ],

      [
        'path',
        {
          d:
            'M13 20l3-4 4 4'
        }
      ],

      [
        'path',
        {
          d:
            'M5 40c8-3 30-3 38 0'
        }
      ]
    ],


    check: [
      [
        'circle',
        {
          cx: '21',
          cy: '21',
          r: '10'
        }
      ],

      [
        'path',
        {
          d:
            'm28 28 9 9'
        }
      ],

      [
        'path',
        {
          d:
            'M17 21l3 3 6-7'
        }
      ]
    ],


    care: [
      [
        'path',
        {
          d:
            'M11 33c5-8 10-13 18-18'
        }
      ],

      [
        'path',
        {
          d:
            'M24 14l7-3 6 6-3 7'
        }
      ],

      [
        'path',
        {
          d:
            'M10 34c4 2 8 4 13 4'
        }
      ],

      [
        'path',
        {
          d:
            'M31 28c-2 3-4 6-8 8'
        }
      ]
    ],


    proof: [
      [
        'rect',
        {
          x: '7',
          y: '11',
          width: '34',
          height: '26',
          rx: '3'
        }
      ],

      [
        'path',
        {
          d:
            'M24 11v26'
        }
      ],

      [
        'path',
        {
          d:
            'm29 27 3 3 6-7'
        }
      ],

      [
        'path',
        {
          d:
            'M12 28l5-5 4 4'
        }
      ]
    ],


    history: [
      [
        'path',
        {
          d:
            'M14 8h20v32H14z'
        }
      ],

      [
        'path',
        {
          d:
            'M19 16h10M19 22h10M19 28h7'
        }
      ],

      [
        'path',
        {
          d:
            'M10 13h4M10 20h4M10 27h4'
        }
      ]
    ],


    next: [
      [
        'rect',
        {
          x: '8',
          y: '12',
          width: '32',
          height: '28',
          rx: '4'
        }
      ],

      [
        'path',
        {
          d:
            'M8 20h32M15 8v8M33 8v8'
        }
      ],

      [
        'path',
        {
          d:
            'M18 29h9'
        }
      ],

      [
        'path',
        {
          d:
            'm25 25 4 4-4 4'
        }
      ]
    ]
  };


  function createSoftIcon(
    iconName,
    extraClass = ''
  ) {

    const wrapper =
      make(
        'span',
        `care-soft-icon${
          extraClass
            ? ` ${extraClass}`
            : ''
        }`
      );


    wrapper.setAttribute(
      'aria-hidden',
      'true'
    );


    const svg =
      document.createElementNS(
        SVG_NS,
        'svg'
      );


    svg.setAttribute(
      'viewBox',
      '0 0 48 48'
    );


    svg.setAttribute(
      'focusable',
      'false'
    );


    const parts =
      ICONS[
        iconName
      ] || [];


    parts.forEach(
      (
        [
          tag,
          attrs
        ]
      ) => {

        const element =
          document.createElementNS(
            SVG_NS,
            tag
          );


        Object.entries(
          attrs
        ).forEach(
          (
            [
              key,
              value
            ]
          ) => {

            element.setAttribute(
              key,
              value
            );
          }
        );


        element.setAttribute(
          'class',
          'icon-stroke'
        );


        svg.appendChild(
          element
        );
      }
    );


    wrapper.appendChild(
      svg
    );


    return wrapper;
  }


  // ============================================================
  // TOP SERVICE OBJECTS
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


    CARE_ASSETS.objects.forEach(
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


        button.setAttribute(
          'aria-pressed',
          'false'
        );


        const media =
          make(
            'span',
            'care-object-media'
          );


        media.appendChild(
          createImage(
            item.image,
            item.alt,
            index < 3
          )
        );


        button.append(
          media,

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
  // LIVING ENVIRONMENT
  // ============================================================

  function renderNeedCards() {

    const track =
      document.getElementById(
        'needTrack'
      );


    if (
      !track
    ) {
      return;
    }


    track.replaceChildren();


    CARE_CONTENT.need.forEach(
      (
        item
      ) => {

        const card =
          make(
            'article',
            'editorial-card reveal'
          );


        card.appendChild(
          make(
            'span',
            'editorial-number',
            item.number
          )
        );


        card.appendChild(
          createSoftIcon(
            item.icon,
            'editorial-icon'
          )
        );


        const heading =
          make(
            'h3'
          );


        appendMultilineText(
          heading,
          item.copy,
          item.accentLine
        );


        card.appendChild(
          heading
        );


        if (
          item.note
        ) {

          card.appendChild(
            make(
              'small',
              '',
              item.note
            )
          );
        }


        track.appendChild(
          card
        );
      }
    );
  }


  // ============================================================
  // CARE FLOW
  // ============================================================

  function renderFlowCards() {

    const track =
      document.getElementById(
        'flowTrack'
      );


    if (
      !track
    ) {
      return;
    }


    track.replaceChildren();


    CARE_CONTENT.flow.forEach(
      (
        item
      ) => {

        const card =
          make(
            'article',
            'flow-card reveal'
          );


        card.appendChild(
          make(
            'span',
            'flow-number',
            item.number
          )
        );


        card.appendChild(
          createSoftIcon(
            item.icon,
            'flow-icon'
          )
        );


        card.appendChild(
          make(
            'p',
            'flow-code',
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
  // PROOF
  // ============================================================

  function createProofFigure(
    label,
    asset,
    caption
  ) {

    const figure =
      make(
        'figure',
        'proof-figure'
      );


    figure.appendChild(
      make(
        'span',
        'proof-label',
        label
      )
    );


    const media =
      make(
        'div',
        'proof-media'
      );


    const image =
      createImage(
        asset.image,
        asset.alt
      );


    image.addEventListener(
      'error',
      () => {

        media.classList.add(
          'is-missing'
        );

      },
      {
        once: true
      }
    );


    media.appendChild(
      image
    );


    figure.appendChild(
      media
    );


    figure.appendChild(
      make(
        'figcaption',
        'proof-caption',
        caption
      )
    );


    return figure;
  }


  function renderProof() {

    const compare =
      document.getElementById(
        'proofCompare'
      );


    if (
      !compare
    ) {
      return;
    }


    compare.replaceChildren(

      createProofFigure(
        'BEFORE',
        CARE_ASSETS.proof.before,
        'CARE 전 물 상태'
      ),


      createProofFigure(
        'AFTER',
        CARE_ASSETS.proof.after,
        'CARE 후 포집 결과'
      )
    );
  }


  // ============================================================
  // CARE PLAN DETAIL PANEL
  // ============================================================

  function createDetailPanel(
    service
  ) {

    const wrapper =
      make(
        'div',
        'service-details'
      );


    const button =
      make(
        'button',
        'service-detail-button'
      );


    button.type =
      'button';


    button.setAttribute(
      'aria-expanded',
      'false'
    );


    button.append(
      make(
        'span',
        '',
        '자세히 보기'
      ),

      make(
        'span',
        '',
        '+'
      )
    );


    const panel =
      make(
        'div',
        'service-detail-panel'
      );


    const inner =
      make(
        'div',
        'service-detail-panel-inner'
      );


    const list =
      make(
        'ul',
        'service-feature-list'
      );


    service.details.forEach(
      (
        detail
      ) => {

        list.appendChild(
          make(
            'li',
            '',
            detail
          )
        );
      }
    );


    inner.appendChild(
      list
    );


    if (
      service.note
    ) {

      inner.appendChild(
        make(
          'p',
          'service-detail-note',
          service.note
        )
      );
    }


    panel.appendChild(
      inner
    );


    button.addEventListener(
      'click',
      () => {

        const open =
          button.getAttribute(
            'aria-expanded'
          ) === 'true';


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


    wrapper.append(
      button,
      panel
    );


    return wrapper;
  }


  // ============================================================
  // CARE PLAN CARD
  // ============================================================

  function createServiceCard(
    service
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


    card.appendChild(
      top
    );


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


    if (
      service.visits
    ) {

      card.appendChild(
        make(
          'p',
          'service-visits',
          service.visits
        )
      );
    }


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


    if (
      service.summary
    ) {

      card.appendChild(
        make(
          'p',
          'service-summary',
          service.summary
        )
      );
    }


    if (
      service.scope
    ) {

      card.appendChild(
        make(
          'p',
          'service-scope',
          service.scope
        )
      );
    }


    card.appendChild(
      createDetailPanel(
        service
      )
    );


    return card;
  }


  function renderPlans() {

    const track =
      document.getElementById(
        'carePlanTrack'
      );


    if (
      !track
    ) {
      return;
    }


    track.replaceChildren();


    CARE_CONTENT.plans.forEach(
      (
        service
      ) => {

        track.appendChild(
          createServiceCard(
            service
          )
        );
      }
    );
  }


  // ============================================================
  // MOOHAE ONE PRODUCT CARD
  // ============================================================

  function createOneProductCard(
    service
  ) {

    const card =
      make(
        'article',
        'one-product-card reveal'
      );


    card.id =
      service.id;


    card.tabIndex =
      -1;


    const media =
      make(
        'div',
        'one-product-media'
      );


    media.appendChild(
      createImage(
        service.image,
        service.alt
      )
    );


    const copy =
      make(
        'div',
        'one-product-copy'
      );


    copy.appendChild(
      make(
        'h3',
        'one-product-name',
        service.name
      )
    );


    copy.appendChild(
      make(
        'p',
        'one-product-description',
        service.description
      )
    );


    copy.appendChild(
      make(
        'p',
        'one-product-price',
        service.price
      )
    );


    card.append(
      media,
      copy
    );


    return card;
  }


  function renderOneProducts() {

    const track =
      document.getElementById(
        'oneTrack'
      );


    if (
      !track
    ) {
      return;
    }


    track.replaceChildren();


    CARE_CONTENT.one.forEach(
      (
        service
      ) => {

        track.appendChild(
          createOneProductCard(
            service
          )
        );
      }
    );
  }


  // ============================================================
  // OBJECT SELECTION
  // ============================================================

  function selectObject(
    selectedButton
  ) {

    document
      .querySelectorAll(
        '.care-object-button'
      )
      .forEach(
        (
          button
        ) => {

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
  // SMOOTH HORIZONTAL SCROLL
  //
  // Native smooth scroll speed differs by browser.
  // This custom animation gives the MOOHAE sliders a calmer,
  // more controlled transition when navigation is triggered.
  // ============================================================

  const activeHorizontalAnimations =
    new WeakMap();


  function easeInOutCubic(
    progress
  ) {

    if (
      progress < 0.5
    ) {

      return (
        4 *
        progress *
        progress *
        progress
      );
    }


    return (
      1 -
      Math.pow(
        -2 * progress + 2,
        3
      ) /
      2
    );
  }


  function animateHorizontalScroll(
    element,
    targetLeft,
    duration =
      MOTION.horizontalDuration
  ) {

    if (
      !element
    ) {
      return;
    }


    const previousAnimation =
      activeHorizontalAnimations.get(
        element
      );


    if (
      previousAnimation
    ) {

      window.cancelAnimationFrame(
        previousAnimation
      );
    }


    const startLeft =
      element.scrollLeft;


    const distance =
      targetLeft -
      startLeft;


    if (
      Math.abs(
        distance
      ) < 1
    ) {

      element.scrollLeft =
        targetLeft;

      return;
    }


    // ----------------------------------------------------------
    // ACCESSIBILITY
    // ----------------------------------------------------------

    if (
      prefersReducedMotion.matches
    ) {

      element.scrollLeft =
        targetLeft;

      return;
    }


    const startTime =
      performance.now();


    function step(
      now
    ) {

      const elapsed =
        now -
        startTime;


      const progress =
        Math.min(
          elapsed /
            duration,
          1
        );


      const eased =
        easeInOutCubic(
          progress
        );


      element.scrollLeft =
        startLeft +
        distance *
          eased;


      if (
        progress <
        1
      ) {

        const frameId =
          window.requestAnimationFrame(
            step
          );


        activeHorizontalAnimations.set(
          element,
          frameId
        );

      } else {

        element.scrollLeft =
          targetLeft;


        activeHorizontalAnimations.delete(
          element
        );
      }
    }


    const frameId =
      window.requestAnimationFrame(
        step
      );


    activeHorizontalAnimations.set(
      element,
      frameId
    );
  }


  // ============================================================
  // CARD HIGHLIGHT
  // ============================================================

  function highlightCard(
    card
  ) {

    if (
      !card
    ) {
      return;
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
      MOTION.highlightDuration
    );
  }


  // ============================================================
  // MOVE TO SERVICE CARD
  // ============================================================

  function moveToServiceCard(
    card
  ) {

    if (
      !card
    ) {
      return;
    }


    const track =
      card.closest(
        '.service-card-track, .one-product-track'
      );


    const section =
      card.closest(
        '.care-section'
      );


    const headerOffset =
      window.innerWidth <= 768
        ? 66
        : 76;


    // ----------------------------------------------------------
    // VERTICAL SECTION MOVE
    // ----------------------------------------------------------

    if (
      section
    ) {

      const top =
        section
          .getBoundingClientRect()
          .top +
        window.scrollY -
        headerOffset -
        8;


      window.scrollTo({
        top,
        behavior:
          prefersReducedMotion.matches
            ? 'auto'
            : 'smooth'
      });
    }


    // ----------------------------------------------------------
    // HORIZONTAL CARD CENTERING
    // ----------------------------------------------------------

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


          animateHorizontalScroll(
            track,

            Math.max(
              0,
              targetLeft
            ),

            MOTION.horizontalDuration
          );
        }


        highlightCard(
          card
        );

      },
      prefersReducedMotion.matches
        ? 0
        : MOTION.verticalDelay
    );
  }


  // ============================================================
  // TOP OBJECT NAVIGATION
  // ============================================================

  function setupObjectNavigation() {

    document
      .querySelectorAll(
        '.care-object-button[data-target]'
      )
      .forEach(
        (
          button
        ) => {

          button.addEventListener(
            'click',
            () => {

              const targetId =
                String(
                  button.dataset
                    .target ||
                  ''
                ).trim();


              const target =
                targetId
                  ? document
                      .getElementById(
                        targetId
                      )
                  : null;


              if (
                !target
              ) {
                return;
              }


              selectObject(
                button
              );


              moveToServiceCard(
                target
              );
            }
          );
        }
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
      prefersReducedMotion.matches
    ) {

      elements.forEach(
        (
          element
        ) => {

          element.classList.add(
            'in-view'
          );
        }
      );


      return;
    }


    if (
      !(
        'IntersectionObserver'
        in window
      )
    ) {

      elements.forEach(
        (
          element
        ) => {

          element.classList.add(
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


              entry.target.classList.add(
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
      (
        element
      ) => {

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

    renderNeedCards();

    renderFlowCards();

    renderProof();

    renderPlans();

    renderOneProducts();

    setupObjectNavigation();

    setupReveal();
  }


  // ============================================================
  // DOM READY
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