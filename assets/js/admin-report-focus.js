(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN
  // REPORT EDITOR AUTO FOCUS
  //
  // 목적:
  // Partner View에서 CARE 완료 후
  // customer-detail.html?focus=report 로 이동했을 때,
  // Care Report 초안이 실제 DOM에 로드된 뒤
  // 작성 영역으로 안전하게 이동한다.
  //
  // DB WRITE 없음
  // 개인정보 URL 추가 없음
  // report public token 사용 없음
  // ============================================================


  const params =
    new URLSearchParams(
      window.location.search
    );


  const shouldFocusReport =
    params.get(
      'focus'
    ) ===
    'report';


  if (
    !shouldFocusReport
  ) {

    return;
  }


  const reportEditorForm =
    document.getElementById(
      'reportEditorForm'
    );


  const reportEditorId =
    document.getElementById(
      'reportEditorId'
    );


  const reportManagerComment =
    document.getElementById(
      'reportManagerComment'
    );


  if (
    !reportEditorForm ||
    !reportEditorId
  ) {

    console.warn(
      'MOOHAE report focus: report editor not found.'
    );

    return;
  }


  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  let completed =
    false;


  let observer =
    null;


  let timeoutId =
    null;


  // ============================================================
  // CLEAN URL
  // ============================================================

  function cleanFocusParameter() {

    const url =
      new URL(
        window.location.href
      );


    url.searchParams.delete(
      'focus'
    );


    window.history.replaceState(
      {},
      '',
      `${url.pathname}${url.search}${url.hash}`
    );
  }


  // ============================================================
  // MOVE
  // ============================================================

  function moveToReportEditor() {

    if (
      completed
    ) {

      return true;
    }


    const reportId =
      String(
        reportEditorId.value ||
        ''
      ).trim();


    // 초안이 실제 생성/조회되기 전이면 기다린다.
    if (
      !UUID_PATTERN.test(
        reportId
      )
    ) {

      return false;
    }


    completed =
      true;


    if (
      observer
    ) {

      observer.disconnect();
    }


    if (
      timeoutId
    ) {

      window.clearTimeout(
        timeoutId
      );
    }


    const reportCard =
      reportEditorForm.closest(
        '.detail-card'
      ) ||
      reportEditorForm;


    // ----------------------------------------------------------
    // URL의 일회성 focus 파라미터 제거
    // 새로고침할 때마다 강제로 스크롤되는 것을 방지
    // ----------------------------------------------------------

    cleanFocusParameter();


    // ----------------------------------------------------------
    // 렌더링 완료 후 이동
    // ----------------------------------------------------------

    window.requestAnimationFrame(
      () => {

        window.requestAnimationFrame(
          () => {

            reportCard.scrollIntoView({
              behavior:
                'smooth',

              block:
                'start'
            });


            window.setTimeout(
              () => {

                if (
                  reportManagerComment &&
                  !reportManagerComment.disabled
                ) {

                  reportManagerComment.focus({
                    preventScroll:
                      true
                  });
                }

              },
              500
            );
          }
        );
      }
    );


    return true;
  }


  // ============================================================
  // INITIAL CHECK
  // ============================================================

  if (
    moveToReportEditor()
  ) {

    return;
  }


  // ============================================================
  // WAIT FOR admin-customer-detail.js
  //
  // populateReportEditor()가 reportEditorId.value를 설정하는
  // 시점을 감시한다.
  // ============================================================

  observer =
    new MutationObserver(
      () => {

        moveToReportEditor();
      }
    );


  /*
   * hidden input의 value 프로퍼티 변경은
   * MutationObserver만으로 항상 잡히지 않을 수 있으므로
   * form과 status 영역 변화도 함께 감시하고
   * 아래 polling을 보조적으로 사용한다.
   */

  observer.observe(
    reportEditorForm,
    {
      subtree:
        true,

      childList:
        true,

      attributes:
        true
    }
  );


  // ============================================================
  // SHORT POLLING FALLBACK
  //
  // 최대 약 8초만 확인.
  // 무한 polling 없음.
  // ============================================================

  let attempts =
    0;


  const maxAttempts =
    40;


  const intervalId =
    window.setInterval(
      () => {

        attempts +=
          1;


        if (
          moveToReportEditor() ||
          attempts >= maxAttempts
        ) {

          window.clearInterval(
            intervalId
          );
        }

      },
      200
    );


  // ============================================================
  // FAIL-SAFE
  // ============================================================

  timeoutId =
    window.setTimeout(
      () => {

        if (
          completed
        ) {

          return;
        }


        if (
          observer
        ) {

          observer.disconnect();
        }


        window.clearInterval(
          intervalId
        );


        /*
         * 리포트가 늦게 생성됐거나 조회에 실패했더라도
         * 사용자에게 오류 페이지를 띄우지는 않는다.
         * 고객 상세 화면에 그대로 머문다.
         */

        console.warn(
          'MOOHAE report focus: report draft was not ready within the expected time.'
        );

      },
      8500
    );

})();