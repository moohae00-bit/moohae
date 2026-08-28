// ============================================================
// COMPLETE HOUSE VISIT
// ============================================================

async function completeVisit() {

  setMessage(
    proofMessage,
    ''
  );


  const recordError =
    validateRecordsForCompletion();


  if (
    recordError
  ) {

    setMessage(
      proofMessage,
      recordError
    );

    return;
  }


  completeVisitButton.disabled =
    true;


  completeVisitButton.textContent =
    '완료 처리 중...';


  try {

    const proof =
      await validateProofMedia();


    if (
      proof.beforeCount < 1 ||
      proof.afterCount < 1
    ) {

      throw new Error(
        'PROOF_REQUIRED'
      );
    }


    const note =
      partnerFinalNote
        .value
        .trim();


    // --------------------------------------------------------
    // 서버에서 최종 완료 처리
    // --------------------------------------------------------

    const {
      error
    } =
      await window
        .moohaeSupabase
        .rpc(
          'partner_complete_house_visit',
          {
            p_house_id:
              houseId,

            p_visit_id:
              currentVisit.id,

            p_partner_note:
              note || null
          }
        );


    if (
      error
    ) {

      throw error;
    }


    // --------------------------------------------------------
    // 서버 처리가 성공한 경우에만 화면 전환
    // --------------------------------------------------------

    setMessage(
      proofMessage,
      'CARE 완료 · 리포트 작성 화면으로 이동합니다.',
      true
    );


    completeVisitButton.textContent =
      'CARE COMPLETED';


    completeVisitButton.disabled =
      true;


    // --------------------------------------------------------
    // CUSTOMER UUID 검증
    // --------------------------------------------------------

    if (
      !customerId ||
      !UUID_PATTERN.test(
        customerId
      )
    ) {

      throw new Error(
        'INVALID_CUSTOMER_ID_AFTER_COMPLETE'
      );
    }


    // --------------------------------------------------------
    // 고객 상세 → Care Report 작성 화면으로 이동
    //
    // focus=report:
    // 고객 상세 데이터 로딩이 끝난 뒤
    // 리포트 작성 영역으로 이동시키기 위한 플래그
    //
    // replace:
    // 완료된 Partner View로 뒤로 돌아가
    // 중복 완료를 누르는 실수를 줄인다.
    // --------------------------------------------------------

    const nextUrl =
      new URL(
        './customer-detail.html',
        window.location.href
      );


    nextUrl.searchParams.set(
      'id',
      customerId
    );


    nextUrl.searchParams.set(
      'focus',
      'report'
    );


    window.setTimeout(
      () => {

        window.location.replace(
          nextUrl.toString()
        );

      },
      650
    );


  } catch (
    error
  ) {

    console.error(
      'MOOHAE partner visit completion error:',
      error
    );


    if (
      error?.message ===
      'PROOF_REQUIRED'
    ) {

      setMessage(
        proofMessage,
        'BEFORE와 AFTER 대표 사진을 각각 1장 이상 남겨주세요.'
      );


    } else if (
      error?.message ===
      'INVALID_CUSTOMER_ID_AFTER_COMPLETE'
    ) {

      /*
       * 서버의 CARE 완료 자체는 이미 성공했을 수 있으므로
       * 완료 RPC를 다시 실행시키지 않는다.
       */

      setMessage(
        proofMessage,
        'CARE는 완료되었습니다. 고객 상세 화면 이동 정보만 확인하지 못했습니다. 고객 목록에서 해당 고객을 다시 열어주세요.',
        true
      );


      completeVisitButton.textContent =
        'CARE COMPLETED';


      completeVisitButton.disabled =
        true;


      return;


    } else {

      setMessage(
        proofMessage,
        'CARE 완료 처리에 실패했습니다. 기록을 다시 확인해주세요.'
      );
    }


    completeVisitButton.disabled =
      false;


    completeVisitButton.textContent =
      'CARE 완료';
  }
}