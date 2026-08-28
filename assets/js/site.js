(() => {
  'use strict';


  // ============================================================
  // MOOHAE GLOBAL SITE UI
  //
  // 공개 페이지 공통 Header / Footer / Mobile Menu
  //
  // 공개 NAVIGATION:
  // - 처음으로
  // - 관리하다
  // - 확인하다
  // - 상담
  //
  // 중요:
  // report.html은 삭제하지 않는다.
  // 고객 리포트는 전용 링크 / CARE 완료 후 경로로만 접근한다.
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

  const make = (
    tag,
    attrs = {},
    text = ''
  ) => {

    const node =
      document.createElement(
        tag
      );


    Object.entries(
      attrs
    ).forEach(
      (
        [
          key,
          value
        ]
      ) => {

        if (
          key ===
          'class'
        ) {

          node.className =
            value;

        } else {

          node.setAttribute(
            key,
            value
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
  };


  // ============================================================
  // LOGO
  // ============================================================

  function createLogo(
    className =
      'logo'
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
            './assets/images/moohae-logo.webp',

          alt:
            'MOOHAE · 더 무해하게.',

          width:
            '850',

          height:
            '500',

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
  // PUBLIC NAVIGATION DATA
  //
  // report는 공개 메뉴에서 제거
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
    // DESKTOP MENU
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
      (
        item
      ) => {

        const link =
          make(
            'a',
            {
              href:
                item.href,

              class:
                page ===
                  item.key
                  ? 'active'
                  : ''
            },
            item.label
          );


        if (
          page ===
          item.key
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
    // CONSULT CTA
    // ----------------------------------------------------------

    inner.appendChild(

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
      )
    );


    // ----------------------------------------------------------
    // MOBILE BUTTON
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
        },
        '☰'
      );


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
      (
        item
      ) => {

        const link =
          make(
            'a',
            {
              href:
                item.href,

              class:
                page ===
                  item.key
                  ? 'active'
                  : ''
            },
            item.label
          );


        if (
          page ===
          item.key
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

    const updateNav =
      () => {

        nav.classList.toggle(
          'scrolled',
          window.scrollY >
            20
        );
      };


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

    toggle.addEventListener(
      'click',
      () => {

        const open =
          panel.classList.toggle(
            'open'
          );


        toggle.setAttribute(
          'aria-expanded',
          String(
            open
          )
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
        (
          link
        ) => {

          link.addEventListener(
            'click',
            () => {

              panel.classList.remove(
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
          );
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


    const footerLogo =
      createLogo(
        'footer-logo'
      );


    footerElement.appendChild(
      footerLogo
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
      (
        node
      ) => {

        node.classList.add(
          'in-view'
        );
      }
    );


  } else {

    const observer =
      new IntersectionObserver(
        (
          entries
        ) => {

          entries.forEach(
            (
              entry
            ) => {

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
      (
        node
      ) => {

        observer.observe(
          node
        );
      }
    );
  }

})();