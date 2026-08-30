(() => {
  'use strict';


  // ============================================================
  // MOOHAE CARE V6
  //
  // CENTRAL DATA
  //
  // 이미지 경로
  // 서비스명
  // 가격
  // 방문횟수
  // 카피
  //
  // 모두 이 파일에서 관리한다.
  // ============================================================


  const IMAGE_BASE =
    './assets/images/care/';


  // ============================================================
  // ASSET DATA
  // ============================================================

  const CARE_ASSETS = {


    services: {

      private: {
        name:
          'PRIVATE',

        image:
          `${IMAGE_BASE}01_private.webp`,

        alt:
          'MOOHAE PRIVATE 전담 CARE',

        target:
          'plan-private'
      },


      corePlus: {
        name:
          'CORE+',

        image:
          `${IMAGE_BASE}02_core_plus.webp`,

        alt:
          'MOOHAE CORE+ 집 전체 CARE',

        target:
          'plan-core-plus'
      },


      core: {
        name:
          'CORE',

        image:
          `${IMAGE_BASE}03_core.webp`,

        alt:
          'MOOHAE CORE 생활 핵심 CARE',

        target:
          'plan-core'
      },


      oneRoom: {
        name:
          'ONE ROOM',

        image:
          `${IMAGE_BASE}04_one_room.webp`,

        alt:
          'MOOHAE ONE ROOM 방 하나 CARE',

        target:
          'one-room'
      },


      oneCare: {
        name:
          'ONE CARE',

        image:
          `${IMAGE_BASE}05_one_care.webp`,

        alt:
          'MOOHAE ONE CARE 개별 CARE',

        target:
          'one-care'
      }

    },


    oneCareItems: [

      {
        name:
          'SOFA',

        price:
          '49,000원~',

        image:
          `${IMAGE_BASE}06_sofa.webp`,

        alt:
          'MOOHAE 소파 CARE'
      },


      {
        name:
          'MATTRESS',

        price:
          '39,000원~',

        image:
          `${IMAGE_BASE}07_mattress.webp`,

        alt:
          'MOOHAE 매트리스 CARE'
      },


      {
        name:
          'BEDDING',

        price:
          '29,000원~',

        image:
          `${IMAGE_BASE}08_bedding.webp`,

        alt:
          'MOOHAE 침구 CARE'
      },


      {
        name:
          'RUG',

        price:
          '29,000원~',

        image:
          `${IMAGE_BASE}09_rug.webp`,

        alt:
          'MOOHAE 러그 CARE'
      },


      {
        name:
          'FLOOR',

        price:
          '39,000원~',

        image:
          `${IMAGE_BASE}10_floor.webp`,

        alt:
          'MOOHAE 바닥 CARE'
      }

    ],


    sections: {

      bedroom:
        `${IMAGE_BASE}11_bedroom.webp`,

      livingroom:
        `${IMAGE_BASE}12_livingroom.webp`,

      wholeSpace:
        `${IMAGE_BASE}13_whole_space.webp`,

      proof:
        `${IMAGE_BASE}14_proof_care.webp`,

      myHome:
        `${IMAGE_BASE}15_my_home.webp`

    }

  };


  // ============================================================
  // CONTENT DATA
  // ============================================================

  const CARE_CONTENT = {


    why: [

      {
        number:
          '01',

        image:
          CARE_ASSETS.sections.bedroom,

        alt:
          '정돈된 침실과 침구',

        copy:
          '깨끗해 보여도,\n보이지 않는 곳은\n남아 있습니다.'
      },


      {
        number:
          '02',

        image:
          CARE_ASSETS.sections.livingroom,

        alt:
          '소파와 러그가 있는 생활 공간',

        copy:
          '매일 닿지만,\n매일 관리하기는\n어렵습니다.'
      },


      {
        number:
          '03',

        image:
          CARE_ASSETS.sections.wholeSpace,

        alt:
          '바닥부터 벽과 천장까지 연결된 생활 공간',

        copy:
          '우리가 생활하는 공간은\n서로 떨어져 있지\n않습니다.'
      }

    ],


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
          '달라진 것을\n보여드립니다.',

        image:
          CARE_ASSETS.sections.proof,

        alt:
          'MOOHAE CARE 결과 확인'
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


    plans: [

      {
        id:
          'plan-private',

        name:
          'PRIVATE',

        image:
          CARE_ASSETS.services.private.image,

        imageAlt:
          CARE_ASSETS.services.private.alt,

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

        image:
          CARE_ASSETS.services.corePlus.image,

        imageAlt:
          CARE_ASSETS.services.corePlus.alt,

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

        image:
          CARE_ASSETS.services.core.image,

        imageAlt:
          CARE_ASSETS.services.core.alt,

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


    one: [

      {
        id:
          'one-room',

        name:
          'ONE ROOM',

        image:
          CARE_ASSETS.services.oneRoom.image,

        imageAlt:
          CARE_ASSETS.services.oneRoom.alt,

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

        image:
          CARE_ASSETS.services.oneCare.image,

        imageAlt:
          CARE_ASSETS.services.oneCare.alt,

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

        items:
          CARE_ASSETS.oneCareItems
      }

    ]

  };


  // ============================================================
  // DOM HELPER
  // ============================================================

  function make(
    tag,
    className = '',
    text = ''
  ) {

    const node =
      document.createElement(tag);


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


  function createImage(
    src,
    alt,
    options = {}
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
      options.eager
        ? 'eager'
        : 'lazy';


    if (
      options.eager
    ) {

      image.fetchPriority =
        'high';
    }


    return image;
  }


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
      (part, index) => {

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


    const services =
      Object.values(
        CARE_ASSETS.services
      );


    services.forEach(
      (service, index) => {

        const button =
          make(
            'button',
            'care-object-button'
          );


        button.type =
          'button';


        button.dataset.target =
          service.target;


        button.setAttribute(
          'aria-label',
          `${service.name} 서비스로 이동`
        );


        const media =
          make(
            'span',
            'care-object-image'
          );


        media.appendChild(
          createImage(
            service.image,
            service.alt,
            {
              eager:
                index < 3
            }
          )
        );


        button.appendChild(
          media
        );


        button.appendChild(
          make(
            'strong',
            '',
            service.name
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


    CARE_CONTENT
      .why
      .forEach(
        (item) => {

          const card =
            make(
              'article',
              'story-card reveal'
            );


          const media =
            make(
              'div',
              'story-card-image'
            );


          media.appendChild(
            createImage(
              item.image,
              item.alt
            )
          );


          const copy =
            make(
              'div',
              'story-card-copy'
            );


          copy.appendChild(
            make(
              'span',
              '',
              item.number
            )
          );


          const heading =
            make('h3');


          appendMultilineText(
            heading,
            item.copy
          );


          copy.appendChild(
            heading
          );


          card.append(
            media,
            copy
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


    CARE_CONTENT
      .method
      .forEach(
        (item) => {

          const card =
            make(
              'article',
              item.image
                ? 'method-card has-image reveal'
                : 'method-card reveal'
            );


          if (
            item.image
          ) {

            const media =
              make(
                'div',
                'method-image'
              );


            media.appendChild(
              createImage(
                item.image,
                item.alt
              )
            );


            card.appendChild(
              media
            );
          }


          const content =
            item.image
              ? make(
                  'div',
                  'method-content'
                )
              : card;


          content.appendChild(
            make(
              'span',
              'method-number',
              item.number
            )
          );


          content.appendChild(
            make(
              'p',
              'method-code',
              item.code
            )
          );


          const heading =
            make('h3');


          appendMultilineText(
            heading,
            item.copy
          );


          content.appendChild(
            heading
          );


          if (
            item.image
          ) {

            card.appendChild(
              content
            );
          }


          track.appendChild(
            card
          );
        }
      );
  }


  // ============================================================
  // ONE CARE ITEMS
  // ============================================================

  function createOneCareItems(
    items
  ) {

    const grid =
      make(
        'div',
        'one-care-grid'
      );


    items.forEach(
      (item) => {

        const card =
          make(
            'div',
            'one-care-item'
          );


        const media =
          make(
            'div',
            'one-care-item-image'
          );


        media.appendChild(
          createImage(
            item.image,
            item.alt
          )
        );


        const copy =
          make(
            'div',
            'one-care-item-copy'
          );


        copy.appendChild(
          make(
            'strong',
            '',
            item.name
          )
        );


        copy.appendChild(
          make(
            'span',
            '',
            item.price
          )
        );


        card.append(
          media,
          copy
        );


        grid.appendChild(
          card
        );
      }
    );


    return grid;
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


    // IMAGE

    if (
      service.image
    ) {

      const media =
        make(
          'div',
          'service-card-media'
        );


      media.appendChild(
        createImage(
          service.image,
          service.imageAlt
        )
      );


      card.appendChild(
        media
      );
    }


    // TOP

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


    // COPY

    const heading =
      make('h3');


    appendMultilineText(
      heading,
      service.copy
    );


    card.appendChild(
      heading
    );


    // PRICE

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


    // FEATURES

    if (
      Array.isArray(
        service.features
      )
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


    // ONE CARE EXPANDABLE

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


      inner.appendChild(
        createOneCareItems(
          service.items
        )
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


    // NOTE

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
  // SERVICES
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


      CARE_CONTENT
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


      CARE_CONTENT
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
  // MY HOME IMAGE
  // ============================================================

  function renderMyHomeImage() {

    const image =
      document.getElementById(
        'myHomeImage'
      );


    if (
      !image
    ) {

      return;
    }


    image.src =
      CARE_ASSETS.sections.myHome;
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
  // SERVICE OBJECT NAVIGATION
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
        section.getBoundingClientRect().top +
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
  // INIT
  // ============================================================

  function init() {

    renderCareObjects();

    renderWhy();

    renderMethod();

    renderServices();

    renderMyHomeImage();

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
        once: true
      }
    );


  } else {

    init();
  }

})();