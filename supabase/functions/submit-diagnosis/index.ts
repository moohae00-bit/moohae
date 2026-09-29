import { withSupabase } from 'npm:@supabase/server@^1'

// ============================================================
// MOOHAE CHECK
// HOME V2 / FINAL 6Q BACKWARD COMPAT
// + FACILITY V3
// + SECURE BOOKING TOKEN
//
// 핵심 원칙
// 1. 기존 HOME CHECK V2 / FINAL 6Q 동작을 유지한다.
// 2. customer_type이 없으면 기존 캐시 호환을 위해 home으로 처리한다.
// 3. facility만 별도 V3 검증 + RPC로 저장한다.
// 4. FACILITY의 "기타: 상세내용"은 서버에서 반드시 "기타"로 정규화한다.
// 5. 브라우저가 보내는 추천 플랜/결과는 공식 판정에 사용하지 않는다.
// 6. 진단 저장 성공 후 예약 토큰 발급 실패는 진단 실패로 전파하지 않는다.
// 7. raw booking token은 로그/DB에 저장하지 않는다.
// ============================================================

// ============================================================
// ALLOWED ORIGINS
// ============================================================

const ALLOWED_ORIGINS = new Set([
  'https://moohae.me',
  'https://www.moohae.me',
  'https://moohae-home-concept-2026.kaverchi00.chatgpt.site',
  'https://moohae-care.kaverchi00.chatgpt.site',
])

function isAllowedOrigin(
  origin: string | null,
) {
  if (!origin) {
    return false
  }

  if (ALLOWED_ORIGINS.has(origin)) {
    return true
  }

  // Local development only. Production traffic remains restricted
  // to the exact origins above.
  return (
    /^http:\/\/localhost(?::\d+)?$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin)
  )
}

// ============================================================
// CUSTOMER TYPE
// ============================================================

const CUSTOMER_TYPES = new Set([
  'home',
  'facility',
])

// ============================================================
// HOME V2 ALLOWED VALUES
// ============================================================

const ALLOWED_V2 = {
  household: new Set([
    '성인',
    '아이',
    '반려동물',
  ]),

  spaces: new Set([
    '침실',
    '거실',
    '주방 · 다이닝',
    '여러 공간에 고르게',
  ]),

  contact_surfaces: new Set([
    '매트리스 · 침구',
    '소파',
    '러그 · 카펫',
    '바닥',
    '여러 곳이 함께',
  ]),

  worries: new Set([
    '관리해도 금방 다시 신경 쓰인다',
    '언제, 어디까지 관리해야 할지 모르겠다',
    '아이의 생활공간은 조금 더 세심하게 보고 싶다',
    '반려동물의 생활공간은 조금 더 세심하게 보고 싶다',
    '예상하지 못한 오염이 생길 때도 도움받고 싶다',
  ]),

  management_preference: new Set([
    '집 전체를 기본적으로 꾸준히 관리해줬으면 좋겠다',
    '집 전체와 더 신경 쓰이는 생활까지 세심하게 관리해줬으면 좋겠다',
    '담당 관리자가 우리 집을 기억하며 더 자주 관리해줬으면 좋겠다',
    '아직 모르겠고 상담을 통해 정하고 싶다',
  ]),
}

// ============================================================
// HOME FINAL 6Q ALLOWED VALUES
// ============================================================

const ALLOWED_6Q = {
  focus_areas: new Set([
    '매트리스·침구',
    '소파·패브릭',
    '아이 생활공간',
    '반려동물 생활공간',
    '바닥·러그',
  ]),

  concern: new Set([
    '평소 관리하기 어려워요',
    '먼지·털 등이 신경 쓰여요',
    '아이가 생활하는 곳이라 신경 쓰여요',
    '반려동물이 함께 생활해요',
    '현재 상태가 궁금해요',
  ]),

  current_management: new Set([
    '일반적인 집 관리',
    '세탁을 자주 해요',
    '전용 장비를 사용해요',
    '전문 CARE를 받아요',
    '따로 관리하지 못하고 있어요',
  ]),

  visit_goal: new Set([
    '현재 상태',
    'CARE 전후 차이',
    '관리가 필요한 곳',
    '적절한 관리 주기',
  ]),

  result_with_family: new Set([
    '네, 함께 확인해요',
    '가능하면 함께 볼게요',
    '저 혼자 확인해요',
    '1인 가구예요',
  ]),

  home_manager: new Set([
    '제가 주로 해요',
    '가족과 함께 해요',
    '다른 가족이 주로 해요',
  ]),
}

