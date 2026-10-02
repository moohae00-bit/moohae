(() => {
  'use strict';
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));
const box=document.getElementById('compare'),now=document.getElementById('now'),handle=document.getElementById('handle');function move(x){const r=box.getBoundingClientRect(),p=Math.max(0,Math.min(1,(x-r.left)/r.width));now.style.clipPath=`inset(0 0 0 ${p*100}%)`;handle.style.left=`${p*100}%`}box.addEventListener('pointerdown',e=>{box.setPointerCapture(e.pointerId);move(e.clientX)});box.addEventListener('pointermove',e=>{if(box.hasPointerCapture(e.pointerId))move(e.clientX)});
const track=document.querySelector('.panels');const panels=[...document.querySelectorAll('.panel')];if(track){const focus=()=>{const c=track.scrollLeft+track.clientWidth/2;panels.forEach(p=>{const pc=p.offsetLeft+p.offsetWidth/2;p.style.transform=Math.abs(pc-c)<p.offsetWidth*.55?'scale(1)':'scale(.965)'})};track.addEventListener('scroll',focus,{passive:true});focus()}
const data={good:['good','지금은 추가 care가 필요하지 않습니다.'],watch:['watch','조금 더 지켜보고 다음에 다시 확인합니다.'],care:['care','지금 관리하는 편이 더 좋습니다.']};document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const s=b.dataset.s,c=document.getElementById('stateCard');c.className='state-card '+(s==='good'?'':s);stateName.textContent=data[s][0];stateDesc.textContent=data[s][1]});
const objectCopy={
sofa:['sofa · care','몸이 오래 닿는 곳.','틈새 먼지와 생활 흔적이 쌓이기 쉬워요.'],
rug:['rug · care','발끝이 매일 머무는 곳.','먼지와 털이 섬유 사이에 머물기 쉬워요.'],
floor:['floor · care','생활이 가장 많이 지나가는 곳.','먼지와 생활 흔적이 다시 쌓이기 쉬워요.'],
fabric:['fabric · care','공간 곳곳에 닿아 있는 소재.','커튼과 쿠션처럼 자주 관리하기 어려운 곳이 있어요.']};
const od=document.getElementById('objectDetail'),spaceFocus=document.getElementById('spaceFocus');document.querySelectorAll('.obj').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.obj').forEach(x=>x.classList.remove('is-active'));btn.classList.add('is-active');spaceFocus.dataset.active=btn.dataset.object;const d=objectCopy[btn.dataset.object];od.innerHTML=`<p class="od-label">${d[0]}</p><h4>${d[1]}</h4><p><span class="od-care">고민</span> · ${d[2]}</p><div class="care-flow-mini"><span>check</span><i></i><span>필요한 만큼 care</span><i></i><span>결과 확인</span></div>`;}));
const hist=document.getElementById('history'),vis=[...document.querySelectorAll('.visit')];new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){hist.classList.add('inview');vis.forEach((v,i)=>setTimeout(()=>v.classList.add('on'),i*260))}}),{threshold:.3}).observe(hist);
})();
