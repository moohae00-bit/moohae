(() => {
  'use strict';

  const qs = [...document.querySelectorAll('.question')];
  const progress = document.getElementById('progress');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const result = document.getElementById('result');
  const navButtons = document.getElementById('navButtons');
  const submitForm = document.getElementById('diagnosisSubmitForm');
  const submitButton = document.getElementById('diagnosisSubmitButton');
  const submitMessage = document.getElementById('diagnosisSubmitMessage');

  const answers = qs.map(() => []);
  let current = 0;
  let resultData = {
    level: '',
    title: '',
    copy: '',
    recommendation: '',
    plan: '',
    price: ''
  };

  // Native form submit is always blocked as a second safety layer.
  if (submitForm) {
    submitForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      return false;
    });
  }

  function render() {
    qs.forEach((q, i) => {
      q.hidden = i !== current;
      q.classList.toggle('active', i === current);
    });

    if (progress) progress.style.width = (current / qs.length) * 100 + '%';
    if (prev) prev.style.visibility = current === 0 ? 'hidden' : 'visible';
    if (next) next.textContent = current === qs.length - 1 ? '결과 보기' : '다음';
  }

  qs.forEach((question, qIndex) => {
    const single = question.dataset.single === 'true';

    question.querySelectorAll('.option').forEach((btn) => {
      btn.type = 'button';

      btn.addEventListener('click', () => {
        const value = btn.textContent.trim();

        if (single) {
          question.querySelectorAll('.option').forEach((item) => item.classList.remove('selected'));
          answers[qIndex] = [value];
          btn.classList.add('selected');
          return;
        }

        btn.classList.toggle('selected');

        if (btn.classList.contains('selected')) {
          if (!answers[qIndex].includes(value)) answers[qIndex].push(value);
        } else {
          answers[qIndex] = answers[qIndex].filter((item) => item !== value);
        }
      });
    });
  });

  const flat = () => answers.flat();
  const has = (text) => flat().some((item) => item.includes(text));

  function appendText(parent, tag, text) {
    const node = document.createElement(tag);
    node.textContent = text;
    parent.appendChild(node);
    return node;
  }

  function buildPersonalizedCopy() {
    const people = answers[0] || [];
    const spaces = answers[1] || [];
    const surfaces = answers[2] || [];
    const worries = answers[3] || [];
    const preference = answers[4]?.[0] || '';

    const hasChild = people.includes('아이');
    const hasPet = people.includes('반려동물');
    const manySpaces = spaces.length >= 2 || spaces.includes('여러 공간에 고르게');
    const manySurfaces = surfaces.length >= 3 || surfaces.includes('여러 곳이 함께');

    const feelsRecurring = worries.includes('관리해도 금방 다시 신경 쓰인다');
    const unsureScope = worries.includes('언제, 어디까지 관리해야 할지 모르겠다');
    const childFocus = worries.includes('아이의 생활공간은 조금 더 세심하게 보고 싶다');
    const petFocus = worries.includes('반려동물의 생활공간은 조금 더 세심하게 보고 싶다');
    const wantsSOS = worries.includes('예상하지 못한 오염이 생길 때도 도움받고 싶다');

    const wantsDedicated = preference.includes('담당 관리자가');
    const wantsPlus = preference.includes('더 신경 쓰이는 생활까지');
    const wantsConsult = preference.includes('상담을 통해');

    let plan = 'STANDARD';
    let price = '월 49,000원';
    let level = 'STANDARD FIT';

    if (wantsDedicated || wantsSOS) {
      plan = 'SIGNATURE';
      price = '월 119,000원';
      level = 'SIGNATURE FIT';
    } else if (
      wantsPlus ||
      childFocus ||
      petFocus ||
      (hasChild && manySurfaces) ||
      (hasPet && manySurfaces) ||
      (feelsRecurring && unsureScope)
    ) {
      plan = 'PLUS';
      price = '월 79,000원';
      level = 'PLUS FIT';
    }

    const details = [];

    if (manySpaces) {
      details.push('한 공간이 아니라 집 전체의 생활 흐름을 함께 보고 싶은 마음');
    } else if (spaces.length) {
      details.push(`${spaces.join('·')}처럼 실제로 오래 머무는 공간을 잘 관리하고 싶은 마음`);
    }

    if (surfaces.length) {
      details.push(`${surfaces.join('·')}처럼 몸이 자주 닿는 곳이 특히 신경 쓰이는 점`);
    }

    if (feelsRecurring) details.push('관리해도 다시 신경 쓰이는 반복적인 피로');
    if (unsureScope) details.push('언제 어디까지 해야 할지 계속 판단해야 하는 부담');
    if (childFocus) details.push('아이의 생활공간만큼은 더 세심하게 챙기고 싶은 마음');
    if (petFocus) details.push('반려동물이 머무는 곳을 조금 더 세심하게 보고 싶은 마음');
    if (wantsSOS) details.push('갑작스러운 오염이 생겼을 때 혼자 해결해야 한다는 부담');

    let title;
    let copy;
    let recommendation;

    if (plan === 'SIGNATURE') {
      title = '계속 신경 쓰기보다, 우리 집을 아는 사람에게 맡기고 싶은 마음이 커 보여요.';
      copy =
        `선택하신 내용을 보면 ${details.slice(0, 4).join(', ')}이 함께 보여요. ` +
        '단순히 방문 횟수가 많은 것보다, 우리 집의 생활방식과 이전 관리 내용을 담당자가 기억하고 필요한 순간에 대응해주길 바라는 쪽에 가깝습니다. ' +
        '관리 시기와 범위를 매번 직접 결정하는 부담을 줄이고 싶은 니즈도 비교적 분명해 보여요.';
      recommendation =
        'SIGNATURE는 연 6회 정기관리와 생활 변화에 맞춘 FOCUS CARE, 필요할 때 MOOHAE 연 2회, 최우선 일정, 관리자 1명당 최대 5가구 관리 원칙으로 설계한 플랜입니다.';
    } else if (plan === 'PLUS') {
      title = '집 전체는 기본으로, 특히 마음이 쓰이는 생활은 조금 더 세심하게 보고 싶어 하시는 것 같아요.';
      copy =
        `선택하신 내용을 보면 ${details.slice(0, 4).join(', ')}이 중요해 보여요. ` +
        '모든 곳을 똑같이 관리하기보다 집 전체의 기본 흐름을 유지하면서, 실제 사용이 많거나 더 걱정되는 생활영역에 관리 비중을 더 두는 방식이 잘 맞습니다.';
      recommendation =
        'PLUS는 연 4회 정기관리와 FOCUS CARE를 통해 집 전체의 기본 관리에 더해 아이·반려동물·특정 생활동선처럼 더 신경 쓰이는 영역을 세심하게 이어서 관리합니다.';
    } else {
      title = '우리 집 전체를 한 해 동안 빠짐없이 관리받는 것부터 시작해도 충분해 보여요.';
      copy =
        `선택하신 내용을 보면 ${details.slice(0, 3).join(', ')}이 가장 먼저 보여요. ` +
        '특정 한 곳을 과하게 관리하기보다, 평소 혼자서는 미루기 쉬운 주요 생활 접촉면을 정기적으로 한 바퀴 관리받는 흐름이 먼저 필요해 보여요.';
      recommendation =
        'STANDARD는 연 3회 정기관리로 바닥·매트리스·소파·러그·카펫 등 우리 집의 주요 생활 접촉면을 Home Profile에 맞춰 한 해 동안 꾸준히 관리하는 기본 플랜입니다.';
    }

    if (wantsConsult) {
      recommendation += ' 아직 플랜을 정하기 어렵다면 상담에서 Home Profile을 간단히 확인한 뒤 관리 범위와 우선순위를 함께 정해도 됩니다.';
    }

    return { level, title, copy, recommendation, plan, price };
  }

  function buildResult() {
    resultData = buildPersonalizedCopy();

    document.getElementById('resultLevel').textContent = resultData.level;
    document.getElementById('resultTitle').textContent = resultData.title;
    document.getElementById('resultCopy').textContent = resultData.copy;

    const rec = document.getElementById('resultRecommend');
    rec.replaceChildren();
    appendText(rec, 'strong', `${resultData.plan} · ${resultData.price}`);
    appendText(rec, 'p', resultData.recommendation);

    const summary = document.getElementById('resultSummary');
    summary.replaceChildren();
    appendText(summary, 'strong', '우리 집 Home Profile 시작점');

    answers.forEach((group, i) => {
      appendText(summary, 'p', `Q${i + 1}  ${group.join(' · ')}`);
    });
  }

  next?.addEventListener('click', () => {
    if (answers[current].length === 0) {
      alert('한 개 이상 선택해주세요.');
      return;
    }

    if (current < qs.length - 1) {
      current++;
      render();
      return;
    }

    buildResult();
    qs.forEach((q) => (q.hidden = true));
    navButtons.hidden = true;
    progress.style.width = '100%';
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  prev?.addEventListener('click', () => {
    if (current > 0) {
      current--;
      render();
    }
  });

  function setSubmitMessage(text, isError = false) {
    if (!submitMessage) return;
    submitMessage.textContent = text;
    submitMessage.classList.toggle('error', isError);
  }

  async function sendDiagnosis() {
    const name = document.getElementById('customerName')?.value.trim() || '';
    const phone = document.getElementById('customerPhone')?.value.trim() || '';
    const privacy = document.getElementById('privacyConsent')?.checked === true;
    const website = document.getElementById('websiteField')?.value || '';

    if (!name) {
      setSubmitMessage('이름을 입력해주세요.', true);
      return;
    }

    if (!/^[0-9+\-\s()]{9,20}$/.test(phone)) {
      setSubmitMessage('연락처를 확인해주세요.', true);
      return;
    }

    if (!privacy) {
      setSubmitMessage('개인정보 수집·이용 동의가 필요합니다.', true);
      return;
    }

    if (!window.moohaeSupabase?.functions?.invoke) {
      setSubmitMessage('전송 연결을 불러오지 못했습니다. 페이지를 새로고침 후 다시 시도해주세요.', true);
      console.error('[MOOHAE] Supabase client/functions unavailable');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = '보내는 중...';
    setSubmitMessage('');

    const payload = {
      name,
      phone,
      privacy_consent: true,
      website,
      household: answers[0],
      spaces: answers[1],
      contact_surfaces: answers[2],
      worries: answers[3],
      management_preference: answers[4],
      client_result_level: resultData.level,
      client_result_message: `${resultData.title} ${resultData.copy}`,
      recommended_plan: resultData.plan
    };

    try {
      const { data, error } = await window.moohaeSupabase.functions.invoke(
        'submit-diagnosis',
        { body: payload }
      );

      if (error) {
        console.error('[MOOHAE] Edge Function invoke error', error);
        throw error;
      }

      if (!data?.ok) {
        console.error('[MOOHAE] Edge Function rejected payload', data);
        throw new Error(data?.error || 'submission_failed');
      }

      setSubmitMessage('전달되었습니다. 무해가 체크 내용을 확인한 뒤 연락드리겠습니다.');
      submitButton.textContent = '전달 완료';
      submitButton.disabled = true;
    } catch (error) {
      console.error('[MOOHAE] diagnosis submit failed', error);
      setSubmitMessage('전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', true);
      submitButton.disabled = false;
      submitButton.textContent = '체크 결과 보내고 관리 상담 신청하기';
    }
  }

  submitButton?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    sendDiagnosis();
  });

  render();
})();
