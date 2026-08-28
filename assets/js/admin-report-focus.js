(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN
  // REPORT EDITOR AUTO FOCUS
  //
  // Partner View 완료 흐름:
  //
  // house-care.html
  //      ↓
  // CARE COMPLETE
  //      ↓
  // partner_complete_house_visit()
  //      ↓
  // Report Draft 생성
  //      ↓
  // customer-detail.html?id=...&focus=report
  //      ↓
  // admin-customer-detail.js 데이터 로딩
  //      ↓
  // Report Editor 준비 확인
  //      ↓
  // 자동 이동
  //
  // DB WRITE 없음
  // PUBLIC TOKEN 사용 없음
  // 개인정보 추가 없음
  // ============================================================


  // ============================================================
  // CONSTANTS
  // ============================================================

  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  const CHECK_INTERVAL_MS =
    150;


  const MAX_WAIT_MS =
    10000;


  // ============================================================
  // ROUTE
  // ============================================================

  const params =
    new URLSearchParams(
      window.location.search
    );


  const focusMode =
    params.get(
      'focus'
    );


  if (
    focusMode !==
    'report'
  ) {

    return;
  }


  // ============================================================
  // DOM
  // ============================================================

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


  const reportEditStatus =
    document.getElementById(
      'reportEditStatus'
    );


  const reportEditorMessage =
    document.getElementById(
      'reportEditorMessage'
    );


  // ============================================================
  // DOM SAFETY
  // ============================================================

  if (
    !reportEditorForm ||
    !reportEditorId ||
    !reportManagerComment
  ) {

    console.error(
      'MOOHAE REPORT FOCUS: Report Editor DOM을 찾지 못했습니다.'
    );


    return;
  }


  // ============================================================
  // STATE
  // ============================================================

  let completed =
    false;


  let intervalId =
    null;


  let timeoutId =
    null;


  // ============================================================
  // CLEAN FOCUS PARAMETER
  //
  // 성공 후 ?focus=report 제거.
  //
  // 고객이 새로고침할 때마다
  // 자동으로 Report까지 내려가는 것을 방지한다.
  // ============================================================

  function cleanFocusParameter() {

    try {

      const url =
        new URL(
          window.location.href
        );


      url.searchParams.delete(
        'focus'
      );


      window.history.replaceState(
        window.history.state,
        '',
        `${url.pathname}${url.search}${url.hash}`
      );

    } catch (
      error
    ) {

      console.warn(
        'MOOHAE REPORT FOCUS: URL 정리 실패',
        error
      );
    }
  }


  // ============================================================
  // STOP
  // ============================================================

  function stopWatcher() {

    if (
      intervalId
    ) {

      window.clearInterval(
        intervalId
      );


      intervalId =
        null;
    }


    if (
      timeoutId
    ) {

      window.clearTimeout(
        timeoutId
      );


      timeoutId =
        null;
    }
  }


  // ============================================================
  // REPORT READY?
  // ============================================================

  function isReportReady() {

    const reportId =
      String(
        reportEditorId.value ||
        ''
      ).trim();


    if (
      !UUID_PATTERN.test(
        reportId
      )
    ) {

      return false;
    }


    /*
     * admin-customer-detail.js가
     * Report Editor를 활성화했는지 추가 검증.
     */

    if (
      reportEditorForm.getAttribute(
        'aria-disabled'
      ) ===
      'true'
    ) {

      return false;
    }


    return true;
  }


  // ============================================================
  // MOVE TO REPORT
  // ============================================================

  function moveToReport() {

    if (
      completed ||
      !isReportReady()
    ) {

      return false;
    }


    completed =
      true;


    stopWatcher();


    /*
     * FORM 자체보다 바깥 detail-card를 기준으로 이동해야
     * 제목 "Care Report 작성"까지 함께 화면에 보인다.
     */

    const reportCard =
      reportEditorForm.closest(
        '.detail-card'
      ) ||
      reportEditorForm;


    // URL 플래그는 일회성으로 소비
    cleanFocusParameter();


    // ----------------------------------------------------------
    // Render cycle 2번 확보
    //
    // 고객 상세의 다른 DOM 렌더링이 모두 끝난 다음
    // 최종 위치를 계산한다.
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


            // --------------------------------------------------
            // 사용자에게 현재 상태도 명확하게 전달
            // --------------------------------------------------

            if (
              reportEditorMessage &&
              !reportEditorMessage.textContent.trim()
            ) {

              reportEditorMessage.textContent =
                'CARE 기록이 연결되었습니다. 리포트를 작성하고 발행해주세요.';


              reportEditorMessage.classList.add(
                'success'
              );
            }


            // --------------------------------------------------
            // 스크롤 종료 후 담당자 코멘트 입력 준비
            // --------------------------------------------------

            window.setTimeout(
              () => {

                if (
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
  // FIRST CHECK
  // ============================================================

  if (
    moveToReport()
  ) {

    return;
  }


  // ============================================================
  // WAIT FOR CUSTOMER DATA
  //
  // admin-customer-detail.js의
  // loadCustomerData()
  //      ↓
  // populateReportEditor()
  //      ↓
  // reportEditorId.value 설정
  //
  // 위 과정이 끝날 때까지만 짧게 확인.
  // ============================================================

  intervalId =
    window.setInterval(
      () => {

        moveToReport();

      },
      CHECK_INTERVAL_MS
    );


  // ============================================================
  // FAIL SAFE
  //
  // 무한 polling 금지.
  // 최대 10초.
  // ============================================================

  timeoutId =
    window.setTimeout(
      () => {

        if (
          completed
        ) {

          return;
        }


        stopWatcher();


        console.warn(
          'MOOHAE REPORT FOCUS: Report Draft가 제한 시간 안에 준비되지 않았습니다.'
        );


        /*
         * 자동 이동 실패가 Report 작성 기능 자체를 막아서는 안 된다.
         * 고객 상세 화면에 그대로 머문다.
         */

        if (
          reportEditorMessage
        ) {

          const current =
            reportEditorMessage.textContent.trim();


          if (
            !current
          ) {

            reportEditorMessage.textContent =
              'CARE는 완료되었지만 리포트 자동 연결을 확인하지 못했습니다. 페이지를 새로고침해 다시 확인해주세요.';
          }
        }


        /*
         * 실패 시 focus=report는 남긴다.
         *
         * 사용자가 새로고침하면 다시 한 번 연결을 시도할 수 있다.
         */

      },
      MAX_WAIT_MS
    );


  // ============================================================
  // CLEANUP
  // ============================================================

  window.addEventListener(
    'pagehide',
    () => {

      stopWatcher();

    },
    {
      once:
        true
    }
  );

})();