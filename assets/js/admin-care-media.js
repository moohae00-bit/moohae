(() => {
  'use strict';


  // ============================================================
  // MOOHAE ADMIN
  // CARE VISIT MEDIA
  //
  // Private Storage:
  // care-reports
  //
  // DB:
  // care_visit_media
  //
  // Media:
  // before / after
  //
  // Limit:
  // 각 최대 10장
  // 파일당 최대 10MB
  //
  // 기존 admin-customer-detail.js와 독립적으로 동작한다.
  // ============================================================



  // ============================================================
  // CONSTANTS
  // ============================================================

  const STORAGE_BUCKET =
    'care-reports';


  const MAX_IMAGES =
    10;


  const MAX_FILE_SIZE =
    10 * 1024 * 1024;


  const SIGNED_URL_TTL =
    60 * 20;


  const ALLOWED_MIME_TYPES =
    new Set([

      'image/jpeg',

      'image/png',

      'image/webp'
    ]);


  const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;



  // ============================================================
  // DOM
  // ============================================================

  const careVisitSelect =
    document.getElementById(
      'careVisitSelect'
    );


  const beforeInput =
    document.getElementById(
      'beforeMediaInput'
    );


  const afterInput =
    document.getElementById(
      'afterMediaInput'
    );


  const beforeGallery =
    document.getElementById(
      'beforeMediaGallery'
    );


  const afterGallery =
    document.getElementById(
      'afterMediaGallery'
    );


  const beforeCount =
    document.getElementById(
      'beforeMediaCount'
    );


  const afterCount =
    document.getElementById(
      'afterMediaCount'
    );


  const beforeMessage =
    document.getElementById(
      'beforeMediaMessage'
    );


  const afterMessage =
    document.getElementById(
      'afterMediaMessage'
    );


  if (
    !careVisitSelect ||
    !beforeInput ||
    !afterInput ||
    !beforeGallery ||
    !afterGallery
  ) {

    return;
  }



  // ============================================================
  // STATE
  // ============================================================

  let currentVisitId =
    '';


  let loading =
    false;


  let uploadLock =
    false;


  const mediaState = {

    before:
      [],

    after:
      []
  };



  // ============================================================
  // HELPERS
  // ============================================================

  function make(
    tag,
    className,
    text = ''
  ) {

    const node =
      document.createElement(
        tag
      );


    if (
      className
    ) {

      node.className =
        className;
    }


    if (
      text
    ) {

      node.textContent =
        text;
    }


    return node;
  }



  function getMessageNode(
    mediaType
  ) {

    return mediaType ===
      'before'

      ? beforeMessage

      : afterMessage;
  }



  function getGalleryNode(
    mediaType
  ) {

    return mediaType ===
      'before'

      ? beforeGallery

      : afterGallery;
  }



  function getCountNode(
    mediaType
  ) {

    return mediaType ===
      'before'

      ? beforeCount

      : afterCount;
  }



  function getInputNode(
    mediaType
  ) {

    return mediaType ===
      'before'

      ? beforeInput

      : afterInput;
  }



  function setMessage(
    mediaType,
    text,
    state = ''
  ) {

    const node =
      getMessageNode(
        mediaType
      );


    if (
      !node
    ) {

      return;
    }


    node.textContent =
      text;


    node.classList.toggle(
      'error',
      state ===
        'error'
    );


    node.classList.toggle(
      'success',
      state ===
        'success'
    );
  }



  function updateCount(
    mediaType
  ) {

    const node =
      getCountNode(
        mediaType
      );


    if (
      !node
    ) {

      return;
    }


    node.textContent =
      `${mediaState[mediaType].length} / ${MAX_IMAGES}`;
  }



  function clearMediaState() {

    mediaState.before =
      [];


    mediaState.after =
      [];


    beforeGallery.replaceChildren();


    afterGallery.replaceChildren();


    updateCount(
      'before'
    );


    updateCount(
      'after'
    );


    setMessage(
      'before',
      ''
    );


    setMessage(
      'after',
      ''
    );
  }



  function getFileExtension(
    file
  ) {

    switch (
      file.type
    ) {

      case 'image/jpeg':

        return 'jpg';


      case 'image/png':

        return 'png';


      case 'image/webp':

        return 'webp';


      default:

        return '';
    }
  }



  function validateFile(
    file
  ) {

    if (
      !file ||
      !ALLOWED_MIME_TYPES.has(
        file.type
      )
    ) {

      return (
        'JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.'
      );
    }


    if (
      !Number.isFinite(
        file.size
      ) ||
      file.size < 1 ||
      file.size >
        MAX_FILE_SIZE
    ) {

      return (
        '사진 한 장의 크기는 10MB 이하여야 합니다.'
      );
    }


    return '';
  }



  // ============================================================
  // SIGNED PREVIEW URL
  // ============================================================

  async function createPreviewUrl(
    storagePath
  ) {

    const {
      data,
      error
    } =
      await window
        .moohaeSupabase
        .storage
        .from(
          STORAGE_BUCKET
        )
        .createSignedUrl(

          storagePath,

          SIGNED_URL_TTL
        );


    if (
      error
    ) {

      throw error;
    }


    return (
      data?.signedUrl ||
      ''
    );
  }



  // ============================================================
  // RENDER GALLERY
  // ============================================================

  async function renderGallery(
    mediaType
  ) {

    const gallery =
      getGalleryNode(
        mediaType
      );


    gallery.replaceChildren();


    updateCount(
      mediaType
    );


    const rows =
      mediaState[
        mediaType
      ];


    if (
      rows.length ===
        0
    ) {

      return;
    }


    for (
      const row
      of rows
    ) {

      const card =
        make(
          'article',
          'care-media-card'
        );


      const loadingNode =
        make(
          'div',
          'care-media-loading',
          '사진 불러오는 중'
        );


      card.appendChild(
        loadingNode
      );


      const deleteButton =
        make(
          'button',
          'care-media-delete',
          '×'
        );


      deleteButton.type =
        'button';


      deleteButton.setAttribute(
        'aria-label',
        '사진 삭제'
      );


      deleteButton.addEventListener(
        'click',
        () => {

          deleteMedia(
            row,
            mediaType,
            deleteButton
          );
        }
      );


      card.appendChild(
        deleteButton
      );


      gallery.appendChild(
        card
      );


      try {

        const previewUrl =
          await createPreviewUrl(
            row.storage_path
          );


        if (
          !previewUrl
        ) {

          throw new Error(
            'signed_url_missing'
          );
        }


        const image =
          document.createElement(
            'img'
          );


        image.src =
          previewUrl;


        image.alt =
          mediaType ===
            'before'

            ? '케어 전 현장 사진'

            : '케어 후 현장 사진';


        image.loading =
          'lazy';


        image.decoding =
          'async';


        image.addEventListener(
          'load',
          () => {

            loadingNode.remove();
          }
        );


        image.addEventListener(
          'error',
          () => {

            loadingNode.textContent =
              '미리보기 실패';
          }
        );


        card.insertBefore(
          image,
          loadingNode
        );


      } catch (
        error
      ) {

        console.error(
          'MOOHAE media preview error:',
          error
        );


        loadingNode.textContent =
          '미리보기 실패';
      }
    }
  }



  // ============================================================
  // LOAD VISIT MEDIA
  // ============================================================

  async function loadVisitMedia() {

    const visitId =
      careVisitSelect.value;


    clearMediaState();


    if (
      !visitId ||
      !UUID_PATTERN.test(
        visitId
      )
    ) {

      currentVisitId =
        '';


      return;
    }


    currentVisitId =
      visitId;


    loading =
      true;


    setMessage(
      'before',
      '저장된 사진을 확인하고 있습니다.'
    );


    setMessage(
      'after',
      '저장된 사진을 확인하고 있습니다.'
    );


    try {

      const {
        data,
        error
      } =
        await window
          .moohaeSupabase
          .rpc(

            'admin_get_care_visit_media',

            {
              p_visit_id:
                visitId
            }
          );


      if (
        error
      ) {

        throw error;
      }


      // 사용자가 조회 중 다른 방문을 선택했으면
      // 이전 응답은 버린다.

      if (
        careVisitSelect.value !==
        visitId
      ) {

        return;
      }


      const rows =
        Array.isArray(
          data
        )

          ? data

          : [];


      mediaState.before =
        rows
          .filter(
            (row) =>
              row.media_type ===
              'before'
          )
          .sort(
            (a, b) =>
              a.display_order -
              b.display_order
          );


      mediaState.after =
        rows
          .filter(
            (row) =>
              row.media_type ===
              'after'
          )
          .sort(
            (a, b) =>
              a.display_order -
              b.display_order
          );


      await Promise.all([

        renderGallery(
          'before'
        ),

        renderGallery(
          'after'
        )
      ]);


      setMessage(
        'before',
        ''
      );


      setMessage(
        'after',
        ''
      );


    } catch (
      error
    ) {

      console.error(
        'MOOHAE visit media load error:',
        error
      );


      setMessage(
        'before',
        '사진 정보를 불러오지 못했습니다.',
        'error'
      );


      setMessage(
        'after',
        '사진 정보를 불러오지 못했습니다.',
        'error'
      );


    } finally {

      loading =
        false;
    }
  }



  // ============================================================
  // UPLOAD
  // ============================================================

  async function uploadFiles(
    mediaType,
    fileList
  ) {

    if (
      uploadLock ||
      loading
    ) {

      return;
    }


    const visitId =
      careVisitSelect.value;


    if (
      !visitId ||
      !UUID_PATTERN.test(
        visitId
      )
    ) {

      setMessage(
        mediaType,
        '먼저 완료할 방문 일정을 선택해주세요.',
        'error'
      );


      return;
    }


    const files =
      Array.from(
        fileList ||
        []
      );


    if (
      files.length ===
        0
    ) {

      return;
    }


    const currentCount =
      mediaState[
        mediaType
      ].length;


    const remaining =
      MAX_IMAGES -
      currentCount;


    if (
      remaining <= 0
    ) {

      setMessage(
        mediaType,
        '사진은 최대 10장까지 등록할 수 있습니다.',
        'error'
      );


      return;
    }


    if (
      files.length >
      remaining
    ) {

      setMessage(
        mediaType,
        `현재 ${remaining}장만 추가할 수 있습니다.`,
        'error'
      );


      return;
    }


    for (
      const file
      of files
    ) {

      const validationError =
        validateFile(
          file
        );


      if (
        validationError
      ) {

        setMessage(
          mediaType,
          validationError,
          'error'
        );


        return;
      }
    }


    uploadLock =
      true;


    const input =
      getInputNode(
        mediaType
      );


    input.disabled =
      true;


    setMessage(
      mediaType,
      `${files.length}장의 사진을 업로드하고 있습니다.`
    );


    try {

      let order =
        currentCount;


      for (
        const file
        of files
      ) {

        // 방문 선택이 업로드 중 바뀌면 중단

        if (
          careVisitSelect.value !==
          visitId
        ) {

          throw new Error(
            'visit_changed_during_upload'
          );
        }


        const extension =
          getFileExtension(
            file
          );


        if (
          !extension
        ) {

          throw new Error(
            'unsupported_file_extension'
          );
        }


        const objectId =
          crypto.randomUUID();


        const storagePath =
          `${visitId}/${mediaType}/${objectId}.${extension}`;


        // ======================================================
        // 1. PRIVATE STORAGE UPLOAD
        // ======================================================

        const {
          error:
            uploadError
        } =
          await window
            .moohaeSupabase
            .storage
            .from(
              STORAGE_BUCKET
            )
            .upload(

              storagePath,

              file,

              {
                cacheControl:
                  '3600',

                contentType:
                  file.type,

                upsert:
                  false
              }
            );


        if (
          uploadError
        ) {

          throw uploadError;
        }



        // ======================================================
        // 2. DB METADATA REGISTER
        //
        // 실패하면 방금 올린 Storage object를 정리한다.
        // ======================================================

        const {
          error:
            registerError
        } =
          await window
            .moohaeSupabase
            .rpc(

              'admin_register_care_visit_media',

              {

                p_visit_id:
                  visitId,

                p_media_type:
                  mediaType,

                p_storage_path:
                  storagePath,

                p_mime_type:
                  file.type,

                p_file_size:
                  file.size,

                p_display_order:
                  order
              }
            );


        if (
          registerError
        ) {

          await window
            .moohaeSupabase
            .storage
            .from(
              STORAGE_BUCKET
            )
            .remove([
              storagePath
            ]);


          throw registerError;
        }


        order +=
          1;
      }


      setMessage(
        mediaType,
        '사진이 저장되었습니다.',
        'success'
      );


      await loadVisitMedia();


    } catch (
      error
    ) {

      console.error(
        'MOOHAE media upload error:',
        error
      );


      setMessage(
        mediaType,
        error?.message ===
          'visit_changed_during_upload'

          ? '업로드 중 방문 일정이 변경되었습니다. 다시 확인해주세요.'

          : '사진 업로드 중 오류가 발생했습니다.',
        'error'
      );


      await loadVisitMedia();


    } finally {

      input.disabled =
        false;


      input.value =
        '';


      uploadLock =
        false;
    }
  }



  // ============================================================
  // DELETE
  // ============================================================

  async function deleteMedia(
    row,
    mediaType,
    button
  ) {

    if (
      uploadLock ||
      !row?.id ||
      !UUID_PATTERN.test(
        row.id
      ) ||
      !row.storage_path
    ) {

      return;
    }


    const confirmed =
      window.confirm(
        '이 사진을 삭제할까요?'
      );


    if (
      !confirmed
    ) {

      return;
    }


    button.disabled =
      true;


    setMessage(
      mediaType,
      '사진을 삭제하고 있습니다.'
    );


    try {

      // ========================================================
      // 1. STORAGE OBJECT FIRST
      //
      // Storage 삭제 성공 후 metadata를 지운다.
      // DB 삭제가 실패해도 파일 자체가 노출되는 고아파일보다
      // metadata 재정리가 가능한 방향을 우선한다.
      // ========================================================

      const {
        error:
          storageError
      } =
        await window
          .moohaeSupabase
          .storage
          .from(
            STORAGE_BUCKET
          )
          .remove([
            row.storage_path
          ]);


      if (
        storageError
      ) {

        throw storageError;
      }



      // ========================================================
      // 2. DELETE METADATA
      // ========================================================

      const {
        error:
          metadataError
      } =
        await window
          .moohaeSupabase
          .rpc(

            'admin_delete_care_visit_media',

            {
              p_media_id:
                row.id
            }
          );


      if (
        metadataError
      ) {

        throw metadataError;
      }


      setMessage(
        mediaType,
        '사진이 삭제되었습니다.',
        'success'
      );


      await loadVisitMedia();


    } catch (
      error
    ) {

      console.error(
        'MOOHAE media delete error:',
        error
      );


      setMessage(
        mediaType,
        '사진 삭제 중 오류가 발생했습니다.',
        'error'
      );


      await loadVisitMedia();


    } finally {

      button.disabled =
        false;
    }
  }



  // ============================================================
  // EVENTS
  // ============================================================

  careVisitSelect.addEventListener(
    'change',
    () => {

      loadVisitMedia();
    }
  );


  beforeInput.addEventListener(
    'change',
    () => {

      uploadFiles(
        'before',
        beforeInput.files
      );
    }
  );


  afterInput.addEventListener(
    'change',
    () => {

      uploadFiles(
        'after',
        afterInput.files
      );
    }
  );



  // ============================================================
  // CORE JS RELOAD SYNC
  //
  // admin-customer-detail.js가 loadCustomerData() 후
  // careVisitSelect를 다시 구성할 수 있으므로
  // select option 변화를 감지해 현재 선택값에 맞춰 동기화.
  // ============================================================

  let selectSyncQueued =
    false;


  const visitSelectObserver =
    new MutationObserver(
      () => {

        if (
          selectSyncQueued
        ) {

          return;
        }


        selectSyncQueued =
          true;


        queueMicrotask(
          () => {

            selectSyncQueued =
              false;


            const value =
              careVisitSelect.value;


            if (
              value !==
              currentVisitId
            ) {

              loadVisitMedia();
            }
          }
        );
      }
    );


  visitSelectObserver.observe(
    careVisitSelect,
    {
      childList:
        true
    }
  );



  // ============================================================
  // INITIAL
  // ============================================================

  clearMediaState();

})();