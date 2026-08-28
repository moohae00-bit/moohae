(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN
  // CUSTOMER DETAIL → PARTNER HOUSE CARE LINK
  //
  // 목적:
  // customer-detail.html?id=CUSTOMER_UUID
  //        ↓
  // house-care.html?id=CUSTOMER_UUID
  //
  // 보안 원칙:
  // - UUID 형식 검증
  // - 개인정보를 URL에 추가하지 않음
  // - customer UUID 외 데이터 전달하지 않음
  // - 삭제된 고객은 현장 CARE 진입 차단
  // ============================================================


  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  const openHouseCareButton =
    document.getElementById(
      'openHouseCareButton'
    );


  const deletedCustomerNotice =
    document.getElementById(
      'deletedCustomerNotice'
    );


  // ============================================================
  // BUTTON 없음
  // ============================================================

  if (
    !openHouseCareButton
  ) {

    return;
  }


  // 기본적으로 숨김
  openHouseCareButton.hidden =
    true;


  // ============================================================
  // CUSTOMER UUID
  // ============================================================

  const params =
    new URLSearchParams(
      window.location.search
    );


  const customerId =
    String(
      params.get('id') ||
      ''
    ).trim();


  // ============================================================
  // INVALID ROUTE
  // ============================================================

  if (
    !UUID_PATTERN.test(
      customerId
    )
  ) {

    console.warn(
      'MOOHAE HOUSE CARE LINK: invalid customer id.'
    );


    return;
  }


  // ============================================================
  // BUILD SAFE URL
  // ============================================================

  const houseCareUrl =
    new URL(
      './house-care.html',
      window.location.href
    );


  houseCareUrl.searchParams.set(
    'id',
    customerId
  );


  openHouseCareButton.href =
    houseCareUrl.toString();


  // ============================================================
  // DELETED CUSTOMER CHECK
  //
  // admin-customer-detail.js가 고객 데이터를 불러온 뒤
  // deletedCustomerNotice.hidden 값을 변경할 수 있으므로
  // 상태를 확인해서 버튼 표시 여부를 결정한다.
  // ============================================================

  function updateButtonVisibility() {

    const isDeleted =
      deletedCustomerNotice &&
      deletedCustomerNotice.hidden ===
        false;


    openHouseCareButton.hidden =
      Boolean(
        isDeleted
      );
  }


  // ============================================================
  // INITIAL
  // ============================================================

  updateButtonVisibility();


  // ============================================================
  // WAIT FOR CUSTOMER DATA RENDER
  // ============================================================

  if (
    deletedCustomerNotice
  ) {

    const observer =
      new MutationObserver(
        () => {

          updateButtonVisibility();
        }
      );


    observer.observe(
      deletedCustomerNotice,
      {
        attributes:
          true,

        attributeFilter: [
          'hidden'
        ]
      }
    );


    // 불필요하게 영구 감시하지 않도록 종료
    window.setTimeout(
      () => {

        observer.disconnect();


        updateButtonVisibility();

      },
      5000
    );
  }


  // ============================================================
  // CLICK SAFETY
  // ============================================================

  openHouseCareButton.addEventListener(
    'click',
    (event) => {

      const isDeleted =
        deletedCustomerNotice &&
        deletedCustomerNotice.hidden ===
          false;


      if (
        isDeleted
      ) {

        event.preventDefault();


        console.warn(
          'MOOHAE HOUSE CARE LINK: deleted customer blocked.'
        );


        return;
      }


      if (
        !UUID_PATTERN.test(
          customerId
        )
      ) {

        event.preventDefault();


        console.warn(
          'MOOHAE HOUSE CARE LINK: invalid customer route blocked.'
        );
      }
    }
  );

})();