// ============================================================
// FACILITY V3 ALLOWED VALUES
// DB: submit_public_facility_diagnosis_v3_internal 과 동일해야 한다.
// ============================================================

const ALLOWED_FACILITY = {
  focus_areas: new Set([
    '침구·매트리스',
    '소파·패브릭',
    '러그·매트',
    '바닥',
    '고객 이용공간',
    '기타',
  ]),

  pain_point: new Set([
    '관리하기 까다로운 곳이 있음',
    '관리에 시간이 많이 듦',
    '좋은 상태를 유지하기 어려움',
    '운영 중 관리하기 어려움',
    '관리 상태를 확인하기 어려움',
    '특별히 없음',
  ]),

  management_method: new Set([
    '내부에서 직접 관리',
    '내부 관리 + 전문업체 이용',
    '정기적으로 전문업체 이용',
    '필요할 때 전문업체 이용',
    '공간별로 다르게 관리',
  ]),

  care_need_areas: new Set([
    '침구·매트리스',
    '소파·패브릭',
    '러그·매트',
    '바닥',
    '고객 이용공간',
    '현재는 없음',
  ]),

  decision_factor: new Set([
    'CARE 결과',
    '전문성',
    '운영에 방해가 적은 것',
    '정기적인 관리',
    '결과를 확인할 수 있는 것',
    '비용',
  ]),

  service_preference: new Set([
    '필요할 때 이용',
    '정기적으로 방문',
    '상태 확인 후 필요한 곳만 CARE',
    '시설 전체를 정기적으로 관리',
    '아직 잘 모르겠음',
  ]),

  sales_preference: new Set([
    '자료를 먼저 확인',
    '간단한 설명을 먼저 듣기',
    '일부 공간을 먼저 경험',
    '현장을 함께 확인한 뒤 결정',
    '필요할 때 검토',
  ]),
}

// ============================================================
// PAYLOAD
// ============================================================

type Payload = {
  customer_type?: unknown

  name?: unknown
  phone?: unknown
  privacy_consent?: unknown
  website?: unknown

  // HOME V2 / FINAL 6Q
  household?: unknown
  spaces?: unknown
  contact_surfaces?: unknown
  worries?: unknown
  management_preference?: unknown

  // FACILITY V3
  facility_name?: unknown
  facility_focus_areas?: unknown
  facility_pain_point?: unknown
  facility_management_method?: unknown
  facility_care_need_areas?: unknown
  facility_decision_factor?: unknown
  facility_service_preference?: unknown
  facility_sales_preference?: unknown

  // 브라우저가 보내더라도 공식 판정에는 사용하지 않는다.
  client_result_level?: unknown
  client_result_message?: unknown
  recommended_plan?: unknown
}

// ============================================================
// BASIC HELPERS
// ============================================================

function cleanText(
  value: unknown,
  max: number,
) {
  if (
    typeof value !== 'string'
  ) {
    return ''
  }

  return value
    .trim()
    .slice(
      0,
      max,
    )
}

function cleanPhone(
  value: unknown,
) {
  if (
    typeof value !== 'string'
  ) {
    return ''
  }

  return value.replace(
    /\D/g,
    '',
  )
}

function validateArray(
  value: unknown,
  allowed: Set<string>,
  min: number,
  max: number,
) {
  if (
    !Array.isArray(value)
  ) {
    return null
  }

  const unique = [
    ...new Set(
      value
        .filter(
          (
            item,
          ): item is string =>
            typeof item === 'string',
        )
        .map(
          (item) =>
            item.trim(),
        ),
    ),
  ]

  if (
    unique.length < min ||
    unique.length > max
  ) {
    return null
  }

  if (
    !unique.every(
      (item) =>
        allowed.has(item),
    )
  ) {
    return null
  }

  return unique
}

