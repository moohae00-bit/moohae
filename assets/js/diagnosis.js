(() => {
  'use strict';

  const qs=[...document.querySelectorAll('.question')];
  const progress=document.getElementById('progress');
  const prev=document.getElementById('prev');
  const next=document.getElementById('next');
  const result=document.getElementById('result');
  const navButtons=document.getElementById('navButtons');
  const answers=qs.map(()=>[]);
  let current=0;

  function render(){
    qs.forEach((q,i)=>{q.hidden=i!==current;q.classList.toggle('active',i===current)});
    progress.style.width=(current/qs.length)*100+'%';
    prev.style.visibility=current===0?'hidden':'visible';
    next.textContent=current===qs.length-1?'결과 보기':'다음';
  }

  qs.forEach((question,qIndex)=>{
    const single=question.dataset.single==='true';
    question.querySelectorAll('.option').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const value=btn.textContent.trim();
        if(single){
          question.querySelectorAll('.option').forEach(item=>item.classList.remove('selected'));
          answers[qIndex]=[value];
          btn.classList.add('selected');
          return;
        }
        btn.classList.toggle('selected');
        if(btn.classList.contains('selected')){
          if(!answers[qIndex].includes(value))answers[qIndex].push(value);
        }else{
          answers[qIndex]=answers[qIndex].filter(item=>item!==value);
        }
      });
    });
  });

  const flat=()=>answers.flat();
  const has=text=>flat().some(item=>item.includes(text));
  const joinNatural=(items)=>{
    if(items.length===0)return '';
    if(items.length===1)return items[0];
    if(items.length===2)return `${items[0]}와 ${items[1]}`;
    return `${items.slice(0,-1).join(', ')}, 그리고 ${items[items.length-1]}`;
  };
  const appendText=(parent,tag,text,className='')=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    node.textContent=text;
    parent.appendChild(node);
    return node;
  };

  function buildResult(){
    const household=answers[0];
    const spaces=answers[1];
    const surfaces=answers[2];
    const concerns=answers[3];
    const delegation=answers[4][0]||'';

    const hasChild=household.includes('아이');
    const hasPet=household.includes('반려동물');
    const repeatedStress=concerns.includes('관리해도 금방 다시 신경 쓰인다');
    const uncertainty=concerns.includes('언제, 어디까지 관리해야 할지 모르겠다');
    const childFocus=concerns.includes('아이의 생활공간은 조금 더 세심하게 보고 싶다');
    const petFocus=concerns.includes('반려동물의 생활공간은 조금 더 세심하게 보고 싶다');
    const wantsSOS=concerns.includes('예상하지 못한 오염이 생길 때도 도움받고 싶다');
    const wantsSignature=delegation.includes('담당 관리자가');
    const wantsPlus=delegation.includes('더 신경 쓰이는 생활까지');
    const wantsStandard=delegation.includes('기본적으로 꾸준히');
    const wantsConsult=delegation.includes('상담을 통해');

    let plan='STANDARD';
    let price='월 49,000원';
    let level='STANDARD FIT';

    if(wantsSignature || wantsSOS){
      plan='SIGNATURE'; price='월 119,000원'; level='SIGNATURE FIT';
    }else if(wantsPlus || childFocus || petFocus || (hasChild && surfaces.length>=3) || (hasPet && surfaces.length>=3)){
      plan='PLUS'; price='월 79,000원'; level='PLUS FIT';
    }

    const spaceText=spaces.includes('여러 공간에 고르게') ? '집 안 여러 공간' : joinNatural(spaces);
    const surfaceText=surfaces.includes('여러 곳이 함께') ? '여러 생활 접촉면' : joinNatural(surfaces);

    const needParts=[];
    if(spaceText) needParts.push(`${spaceText}에서 보내는 시간이 많고`);
    if(surfaceText) needParts.push(`${surfaceText}이 특히 신경 쓰이는 집으로 보입니다`);

    const emotionParts=[];
    if(repeatedStress) emotionParts.push('관리를 해도 다시 금방 신경 쓰이는 반복적인 피로');
    if(uncertainty) emotionParts.push('언제, 어디까지 관리해야 하는지 스스로 판단해야 하는 부담');
    if(childFocus) emotionParts.push('아이 생활공간을 조금 더 세심하게 챙기고 싶은 마음');
    if(petFocus) emotionParts.push('반려동물의 생활공간을 더 편하게 맡기고 싶은 마음');
    if(wantsSOS) emotionParts.push('갑작스러운 오염이 생겼을 때 혼자 해결해야 한다는 걱정');

    let title='우리 집 전체를 꾸준히 관리하는 방향이 잘 맞습니다.';
    if(plan==='PLUS') title='집 전체와 함께, 더 신경 쓰이는 생활까지 맡기는 편이 잘 맞습니다.';
    if(plan==='SIGNATURE') title='관리 자체를 무해에게 더 많이 맡기고 싶은 집에 가깝습니다.';

    let copy='';
    if(needParts.length) copy += `선택하신 내용을 보면 ${needParts.join(' ')}. `;
    if(emotionParts.length){
      copy += `특히 ${joinNatural(emotionParts)}이 함께 보입니다. `;
    }else{
      copy += '특정한 문제 하나보다 집 전체를 일정한 주기로 관리하고 싶은 니즈가 더 크게 보입니다. ';
    }

    if(repeatedStress || uncertainty){
      copy += '이 경우 필요한 것은 관리 횟수를 늘리는 것만이 아니라, 무엇을 언제 챙길지 계속 생각해야 하는 부담을 줄이는 것입니다. ';
    }
    if(childFocus || petFocus){
      copy += '가족 전체의 기본 관리 위에, 조금 더 마음이 쓰이는 생활동선을 따로 살피는 방식이 잘 맞습니다. ';
    }
    if(wantsSOS){
      copy += '정기관리 사이의 예상하지 못한 순간에도 도움을 요청할 수 있다는 점이 안심에 중요한 요소로 보입니다. ';
    }

    let recommendation='';
    if(plan==='STANDARD'){
      recommendation='MOOHAE 365 STANDARD는 연 3회 정기관리로 집 전체의 주요 생활 접촉면을 한 해 동안 꾸준히 관리합니다. “집 전체는 챙기고 싶지만, 관리가 생활의 큰 부담이 되지는 않았으면 좋겠다”는 선택에 가장 가깝습니다.';
    }else if(plan==='PLUS'){
      recommendation='MOOHAE 365 PLUS는 연 4회 정기관리와 FOCUS CARE를 통해 집 전체를 기본으로 보면서 아이·반려동물 등 더 신경 쓰이는 생활영역을 한 단계 더 세심하게 관리합니다. “전체는 맡기되, 우리 집에서 특별히 마음 쓰이는 부분은 더 깊게 봐줬으면 좋겠다”는 니즈에 가깝습니다.';
    }else{
      recommendation='SIGNATURE는 연 6회 정기관리, FOCUS CARE, 필요할 때 MOOHAE 연 2회, 최우선 일정과 담당 관리자 1명당 최대 5가구 관리 원칙을 포함합니다. “이제 이 부분은 내가 계속 신경 쓰기보다, 우리 집을 아는 담당자에게 맡기고 싶다”는 니즈에 가장 가깝습니다.';
    }

    if(wantsConsult){
      recommendation += ' 아직 플랜을 정하기 어렵다면 괜찮습니다. 상담에서 Home Profile을 간단히 확인한 뒤 실제 생활방식에 맞춰 범위를 조정하는 편이 더 정확합니다.';
    }

    document.getElementById('resultLevel').textContent=level;
    document.getElementById('resultTitle').textContent=title;
    document.getElementById('resultCopy').textContent=copy;

    const rec=document.getElementById('resultRecommend');
    rec.replaceChildren();
    appendText(rec,'strong',`${plan} · ${price}`);
    appendText(rec,'p',recommendation);

    const summary=document.getElementById('resultSummary');
    summary.replaceChildren();
    appendText(summary,'strong','우리 집 Home Profile 시작점');
    if(household.length) appendText(summary,'p',`함께 생활하는 구성원  ${household.join(' · ')}`);
    if(spaces.length) appendText(summary,'p',`주 생활공간  ${spaces.join(' · ')}`);
    if(surfaces.length) appendText(summary,'p',`신경 쓰이는 접촉면  ${surfaces.join(' · ')}`);
    if(concerns.length) appendText(summary,'p',`관리에서 느끼는 부담  ${concerns.join(' · ')}`);
  }

  next.addEventListener('click',()=>{
    if(answers[current].length===0){alert('한 개 이상 선택해주세요.');return}
    if(current<qs.length-1){current++;render();return}
    buildResult();
    qs.forEach(q=>q.hidden=true);
    navButtons.hidden=true;
    progress.style.width='100%';
    result.style.display='block';
    result.scrollIntoView({behavior:'smooth',block:'start'});
  });
  prev.addEventListener('click',()=>{if(current>0){current--;render()}});
  render();
})();