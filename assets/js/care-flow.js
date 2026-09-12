(() => {
  'use strict';

  // ============================================================
  // MOOHAE CARE FLOW — VISUAL ONLY
  //
  // Existing care.js renders the original FLOW cards.
  // This isolated visual layer replaces only #flowTrack after
  // the existing page script has initialized.
  // ============================================================

  const FLOW_CARDS = [
    {
      label: '01 CHECK',
      firstLine: '먼저,',
      secondLine: '확인합니다.',
      description: '무엇이 필요한지부터 확인합니다.',
      image: './assets/images/care-flow/01_check.webp',
      alt: 'MOOHAE CARE FLOW CHECK 오브젝트'
    },
    {
      label: '02 CARE',
      firstLine: '필요한 곳만,',
      secondLine: 'CARE합니다.',
      description: '확인한 상태에 맞춰 필요한 CARE만.',
      image: './assets/images/care-flow/02_care.webp',
      alt: 'MOOHAE CARE FLOW CARE 오브젝트'
    },
    {
      label: '03 PROOF',
      firstLine: '달라진 것을,',
      secondLine: '보여드립니다.',
      description: 'CARE 결과를 눈으로 확인할 수 있도록.',
      image: './assets/images/care-flow/03_proof.webp',
      alt: 'MOOHAE CARE FLOW PROOF 오브젝트'
    },
    {
      label: '04 HISTORY',
      firstLine: '오늘의 CARE를,',
      secondLine: '기록합니다.',
      description: '우리 집의 이전 CARE가 다음 판단으로.',
      image: './assets/images/care-flow/04_history.webp',
      alt: 'MOOHAE CARE FLOW HISTORY 오브젝트'
    },
    {
      label: '05 NEXT',
      firstLine: '다음 CARE로,',
      secondLine: '이어갑니다.',
      description: '필요한 시점을 기억하고 다음 CARE까지 연결합니다.',
      image: './assets/images/care-flow/05_next.webp',
      alt: 'MOOHAE CARE FLOW NEXT 오브젝트'
    }
  ];

  function make(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (typeof text === 'string') {
      element.textContent = text;
    }

    return element;
  }

  function createFlowCard(item, index) {
    const card = make('article', 'flow-card flow-final-card');

    const label = make('p', 'flow-label', item.label);

    const title = make('h3', 'flow-card-title');
    title.append(
      document.createTextNode(item.firstLine),
      document.createElement('br')
    );

    const accent = make('span', '', item.secondLine);
    title.appendChild(accent);

    const description = make(
      'p',
      'flow-body',
      item.description
    );

    const media = make('div', 'flow-object-media');
    const image = document.createElement('img');
    image.className = 'flow-object-image';
    image.src = item.image;
    image.alt = item.alt;
    image.decoding = 'async';
    image.loading = index === 0 ? 'eager' : 'lazy';
    image.addEventListener(
      'error',
      () => {
        media.hidden = true;
      },
      { once: true }
    );

    media.appendChild(image);
    card.append(label, title, description, media);

    return card;
  }

  function renderConfirmedCareFlow() {
    const track = document.getElementById('flowTrack');

    if (!track) {
      return;
    }

    const fragment = document.createDocumentFragment();

    FLOW_CARDS.forEach((item, index) => {
      fragment.appendChild(
        createFlowCard(item, index)
      );
    });

    track.replaceChildren(fragment);
  }

  function init() {
    renderConfirmedCareFlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