function validateSingleValue(
  value: unknown,
  allowed: Set<string>,
) {
  if (
    typeof value !== 'string'
  ) {
    return null
  }

  const cleaned =
    value.trim()

  if (
    !cleaned ||
    !allowed.has(cleaned)
  ) {
    return null
  }

  return cleaned
}

function extractDiagnosisId(
  data: unknown,
) {
  const row =
    Array.isArray(data) &&
    data.length > 0
      ? data[0]
      : null

  return (
    row &&
    typeof row === 'object' &&
    'diagnosis_id' in row &&
    typeof row.diagnosis_id === 'string'
  )
    ? row.diagnosis_id
    : null
}

// ============================================================
// HOME FINAL 6Q HELPERS
// ============================================================

function isAllowedOther(
  item: string,
) {
  return item === '기타' ||
    (
      item.startsWith('기타: ') &&
      item.length <= 100
    )
}

function validate6QArray(
  value: unknown,
  allowed: Set<string>,
  min: number,
  max: number,
  allowOther = false,
) {
  if (
    !Array.isArray(value)
  ) {
    return null
  }

  const unique = [
    ...new Set(
      value
        .filter(
          (
            item,
          ): item is string =>
            typeof item === 'string',
        )
        .map(
          (item) =>
            item.trim(),
        )
        .filter(Boolean),
    ),
  ]

  if (
    unique.length < min ||
    unique.length > max
  ) {
    return null
  }

  if (
    !unique.every(
      (item) =>
        allowed.has(item) ||
        (
          allowOther &&
          isAllowedOther(item)
        ),
    )
  ) {
    return null
  }

  return unique
}

function validate6QPreferencePair(
  value: unknown,
) {
  if (
    !Array.isArray(value)
  ) {
    return null
  }

  const cleaned =
    value
      .filter(
        (
          item,
        ): item is string =>
          typeof item === 'string',
      )
      .map(
        (item) =>
          item.trim(),
      )
      .filter(Boolean)

  if (
    cleaned.length !== 2
  ) {
    return null
  }

  if (
    !ALLOWED_6Q.result_with_family.has(
      cleaned[0],
    ) ||
    !ALLOWED_6Q.home_manager.has(
      cleaned[1],
    )
  ) {
    return null
  }

  return cleaned
}

// ============================================================
// FACILITY V3 HELPERS
// ============================================================

function normalizeFacilityFocusArea(
  value: string,
) {
  const cleaned =
    value.trim()

  if (
    cleaned === '기타' ||
    cleaned.startsWith('기타:')
  ) {
    return '기타'
  }

  return cleaned
}

function validateFacilityFocusAreas(
  value: unknown,
) {
  if (
    !Array.isArray(value)
  ) {
    return null
  }

  const raw =
    value
      .filter(
        (
          item,
        ): item is string =>
          typeof item === 'string',
      )
      .map(
        (item) =>
          item.trim(),
      )
      .filter(Boolean)

  if (
    raw.length < 1 ||
    raw.length > 2 ||
    raw.some(
      (item) =>
        item.length > 100,
    )
  ) {
    return null
  }

  const normalized =
    raw.map(
      normalizeFacilityFocusArea,
    )

  if (
    normalized.some(
      (item) =>
        !ALLOWED_FACILITY.focus_areas.has(
          item,
        ),
    )
  ) {
    return null
  }

  // "기타" + "기타: 상세내용"처럼 정규화 후 중복되는 입력도 거부한다.
  if (
    new Set(
      normalized,
    ).size !==
      normalized.length
  ) {
    return null
  }

  return normalized
}

