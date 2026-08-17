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
  qs.forEach((question,qIndex)=>question.querySelectorAll('.option').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const value=btn.textContent.trim();
      btn.classList.toggle('selected');
      if(btn.classList.contains('selected')){if(!answers[qIndex].includes(value))answers[qIndex].push(value)}
      else answers[qIndex]=answers[qIndex].filter(item=>item!==value);
    });
  }));
  const flat=()=>answers.flat();
  const has=text=>flat().some(item=>item.includes(text));
  const appendText=(parent,tag,text,className='')=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    node.textContent=text;
    parent.appendChild(node);
    return node;
  };

  function buildResult(){
    const total=answers.reduce((sum,a)=>sum+a.length,0);
    const signals=['먼지와 실내 공기','반려동물 생활 공간','관리해도 금방 먼지가 다시 쌓인다','매트리스 내부가 걱정된다','패브릭 관리가 어렵다'].filter(item=>flat().includes(item)).length;
    const broad=has('집 전체')||has('전체적인 관리');
    const focused=has('침대와 패브릭')||has('매트리스 내부')||has('패브릭 관리')||has('반려동물')||has('먼지')||has('관리해도 금방');
    const wantsVisit=has('무료 방문 진단');
    const wantsConsult=has('상담부터');
    let level,title,copy,recommendation;

    if(signals>=3||broad||total>=8){
      level='DETAILED CHECK';
      title='눈에 보이는 관리만으로는 확인하기 어려운 부분이 많습니다.';
      copy='선택하신 내용을 보면 한 가지 공간보다 여러 생활 영역이 함께 신경 쓰이고 있습니다. 온라인 체크만으로 실제 상태를 판단하기보다, 무해가 직접 방문해 눈에 보이지 않는 생활환경을 확인해보는 것을 권합니다.';
      recommendation='먼저 상담으로 가장 신경 쓰이는 부분을 알려주세요. 이후 방문 진단에서 실제 상태를 함께 확인하고, 필요한 범위만 케어 방향으로 제안해드립니다.';
    }else if(focused||signals>=1){
      level='FOCUSED CHECK';
      title='특정 공간을 조금 더 자세히 확인해볼 필요가 있습니다.';
      copy='침구·패브릭, 먼지 또는 반려동물 생활 공간처럼 평소 관리가 어려운 영역이 확인되었습니다. 겉으로 깨끗해 보여도 실제 상태는 생활 방식과 공간에 따라 다를 수 있습니다.';
      recommendation='상담 후 방문 진단을 받아보세요. 무해가 고객님이 선택한 공간을 우선 확인하고, 현장에서 상태를 본 뒤 필요한 케어 범위를 안내합니다.';
    }else{
      level='BASIC CHECK';
      title='지금은 우리 집의 상태를 직접 확인해보는 단계가 좋습니다.';
      copy='현재 체크에서는 특정 문제에 집중되기보다 기본적인 생활환경 관리에 대한 관심이 확인되었습니다. 온라인 질문만으로 보이지 않는 먼지와 패브릭 상태까지 정확하게 알 수는 없습니다.';
      recommendation='짧은 상담으로 평소 관리 방식과 생활환경을 알려주신 뒤, 방문 진단으로 실제 상태를 확인해보세요. 필요한 경우에만 적합한 케어를 안내합니다.';
    }
    if(wantsVisit&&wantsConsult)recommendation+=' 상담과 방문 진단을 모두 선택하셨으므로, 상담에서 방문 일정을 함께 잡는 방식이 가장 간단합니다.';
    else if(wantsVisit)recommendation+=' 방문 진단을 선택하셨으므로, 상담 채널에서 가능한 방문 일정부터 확인해보세요.';
    else if(wantsConsult)recommendation+=' 상담을 선택하셨으므로, 먼저 현재 가장 신경 쓰이는 공간을 알려주시면 방문 진단이 필요한지 함께 정리해드립니다.';

    document.getElementById('resultLevel').textContent=level;
    document.getElementById('resultTitle').textContent=title;
    document.getElementById('resultCopy').textContent=copy;

    const rec=document.getElementById('resultRecommend');
    rec.replaceChildren();
    appendText(rec,'strong','추천 다음 단계');
    appendText(rec,'p',recommendation);

    const summary=document.getElementById('resultSummary');
    summary.replaceChildren();
    appendText(summary,'strong','선택한 내용');
    answers.forEach((group,i)=>appendText(summary,'p',`Q${i+1}  ${group.join(' · ')}`));
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