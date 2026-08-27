(() => {
  'use strict';

  // ============================================================
  // MOOHAE ADMIN
  // CUSTOMER DETAIL -> HOUSE CARE LINK
  //
  // 목적
  // - 고객 상세의 CUSTOMER UUID를 Partner View로 안전하게 전달
  // - 삭제 처리 고객에서는 현장 CARE 진입 버튼 숨김
  // - 기존 admin-customer-detail.js를 건드리지 않고 모듈 분리
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


  if (
    !openHouseCareButton
  ) {
    return;
  }


  const customerId =
    new URLSearchParams(
      window.location.search
    ).get(
      'id'
    );


  if (
    !customerId ||
    !UUID_PATTERN.test(
      customerId
    )
  ) {
    openHouseCareButton.hidden =
      true;

    return;
  }


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


  const syncVisibility =
    () => {
      const deleted =
        deletedCustomerNotice
          ? !deletedCustomerNotice.hidden
          : false;


      openHouseCareButton.hidden =
        deleted;


      openHouseCareButton.setAttribute(
        'aria-disabled',
        deleted
          ? 'true'
          : 'false'
      );
    };


  syncVisibility();


  if (
    deletedCustomerNotice
  ) {
    const observer =
      new MutationObserver(
        syncVisibility
      );


    observer.observe(
      deletedCustomerNotice,
      {
        attributes: true,
        attributeFilter: [
          'hidden'
        ]
      }
    );
  }

})();