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
              note ||
              null
          }
        );


    if (
      error
    ) {

      throw error;
    }


    // --------------------------------------------------------
    // CARE 완료 성공
    // --------------------------------------------------------

    setMessage(
      proofMessage,
      'CARE 완료 · Care Report 작성 화면으로 이동합니다.',
      true
    );


    completeVisitButton.textContent =
      'CARE COMPLETED';


    completeVisitButton.disabled =
      true;


    // --------------------------------------------------------
    // 고객 상세의 Care Report 작성 영역으로 자동 이동
    //
    // replace 사용:
    // 완료된 Partner 화면으로 뒤로 돌아가
    // 실수로 다시 완료 처리하는 것을 방지
    // --------------------------------------------------------

    const reportEditorUrl =
      new URL(
        './customer-detail.html',
        window.location.href
      );


    reportEditorUrl.searchParams.set(
      'id',
      customerId
    );


    reportEditorUrl.hash =
      'reportEditorForm';


    window.setTimeout(
      () => {

        window.location.replace(
          reportEditorUrl.toString()
        );

      },
      700
    );


  } catch (
    error
  ) {

    console.error(
      'MOOHAE partner visit completion error:',
      error
    );


    setMessage(

      proofMessage,

      error?.message ===
        'PROOF_REQUIRED'

        ? 'BEFORE와 AFTER 대표 사진을 각각 1장 이상 남겨주세요.'

        : 'CARE 완료 처리에 실패했습니다. 기록을 다시 확인해주세요.'
    );


    completeVisitButton.disabled =
      false;


    completeVisitButton.textContent =
      'CARE 완료';
  }
}