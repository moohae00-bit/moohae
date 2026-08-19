(() => {
  'use strict';

  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const loading = document.getElementById('reportLoading');
  const errorBox = document.getElementById('reportError');
  const errorMessage = document.getElementById('reportErrorMessage');
  const content = document.getElementById('reportContent');

  const customerName = document.getElementById('customerName');
  const careDate = document.getElementById('careDate');
  const careAreaTop = document.getElementById('careAreaTop');
  const careAreaSummary = document.getElementById('careAreaSummary');
  const beforeDiagnosis = document.getElementById('beforeDiagnosis');
  const afterDiagnosis = document.getElementById('afterDiagnosis');
  const careList = document.getElementById('careList');
  const managerComment = document.getElementById('managerComment');
  const nextCare = document.getElementById('nextCare');
  const nextCareSummary = document.getElementById('nextCareSummary');

  const beforeAfterSection = document.getElementById('beforeAfterSection');
  const beforePhotoWrap = document.getElementById('beforePhotoWrap');
  const afterPhotoWrap = document.getElementById('afterPhotoWrap');
  const beforeImage = document.getElementById('beforeImage');
  const afterImage = document.getElementById('afterImage');

  function showError(message) {
    loading.hidden = true;
    content.hidden = true;
    errorMessage.textContent = message;
    errorBox.hidden = false;
  }

  function showContent() {
    loading.hidden = true;
    errorBox.hidden = true;
    content.hidden = false;
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  function renderCareItems(items) {
    careList.replaceChildren();

    if (!Array.isArray(items) || items.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = '기록된 케어 항목이 없습니다.';
      careList.appendChild(empty);
      return;
    }

    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'care-item';

      const check = document.createElement('div');
      check.className = 'check';
      check.textContent = '✓';

      const label = document.createElement('div');
      label.textContent = String(item);

      const state = document.createElement('div');
      state.className = 'care-state';
      state.textContent = 'COMPLETE';

      row.append(check, label, state);
      careList.appendChild(row);
    }
  }

  function isSafeLocalImagePath(value) {
    if (typeof value !== 'string') return false;
    const path = value.trim();

    if (!path) return false;
    if (path.startsWith('data:')) return false;
    if (path.startsWith('//')) return false;
    if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return false;

    return path.startsWith('./') || path.startsWith('../') || path.startsWith('/');
  }

  function renderImages(beforePath, afterPath) {
    let hasImage = false;

    if (isSafeLocalImagePath(beforePath)) {
      beforeImage.src = beforePath;
      beforePhotoWrap.hidden = false;
      hasImage = true;
    } else {
      beforeImage.removeAttribute('src');
      beforePhotoWrap.hidden = true;
    }

    if (isSafeLocalImagePath(afterPath)) {
      afterImage.src = afterPath;
      afterPhotoWrap.hidden = false;
      hasImage = true;
    } else {
      afterImage.removeAttribute('src');
      afterPhotoWrap.hidden = true;
    }

    beforeAfterSection.hidden = !hasImage;
  }

  function renderReport(report) {
    customerName.textContent = report.customer_name || '고객';
    careDate.textContent = formatDate(report.care_date);

    const area = report.care_area || '생활 공간';
    careAreaTop.textContent = area;
    careAreaSummary.textContent = area;

    beforeDiagnosis.textContent =
      report.before_diagnosis || '케어 전 상태 기록이 없습니다.';

    afterDiagnosis.textContent =
      report.after_diagnosis || '케어 후 상태 기록이 없습니다.';

    managerComment.textContent =
      report.manager_comment || '담당자 코멘트가 없습니다.';

    const recommendation =
      report.next_care_recommendation || '관리 상태에 따라 추후 확인';

    nextCare.textContent = recommendation;
    nextCareSummary.textContent = recommendation;

    renderCareItems(report.care_items);
    renderImages(report.before_image_path, report.after_image_path);

    showContent();
  }

  async function loadReport() {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token || !UUID_PATTERN.test(token)) {
      showError('리포트 링크가 올바르지 않습니다.');
      return;
    }

    if (!window.moohaeSupabaseConfigReady || !window.moohaeSupabase) {
      showError('리포트 연결을 확인할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const { data, error } = await window.moohaeSupabase.rpc(
        'get_public_care_report',
        { p_public_token: token }
      );

      if (error) {
        console.error('MOOHAE public report RPC error:', {
          code: error.code,
          message: error.message
        });
        showError('리포트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      const rows = Array.isArray(data) ? data : [];

      if (rows.length !== 1) {
        showError('링크가 올바르지 않거나 아직 발행되지 않은 리포트입니다.');
        return;
      }

      renderReport(rows[0]);
    } catch (error) {
      console.error('MOOHAE public report exception:', error);
      showError('리포트를 불러오는 중 오류가 발생했습니다.');
    }
  }

  loadReport();
})();
