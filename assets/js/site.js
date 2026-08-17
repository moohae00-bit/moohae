(() => {
  'use strict';
  const page = document.body.dataset.page || '';
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const make = (tag, attrs = {}, text = '') => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') node.className = value;
      else node.setAttribute(key, value);
    });
    if (text) node.textContent = text;
    return node;
  };

  if (header) {
    const nav = make('nav', {class:'nav', id:'nav'});
    const inner = make('div', {class:'nav-inner'});
    inner.appendChild(make('a', {href:'./index.html', class:'logo'}, 'm∞hae'));

    const menu = make('div', {class:'nav-menu'});
    [['home','./index.html','홈'],['care','./care.html','Care'],['diagnosis','./diagnosis.html','무료 진단'],['report','./report.html','Care Report']]
      .forEach(([key, href, label]) => menu.appendChild(make('a', {href, class: page === key ? 'active' : ''}, label)));
    inner.appendChild(menu);
    inner.appendChild(make('a', {href:'https://pf.kakao.com/_uRbiX/chat',target:'_blank',rel:'noopener noreferrer',class:'nav-cta'}, '상담'));

    const toggle = make('button', {class:'mobile-toggle',id:'mobileToggle',type:'button','aria-label':'메뉴 열기','aria-expanded':'false'}, '☰');
    inner.appendChild(toggle);
    nav.appendChild(inner);
    header.appendChild(nav);

    const panel = make('div', {class:'mobile-panel',id:'mobilePanel'});
    [['./index.html','홈'],['./care.html','Care'],['./diagnosis.html','무료 진단'],['./report.html','Care Report']]
      .forEach(([href,label]) => panel.appendChild(make('a',{href},label)));
    panel.appendChild(make('a',{href:'https://pf.kakao.com/_uRbiX/chat',target:'_blank',rel:'noopener noreferrer'},'상담하기'));
    header.appendChild(panel);

    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', updateNav, {passive:true});
    updateNav();
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  if (footer) {
    const f = make('footer', {class:'footer'});
    f.appendChild(make('div',{class:'footer-logo'},'m∞hae'));
    f.appendChild(document.createTextNode('눈에 보이지 않는 곳을 케어하는 홈케어'));
    f.appendChild(make('br'));
    f.appendChild(document.createTextNode('© MOOHAE'));
    footer.appendChild(f);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12,rootMargin:'0px 0px -7% 0px'});
  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
})();