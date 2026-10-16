(() => {
  'use strict';
  const reveals=[...document.querySelectorAll('.event-page .reveal')];
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-visible');});},{threshold:.18});
  reveals.forEach(el=>observer.observe(el));
  const benefits=[...document.querySelectorAll('[data-benefit]')];
  benefits.forEach(card=>{card.addEventListener('click',()=>{const already=card.classList.contains('is-focus');benefits.forEach(x=>x.classList.remove('is-focus','is-muted'));if(!already){card.classList.add('is-focus');benefits.filter(x=>x!==card).forEach(x=>x.classList.add('is-muted'));}});});
  const steps=[...document.querySelectorAll('.step')];
  const progress=document.getElementById('processProgress');
  const process=document.getElementById('process');
  function updateProcess(){if(!process||!progress)return;const r=process.getBoundingClientRect();const vh=window.innerHeight||document.documentElement.clientHeight;const start=vh*.72;const end=-r.height*.12;const t=Math.max(0,Math.min(1,(start-r.top)/(start-end)));progress.style.height=`${Math.round(t*100)}%`;steps.forEach(step=>{const sr=step.getBoundingClientRect();step.classList.toggle('is-active',sr.top<vh*.72);});}
  addEventListener('scroll',updateProcess,{passive:true});addEventListener('resize',updateProcess,{passive:true});updateProcess();
})();
