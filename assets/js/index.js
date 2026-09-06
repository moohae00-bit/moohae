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

})();