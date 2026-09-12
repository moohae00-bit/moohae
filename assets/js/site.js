(() => {
  'use strict';


  // ============================================================
  // MOOHAE GLOBAL SITE UI
  //
  // PUBLIC NAVIGATION
  //
  // LOGO = HOME
  // CARE
  // CHECK
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
            'MOOHAE HOME'
        }
      );


    const image =
      make(
        'img',
        {
          src:
            './assets/images/moohae-logo.webp',

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
        'care',

      href:
        './care.html',

      label:
        'CARE'
    },


    {
      key:
        'diagnosis',

      href:
        './diagnosis.html',

      label:
        'CHECK'
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
    // PRIMARY NAV
    // LOGO = HOME / CARE / CHECK
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


        const classNames = [];

        if (
          isActive
        ) {

          classNames.push(
            'active'
          );
        }


        if (
          item.key ===
          'diagnosis'
        ) {

          classNames.push(
            'nav-check-cta'
          );
        }


        const link =
          make(
            'a',
            {
              href:
                item.href,

              class:
                classNames.join(
                  ' '
                )
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


    nav.appendChild(
      inner
    );


    header.appendChild(
      nav
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