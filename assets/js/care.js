(() => {
  'use strict';

  // ============================================================
  // MOOHAE CARE · FINAL
  // Changeable service data and object paths live here.
  // ============================================================

  const IMAGE_BASE = './assets/images/care/';

  const CARE_OBJECTS = [
    {
      key: 'private',
      name: 'PRIVATE',
      image: `${IMAGE_BASE}01_private.webp`,
      alt: 'MOOHAE PRIVATE 전담 CARE',
      target: 'plan-private'
    },
    {
      key: 'corePlus',
      name: 'CORE+',
      image: `${IMAGE_BASE}02_core_plus.webp`,
      alt: 'MOOHAE CORE+ 집 전체 CARE',
      target: 'plan-core-plus'
    },
    {
      key: 'core',
      name: 'CORE',
      image: `${IMAGE_BASE}03_core.webp`,
      alt: 'MOOHAE CORE 생활 핵심 CARE',
      target: 'plan-core'
    },
    {
      key: 'oneRoom',
      name: 'ONE ROOM',
      image: `${IMAGE_BASE}04_one_room.webp`,
      alt: 'MOOHAE ONE ROOM 방 하나 CARE',
      target: 'one-room'
    },
    {
      key: 'oneCare',
      name: 'ONE CARE',
      image: `${IMAGE_BASE}05_one_care.webp`,
      alt: 'MOOHAE ONE CARE 개별 CARE',
      target: 'one-care'
    }
  ];

  const CARE_CONTENT = {
    need: [
      {
        number: '01',
        topic: 'UNSEEN',
        copy: '보이지 않아도,\n남아 있습니다.',
        note: '침구 · 소파 · 러그'
      },
      {
        number: '02',
        topic: 'EVERYDAY',
        copy: '매일 닿지만,\n매일 관리하기는\n어렵습니다.',
        note: ''
      },
      {
        number: '03',
        topic: 'CONNECTED',
        copy: '공간은\n서로 이어져 있습니다.',
        note: '바닥에서 가구와 패브릭까지.'
      }
    ],

    flow: [
      {
        number: '01',
        code: 'CHECK',
        copy: '먼저,\n확인합니다.'
      },
      {
        number: '02',
        code: 'CARE',
        copy: '필요한 곳을\nCARE합니다.'
      },
      {
        number: '03',
        code: 'PROOF',
        copy: '달라진 것을\n보여드립니다.'
      },
      {
        number: '04',
        code: 'HISTORY',
        copy: '오늘의 CARE를\n기록합니다.'
      },
      {
        number: '05',
        code: 'NEXT',
        copy: '다음 CARE로\n이어갑니다.'
      }
    ],

    plans: [
      {
        id: 'plan-private',
        name: 'PRIVATE',
        copy: '우리 집을 위한\n전담 CARE.',
        visits: '연 6회',
        price: '1,140,000원',
        priceUnit: '/ 1년',
        summary: '우리 집의 기록과 생활 흐름을 이해하는 전담관리.',
        details: [
          '전담 파트너',
          '집별 CARE 설계',
          'CARE HISTORY'
        ],
        note:
          '전담관리가 필요한 소수의 HOUSE를 위한 제한형 CARE입니다.'
      },
      {
        id: 'plan-core-plus',
        name: 'CORE+',
        copy: '집 전체를\n더 깊이 CARE.',
        visits: '연 4회',
        price: '640,000원',
        priceUnit: '/ 1년',
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
        id: 'plan-core',
        name: 'CORE',
        copy: '생활의 핵심을\n1년의 주기로.',
        visits: '연 3회',
        price: '390,000원',
        priceUnit: '/ 1년',
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

    one: [
      {
        id: 'one-room',
        name: 'ONE ROOM',
        copy: '방 하나를\n한 번에.',
        visits: '',
        price: '79,000원',
        priceUnit: '/ ROOM',
        summary:
          '방 하나의 주요 생활 영역을 한 번에 CARE합니다.',
        details: [
          '침구류',
          '매트리스',
          '바닥',
          '방 안의 관리 가능한 가구'
        ],
        note:
          'MOOHAE ONE의 대표 서비스입니다.'
      },
      {
        id: 'one-care',
        name: 'ONE CARE',
        copy: '필요한 곳만,\n하나씩.',
        visits: '',
        price: '29,000원~',
        priceUnit: '',
        summary:
          '필요한 영역 하나부터 선택해 시작합니다.',
        details: [],
        note:
          '크기와 관리 범위에 따라 금액이 달라질 수 있습니다.',
        items: [
          {
            name: 'SOFA',
            price: '49,000원~'
          },
          {
            name: 'MATTRESS',
            price: '39,000원~'
          },
          {
            name: 'BEDDING',
            price: '29,000원~'
          },
          {
            name: 'RUG',
            price: '29,000원~'
          },
          {
            name: 'FLOOR',
            price: '39,000원~'
          }
        ]
      }
    ]
  };

  function make(
    tag,
    className = '',
    text = ''
  ) {
    const node =
      document.createElement(tag);

    if (className) {
      node.className =
        className;
    }

    if (text) {
      node.textContent =
        text;
    }

    return node;
  }

  function appendMultilineText(
    parent,
    value
  ) {
    String(value || '')
      .split('\n')
      .forEach(
        (part, index) => {
          if (index > 0) {
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
      document.createElement('img');

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

    if (eager) {
      image.fetchPriority =
        'high';
    }

    return image;
  }

  function renderCareObjects() {
    const track =
      document.getElementById(
        'careObjectTrack'
      );

    if (!track) {
      return;
    }

    track.replaceChildren();

    CARE_OBJECTS.forEach(
      (item, index) => {
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
          createObjectImage(
            item,
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

  function renderNeedCards() {
    const track =
      document.getElementById(
        'needTrack'
      );

    if (!track) {
      return;
    }

    track.replaceChildren();

    CARE_CONTENT.need.forEach(
      (item) => {
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
          make(
            'p',
            'editorial-topic',
            item.topic
          )
        );

        const heading =
          make('h3');

        appendMultilineText(
          heading,
          item.copy
        );

        card.appendChild(
          heading
        );

        if (item.note) {
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

  function renderFlowCards() {
    const track =
      document.getElementById(
        'flowTrack'
      );

    if (!track) {
      return;
    }

    track.replaceChildren();

    CARE_CONTENT.flow.forEach(
      (item) => {
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
          make(
            'p',
            'flow-code',
            item.code
          )
        );

        const heading =
          make('h3');

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

  function createDetailPanel(
    service,
    buttonClass,
    panelClass
  ) {
    const wrapper =
      make(
        'div',
        'service-details'
      );

    const button =
      make(
        'button',
        buttonClass
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
        panelClass
      );

    const inner =
      make(
        'div',
        panelClass ===
          'one-detail-panel'
          ? 'one-detail-panel-inner'
          : 'service-detail-panel-inner'
      );

    if (
      Array.isArray(
        service.items
      ) &&
      service.items.length
    ) {
      const list =
        make(
          'ul',
          'one-detail-list'
        );

      service.items.forEach(
        (item) => {
          const row =
            make('li');

          row.append(
            make(
              'strong',
              '',
              item.name
            ),
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

      inner.appendChild(
        list
      );

    } else {
      const list =
        make(
          'ul',
          'service-feature-list'
        );

      service.details.forEach(
        (detail) => {
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
    }

    if (service.note) {
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
          String(!open)
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
      make('h3');

    appendMultilineText(
      heading,
      service.copy
    );

    card.appendChild(
      heading
    );

    if (service.visits) {
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

    if (service.priceUnit) {
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

    if (service.summary) {
      card.appendChild(
        make(
          'p',
          'service-summary',
          service.summary
        )
      );
    }

    card.appendChild(
      createDetailPanel(
        service,
        service.items
          ? 'one-detail-button'
          : 'service-detail-button',
        service.items
          ? 'one-detail-panel'
          : 'service-detail-panel'
      )
    );

    return card;
  }

  function renderServices() {
    const planTrack =
      document.getElementById(
        'carePlanTrack'
      );

    const oneTrack =
      document.getElementById(
        'oneTrack'
      );

    if (planTrack) {
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

    if (oneTrack) {
      oneTrack.replaceChildren();

      CARE_CONTENT.one.forEach(
        (service) => {
          oneTrack.appendChild(
            createServiceCard(
              service
            )
          );
        }
      );
    }
  }

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
            String(selected)
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
      window.innerWidth <= 768
        ? 66
        : 76;

    if (section) {
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
          'smooth'
      });
    }

    window.setTimeout(
      () => {
        if (track) {
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

  function setupObjectNavigation() {
    document
      .querySelectorAll(
        '.care-object-button[data-target]'
      )
      .forEach(
        (button) => {
          button.addEventListener(
            'click',
            () => {
              const targetId =
                String(
                  button.dataset.target ||
                  ''
                ).trim();

              const target =
                targetId
                  ? document.getElementById(
                      targetId
                    )
                  : null;

              if (!target) {
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

  function setupReveal() {
    const elements =
      document.querySelectorAll(
        '.care-page .reveal'
      );

    if (!elements.length) {
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
          threshold: 0.1,
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

  function init() {
    renderCareObjects();
    renderNeedCards();
    renderFlowCards();
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
        once: true
      }
    );
  } else {
    init();
  }

})();