function validateFacilityCareNeedAreas(
  value: unknown,
) {
  if (
    !Array.isArray(value)
  ) {
    return null
  }

  const raw =
    value
      .filter(
        (
          item,
        ): item is string =>
          typeof item === 'string',
      )
      .map(
        (item) =>
          item.trim(),
      )
      .filter(Boolean)

  if (
    raw.length < 1 ||
    raw.length > 2
  ) {
    return null
  }

  if (
    new Set(
      raw,
    ).size !==
      raw.length
  ) {
    return null
  }

  if (
    !raw.every(
      (item) =>
        ALLOWED_FACILITY
          .care_need_areas
          .has(item),
    )
  ) {
    return null
  }

  if (
    raw.includes(
      '현재는 없음',
    ) &&
    raw.length !== 1
  ) {
    return null
  }

  return raw
}

function buildFacilityResultMessage(
  facilityName: string,
) {
  return `${facilityName}의 현재 관리 방식과 필요한 CARE 범위를 확인했습니다. 운영 흐름에 맞춰 우선 확인할 공간과 필요한 CARE를 상담 시 함께 정리합니다.`
}

// ============================================================
// HOME SERVER-SIDE PLAN DECISION
// ============================================================

function buildServerResultV2(
  household: string[],
  contactSurfaces: string[],
  worries: string[],
  preference: string[],
) {
  const hasChild =
    household.includes(
      '아이',
    )

  const hasPet =
    household.includes(
      '반려동물',
    )

  const manySurfaces =
    contactSurfaces.length >= 3 ||
    contactSurfaces.includes(
      '여러 곳이 함께',
    )

  const feelsRecurring =
    worries.includes(
      '관리해도 금방 다시 신경 쓰인다',
    )

  const unsureScope =
    worries.includes(
      '언제, 어디까지 관리해야 할지 모르겠다',
    )

  const childFocus =
    worries.includes(
      '아이의 생활공간은 조금 더 세심하게 보고 싶다',
    )

  const petFocus =
    worries.includes(
      '반려동물의 생활공간은 조금 더 세심하게 보고 싶다',
    )

  const wantsSOS =
    worries.includes(
      '예상하지 못한 오염이 생길 때도 도움받고 싶다',
    )

  const wantsDedicated =
    preference.some(
      (item) =>
        item.includes(
          '담당 관리자가',
        ),
    )

  const wantsPlus =
    preference.some(
      (item) =>
        item.includes(
          '더 신경 쓰이는 생활까지',
        ),
    )

  let plan =
    'STANDARD'

  let level =
    'STANDARD'

  let message =
    '집 전체의 주요 생활 접촉면을 정기적으로 관리받고 싶은 니즈가 중심으로 확인되었습니다.'

  if (
    wantsDedicated ||
    wantsSOS
  ) {
    plan =
      'SIGNATURE'

    level =
      'SIGNATURE'

    message =
      '정기관리뿐 아니라 담당자가 우리 집의 생활 흐름을 기억하고, 필요할 때 더 적극적으로 맡길 수 있기를 바라는 니즈가 확인되었습니다.'
  } else if (
    wantsPlus ||
    childFocus ||
    petFocus ||
    (
      hasChild &&
      manySurfaces
    ) ||
    (
      hasPet &&
      manySurfaces
    ) ||
    (
      feelsRecurring &&
      unsureScope
    )
  ) {
    plan =
      'PLUS'

    level =
      'PLUS'

    message =
      '집 전체의 기본 관리에 더해 아이·반려동물 또는 더 신경 쓰이는 생활 접촉면을 세심하게 관리받고 싶은 니즈가 확인되었습니다.'
  }

  return {
    plan,
    level,
    message,
  }
}

