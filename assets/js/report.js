(() => {
  'use strict';


  // ============================================================
  // MOOHAE CARE REPORT
  // PUBLIC REPORT + PRIVATE MEDIA
  // ============================================================

  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


  // ============================================================
  // DOM
  // ============================================================

  const loading =
    document.getElementById('reportLoading');

  const errorBox =
    document.getElementById('reportError');

  const errorMessage =
    document.getElementById('reportErrorMessage');

  const content =
    document.getElementById('reportContent');


  const customerName =
    document.getElementById('customerName');

  const careDate =
    document.getElementById('careDate');

  const careAreaTop =
    document.getElementById('careAreaTop');

  const careMainAreaSummary =
    document.getElementById('careMainAreaSummary');

  const nextCareAreaSummary =
    document.getElementById('nextCareAreaSummary');

  const nextCheckAreaSummary =
    document.getElementById('nextCheckAreaSummary');

  const careList =
    document.getElementById('careList');

  const managerComment =
    document.getElementById('managerComment');

  const nextCare =
    document.getElementById('nextCare');


  // ------------------------------------------------------------
  // MEDIA
  // ------------------------------------------------------------

  const beforeAfterSection =
    document.getElementById('beforeAfterSection');

  const beforeMediaGroup =
    document.getElementById('beforeMediaGroup');

  const afterMediaGroup =
    document.getElementById('afterMediaGroup');

  const beforeMediaGrid =
    document.getElementById('beforeMediaGrid');

  const afterMediaGrid =
    document.getElementById('afterMediaGrid');

  const beforeMediaCount =
    document.getElementById('beforeMediaCount');

  const afterMediaCount =
    document.getElementById('afterMediaCount');

  const mediaLightbox =
    document.getElementById('reportMediaLightbox');

  const mediaLightboxImage =
    document.getElementById('reportMediaLightboxImage');

  const mediaLightboxClose =
    document.getElementById('reportMediaLightboxClose');

  let mediaLightboxReturnFocus =
    null;


  // ============================================================
  // UI STATE
  // ============================================================

  function showError(message) {
    loading.hidden =
      true;

    content.hidden =
      true;

    errorMessage.textContent =
      message;

    errorBox.hidden =
      false;
  }


  function showContent() {
    loading.hidden =
      true;

    errorBox.hidden =
      true;

    content.hidden =
      false;
  }



  // ============================================================
  // HELPERS
  // ============================================================

  function formatDate(value) {
    if (!value) {
      return '—';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '—';
    }

    return new Intl.DateTimeFormat(
      'ko-KR',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    ).format(date);
  }


  function pickText(
    object,
    ...keys
  ) {
    for (
      const key
      of keys
    ) {
      const value =
        object?.[key];

      if (
        typeof value === 'string' &&
        value.trim()
      ) {
        return value.trim();
      }
    }

    return '';
  }


  function setText(
    node,
    value,
    fallback = '—'
  ) {
    if (!node) {
      return;
    }

    node.textContent =
      typeof value === 'string' &&
      value.trim()

        ? value.trim()

        : fallback;
  }


  function normalizeStringArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    const normalized = [];
    const seen = new Set();

    for (const item of value) {
      if (typeof item !== 'string') {
        continue;
      }

      const text =
        item.trim();

      if (
        !text ||
        seen.has(text)
      ) {
        continue;
      }

      seen.add(text);
      normalized.push(text);
    }

    return normalized;
  }


  function normalizeReportDetail(value) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      return value;
    }

    if (
      Array.isArray(value) &&
      value.length === 1 &&
      value[0] &&
      typeof value[0] === 'object' &&
      !Array.isArray(value[0])
    ) {
      return value[0];
    }

    return null;
  }


  function makeAreaLabel(item) {
    if (
      !item ||
      typeof item !== 'object'
    ) {
      return '';
    }

    const spaceName =
      pickText(
        item,
        'space_name',
        'spaceName'
      );

    const objectName =
      pickText(
        item,
        'object_name',
        'objectName'
      );

    if (spaceName && objectName) {
      return `${spaceName} · ${objectName}`;
    }

    return objectName || spaceName;
  }


  function renderSummaryValue(
    node,
    values,
    fallback = '없음'
  ) {
    if (!node) {
      return;
    }

    const normalized =
      normalizeStringArray(values);

    node.textContent =
      normalized.length > 0
        ? normalized.join('\n')
        : fallback;
  }



  // ============================================================
  // CUSTOMER
  // ============================================================

  function renderCustomerName(report) {
    const name =
      pickText(
        report,
        'customer_name',
        'customerName'
      );

    setText(
      customerName,
      name,
      '고객'
    );

    document
      .querySelectorAll(
        '[data-output="customerName"]'
      )
      .forEach(
        (node) => {
          node.textContent =
            name || '고객';
        }
      );
  }



  // ============================================================
  // TODAY'S CARE
  // ============================================================

  function renderLegacyCareItems(items) {
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      const empty =
        document.createElement('p');

      empty.className =
        'care-detail-empty';

      empty.textContent =
        '기록된 CARE 항목이 없습니다.';

      careList.appendChild(
        empty
      );

      return;
    }


    for (const item of items) {
      const row =
        document.createElement('div');

      row.className =
        'care-item';


      const check =
        document.createElement('div');

      check.className =
        'check';

      check.textContent =
        '✓';


      const label =
        document.createElement('div');

      label.textContent =
        String(item);


      const state =
        document.createElement('div');

      state.className =
        'care-state';

      state.textContent =
        'COMPLETE';


      row.append(
        check,
        label,
        state
      );

      careList.appendChild(
        row
      );
    }
  }


  function renderCareDetails(
    details,
    legacyItems
  ) {
    careList.replaceChildren();

    const normalizedDetails =
      Array.isArray(details)
        ? details.filter(
            (item) =>
              item &&
              typeof item === 'object' &&
              !Array.isArray(item)
          )
        : [];


    if (
      normalizedDetails.length === 0
    ) {
      renderLegacyCareItems(
        legacyItems
      );

      return;
    }


    for (
      const item
      of normalizedDetails
    ) {
      const card =
        document.createElement('article');

      card.className =
        'care-detail-item';


      const head =
        document.createElement('div');

      head.className =
        'care-detail-head';


      const title =
        document.createElement('div');

      title.className =
        'care-detail-title';


      const objectName =
        pickText(
          item,
          'object_name',
          'objectName'
        ) ||
        'CARE 항목';

      const spaceName =
        pickText(
          item,
          'space_name',
          'spaceName'
        );


      if (spaceName) {
        const space =
          document.createElement('span');

        space.className =
          'care-detail-space';

        space.textContent =
          spaceName;

        title.appendChild(
          space
        );
      }


      const name =
        document.createElement('strong');

      name.textContent =
        objectName;

      title.appendChild(
        name
      );


      const state =
        document.createElement('span');

      state.className =
        'care-state care-detail-state';

      state.textContent =
        'CARE COMPLETE';


      head.append(
        title,
        state
      );

      card.appendChild(
        head
      );


      const completedParts =
        normalizeStringArray(
          item.completed_parts ??
          item.completedParts
        );

      const list =
        document.createElement('ul');

      list.className =
        'care-detail-parts';


      if (
        completedParts.length === 0
      ) {
        const empty =
          document.createElement('li');

        empty.className =
          'care-detail-part care-detail-part-empty';

        empty.textContent =
          '세부 완료 기록이 없습니다.';

        list.appendChild(
          empty
        );

      } else {
        for (
          const part
          of completedParts
        ) {
          const listItem =
            document.createElement('li');

          listItem.className =
            'care-detail-part';

          listItem.textContent =
            part;

          list.appendChild(
            listItem
          );
        }
      }


      card.appendChild(
        list
      );

      careList.appendChild(
        card
      );
    }
  }


  // ============================================================
  // MEDIA HELPERS
  // ============================================================

  function isSafeSignedImageUrl(value) {
    if (
      typeof value !==
      'string'
    ) {
      return false;
    }

    const trimmed =
      value.trim();

    if (
      !trimmed
    ) {
      return false;
    }

    try {
      const url =
        new URL(
          trimmed
        );

      return (
        url.protocol === 'https:' &&
        (
          url.hostname === 'supabase.co' ||
          url.hostname.endsWith(
            '.supabase.co'
          )
        )
      );

    } catch {
      return false;
    }
  }


  function closeMediaLightbox() {
    if (
      !mediaLightbox ||
      !mediaLightboxImage ||
      mediaLightbox.hidden
    ) {
      return;
    }

    mediaLightbox.hidden =
      true;

    mediaLightboxImage.removeAttribute(
      'src'
    );

    mediaLightboxImage.alt =
      '';

    document.body.classList.remove(
      'report-lightbox-open'
    );

    if (
      mediaLightboxReturnFocus instanceof HTMLElement
    ) {
      mediaLightboxReturnFocus.focus();
    }

    mediaLightboxReturnFocus =
      null;
  }


  function openMediaLightbox(
    imageUrl,
    imageAlt,
    trigger
  ) {
    if (
      !mediaLightbox ||
      !mediaLightboxImage ||
      !mediaLightboxClose ||
      !isSafeSignedImageUrl(
        imageUrl
      )
    ) {
      return;
    }

    mediaLightboxReturnFocus =
      trigger instanceof HTMLElement
        ? trigger
        : null;

    mediaLightboxImage.src =
      imageUrl;

    mediaLightboxImage.alt =
      imageAlt ||
      'CARE 사진 확대 보기';

    mediaLightbox.hidden =
      false;

    document.body.classList.add(
      'report-lightbox-open'
    );

    mediaLightboxClose.focus();
  }


  if (
    mediaLightboxClose
  ) {
    mediaLightboxClose.addEventListener(
      'click',
      closeMediaLightbox
    );
  }


  if (
    mediaLightbox
  ) {
    mediaLightbox.addEventListener(
      'click',
      (event) => {
        if (
          event.target ===
          mediaLightbox
        ) {
          closeMediaLightbox();
        }
      }
    );
  }


  document.addEventListener(
    'keydown',
    (event) => {
      if (
        event.key === 'Escape' &&
        mediaLightbox &&
        !mediaLightbox.hidden
      ) {
        closeMediaLightbox();
      }
    }
  );


  function createMediaItem(
    media,
    label
  ) {
    if (
      !media ||
      !isSafeSignedImageUrl(
        media.url
      )
    ) {
      return null;
    }


    const item =
      document.createElement(
        'figure'
      );

    item.className =
      'report-media-item';


    const image =
      document.createElement(
        'img'
      );

    image.src =
      media.url;

    image.alt =
      label;

    image.loading =
      'lazy';

    image.decoding =
      'async';

    image.referrerPolicy =
      'no-referrer';


    const zoomButton =
      document.createElement(
        'button'
      );

    zoomButton.type =
      'button';

    zoomButton.className =
      'report-media-zoom-trigger';

    zoomButton.setAttribute(
      'aria-label',
      `${label} 확대해서 보기`
    );

    zoomButton.addEventListener(
      'click',
      () => {
        openMediaLightbox(
          media.url,
          label,
          zoomButton
        );
      }
    );

    zoomButton.appendChild(
      image
    );

    item.appendChild(
      zoomButton
    );


    return item;
  }


  function renderMediaGroup(
    mediaType,
    rows
  ) {
    const isBefore =
      mediaType ===
      'before';


    const group =
      isBefore
        ? beforeMediaGroup
        : afterMediaGroup;


    const grid =
      isBefore
        ? beforeMediaGrid
        : afterMediaGrid;


    const countNode =
      isBefore
        ? beforeMediaCount
        : afterMediaCount;


    grid.replaceChildren();


    const safeRows =
      Array.isArray(rows)

        ? rows
            .filter(
              (row) =>
                row &&
                typeof row.id === 'string' &&
                UUID_PATTERN.test(
                  row.id
                ) &&
                Number.isInteger(
                  row.order
                ) &&
                row.order >= 0 &&
                row.order <= 9 &&
                isSafeSignedImageUrl(
                  row.url
                )
            )
            .sort(
              (a, b) =>
                a.order -
                b.order
            )
            .slice(
              0,
              10
            )

        : [];


    if (
      safeRows.length === 0
    ) {
      group.hidden =
        true;

      countNode.textContent =
        '0 PHOTOS';

      grid.removeAttribute(
        'data-count'
      );

      return false;
    }


    grid.dataset.count =
      String(
        safeRows.length
      );


    countNode.textContent =
      safeRows.length === 1
        ? '1 PHOTO'
        : `${safeRows.length} PHOTOS`;


    safeRows.forEach(
      (
        row,
        index
      ) => {
        const item =
          createMediaItem(
            row,
            isBefore
              ? `케어 전 사진 ${index + 1}`
              : `케어 후 사진 ${index + 1}`
          );

        if (item) {
          grid.appendChild(
            item
          );
        }
      }
    );


    group.hidden =
      grid.children.length === 0;


    return (
      grid.children.length >
      0
    );
  }


  function renderMedia(
    mediaData
  ) {
    const beforeVisible =
      renderMediaGroup(
        'before',
        mediaData?.before
      );


    const afterVisible =
      renderMediaGroup(
        'after',
        mediaData?.after
      );


    beforeAfterSection.hidden =
      !beforeVisible &&
      !afterVisible;
  }



  // ============================================================
  // REPORT
  // ============================================================

  function renderReport(
    report,
    detail
  ) {
    renderCustomerName(
      report
    );


    careDate.textContent =
      formatDate(
        report.care_date ??
        report.careDate
      );


    const area =
      pickText(
        report,
        'care_area',
        'careArea'
      ) ||
      '생활 공간';


    careAreaTop.textContent =
      area;


    managerComment.textContent =
      pickText(
        report,
        'manager_comment',
        'managerComment'
      ) ||
      '담당자 코멘트가 없습니다.';


    const recommendation =
      pickText(
        report,
        'next_care_recommendation',
        'nextCareRecommendation'
      ) ||
      '관리 상태에 따라 추후 확인';


    nextCare.textContent =
      recommendation;


    const careDetails =
      Array.isArray(
        detail?.care_details
      )
        ? detail.care_details
        : [];


    renderCareDetails(
      careDetails,
      report.care_items ??
      report.careItems
    );


    let mainAreas =
      normalizeStringArray(
        detail?.main_areas
      );


    if (
      mainAreas.length === 0 &&
      careDetails.length > 0
    ) {
      mainAreas =
        normalizeStringArray(
          careDetails.map(
            makeAreaLabel
          )
        );
    }


    renderSummaryValue(
      careMainAreaSummary,
      mainAreas,
      '상세 CARE 기록 없음'
    );


    renderSummaryValue(
      nextCareAreaSummary,
      detail?.next_care_areas,
      '없음'
    );


    renderSummaryValue(
      nextCheckAreaSummary,
      detail?.next_check_areas,
      '없음'
    );
  }



  // ============================================================
  // LOAD REPORT MEDIA
  // ============================================================

  async function loadReportMedia(
    token
  ) {
    try {
      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .functions
          .invoke(
            'get-public-care-report-media',
            {
              body: {
                public_token:
                  token
              }
            }
          );


      if (
        error
      ) {
        console.error(
          'MOOHAE public report media function error:',
          error
        );

        renderMedia(
          {
            before: [],
            after: []
          }
        );

        return;
      }


      if (
        !data?.ok
      ) {
        console.error(
          'MOOHAE public report media rejected:',
          data
        );

        renderMedia(
          {
            before: [],
            after: []
          }
        );

        return;
      }


      renderMedia(
        {
          before:
            Array.isArray(
              data.before
            )
              ? data.before
              : [],

          after:
            Array.isArray(
              data.after
            )
              ? data.after
              : []
        }
      );

    } catch (
      error
    ) {
      console.error(
        'MOOHAE public report media exception:',
        error
      );

      renderMedia(
        {
          before: [],
          after: []
        }
      );
    }
  }



  // ============================================================
  // LOAD REPORT
  // ============================================================

  async function loadReport() {
    const token =
      new URLSearchParams(
        window.location.search
      ).get(
        'token'
      );


    if (
      !token ||
      !UUID_PATTERN.test(
        token
      )
    ) {
      showError(
        '리포트 링크가 올바르지 않습니다.'
      );

      return;
    }


    if (
      !window.moohaeSupabaseConfigReady ||
      !window.moohaeSupabase
    ) {
      showError(
        '리포트 연결을 확인할 수 없습니다. 잠시 후 다시 시도해주세요.'
      );

      return;
    }


    try {
      const [
        reportResult,
        detailResult,
        mediaResult
      ] =
        await Promise.allSettled([
          window
            .moohaeSupabase
            .rpc(
              'get_public_care_report',
              {
                p_public_token:
                  token
              }
            ),

          window
            .moohaeSupabase
            .rpc(
              'get_public_care_report_detail_v1',
              {
                p_public_token:
                  token
              }
            ),

          loadReportMedia(
            token
          )
        ]);


      if (
        reportResult.status !==
        'fulfilled'
      ) {
        throw reportResult.reason;
      }


      const {
        data,
        error
      } =
        reportResult.value;


      if (
        error
      ) {
        console.error(
          'MOOHAE public report RPC error:',
          {
            code:
              error.code,

            message:
              error.message
          }
        );


        showError(
          '리포트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
        );

        return;
      }


      const rows =
        Array.isArray(
          data
        )
          ? data
          : [];


      if (
        rows.length !== 1
      ) {
        showError(
          '링크가 올바르지 않거나 아직 발행되지 않은 리포트입니다.'
        );

        return;
      }


      let reportDetail =
        null;


      if (
        detailResult.status ===
        'fulfilled'
      ) {
        const {
          data: detailData,
          error: detailError
        } =
          detailResult.value;


        if (detailError) {
          console.error(
            'MOOHAE public report detail RPC error:',
            {
              code:
                detailError.code,

              message:
                detailError.message
            }
          );

        } else {
          reportDetail =
            normalizeReportDetail(
              detailData
            );
        }

      } else {
        console.error(
          'MOOHAE public report detail promise rejected:',
          detailResult.reason
        );
      }


      renderReport(
        rows[0],
        reportDetail
      );


      showContent();


      if (
        mediaResult.status ===
        'rejected'
      ) {
        console.error(
          'MOOHAE media promise rejected:',
          mediaResult.reason
        );
      }


    } catch (
      error
    ) {
      console.error(
        'MOOHAE public report exception:',
        error
      );


      showError(
        '리포트를 불러오는 중 오류가 발생했습니다.'
      );
    }
  }



  // ============================================================
  // START
  // ============================================================

  loadReport();

})();