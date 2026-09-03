(() => {
  'use strict';


  // ============================================================
  // MOOHAE CARE
  // NATIVE SWIPE UNIFIED VERSION
  //
  // 가로 스와이프 원칙
  //
  // - MOOHAE CARE 상단과 동일한 native touch scroll 사용
  // - LIVING / FLOW / CARE PLAN / ONE 모두 동일
  // - dragResistance 사용하지 않음
  // - pointermove 인위적 감속 사용하지 않음
  // - 브라우저 기본 momentum 사용
  // - CSS scroll-snap만 사용
  //
  // CARE PLAN
  // - 가격 아래 "부가세 별도" 표시
  // ============================================================


  // ============================================================
  // PATH
  // ============================================================

  const IMAGE_BASE =
    './assets/images/care/';


  // ============================================================
  // ACCESSIBILITY
  // ============================================================

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
  // CONTENT
  // ============================================================

  const CARE_CONTENT = {


    // ----------------------------------------------------------
    // LIVING ENVIRONMENT
    // ----------------------------------------------------------

    need: [

      {
        label:
          '01 · FABRIC',

        object:
          'livingSofa',

        copy:
          '보이지 않아도,\n남아 있습니다.',

        accentLine:
          1,

        body:
          '매일 사용하는 소파와 패브릭 깊은 곳까지.'
      },


      {
        label:
          '02 · DAILY',

        object:
          'livingBedding',

        copy:
          '매일 닿지만,\n매일 관리하기는 어렵습니다.',

        accentLine:
          1,

        body:
          '침구는 매일 피부와 가장 가까이 머무는 공간입니다.'
      },


      {
        label:
          '03 · SPACE',

        object:
          'livingSpace',

        copy:
          '집은,\n하나의 공간으로 이어집니다.',

        accentLine:
          1,

        body:
          '바닥에서 가구와 패브릭까지.'
      }

    ],


    // ----------------------------------------------------------
    // CARE FLOW
    // ----------------------------------------------------------

    flow: [

      {
        label:
          '01 · CHECK',

        object:
          'flowCheck',

        copy:
          '먼저,\n확인합니다.',

        accentLine:
          1,

        body:
          '무엇을 해야 하는지보다, 무엇이 필요한지부터.'
      },


      {
        label:
          '02 · CARE',

        object:
          'flowCare',

        copy:
          '필요한 곳에,\n필요한 CARE를.',

        accentLine:
          1,

        body:
          '모든 곳을 하는 것이 아니라 필요한 곳을 제대로.'
      },


      {
        label:
          '03 · PROOF',

        object:
          'flowProof',

        copy:
          '했다는 말보다,\n달라진 것을.',

        accentLine:
          1,

        body:
          ''
      },


      {
        label:
          '04 · HISTORY',

        object:
          'flowHistory',

        copy:
          '오늘의 CARE는,\n기록으로 남습니다.',

        accentLine:
          1,

        body:
          '우리 집의 다음 CARE를 위한 기록.'
      },


      {
        label:
          '05 · NEXT CARE',

        object:
          'flowNext',

        copy:
          '다음 CARE는,\n오늘의 기록에서 시작됩니다.',

        accentLine:
          1,

        body:
          ''
      }

    ],


    // ----------------------------------------------------------
    // CARE PLAN
    //
    // 서비스 구성은 기본 카드에 중복 노출하지 않는다.
    // details = 자세히 보기 내부에서만 출력.
    //
    // vatNotice:
    // CARE PLAN 가격 아래 표시되는 세금 안내.
    // ----------------------------------------------------------

    plans: [

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

        vatNotice:
          '부가세 별도',

        summary:
          '우리 집의 기록과 생활 흐름을 이해하는 전담관리.',

        details: [
          '전담 파트너',
          '집별 CARE 설계',
          'CARE HISTORY'
        ],

        note:
          '전담관리가 필요한 소수의 HOUSE를 위한 제한형 CARE입니다.'
      },


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

        vatNotice:
          '부가세 별도',

        summary:
          '생활의 핵심에서 벽과 천장, 디테일링까지.',

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

        vatNotice:
          '부가세 별도',

        summary:
          '가장 자주 생활하고 접촉하는 핵심 영역을 주기적으로.',

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
  // SVG OBJECT SYSTEM
  // ============================================================

  const SVG_NS =
    'http://www.w3.org/2000/svg';


  const OBJECTS = {


    // ----------------------------------------------------------
    // LIVING · SOFA
    // ----------------------------------------------------------

    livingSofa: [

      [
        'rect',
        'object-warm',
        {
          x: 22,
          y: 58,
          width: 96,
          height: 54,
          rx: 18
        }
      ],

      [
        'path',
        'object-fill',
        {
          d:
            'M31 64V46c0-10 8-18 18-18h43c10 0 18 8 18 18v18'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M70 30v31M22 78h96M31 112v12M109 112v12'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M38 85c18 5 46 5 64 0'
        }
      ]

    ],


    // ----------------------------------------------------------
    // LIVING · BEDDING
    // ----------------------------------------------------------

    livingBedding: [

      [
        'rect',
        'object-warm',
        {
          x: 20,
          y: 48,
          width: 102,
          height: 64,
          rx: 14
        }
      ],

      [
        'path',
        'object-fill',
        {
          d:
            'M26 70h90v38H26z'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M20 72h102M31 48v-9c0-7 6-13 13-13h23c7 0 13 6 13 13v9'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M31 112v12M112 112v12M74 82c13 4 25 4 36 0'
        }
      ]

    ],


    // ----------------------------------------------------------
    // LIVING · SPACE
    // ----------------------------------------------------------

    livingSpace: [

      [
        'path',
        'object-warm',
        {
          d:
            'M15 109h112v14H15z'
        }
      ],

      [
        'rect',
        'object-fill',
        {
          x: 25,
          y: 61,
          width: 50,
          height: 48,
          rx: 11
        }
      ],

      [
        'rect',
        'object-warm',
        {
          x: 84,
          y: 45,
          width: 32,
          height: 64,
          rx: 6
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M25 77h50M50 61v48M91 45V32M108 45V32M18 122c25-7 82-7 106 0'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M26 109v10M72 109v10M86 109v10M114 109v10'
        }
      ]

    ],


    // ----------------------------------------------------------
    // FLOW · CHECK
    // ----------------------------------------------------------

    flowCheck: [

      [
        'path',
        'object-warm',
        {
          d:
            'M30 104V47c0-8 6-14 14-14h46c8 0 14 6 14 14v57z'
        }
      ],

      [
        'circle',
        'object-fill',
        {
          cx: 71,
          cy: 67,
          r: 22
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M87 83l24 24M52 67l12 12 24-28'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M22 111h94'
        }
      ]

    ],


    // ----------------------------------------------------------
    // FLOW · CARE
    // ----------------------------------------------------------

    flowCare: [

      [
        'rect',
        'object-warm',
        {
          x: 20,
          y: 68,
          width: 104,
          height: 43,
          rx: 13
        }
      ],

      [
        'path',
        'object-fill',
        {
          d:
            'M32 72V53c0-9 7-16 16-16h46c9 0 16 7 16 16v19'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M70 38v34M20 84h104M31 111v11M113 111v11'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M45 31c5-9 13-15 24-18M95 27c-8-7-17-11-29-11'
        }
      ]

    ],


    // ----------------------------------------------------------
    // FLOW · PROOF
    // ----------------------------------------------------------

    flowProof: [

      [
        'rect',
        'object-warm',
        {
          x: 17,
          y: 37,
          width: 48,
          height: 72,
          rx: 9
        }
      ],

      [
        'rect',
        'object-fill',
        {
          x: 78,
          y: 37,
          width: 48,
          height: 72,
          rx: 9
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M65 72h13M71 66l7 6-7 6'
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M28 87l10-10 10 8 8-13M91 83l8 8 16-21'
        }
      ]

    ],


    // ----------------------------------------------------------
    // FLOW · HISTORY
    // ----------------------------------------------------------

    flowHistory: [

      [
        'rect',
        'object-warm',
        {
          x: 28,
          y: 23,
          width: 86,
          height: 94,
          rx: 13
        }
      ],

      [
        'rect',
        'object-fill',
        {
          x: 39,
          y: 38,
          width: 64,
          height: 20,
          rx: 6
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M42 73h56M42 87h42M42 101h50'
        }
      ],

      [
        'circle',
        'object-line',
        {
          cx: 34,
          cy: 73,
          r: 3
        }
      ],

      [
        'circle',
        'object-line',
        {
          cx: 34,
          cy: 87,
          r: 3
        }
      ],

      [
        'circle',
        'object-line',
        {
          cx: 34,
          cy: 101,
          r: 3
        }
      ]

    ],


    // ----------------------------------------------------------
    // FLOW · NEXT
    // ----------------------------------------------------------

    flowNext: [

      [
        'rect',
        'object-warm',
        {
          x: 22,
          y: 35,
          width: 98,
          height: 82,
          rx: 14
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M22 59h98M42 26v20M100 26v20'
        }
      ],

      [
        'circle',
        'object-fill',
        {
          cx: 72,
          cy: 87,
          r: 18
        }
      ],

      [
        'path',
        'object-line',
        {
          d:
            'M64 87h18M76 80l7 7-7 7'
        }
      ]

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
      .split(
        '\n'
      )
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


  function createBrandObject(
    objectName,
    extraClass = ''
  ) {

    const wrapper =
      make(
        'div',
        `brand-object${
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
      '0 0 144 144'
    );


    svg.setAttribute(
      'focusable',
      'false'
    );


    const parts =
      OBJECTS[
        objectName
      ] || [];


    parts.forEach(
      (
        [
          tag,
          className,
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
              String(
                value
              )
            );
          }
        );


        element.setAttribute(
          'class',
          className
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
  // NATIVE SWIPE NORMALIZATION
  // ============================================================

  function normalizeNativeHorizontalTracks() {

    const tracks =
      document.querySelectorAll(
        [
          '#careObjectTrack',
          '#needTrack',
          '#flowTrack',
          '#carePlanTrack',
          '#oneTrack'
        ].join(',')
      );


    tracks.forEach(
      (
        track
      ) => {

        track.classList.remove(
          'calm-horizontal-track'
        );


        track.style.touchAction =
          'auto';

      }
    );
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
            'p',
            'editorial-label',
            item.label
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
          item.body
        ) {

          card.appendChild(
            make(
              'p',
              'editorial-body',
              item.body
            )
          );
        }


        card.appendChild(
          createBrandObject(
            item.object,
            'editorial-object'
          )
        );


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
            'p',
            'flow-label',
            item.label
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
          item.body
        ) {

          card.appendChild(
            make(
              'p',
              'flow-body',
              item.body
            )
          );
        }


        card.appendChild(
          createBrandObject(
            item.object,
            'flow-object'
          )
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
        once:
          true
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
  // CARE PLAN DETAIL
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


    // ----------------------------------------------------------
    // SERVICE NAME
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


    card.appendChild(
      top
    );


    // ----------------------------------------------------------
    // MAIN COPY
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
    // VISITS
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // VAT NOTICE
    //
    // PRIVATE / CORE+ / CORE 모두
    // 가격 바로 아래에 표시.
    // ----------------------------------------------------------

    if (
      service.vatNotice
    ) {

      card.appendChild(
        make(
          'p',
          'service-vat',
          service.vatNotice
        )
      );
    }


    // ----------------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------------

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


    /*
     * 침구 / 소파 / 벽 / 천장 등 구성은
     * 기본 카드에 다시 표시하지 않는다.
     *
     * 자세히 보기 내부에서만 표시.
     */

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
  // MOOHAE ONE
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
  // CLICK NAVIGATION
  //
  // 손가락 스와이프에는 개입하지 않는다.
  //
  // 상단 PRIVATE / CORE+ / CORE / ONE ROOM / ONE CARE를
  // 눌렀을 때만 native smooth scroll 사용.
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
      850
    );
  }


  function centerCardInTrack(
    track,
    card
  ) {

    if (
      !track ||
      !card
    ) {

      return;
    }


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
        prefersReducedMotion.matches
          ? 'auto'
          : 'smooth'

    });
  }


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
      window.innerWidth <=
        768

        ? 66
        : 76;


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

        top:
          Math.max(
            0,
            top
          ),

        behavior:
          prefersReducedMotion.matches
            ? 'auto'
            : 'smooth'

      });
    }


    window.setTimeout(
      () => {

        centerCardInTrack(
          track,
          card
        );


        highlightCard(
          card
        );

      },

      prefersReducedMotion.matches
        ? 0
        : 280
    );
  }


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

                  ? document.getElementById(
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
      prefersReducedMotion.matches ||

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


              entry.target
                .classList.add(
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


    /*
     * 모든 카드 렌더링 이후
     * 가로 스크롤을 상단 CARE와 동일한 native 방식으로 통일.
     */

    normalizeNativeHorizontalTracks();


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
        once:
          true
      }
    );

  } else {

    init();
  }

})();