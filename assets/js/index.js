(() => {
  'use strict';
  const processSection=document.querySelector('.process');
  const processList=document.querySelector('.process-list');
  const processItems=document.querySelectorAll('.process-item');
  if(processSection&&processList&&processItems.length){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        processList.classList.add('process-visible');
        processItems.forEach(item=>item.classList.add('process-in'));
        observer.unobserve(entry.target);
      });
    },{threshold:.22,rootMargin:'0px 0px -10% 0px'});
    observer.observe(processSection);
  }

  const comparison=document.getElementById('comparison');
  if(comparison){
    let dragging=false,current=50;
    const update=percent=>{
      current=Math.max(0,Math.min(100,percent));
      comparison.style.setProperty('--position',current+'%');
      comparison.setAttribute('aria-valuenow',String(Math.round(current)));
    };
    const fromPointer=clientX=>{
      const rect=comparison.getBoundingClientRect();
      update(((clientX-rect.left)/rect.width)*100);
    };
    comparison.addEventListener('pointerdown',event=>{
      dragging=true;
      try{comparison.setPointerCapture(event.pointerId)}catch(_){}
      fromPointer(event.clientX);
    });
    comparison.addEventListener('pointermove',event=>{if(dragging)fromPointer(event.clientX)});
    const stop=event=>{
      dragging=false;
      try{if(event&&event.pointerId!==undefined)comparison.releasePointerCapture(event.pointerId)}catch(_){}
    };
    comparison.addEventListener('pointerup',stop);
    comparison.addEventListener('pointercancel',stop);
    comparison.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();update(current-3)}
      if(event.key==='ArrowRight'){event.preventDefault();update(current+3)}
    });
  }
})();