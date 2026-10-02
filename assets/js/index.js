(() => {
  'use strict';
(()=>{'use strict';const story=document.querySelector('.story'),stage=document.querySelector('.stage'),copies=[...document.querySelectorAll('[data-copy]')],dots=[...document.querySelectorAll('.progress i')],cta=document.querySelector('.cta');let last=-1;
function update(){const r=story.getBoundingClientRect(),travel=Math.max(1,r.height-innerHeight),p=Math.max(0,Math.min(1,-r.top/travel)),step=Math.min(6,Math.max(0,Math.round((-r.top)/innerHeight)));if(step===last)return;last=step;stage.dataset.step=step;stage.classList.toggle('dark',step===1||step===2);stage.classList.toggle('good',step===3);stage.classList.toggle('released',step>=4);copies.forEach((x,i)=>x.classList.toggle('active',i===step));dots.forEach((x,i)=>x.classList.toggle('on',i===step));cta.classList.toggle('show',step===6)}
let lock=false;addEventListener('scroll',()=>{if(!lock){requestAnimationFrame(()=>{update();lock=false});lock=true}},{passive:true});update()})();
})();
