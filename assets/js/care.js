(() => {
  'use strict';

  /**
   * MOOHAE CARE
   *
   * JavaScript는 화면 동작만 담당합니다.
   * 서비스 콘텐츠와 이미지 경로는
   * HTML / CSS에서 관리합니다.
   */


  function setupReveal() {
    const elements = document.querySelectorAll(
      '.care-page .reveal'
    );


    if (!elements.length) {
      return;
    }


    if (
      !(
        'IntersectionObserver'
        in window
      )
    ) {
      elements.forEach(
        (element) => {
          element.classList.add(
            'in-view'
          );
        }
      );

      return;
    }


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


              entry.target.classList.add(
                'in-view'
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: 0.12,

          rootMargin:
            '0px 0px -6% 0px'
        }
      );


    elements.forEach(
      (element) => {
        observer.observe(
          element
        );
      }
    );
  }


  function init() {
    setupReveal();
  }


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init,
      {
        once: true
      }
    );

  } else {

    init();

  }

})();