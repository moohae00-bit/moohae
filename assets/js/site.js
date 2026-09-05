(() => {
  'use strict';


  // ============================================================
  // MOOHAE GLOBAL SITE UI
  //
  // PUBLIC NAVIGATION
  //
  // 처음으로
  // 관리하다
  // 확인하다
  // 상담
  //
  // report.html은 공개 NAV에 노출하지 않는다.
  //
  // LOGO
  // assets/images/moohae-logo.webp
  // ============================================================


  // ============================================================
  // PAGE
  // ============================================================

  const page =
    document.body.dataset.page ||
    '';


  const header =
    document.getElementById(
      'site-header'
    );


  const footer =
    document.getElementById(
      'site-footer'
    );


  // ============================================================
  // SAFE DOM HELPER
  // ============================================================

  function make(
    tag,
    attrs = {},
    text = ''
  ) {

    const node =
      document.createElement(
        tag
      );


    Object.entries(
      attrs
    ).forEach(
      ([key, value]) => {

        if (
          value === null ||
          value === undefined
        ) {

          return;
        }


        if (
          key === 'class'
        ) {

          node.className =
            value;


        } else {

          node.setAttribute(
            key,
            String(value)
          );
        }
      }
    );


    if (
      text
    ) {

      node.textContent =
        text;
    }


    return node;
  }


  // ============================================================
  // LOGO
  // ============================================================

  function createLogo(
    className = 'logo'
  ) {

    const link =
      make(
        'a',
        {
          href:
            './index.html',

          class:
            className,

          'aria-label':
            'MOOHAE 처음으로'
        }
      );


    const image =
      make(
        'img',
        {
          src:
            './assets/images/moohae-logo.webp?v=20260903-1',

          alt:
            'MOOHAE',

          loading:
            'eager',

          decoding:
            'async'
        }
      );


    link.appendChild(
      image
    );


    return link;
  }


  // ============================================================
  // PUBLIC NAVIGATION
  // ============================================================

  const navigationItems = [

    {
      key:
        'home',

      href:
        './index.html',

      label:
        '처음으로'
    },


    {
      key:
        'care',

      href:
        './care.html',

      label:
        '관리하다'
    },


    {
      key:
        'diagnosis',

      href:
        './diagnosis.html',

      label:
        '확인하다'
    }

  ];


  // ============================================================
  // HEADER
  // ============================================================

  if (
    header
  ) {

    const nav =
      make(
        'nav',
        {
          class:
            'nav',

          id:
            'nav',

          'aria-label':
            'MOOHAE 주요 메뉴'
        }
      );


    const inner =
      make(
        'div',
        {
          class:
            'nav-inner'
        }
      );


    // ----------------------------------------------------------
    // LOGO
    // ----------------------------------------------------------

    inner.appendChild(
      createLogo(
        'logo'
      )
    );


    // ----------------------------------------------------------
    // DESKTOP NAV
    // ----------------------------------------------------------

    const menu =
      make(
        'div',
        {
          class:
            'nav-menu'
        }
      );


    navigationItems.forEach(
      (item) => {

        const isActive =
          page ===
          item.key;


        const link =
          make(
            'a',
            {
              href:
                item.href,

              class:
                isActive
                  ? 'active'
                  : ''
            },
            item.label
          );


        if (
          isActive
        ) {

          link.setAttribute(
            'aria-current',
            'page'
          );
        }


        menu.appendChild(
          link
        );
      }
    );


    inner.appendChild(
      menu
    );


    // ----------------------------------------------------------
    // CONSULT
    // ----------------------------------------------------------

    const consult =
      make(
        'a',
        {
          href:
            'https://pf.kakao.com/_uRbiX/chat',

          target:
            '_blank',

          rel:
            'noopener noreferrer',

          class:
            'nav-cta'
        },
        '상담'
      );


    inner.appendChild(
      consult
    );


    // ----------------------------------------------------------
    // MOBILE MENU BUTTON
    // ----------------------------------------------------------

    const toggle =
      make(
        'button',
        {
          class:
            'mobile-toggle',

          id:
            'mobileToggle',

          type:
            'button',

          'aria-label':
            '메뉴 열기',

          'aria-expanded':
            'false',

          'aria-controls':
            'mobilePanel'
        }
      );


    for (
      let index = 0;
      index < 3;
      index += 1
    ) {

      toggle.appendChild(
        make(
          'span'
        )
      );
    }


    inner.appendChild(
      toggle
    );


    nav.appendChild(
      inner
    );


    header.appendChild(
      nav
    );


    // ==========================================================
    // MOBILE PANEL
    // ==========================================================

    const panel =
      make(
        'div',
        {
          class:
            'mobile-panel',

          id:
            'mobilePanel'
        }
      );


    navigationItems.forEach(
      (item) => {

        const isActive =
          page ===
          item.key;


        const link =
          make(
            'a',
            {
              href:
                item.href,

              class:
                isActive
                  ? 'active'
                  : ''
            },
            item.label
          );


        if (
          isActive
        ) {

          link.setAttribute(
            'aria-current',
            'page'
          );
        }


        panel.appendChild(
          link
        );
      }
    );


    panel.appendChild(
      make(
        'a',
        {
          href:
            'https://pf.kakao.com/_uRbiX/chat',

          target:
            '_blank',

          rel:
            'noopener noreferrer',

          class:
            'mobile-consult-link'
        },
        '상담하기'
      )
    );


    header.appendChild(
      panel
    );


    // ==========================================================
    // NAV SCROLL STATE
    // ==========================================================

    function updateNav() {

      nav.classList.toggle(
        'scrolled',
        window.scrollY >
          16
      );
    }


    window.addEventListener(
      'scroll',
      updateNav,
      {
        passive:
          true
      }
    );


    updateNav();


    // ==========================================================
    // MOBILE MENU
    // ==========================================================

    function closeMobileMenu() {

      panel.classList.remove(
        'open'
      );


      toggle.classList.remove(
        'open'
      );


      toggle.setAttribute(
        'aria-expanded',
        'false'
      );


      toggle.setAttribute(
        'aria-label',
        '메뉴 열기'
      );
    }


    toggle.addEventListener(
      'click',
      () => {

        const open =
          panel.classList.toggle(
            'open'
          );


        toggle.classList.toggle(
          'open',
          open
        );


        toggle.setAttribute(
          'aria-expanded',
          String(open)
        );


        toggle.setAttribute(
          'aria-label',
          open
            ? '메뉴 닫기'
            : '메뉴 열기'
        );
      }
    );


    panel
      .querySelectorAll(
        'a'
      )
      .forEach(
        (link) => {

          link.addEventListener(
            'click',
            closeMobileMenu
          );
        }
      );


    // ESC

    document.addEventListener(
      'keydown',
      (event) => {

        if (
          event.key ===
          'Escape'
        ) {

          closeMobileMenu();
        }
      }
    );


    // DESKTOP 전환 시 MOBILE PANEL 정리

    window.addEventListener(
      'resize',
      () => {

        if (
          window.innerWidth >
          768
        ) {

          closeMobileMenu();
        }
      },
      {
        passive:
          true
      }
    );
  }


  // ============================================================
  // FOOTER
  // ============================================================

  if (
    footer
  ) {

    const footerElement =
      make(
        'footer',
        {
          class:
            'footer'
        }
      );


    footerElement.appendChild(
      createLogo(
        'footer-logo'
      )
    );


    footerElement.appendChild(
      make(
        'p',
        {
          class:
            'footer-message'
        },
        '눈에 보이지 않는 곳을 CARE하고, 기록을 통해 다음 CARE로 이어갑니다.'
      )
    );


    footerElement.appendChild(
      make(
        'p',
        {
          class:
            'footer-brand'
        },
        '생활환경 관리 브랜드 MOOHAE'
      )
    );


    footerElement.appendChild(
      make(
        'p',
        {
          class:
            'footer-copyright'
        },
        '© MOOHAE'
      )
    );


    footer.appendChild(
      footerElement
    );
  }


  // ============================================================
  // REVEAL
  // ============================================================

  const revealNodes =
    document.querySelectorAll(
      '.reveal'
    );


  if (
    !(
      'IntersectionObserver'
      in window
    )
  ) {

    revealNodes.forEach(
      (node) => {

        node.classList.add(
          'in-view'
        );
      }
    );


  } else {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {

                return;
              }


              entry
                .target
                .classList
                .add(
                  'in-view'
                );


              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold:
            0.12,

          rootMargin:
            '0px 0px -7% 0px'
        }
      );


    revealNodes.forEach(
      (node) => {

        observer.observe(
          node
        );
      }
    );
  }

})();