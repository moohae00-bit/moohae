(() => {
  'use strict';

  const topProgress = document.getElementById('previewProgressText');
  const homePanel = document.getElementById('homeCheckPanel');
  const facilityPanel = document.getElementById('facilityCheckPanel');
  const homeCount = document.getElementById('progressCount');
  const facilityCount = document.getElementById('facilityProgressCount');
  const homeUnsureButton = document.getElementById('homeUnsureButton');

  function isFacilityActive() {
    return Boolean(facilityPanel && !facilityPanel.hidden);
  }

  function syncTopProgress() {
    if (!topProgress) return;
    const source = isFacilityActive() ? facilityCount : homeCount;
    topProgress.textContent = source?.textContent?.trim() || (isFacilityActive() ? '1 / 7' : '1 / 6');
  }

  function syncAriaState() {
    document.querySelectorAll('.option').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.classList.contains('selected')));
    });
    document.querySelectorAll('.facility-option').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.classList.contains('is-selected')));
    });
  }

  function addQuestionTips() {
    document.querySelectorAll('#homeCheckPanel .question').forEach((question, index) => {
      if (question.querySelector('.question-tip')) return;
      const tip = document.createElement('div');
      tip.className = 'question-tip';
      tip.textContent = index === 0
        ? '무해는 필요한 만큼만 CARE해요.'
        : '정답은 없어요. 지금 우리 집에 가장 가까운 답을 골라주세요.';
      question.appendChild(tip);
    });

    document.querySelectorAll('#facilityCheckPanel .facility-question').forEach((question) => {
      if (question.querySelector('.question-tip')) return;
      const tip = document.createElement('div');
      tip.className = 'question-tip';
      tip.textContent = '시설 운영 방식에 가장 가까운 답을 골라주세요.';
      question.appendChild(tip);
    });
  }

  function scrollActiveQuestionIntoView() {
    const active = isFacilityActive()
      ? facilityPanel?.querySelector('.facility-question.is-active:not([hidden])')
      : homePanel?.querySelector('.question.active:not([hidden])');

    if (!active) return;
    const rect = active.getBoundingClientRect();
    if (rect.top < 74 || rect.top > window.innerHeight * .55) {
      active.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }

  if (homeUnsureButton) {
    homeUnsureButton.addEventListener('click', () => {
      const firstQuestion = homePanel?.querySelector('.question');
      const otherButton = firstQuestion?.querySelector('.option[data-other="true"]');
      const otherInput = firstQuestion?.querySelector('.other-input');

      if (!otherButton || !otherInput) return;

      if (!otherButton.classList.contains('selected')) {
        otherButton.click();
      }

      otherInput.value = '잘 모르겠어요';
      otherInput.dispatchEvent(new Event('input', {bubbles:true}));
      otherInput.dispatchEvent(new Event('change', {bubbles:true}));
      syncAriaState();
      homeUnsureButton.textContent = '잘 모르겠어요 · 선택됨';
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest('.option,.facility-option')) {
      window.setTimeout(syncAriaState, 0);
    }

    if (target.closest('#homeCheckTab,#facilityCheckTab,#next,#prev,#facilityNext,#facilityPrev')) {
      window.setTimeout(() => {
        syncTopProgress();
        syncAriaState();
        scrollActiveQuestionIntoView();
      }, 40);
    }
  });

  const observer = new MutationObserver(() => {
    syncTopProgress();
    syncAriaState();
  });

  [homePanel, facilityPanel, homeCount, facilityCount].forEach((node) => {
    if (!node) return;
    observer.observe(node, {
      subtree:true,
      childList:true,
      characterData:true,
      attributes:true,
      attributeFilter:['hidden','class','aria-selected']
    });
  });

  addQuestionTips();
  syncTopProgress();
  syncAriaState();
})();