function buildServerResult6Q(
  focusAreas: string[],
  concern: string[],
  currentManagement: string[],
  visitGoal: string[],
) {
  const primaryConcern =
    concern[0] ||
    ''

  const primaryCurrentManagement =
    currentManagement[0] ||
    ''

  const primaryVisitGoal =
    visitGoal[0] ||
    ''

  const hasMultipleFocus =
    focusAreas.length >= 2

  const childOrPetFocus =
    focusAreas.some(
      (value) =>
        value ===
          '아이 생활공간' ||
        value ===
          '반려동물 생활공간',
    ) ||
    primaryConcern ===
      '아이가 생활하는 곳이라 신경 쓰여요' ||
    primaryConcern ===
      '반려동물이 함께 생활해요'

  const managementBurden =
    primaryConcern ===
      '평소 관리하기 어려워요' ||
    primaryCurrentManagement ===
      '따로 관리하지 못하고 있어요'

  const alreadyUsesSpecialCare =
    primaryCurrentManagement ===
      '전용 장비를 사용해요' ||
    primaryCurrentManagement ===
      '전문 CARE를 받아요'

  const needsScopeHelp =
    primaryVisitGoal ===
      '관리가 필요한 곳'

  const needsOngoingCycle =
    primaryVisitGoal ===
      '적절한 관리 주기'

  // PRIVATE는 단순 관심이 아니라
  // 여러 생활영역 + 지속 관리 필요성이 동시에 확인될 때만 추천한다.
  const privateNeed =
    hasMultipleFocus &&
    needsOngoingCycle &&
    (
      childOrPetFocus ||
      managementBurden ||
      alreadyUsesSpecialCare
    )

  const corePlusNeed =
    childOrPetFocus ||
    hasMultipleFocus ||
    managementBurden ||
    primaryConcern ===
      '먼지·털 등이 신경 쓰여요' ||
    needsScopeHelp ||
    needsOngoingCycle

  let plan =
    'STANDARD'

  let message =
    '현재 가장 신경 쓰이는 공간을 중심으로 핵심 CARE를 정기적으로 이어가는 구성이 적합합니다.'

  if (
    privateNeed
  ) {
    plan =
      'SIGNATURE'

    message =
      '여러 생활영역을 함께 살피고 관리 주기까지 지속적으로 이어갈 필요가 있어, 집의 CARE HISTORY를 바탕으로 전담 관리하는 구성이 적합합니다.'

  } else if (
    corePlusNeed
  ) {
    plan =
      'PLUS'

    message =
      '기본 CARE 범위를 넘어 아이·반려동물 생활공간, 여러 관심 공간 또는 관리 주기까지 조금 더 세심하게 이어가는 구성이 적합합니다.'
  }

  return {
    plan,
    level:
      plan,
    message,
  }
}

function toPublicCarePlanName(
  plan: string,
) {
  if (
    plan === 'SIGNATURE'
  ) {
    return 'PRIVATE'
  }

  if (
    plan === 'PLUS'
  ) {
    return 'CORE+'
  }

  return 'CORE'
}

// ============================================================
// EDGE FUNCTION
// ============================================================

export default {
  fetch: withSupabase(
    {
      auth: 'publishable',
    },

    async (
      req,
      ctx,
    ) => {
      // ========================================================
      // ORIGIN
      // ========================================================

      const origin =
        req.headers.get(
          'origin',
        )

      if (
        !isAllowedOrigin(
          origin,
        )
      ) {
        return Response.json(
          {
            ok: false,
            error:
              'origin_not_allowed',
          },
          {
            status: 403,
          },
        )
      }

      // ========================================================
      // METHOD
      // ========================================================

      if (
        req.method !==
        'POST'
      ) {
        return Response.json(
          {
            ok: false,
            error:
              'method_not_allowed',
          },
          {
            status: 405,
          },
        )
      }

      // ========================================================
      // JSON
      // ========================================================

      let body: Payload

      try {
        body =
          await req.json()
      } catch {
        return Response.json(
          {
            ok: false,
            error:
              'invalid_json',
          },
          {
            status: 400,
          },
        )
      }

      // ========================================================
      // BOT / HONEYPOT
      // ========================================================

      if (
        cleanText(
          body.website,
          200,
        )
      ) {
        return Response.json({
          ok: true,
          booking_available:
            false,
        })
      }

      // ========================================================
      // CUSTOMER TYPE
      //
      // 기존 캐시된 HOME 페이지는 customer_type을 보내지 않으므로
      // 빈 값은 home으로 처리한다.
      // ========================================================

      const requestedCustomerType =
        cleanText(
          body.customer_type,
          20,
        ).toLowerCase()

      const customerType =
        requestedCustomerType ||
        'home'

      if (
        !CUSTOMER_TYPES.has(
          customerType,
        )
      ) {
        return Response.json(
          {
            ok: false,
            error:
              'invalid_customer_type',
          },
          {
            status: 400,
          },
        )
      }

      // ========================================================
      // COMMON CUSTOMER DATA
      // ========================================================

      const name =
        cleanText(
          body.name,
          80,
        )

      const phone =
        cleanPhone(
          body.phone,
        )

      if (
        !name ||
        name.length > 80
      ) {
        return Response.json(
          {
            ok: false,
            error:
              'invalid_name',
          },
          {
            status: 400,
          },
        )
      }

      if (
        phone.length < 9 ||
        phone.length > 12
      ) {
        return Response.json(
          {
            ok: false,
            error:
              'invalid_phone',
          },
          {
            status: 400,
          },
        )
      }

      if (
        body.privacy_consent !==
        true
      ) {
        return Response.json(
          {
            ok: false,
            error:
              'consent_required',
          },
          {
            status: 400,
          },
        )
      }

      // ========================================================
      // COMMON RESPONSE STATE
      // ========================================================

      let diagnosisId:
        string | null =
          null

      let responseRecommendedPlan:
        string | null =
          null

      let responseResultLevel =
        ''

      let responseResultMessage =
        ''

      // ========================================================
      // FACILITY V3
      // ========================================================

      if (
        customerType ===
          'facility'
      ) {
        const facilityName =
          cleanText(
            body.facility_name,
            121,
          )

        if (
          !facilityName ||
          facilityName.length > 120
        ) {
          return Response.json(
            {
              ok: false,
              error:
                'invalid_facility_name',
            },
            {
              status: 400,
            },
          )
        }

        const facilityFocusAreas =
          validateFacilityFocusAreas(
            body.facility_focus_areas,
          )

        const facilityPainPoint =
          validateSingleValue(
            body.facility_pain_point,
            ALLOWED_FACILITY.pain_point,
          )

        const facilityManagementMethod =
          validateSingleValue(
            body.facility_management_method,
            ALLOWED_FACILITY.management_method,
          )

        const facilityCareNeedAreas =
          validateFacilityCareNeedAreas(
            body.facility_care_need_areas,
          )

        const facilityDecisionFactor =
          validateSingleValue(
            body.facility_decision_factor,
            ALLOWED_FACILITY.decision_factor,
          )

        const facilityServicePreference =
          validateSingleValue(
            body.facility_service_preference,
            ALLOWED_FACILITY.service_preference,
          )

        const facilitySalesPreference =
          validateSingleValue(
            body.facility_sales_preference,
            ALLOWED_FACILITY.sales_preference,
          )

        if (
          !facilityFocusAreas ||
          !facilityPainPoint ||
          !facilityManagementMethod ||
          !facilityCareNeedAreas ||
          !facilityDecisionFactor ||
          !facilityServicePreference ||
          !facilitySalesPreference
        ) {
          return Response.json(
            {
              ok: false,
              error:
                'invalid_facility_diagnosis_values',
            },
            {
              status: 400,
            },
          )
        }

        const facilityResultMessage =
          buildFacilityResultMessage(
            facilityName,
          )

        const {
          data,
          error,
        } =
          await ctx
            .supabaseAdmin
            .rpc(
              'submit_public_facility_diagnosis_v3_internal',
              {
                p_name:
                  name,

                p_phone:
                  phone,

                p_facility_name:
                  facilityName,

                p_facility_focus_areas:
                  facilityFocusAreas,

                p_facility_pain_point:
                  facilityPainPoint,

                p_facility_management_method:
                  facilityManagementMethod,

                p_facility_care_need_areas:
                  facilityCareNeedAreas,

                p_facility_decision_factor:
                  facilityDecisionFactor,

                p_facility_service_preference:
                  facilityServicePreference,

                p_facility_sales_preference:
                  facilitySalesPreference,

                p_result_message:
                  facilityResultMessage,
              },
            )

        if (
          error
        ) {
          console.error(
            'submit_public_facility_diagnosis_v3_internal failed',
            {
              code:
                error.code,
              message:
                error.message,
            },
          )

          return Response.json(
            {
              ok: false,
              error:
                'storage_failed',
            },
            {
              status: 500,
            },
          )
        }

        diagnosisId =
          extractDiagnosisId(
            data,
          )

        responseRecommendedPlan =
          null

        responseResultLevel =
          'FACILITY'

        responseResultMessage =
          facilityResultMessage

      // ========================================================
      // HOME V2 / FINAL 6Q
      // ========================================================

      } else {
        // FINAL 6Q를 먼저 검증하고,
        // 실패하면 기존 V2 형식으로 검증한다.
        // 캐시된 기존 페이지와 신규 페이지를 동시에 지원한다.

        const household6Q =
          validate6QArray(
            body.household,
            ALLOWED_6Q.focus_areas,
            1,
            2,
            true,
          )

        const spaces6Q =
          validate6QArray(
            body.spaces,
            ALLOWED_6Q.concern,
            1,
            1,
            true,
          )

        const contactSurfaces6Q =
          validate6QArray(
            body.contact_surfaces,
            ALLOWED_6Q.current_management,
            1,
            1,
          )

        const worries6Q =
          validate6QArray(
            body.worries,
            ALLOWED_6Q.visit_goal,
            1,
            1,
          )

        const managementPreference6Q =
          validate6QPreferencePair(
            body.management_preference,
          )

        const isFinal6Q =
          Boolean(
            household6Q &&
            spaces6Q &&
            contactSurfaces6Q &&
            worries6Q &&
            managementPreference6Q,
          )

        const householdV2 =
          isFinal6Q
            ? null
            : validateArray(
                body.household,
                ALLOWED_V2.household,
                1,
                3,
              )

        const spacesV2 =
          isFinal6Q
            ? null
            : validateArray(
                body.spaces,
                ALLOWED_V2.spaces,
                1,
                4,
              )

        const contactSurfacesV2 =
          isFinal6Q
            ? null
            : validateArray(
                body.contact_surfaces,
                ALLOWED_V2.contact_surfaces,
                1,
                5,
              )

        const worriesV2 =
          isFinal6Q
            ? null
            : validateArray(
                body.worries,
                ALLOWED_V2.worries,
                1,
                5,
              )

        const managementPreferenceV2 =
          isFinal6Q
            ? null
            : validateArray(
                body.management_preference,
                ALLOWED_V2.management_preference,
                1,
                1,
              )

        const isV2 =
          Boolean(
            householdV2 &&
            spacesV2 &&
            contactSurfacesV2 &&
            worriesV2 &&
            managementPreferenceV2,
          )

        if (
          !isFinal6Q &&
          !isV2
        ) {
          return Response.json(
            {
              ok: false,
              error:
                'invalid_diagnosis_values',
            },
            {
              status: 400,
            },
          )
        }

        const household =
          (
            isFinal6Q
              ? household6Q
              : householdV2
          ) as string[]

        const livingSpaces =
          (
            isFinal6Q
              ? spaces6Q
              : spacesV2
          ) as string[]

        const contactSurfaces =
          (
            isFinal6Q
              ? contactSurfaces6Q
              : contactSurfacesV2
          ) as string[]

        const worries =
          (
            isFinal6Q
              ? worries6Q
              : worriesV2
          ) as string[]

        const managementPreference =
          (
            isFinal6Q
              ? managementPreference6Q
              : managementPreferenceV2
          ) as string[]

        const serverResult =
          isFinal6Q
            ? buildServerResult6Q(
                household,
                livingSpaces,
                contactSurfaces,
                worries,
              )
            : buildServerResultV2(
                household,
                contactSurfaces,
                worries,
                managementPreference,
              )

        const resultMessage =
          isFinal6Q
            ? [
                serverResult.message,
                `추천 CARE PLAN: ${toPublicCarePlanName(
                  serverResult.plan,
                )}.`,
                `관심 공간: ${household.join(
                  ' · ',
                )}.`,
              ].join(
                ' ',
              )
            : [
                serverResult.message,
                `추천 관리 유형: ${serverResult.plan}.`,
                `함께 생활: ${household.join(
                  ' · ',
                )}.`,
              ].join(
                ' ',
              )

        const {
          data,
          error,
        } =
          await ctx
            .supabaseAdmin
            .rpc(
              'submit_public_diagnosis_v2_internal',
              {
                p_name:
                  name,

                p_phone:
                  phone,

                p_household:
                  household,

                p_living_spaces:
                  livingSpaces,

                p_contact_surfaces:
                  contactSurfaces,

                p_management_worries:
                  worries,

                p_management_preference:
                  managementPreference,

                p_recommended_plan:
                  serverResult.plan,

                p_result_level:
                  serverResult.level,

                p_result_message:
                  resultMessage,
              },
            )

        if (
          error
        ) {
          console.error(
            'submit_public_diagnosis_v2_internal failed',
            {
              code:
                error.code,
              message:
                error.message,
            },
          )

          return Response.json(
            {
              ok: false,
              error:
                'storage_failed',
            },
            {
              status: 500,
            },
          )
        }

        diagnosisId =
          extractDiagnosisId(
            data,
          )

        responseRecommendedPlan =
          serverResult.plan

        responseResultLevel =
          serverResult.level

        responseResultMessage =
          serverResult.message
      }

      // ========================================================
      // BOOKING TOKEN
      //
      // HOME / FACILITY 공통.
      // 진단 저장 성공 후 diagnosis_id가 있을 때만 시도한다.
      // 발급 실패는 진단 접수 실패로 전파하지 않는다.
      // ========================================================

      let bookingToken:
        string | null =
          null

      let bookingTokenExpiresAt:
        string | null =
          null

      let bookingAvailable =
        false

      if (
        diagnosisId
      ) {
        try {
          const {
            data:
              tokenData,
            error:
              tokenError,
          } =
            await ctx
              .supabaseAdmin
              .rpc(
                'issue_booking_access_token_internal',
                {
                  p_diagnosis_id:
                    diagnosisId,
                },
              )

          if (
            tokenError
          ) {
            console.error(
              'issue_booking_access_token_internal failed',
              {
                code:
                  tokenError.code,
                message:
                  tokenError.message,
              },
            )
          } else {
            const tokenRow =
              Array.isArray(
                tokenData,
              ) &&
              tokenData.length > 0
                ? tokenData[0]
                : null

            const rawToken =
              typeof tokenRow?.booking_token ===
                'string'
                ? tokenRow.booking_token
                : ''

            const rawExpiresAt =
              typeof tokenRow?.expires_at ===
                'string'
                ? tokenRow.expires_at
                : ''

            if (
              /^[0-9a-f]{64}$/.test(
                rawToken,
              ) &&
              rawExpiresAt
            ) {
              bookingToken =
                rawToken

              bookingTokenExpiresAt =
                rawExpiresAt

              bookingAvailable =
                true
            }
          }
        } catch (
          tokenUnexpectedError
        ) {
          // raw token은 절대 로그에 기록하지 않는다.
          console.error(
            'booking token issuance unexpected failure',
            tokenUnexpectedError,
          )
        }
      }

      // ========================================================
      // RESPONSE
      // ========================================================

      return Response.json({
        ok: true,

        customer_type:
          customerType,

        submission_id:
          diagnosisId,

        recommended_plan:
          responseRecommendedPlan,

        result_level:
          responseResultLevel,

        result_message:
          responseResultMessage,

        booking_available:
          bookingAvailable,

        booking_token:
          bookingToken,

        booking_token_expires_at:
          bookingTokenExpiresAt,
      })
    },
  ),
}
